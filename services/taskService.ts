import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";

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
  return docRef.id;
};


export const subscribePendingTasksByDate = (
  date: string,
  onTasks: (tasks: Array<{ id: string } & Record<string, any>>) => void,
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
    where("status", "==", "pending"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      onTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    },
    (error) => {
      if (onError) onError(error);
    },
  );
};


export const subscribeOverdueTasks = (
  date: string,
  onTasks: (tasks: Array<{ id: string } & Record<string, any>>) => void,
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
      onTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    },
    (error) => {
      if (onError) onError(error);
    },
  );
};


export const subscribeCompleteTasksByDate = (
  date: string,
  onTasks: (tasks: Array<{ id: string } & Record<string, any>>) => void,
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
      onTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
