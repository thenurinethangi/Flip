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

export type AddNewCountdownType = {
  countdownName: string;
  date: string;
  reminder: string;
  repeat: string;
  type: string;
};

export const add = async (data: AddNewCountdownType) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const payload = {
    countdownName: data.countdownName,
    date: data.date,
    reminder: data.reminder,
    repeat: data.repeat,
    type: data.type,
    userId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "countdowns"), payload);
  return docRef.id;
};

const isOldDate = (dateStr: string, today: Date = new Date()): boolean => {
  if (!dateStr) return false;

  const parsed = new Date(
    dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`,
  );
  if (Number.isNaN(parsed.getTime())) return false;

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);

  return parsed < todayStart;
};

const getNextRepeatDate = (
  dateStr: string,
  repeat: string,
  today: Date = new Date(),
): string | null => {
  if (!dateStr || repeat === "None") return null;

  const parsed = new Date(
    dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`,
  );
  if (Number.isNaN(parsed.getTime())) return null;

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);

  if (parsed >= todayStart) return parsed.toLocaleDateString("en-CA");

  while (parsed < todayStart) {
    if (repeat === "Weekly") {
      parsed.setDate(parsed.getDate() + 7);
    } else if (repeat === "Monthly") {
      const day = parsed.getDate();
      parsed.setMonth(parsed.getMonth() + 1, day);
    } else if (repeat === "Yearly") {
      const month = parsed.getMonth();
      const day = parsed.getDate();
      parsed.setFullYear(parsed.getFullYear() + 1, month, day);
    } else {
      return null;
    }
  }

  return parsed.toLocaleDateString("en-CA");
};

const ensureRepeatCountdown = async (userId: string) => {
  const countdownsRef = collection(db, "countdowns");
  const q = query(
    countdownsRef,
    where("userId", "==", userId),
    where("repeat", "in", ["Weekly", "Monthly", "Yearly"]),
  );
  const snapshot = await getDocs(q);

  const cd = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((item: any) => !item.isRepeated);

  for (let i = 0; i < cd.length; i++) {
    const item: any = cd[i];

    if (isOldDate(item.date)) {
      const nextDate = getNextRepeatDate(item.date, item.repeat);
      if (nextDate && nextDate !== item.date) {
        await updateDoc(doc(db, "countdowns", item.id), {
          date: nextDate,
          updatedAt: serverTimestamp(),
        });
      }
    }
  }
};

export const subscribeCountdown = async (
  onCountdowns: (
    countdowns: Array<{ id: string } & Record<string, any>>,
  ) => void,
  onError?: (error: Error) => void,
) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  void ensureRepeatCountdown(user.uid).catch((error) => {
    if (onError) onError(error as Error);
  });

  const countdownsRef = collection(db, "countdowns");
  const q = query(countdownsRef, where("userId", "==", user.uid));

  return onSnapshot(q, (snapshot) => {
    const countdowns = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((doc: any) => {
        if (!isOldDate(doc.date)) {
          return doc;
        }
      });
    countdowns.sort((a: any, b: any) => {
      const aDate = a.createdAt?.toDate?.() ?? new Date(0);
      const bDate = b.createdAt?.toDate?.() ?? new Date(0);
      return aDate.getTime() - bDate.getTime();
    });
    onCountdowns(countdowns);
  });
};
