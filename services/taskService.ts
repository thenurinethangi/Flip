import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { scheduleLocalNotificationForTaskWithoutRepeat } from "./notificationService";
import {
  ensureRepeatSubtasksForTask,
  getAllSubTasksByTaskId,
} from "./subtaskService";

export interface AddTaskInput {
  taskname: string;
  date: string;
  time: string;
  reminder: string;
  repeat: string;
  priorityLevel: string;
  taskType: string;
  tags: string;
}

export const add = async (input: AddTaskInput) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const payload = {
    taskname: input.taskname,
    date: input.date,
    time: input.time,
    reminder: input.reminder,
    repeat: input.repeat,
    priorityLevel: input.priorityLevel,
    taskType: input.taskType,
    tags: input.tags,
    status: "pending",
    userId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "tasks"), payload);

  if (input.reminder !== "None" && input.repeat === "None") {
    const reminderDate = getReminderDate(input);
    const title = input.taskname;
    const body = getReminderBodyText(input.reminder as ReminderLabel);

    const notificationId = await scheduleLocalNotificationForTaskWithoutRepeat(
      title,
      body,
      reminderDate,
      docRef.id,
    );

    await updateDoc(doc(db, "tasks", docRef.id), {
      notificationId: notificationId,
      updatedAt: serverTimestamp(),
    });
  }

  return docRef.id;
};

type ReminderLabel =
  | "None"
  | "At time of task"
  | "5 minutes before"
  | "30 minutes before"
  | "1 hour before"
  | "On the day"
  | "1 day early";

const getReminderBodyText = (reminderLabel: ReminderLabel): string => {
  if (reminderLabel === "None") {
    return "";
  }

  const prefixMap: Record<Exclude<ReminderLabel, "None">, string> = {
    "At time of task": "Scheduled now",
    "5 minutes before": "Scheduled in 5 minutes",
    "30 minutes before": "Scheduled in 30 minutes",
    "1 hour before": "Scheduled in 1 hour",
    "On the day": "Scheduled today",
    "1 day early": "Scheduled next day",
  };

  return prefixMap[reminderLabel];
};

export function getReminderDate(task: AddTaskInput): Date {
  const [year, month, day] = task.date.split("-").map(Number);

  const reminderDate = new Date(year, month - 1, day, 9, 0, 0);

  const today = new Date();

  const parseTimeToHoursMinutes = (
    timeStr: string,
  ): { hours: number; minutes: number } | null => {
    if (!timeStr) return null;
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3].toUpperCase();
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  };

  switch (task.reminder) {
    case "At time of task":
      {
        const parsed = parseTimeToHoursMinutes(task.time);
        if (parsed) {
          reminderDate.setHours(parsed.hours, parsed.minutes, 0, 0);
        }
      }
      break;

    case "5 minutes before":
      {
        const parsed = parseTimeToHoursMinutes(task.time);
        if (parsed) {
          reminderDate.setHours(parsed.hours, parsed.minutes, 0, 0);
          reminderDate.setMinutes(reminderDate.getMinutes() - 5);
        }
      }
      break;

    case "30 minutes before":
      {
        const parsed = parseTimeToHoursMinutes(task.time);
        if (parsed) {
          reminderDate.setHours(parsed.hours, parsed.minutes, 0, 0);
          reminderDate.setMinutes(reminderDate.getMinutes() - 30);
        }
      }
      break;

    case "1 hour before":
      {
        const parsed = parseTimeToHoursMinutes(task.time);
        if (parsed) {
          reminderDate.setHours(parsed.hours, parsed.minutes, 0, 0);
          reminderDate.setMinutes(reminderDate.getMinutes() - 60);
        }
      }
      break;

    case "On the day":
      {
        reminderDate.setHours(9, 0, 0, 0);
        if (reminderDate < today) {
          const now = new Date();
          now.setMinutes(now.getMinutes() + 2);
          reminderDate.setTime(now.getTime());
        }
      }
      break;

    case "1 day early":
      reminderDate.setDate(reminderDate.getDate() - 1);
      reminderDate.setHours(9, 0, 0, 0);
      if (reminderDate < today) {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 2);
        reminderDate.setTime(now.getTime());
      }
      break;
  }

  return reminderDate;
}

const DAILY_REPEAT_STORAGE_KEY = "dailyRepeatAdd";
const WEEKLY_REPEAT_STORAGE_KEY = "weeklyRepeatAdd";
const MONTHLY_REPEAT_STORAGE_KEY = "monthlyRepeatAdd";

const ensureRepeatTasks = async (date: string, userId: string) => {
  const todayStr = new Date().toLocaleDateString("en-CA");
  if (date !== todayStr) return;

  const dateObj = new Date(`${date} T00:00:00`);
  const isMonday = dateObj.getDay() === 1;
  const isMonthStart = dateObj.getDate() === 1;

  const runRepeat = async (
    repeatValue: "Daily" | "Weekly" | "Monthly",
    storageKeyBase: string,
    shouldRun: boolean,
  ) => {
    if (!shouldRun) return;

    const storageKey = `${storageKeyBase}_${userId} `;
    const stored = await AsyncStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { date?: string; done?: boolean };
        if (parsed?.date === date && parsed?.done) {
          return;
        }
      } catch {
        // ignore parse errors and proceed
      }
    }

    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("userId", "==", userId),
      where("repeat", "==", repeatValue),
    );

    const snapshot = await getDocs(q);
    const repeatTasks = snapshot.docs
      .map((docItem) => ({ id: docItem.id, ...docItem.data() }))
      .filter((task: any) => !task.isRepeated);

    if (repeatTasks.length > 0) {
      const batch = writeBatch(db);
      repeatTasks.forEach((task: any) => {
        const {
          id: _id,
          createdAt: _createdAt,
          updatedAt: _updatedAt,
          ...rest
        } = task;
        const payload = {
          ...rest,
          date,
          status: "pending",
          isRepeated: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        const newDocRef = doc(collection(db, "tasks"));
        batch.set(newDocRef, payload);
      });
      await batch.commit();
    }

    await AsyncStorage.setItem(
      storageKey,
      JSON.stringify({ date, done: true }),
    );
  };

  await runRepeat("Daily", DAILY_REPEAT_STORAGE_KEY, true);
  await runRepeat("Weekly", WEEKLY_REPEAT_STORAGE_KEY, isMonday);
  await runRepeat("Monthly", MONTHLY_REPEAT_STORAGE_KEY, isMonthStart);
};

export const subscribePendingTasksByDate = (
  date: string,
  onTasks: (
    tasks: Array<{
      task: { id: string } & Record<string, any>;
      subtasks: Array<{ id: string } & Record<string, any>>;
    }>,
  ) => void,
  onError?: (error: Error) => void,
) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  void ensureRepeatTasks(date, user.uid).catch((error) => {
    if (onError) onError(error as Error);
  });

  const tasksRef = collection(db, "tasks");
  const q = query(
    tasksRef,
    where("userId", "==", user.uid),
    where("date", "==", date),
    where("status", "==", "pending"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const priorityRank: Record<string, number> = {
        high: 0,
        medium: 1,
        low: 2,
        none: 3,
      };

      const tasks: Array<
        { id: string; priorityLevel?: string } & Record<string, any>
      > = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      tasks.sort((a, b) => {
        const aRank =
          priorityRank[String(a.priorityLevel ?? "none").toLowerCase()] ?? 3;
        const bRank =
          priorityRank[String(b.priorityLevel ?? "none").toLowerCase()] ?? 3;
        return aRank - bRank;
      });

      Promise.all(
        tasks.map(async (task) => {
          await ensureRepeatSubtasksForTask(date, user.uid, task.id);
          return {
            task,
            subtasks: await getAllSubTasksByTaskId(task.id),
          };
        }),
      )
        .then(onTasks)
        .catch((error) => {
          if (onError) onError(error as Error);
        });
    },
    (error) => {
      if (onError) onError(error);
    },
  );
};

export const subscribeOverdueTasks = (
  date: string,
  onTasks: (
    tasks: Array<{
      task: { id: string } & Record<string, any>;
      subtasks: Array<{ id: string } & Record<string, any>>;
    }>,
  ) => void,
  onError?: (error: Error) => void,
) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const tasksRef = collection(db, "tasks");
  const q = query(
    tasksRef,
    where("userId", "==", user.uid),
    where("date", "<", date),
    where("status", "==", "pending"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      Promise.all(
        tasks.map(async (task) => {
          await ensureRepeatSubtasksForTask(date, user.uid, task.id);
          return {
            task,
            subtasks: await getAllSubTasksByTaskId(task.id),
          };
        }),
      )
        .then(onTasks)
        .catch((error) => {
          if (onError) onError(error as Error);
        });
    },
    (error) => {
      if (onError) onError(error);
    },
  );
};

export const subscribeCompleteTasksByDate = (
  date: string,
  onTasks: (
    tasks: Array<{
      task: { id: string } & Record<string, any>;
      subtasks: Array<{ id: string } & Record<string, any>>;
    }>,
  ) => void,
  onError?: (error: Error) => void,
) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const tasksRef = collection(db, "tasks");
  const q = query(
    tasksRef,
    where("userId", "==", user.uid),
    where("date", "==", date),
    where("status", "==", "complete"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      Promise.all(
        tasks.map(async (task) => {
          await ensureRepeatSubtasksForTask(date, user.uid, task.id);
          return {
            task,
            subtasks: await getAllSubTasksByTaskId(task.id),
          };
        }),
      )
        .then(onTasks)
        .catch((error) => {
          if (onError) onError(error as Error);
        });
    },
    (error) => {
      if (onError) onError(error);
    },
  );
};

export const updateTaskStatusByTaskId = async (id: string, status: string) => {
  await updateDoc(doc(db, "tasks", id), {
    status: status,
    updatedAt: serverTimestamp(),
  });
};

export const postponeTasksByTaskIds = async (ids: string[], date: string) => {
  const batch = writeBatch(db);
  ids.forEach((id) => {
    batch.update(doc(db, "tasks", id), {
      date,
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
};

export const update = async (task: any) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  await updateDoc(doc(db, "tasks", task.id), {
    taskname: task.taskname,
    date: task.date,
    time: task.time,
    reminder: task.reminder,
    repeat: task.repeat,
    priorityLevel: task.priorityLevel,
    taskType: task.taskType,
    tags: task.tags,
    status: task.status,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTaskByTaskId = async (taskId: string) => {
  await deleteDoc(doc(db, "tasks", taskId));
};
