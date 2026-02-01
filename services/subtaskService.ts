import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { AddTaskInput } from "./taskService";

export const addNewSubTask = async (input: AddTaskInput, taskId: string) => {
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
    taskId: taskId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "subtasks"), payload);
  return docRef.id;
};

const DAILY_SUBTASK_REPEAT_KEY = "dailyRepeatSubtaskAdd";
const WEEKLY_SUBTASK_REPEAT_KEY = "weeklyRepeatSubtaskAdd";
const MONTHLY_SUBTASK_REPEAT_KEY = "monthlyRepeatSubtaskAdd";

export const ensureRepeatSubtasksForTask = async (
  date: string,
  userId: string,
  taskId: string,
) => {
  const todayStr = new Date().toLocaleDateString("en-CA");
  if (date !== todayStr) return;

  const dateObj = new Date(`${date}T00:00:00`);
  const isMonday = dateObj.getDay() === 1;
  const isMonthStart = dateObj.getDate() === 1;

  const runRepeat = async (
    repeatValue: "Daily" | "Weekly" | "Monthly",
    storageKeyBase: string,
    shouldRun: boolean,
  ) => {
    if (!shouldRun) return;

    const storageKey = `${storageKeyBase}_${userId}_${taskId}`;
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

    const subtaskRef = collection(db, "subtasks");
    const q = query(
      subtaskRef,
      where("userId", "==", userId),
      where("taskId", "==", taskId),
      where("repeat", "==", repeatValue),
    );

    const snapshot = await getDocs(q);
    const repeatSubtasks = snapshot.docs
      .map((docItem) => ({ id: docItem.id, ...docItem.data() }))
      .filter((subtask: any) => !subtask.isRepeated);

    if (repeatSubtasks.length > 0) {
      const batch = writeBatch(db);
      repeatSubtasks.forEach((subtask: any) => {
        const {
          id: _id,
          createdAt: _createdAt,
          updatedAt: _updatedAt,
          ...rest
        } = subtask;
        const payload = {
          ...rest,
          date,
          status: "pending",
          isRepeated: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        const newDocRef = doc(collection(db, "subtasks"));
        batch.set(newDocRef, payload);
      });
      await batch.commit();
    }

    await AsyncStorage.setItem(
      storageKey,
      JSON.stringify({ date, done: true }),
    );
  };

  await runRepeat("Daily", DAILY_SUBTASK_REPEAT_KEY, true);
  await runRepeat("Weekly", WEEKLY_SUBTASK_REPEAT_KEY, isMonday);
  await runRepeat("Monthly", MONTHLY_SUBTASK_REPEAT_KEY, isMonthStart);
};

export const getAllSubTasksByTaskId = async (taskId: string) => {
  const subtaskRef = collection(db, "subtasks");
  const q = query(
    subtaskRef,
    where("taskId", "==", taskId),
    orderBy("createdAt", "asc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const subscribeSubTasksByTaskId = (
  taskId: string,
  onSubTasks: (tasks: Array<{ id: string } & Record<string, any>>) => void,
  onError?: (error: Error) => void,
) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const todayStr = new Date().toLocaleDateString("en-CA");
  void ensureRepeatSubtasksForTask(todayStr, user.uid, taskId).catch(
    (error) => {
      if (onError) onError(error as Error);
    },
  );

  const subtaskRef = collection(db, "subtasks");
  const q = query(
    subtaskRef,
    where("taskId", "==", taskId),
    orderBy("createdAt", "asc"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      onSubTasks(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    },
    (error) => {
      if (onError) onError(error as Error);
    },
  );
};

export const updateSubTaskStatusByTaskId = async (
  id: string,
  status: string,
) => {
  await updateDoc(doc(db, "subtasks", id), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const updateSubTask = async (subtask: any) => {
  await updateDoc(doc(db, "subtasks", subtask.id), {
    taskname: subtask.taskname,
    date: subtask.date,
    time: subtask.time,
    reminder: subtask.reminder,
    repeat: subtask.repeat,
    priorityLevel: subtask.priorityLevel,
    taskId: subtask.taskId,
    taskType: subtask.taskType,
    tags: subtask.tags,
    status: subtask.status,
    updatedAt: serverTimestamp(),
  });
};

export const updateSubtaskStatusBySubtaskId = async (
  id: string,
  status: string,
) => {
  await updateDoc(doc(db, "subtasks", id), {
    status: status,
    updatedAt: serverTimestamp(),
  });
};

export const deleteSubtaskBySubtaskId = async (subtaskId: string) => {
  await deleteDoc(doc(db, "subtasks", subtaskId));
};
