import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { getAllSubTasksByTaskId } from "./subtaskService";

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
        tasks.map(async (task) => ({
          task,
          subtasks: await getAllSubTasksByTaskId(task.id),
        })),
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
        tasks.map(async (task) => ({
          task,
          subtasks: await getAllSubTasksByTaskId(task.id),
        })),
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
        tasks.map(async (task) => ({
          task,
          subtasks: await getAllSubTasksByTaskId(task.id),
        })),
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
