import type { AddTaskInput } from "./taskTypes";

export type ReminderLabel =
  | "None"
  | "At time of task"
  | "5 minutes before"
  | "30 minutes before"
  | "1 hour before"
  | "On the day"
  | "1 day early";

export const getReminderBodyText = (reminderLabel: ReminderLabel): string => {
  if (reminderLabel === "None") {
    return "";
  }

  const prefixMap: Record<Exclude<ReminderLabel, "None">, string> = {
    "At time of task": "Scheduled now",
    "5 minutes before": "Scheduled in 5 minutes",
    "30 minutes before": "Scheduled in 30 minutes",
    "1 hour before": "Scheduled in 1 hour",
    "On the day": "Scheduled today",
    "1 day early": "Scheduled tomorrow",
  };

  return prefixMap[reminderLabel];
};

export function getReminderDate(task: AddTaskInput): Date {
  const [year, month, day] = task.date.split("-").map(Number);

  const reminderDate = new Date(year, month - 1, day, 9, 0, 0);

  const today = new Date();

  const parseTimeToHoursMinutes = (
    timeStr: string,
  ): { hours: number; minutes: number } | null => {
    if (!timeStr) return null;
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3].toUpperCase();
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  };

  switch (task.reminder) {
    case "At time of task": {
      const parsedTime = parseTimeToHoursMinutes(task.time);
      if (parsedTime) {
        reminderDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
      }
      break;
    }
    case "5 minutes before": {
      const parsedTime = parseTimeToHoursMinutes(task.time);
      if (parsedTime) {
        reminderDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
        reminderDate.setMinutes(reminderDate.getMinutes() - 5);
      }
      break;
    }
    case "30 minutes before": {
      const parsedTime = parseTimeToHoursMinutes(task.time);
      if (parsedTime) {
        reminderDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
        reminderDate.setMinutes(reminderDate.getMinutes() - 30);
      }
      break;
    }
    case "1 hour before": {
      const parsedTime = parseTimeToHoursMinutes(task.time);
      if (parsedTime) {
        reminderDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
        reminderDate.setHours(reminderDate.getHours() - 1);
      }
      break;
    }
    case "On the day": {
      reminderDate.setDate(today.getDate());
      reminderDate.setMonth(today.getMonth());
      reminderDate.setFullYear(today.getFullYear());
      break;
    }
    case "1 day early": {
      reminderDate.setDate(reminderDate.getDate() - 1);
      break;
    }
  }

  return reminderDate;
}
