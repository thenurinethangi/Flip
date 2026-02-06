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
} from "firebase/firestore";
import { auth, db } from "./firebase";
import {
  cancelLocalNotification,
  scheduleLocalNotificationForCountdown,
} from "./notificationService";

export type AddNewCountdownType = {
  countdownName: string;
  date: string;
  reminder: string;
  repeat: string;
  type: string;
};

type ReminderLabel =
  | "None"
  | "1 day early"
  | "2 day early"
  | "5 day early"
  | "1 week early"
  | "2 week early"
  | "1 month early";

export function getReminderDate(
  taskDateStr: string,
  reminderLabel: ReminderLabel,
): Date {
  const [year, month, day] = taskDateStr.split("-").map(Number);

  const reminderDate = new Date(year, month - 1, day, 9, 0, 0);

  switch (reminderLabel) {
    case "1 day early":
      reminderDate.setDate(reminderDate.getDate() - 1);
      break;

    case "2 day early":
      reminderDate.setDate(reminderDate.getDate() - 2);
      break;

    case "5 day early":
      reminderDate.setDate(reminderDate.getDate() - 5);
      break;

    case "1 week early":
      reminderDate.setDate(reminderDate.getDate() - 7);
      break;

    case "2 week early":
      reminderDate.setDate(reminderDate.getDate() - 14);
      break;

    case "1 month early":
      reminderDate.setMonth(reminderDate.getMonth() - 1);
      break;
  }

  return reminderDate;
}

const getReminderBodyText = (
  reminderLabel: ReminderLabel,
  countdownName: string,
): string => {
  if (reminderLabel === "None") {
    return countdownName;
  }

  const prefixMap: Record<Exclude<ReminderLabel, "None">, string> = {
    "1 day early": "1 day left to ",
    "2 day early": "2 days left to ",
    "5 day early": "5 days left to ",
    "1 week early": "1 week left to ",
    "2 week early": "2 weeks left to ",
    "1 month early": "1 month left to ",
  };

  return `${prefixMap[reminderLabel] ?? ""}${countdownName}`.trim();
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

  if (data.reminder !== "None") {
    const dateToRemind = getReminderDate(
      data.date,
      data.reminder as ReminderLabel,
    );
    const bodyText = getReminderBodyText(
      data.reminder as ReminderLabel,
      data.countdownName,
    );
    const notificationId = await scheduleLocalNotificationForCountdown(
      data.type + " Reminder",
      bodyText,
      dateToRemind,
      docRef.id,
    );
    console.log(notificationId);

    await updateDoc(doc(db, "countdowns", docRef.id), {
      notificationId: notificationId,
    });
  }

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
        if (item.reminder !== "None") {
          const dateToRemind = getReminderDate(
            nextDate,
            item.reminder as ReminderLabel,
          );
          const bodyText = getReminderBodyText(
            item.reminder as ReminderLabel,
            item.countdownName,
          );
          const notificationId = await scheduleLocalNotificationForCountdown(
            item.type + " Reminder",
            bodyText,
            dateToRemind,
            item.id,
          );

          await updateDoc(doc(db, "countdowns", item.id), {
            date: nextDate,
            updatedAt: serverTimestamp(),
            notificationId: notificationId,
          });
        } else {
          await updateDoc(doc(db, "countdowns", item.id), {
            date: nextDate,
            updatedAt: serverTimestamp(),
          });
        }
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

export const deleteCountdown = async (id: string) => {
  const c_doc = await getDoc(doc(db, "countdowns", id));

  if (c_doc.exists() && c_doc.data().notificationId) {
    try {
      await cancelLocalNotification(c_doc.data().notificationId);
    } catch (error) {
      console.log("Failed to cancel notification", error);
    }
  }

  await deleteDoc(doc(db, "countdowns", id));
};

export const editCountdown = async (data: any) => {
  const c_doc = await getDoc(doc(db, "countdowns", data.id));

  if (c_doc.exists() && c_doc.data().notificationId) {
    try {
      await cancelLocalNotification(c_doc.data().notificationId);
    } catch (error) {
      console.log("Failed to cancel notification", error);
    }
  }

  if (data.reminder !== "None") {
    const dateToRemind = getReminderDate(
      data.date,
      data.reminder as ReminderLabel,
    );
    const bodyText = getReminderBodyText(
      data.reminder as ReminderLabel,
      data.countdownName,
    );
    const notificationId = await scheduleLocalNotificationForCountdown(
      data.type + " Reminder",
      bodyText,
      dateToRemind,
      data.id,
    );

    await updateDoc(doc(db, "countdowns", data.id), {
      countdownName: data.countdownName,
      date: data.date,
      reminder: data.reminder,
      repeat: data.repeat,
      notificationId: notificationId,
      updatedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(doc(db, "countdowns", data.id), {
      countdownName: data.countdownName,
      date: data.date,
      reminder: data.reminder,
      repeat: data.repeat,
      notificationId: deleteField(),
      updatedAt: serverTimestamp(),
    });
  }
};
