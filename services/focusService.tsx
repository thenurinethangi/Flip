import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, Timestamp, where } from "firebase/firestore";
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

export type FocusSummary = {
    count: number;
    totalMinutes: number;
};

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

    const focusRef = collection(db, "focus");
    const q = query(
        focusRef,
        where("userId", "==", user.uid),
    );
    const docsRef = await getDocs(q);

    return docsRef.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item: any) => {
            const rawDate = item.date;
            const docDate = rawDate instanceof Timestamp ? rawDate.toDate() : new Date(rawDate);
            return docDate >= startOfDay && docDate <= endOfDay;
        });
};

export const subscribeFocusByDate = (
    date: Date,
    onData: (focusDocs: FocusType[]) => void,
    onError?: (error: unknown) => void,
) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated");
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const focusRef = collection(db, "focus");
    const q = query(
        focusRef,
        where("userId", "==", user.uid),
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const items = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((item: any) => {
                    const rawDate = item.date;
                    const docDate = rawDate instanceof Timestamp ? rawDate.toDate() : new Date(rawDate);
                    return docDate >= startOfDay && docDate <= endOfDay;
                }) as FocusType[];
            onData(items);
        },
        (error) => {
            if (onError) onError(error);
        },
    );
};

export const subscribeAllFocus = (
    onData: (focusDocs: FocusType[]) => void,
    onError?: (error: unknown) => void,
) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated");
    }

    const focusRef = collection(db, "focus");
    const q = query(
        focusRef,
        where("userId", "==", user.uid),
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const items = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() })) as FocusType[];
            onData(items);
        },
        (error) => {
            if (onError) onError(error);
        },
    );
};

const getDayRange = (date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return { startOfDay, endOfDay };
};

export const getFocusSummaryByDate = async (date: Date): Promise<FocusSummary> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated");
    }

    const { startOfDay, endOfDay } = getDayRange(date);
    const focusRef = collection(db, "focus");
    const q = query(focusRef, where("userId", "==", user.uid));
    const docsRef = await getDocs(q);

    let countTotal = 0;
    let sumMinutes = 0;

    docsRef.docs.forEach((docSnap) => {
        const data: any = docSnap.data();
        const rawDate = data?.date;
        const docDate = rawDate instanceof Timestamp ? rawDate.toDate() : new Date(rawDate);
        if (docDate >= startOfDay && docDate <= endOfDay) {
            countTotal += 1;
            sumMinutes += data?.focusDuration ?? 0;
        }
    });

    return { count: countTotal, totalMinutes: sumMinutes };
};

export const getTotalFocusSummary = async (): Promise<FocusSummary> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated");
    }

    const focusRef = collection(db, "focus");
    const q = query(focusRef, where("userId", "==", user.uid));
    const docsRef = await getDocs(q);

    let countTotal = 0;
    let sumMinutes = 0;

    docsRef.docs.forEach((docSnap) => {
        const data: any = docSnap.data();
        countTotal += 1;
        sumMinutes += data?.focusDuration ?? 0;
    });

    return { count: countTotal, totalMinutes: sumMinutes };
};

export const getFocusRecordsByRange = async (start: Date, end: Date) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated");
    }

    const focusRef = collection(db, "focus");
    const q = query(focusRef, where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    const items = snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .filter((item: any) => {
            const rawDate = item.date;
            const docDate = rawDate instanceof Timestamp ? rawDate.toDate() : new Date(rawDate);
            return docDate >= start && docDate <= end;
        }) as any[];

    const taskIds = new Set<string>();
    const subtaskIds = new Set<string>();
    items.forEach((item) => {
        if (!item.taskId) return;
        if (item.type === "subtask") {
            subtaskIds.add(item.taskId);
        } else {
            taskIds.add(item.taskId);
        }
    });

    const taskMap = new Map<string, string>();
    const subtaskMap = new Map<string, string>();

    await Promise.all(
        Array.from(taskIds).map(async (id) => {
            const snap = await getDoc(doc(db, "tasks", id));
            if (snap.exists()) {
                const data = snap.data() as any;
                taskMap.set(id, data?.taskname ?? "");
            }
        }),
    );

    await Promise.all(
        Array.from(subtaskIds).map(async (id) => {
            const snap = await getDoc(doc(db, "subtasks", id));
            if (snap.exists()) {
                const data = snap.data() as any;
                subtaskMap.set(id, data?.taskname ?? "");
            }
        }),
    );

    return items.map((item) => {
        const rawDate = item.date;
        const rawStart = item.startTime;
        const rawEnd = item.endTime;
        const date = rawDate?.toDate ? rawDate.toDate() : new Date(rawDate);
        const startTime = rawStart?.toDate ? rawStart.toDate() : new Date(rawStart);
        const endTime = rawEnd?.toDate ? rawEnd.toDate() : new Date(rawEnd);
        const taskName = item.type === "subtask"
            ? subtaskMap.get(item.taskId) ?? ""
            : taskMap.get(item.taskId) ?? "";

        return {
            ...item,
            date,
            startTime,
            endTime,
            taskName,
        };
    }) as FocusType[];
};


export const getFocusTimeAndPomoCountByTask = async (id: string) => {

    const focusRef = collection(db, "focus");
    const q = query(focusRef, where("taskId", "==", id));
    const docsRef = await getDocs(q);

    let countTotal = 0;
    let sumMinutes = 0;

    docsRef.docs.forEach((docSnap) => {
        const data: any = docSnap.data();
        countTotal += 1;
        sumMinutes += data?.focusDuration ?? 0;
    });

    return { count: countTotal, totalMinutes: sumMinutes };
};