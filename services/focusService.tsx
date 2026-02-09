import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export type AddFocus = {
    focusDuration: number;
    date: Date;
    startTime: Date;
    endTime: Date;
    taskId: string;
    type: string;
}

export const add = async (data: any) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated");
    }

    const payload = {
        focusDuration: data.focusDuration,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        taskId: data.taskId,
        type: data.type,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "focus"), payload);
    return docRef.id;
};