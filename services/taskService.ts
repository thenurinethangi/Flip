import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
        status: 'pending',
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "tasks"), payload);
    return docRef.id;
};
