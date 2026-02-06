import * as Notifications from "expo-notifications";

export async function scheduleLocalNotificationForCountdown(title: string, body: string, date: Date, id: string) {

    console.log(title);
    console.log(body);
    console.log(date);

    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: {
                type: 'countdown',
                countdownId: id,
                action: "OPEN_TASK",
            },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: new Date(Date.now() + 5000),
        },
    });

    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: {
                type: 'countdown',
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


export async function cancelLocalNotificationForCountdown(id: string) {
    await Notifications.cancelScheduledNotificationAsync(id);
}


export async function scheduleLocalNotificationForTaskWithoutRepeat(title: string, body: string, date: Date, id: string) {

    console.log(title);
    console.log(body);
    console.log(date);

    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: {
                type: 'task',
                taskId: id,
                action: "OPEN_TASK",
            },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: new Date(Date.now() + 5000),
        },
    });

    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: {
                type: 'task',
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
