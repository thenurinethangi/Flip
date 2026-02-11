import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { registerListener } from "./listenerRegistry";
import {
  cancelLocalNotification,
  scheduleLocalNotificationForTask,
} from "./notificationService";
import {
  ensureRepeatSubtasksForTask,
  getAllSubTasksByTaskId,
} from "./subtaskService";
import {
  getReminderBodyText,
  getReminderDate,
  type ReminderLabel,
} from "./taskReminder";
import type { AddTaskInput } from "./taskTypes";

export { getReminderBodyText, getReminderDate } from "./taskReminder";
export type { ReminderLabel } from "./taskReminder";
export type { AddTaskInput } from "./taskTypes";

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

  if (input.reminder !== "None") {
    const reminderDate = getReminderDate(input);
    const title = input.taskname;
    const body = getReminderBodyText(input.reminder as ReminderLabel);

    const notificationId = await scheduleLocalNotificationForTask(
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
      const createdTasks: Array<{ id: string; payload: Record<string, any> }> =
        [];
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
        createdTasks.push({ id: newDocRef.id, payload });
      });
      await batch.commit();

      for (const created of createdTasks) {
        const reminder = created.payload.reminder as ReminderLabel | undefined;
        if (reminder && reminder !== "None") {
          const reminderDate = getReminderDate(created.payload as AddTaskInput);
          const title = String(created.payload.taskname ?? "Task");
          const body = getReminderBodyText(reminder);
          const notificationId = await scheduleLocalNotificationForTask(
            title,
            body,
            reminderDate,
            created.id,
          );

          await updateDoc(doc(db, "tasks", created.id), {
            notificationId,
            updatedAt: serverTimestamp(),
          });
        }
      }
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

  const unsubscribe = onSnapshot(
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
  const unregister = registerListener(unsubscribe);
  return () => {
    unsubscribe();
    unregister();
  };
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

  const unsubscribe = onSnapshot(
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
  const unregister = registerListener(unsubscribe);
  return () => {
    unsubscribe();
    unregister();
  };
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

  const unsubscribe = onSnapshot(
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
  const unregister = registerListener(unsubscribe);
  return () => {
    unsubscribe();
    unregister();
  };
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

  const docRef = await getDoc(doc(db, "tasks", task.id));
  if (docRef.exists() && docRef.data().notificationId) {
    try {
      await cancelLocalNotification(docRef.data().notificationId);
    } catch (error) {
      console.log("Failed to cancel notification", error);
    }
  }

  if (task.reminder !== "None") {
    const reminderDate = getReminderDate(task);
    const title = task.taskname;
    const body = getReminderBodyText(task.reminder as ReminderLabel);

    const notificationId = await scheduleLocalNotificationForTask(
      title,
      body,
      reminderDate,
      docRef.id,
    );

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
      notificationId: notificationId,
      updatedAt: serverTimestamp(),
    });
  } else {
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
      notificationId: deleteField(),
      updatedAt: serverTimestamp(),
    });
  }
};

export const deleteTaskByTaskId = async (taskId: string) => {
  const docRef = await getDoc(doc(db, "tasks", taskId));
  if (docRef.exists() && docRef.data().notificationId) {
    try {
      await cancelLocalNotification(docRef.data().notificationId);
    } catch (error) {
      console.log("Failed to cancel notification", error);
    }
  }

  const subtaskRef = collection(db, "subtasks");
  const subtaskQuery = query(subtaskRef, where("taskId", "==", taskId));
  const subtaskSnapshot = await getDocs(subtaskQuery);
  if (!subtaskSnapshot.empty) {
    const batch = writeBatch(db);
    for (const subtaskDoc of subtaskSnapshot.docs) {
      const data = subtaskDoc.data();
      if (data?.notificationId) {
        try {
          await cancelLocalNotification(data.notificationId);
        } catch (error) {
          console.log("Failed to cancel subtask notification", error);
        }
      }
      batch.delete(subtaskDoc.ref);
    }
    await batch.commit();
  }

  await deleteDoc(doc(db, "tasks", taskId));
};
