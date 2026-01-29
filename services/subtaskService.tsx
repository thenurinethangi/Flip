import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
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


export const getAllSubTasksByTaskId = async (taskId: string) => {

    const subtaskRef = collection(db, "subtasks");
    const q = query(subtaskRef,
        where('taskId', '==', taskId),
        orderBy('createdAt', 'asc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
};

export const subscribeSubTasksByTaskId = (
    taskId: string,
    onSubTasks: (tasks: Array<{ id: string } & Record<string, any>>) => void,
    onError?: (error: Error) => void,
) => {
    const subtaskRef = collection(db, "subtasks");
    const q = query(
        subtaskRef,
        where('taskId', '==', taskId),
        orderBy('createdAt', 'asc'),
    );

    return onSnapshot(
        q,
        (snapshot) => {
            onSubTasks(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })));
        },
        (error) => {
            if (onError) onError(error as Error);
        },
    );
};

export const updateSubTaskStatusByTaskId = async (id: string, status: string) => {
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