import * as Notifications from "expo-notifications";

async function ensureNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;
  const request = await Notifications.requestPermissionsAsync();
  return request.status === "granted";
}

export async function scheduleLocalNotificationForCountdown(
  title: string,
  body: string,
  date: Date,
  id: string,
) {
  console.log(title);
  console.log(body);
  console.log(date);

  const hasPermission = await ensureNotificationPermission();
  if (!hasPermission) return null;

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: {
          type: "countdown",
          countdownId: id,
          action: "OPEN_TASK",
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    });
    return notificationId;
  } catch {
    return null;
  }
}

export async function cancelLocalNotification(id?: string | null) {
  if (!id) return;
  await Notifications.cancelScheduledNotificationAsync(id);
}

export async function scheduleLocalNotificationForTask(
  title: string,
  body: string,
  date: Date,
  id: string,
) {
  console.log(title);
  console.log(body);
  console.log(date);

  const hasPermission = await ensureNotificationPermission();
  if (!hasPermission) return null;

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: {
          type: "task",
          taskId: id,
          action: "OPEN_TASK",
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    });
    return notificationId;
  } catch {
    return null;
  }
}
