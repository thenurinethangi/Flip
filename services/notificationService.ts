import * as Notifications from "expo-notifications";

export async function scheduleLocalNotificationForCountdown(
    title: string,
    body: string,
    date: Date,
    id: string,
) {
    console.log(title);
    console.log(body);
    console.log(date);

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
}

export async function cancelLocalNotification(id: string) {
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
}
