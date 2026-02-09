import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { auth, db } from "./firebase";

export type AddFocus = {
    focusDuration: number;
    date: Date;
    startTime: Date;
    endTime: Date;
    taskId: string;
    type: string;
}

export type FocusType = {
    id: string;
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


export const getAllFocusByDate = async (date: Date) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated");
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const focusRef = collection(db, 'focus');
    const q = query(
        focusRef,
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
    );
    const docsRef = await getDocs(q);

    return docsRef.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};