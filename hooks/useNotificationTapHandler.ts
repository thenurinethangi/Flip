import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { router } from 'expo-router';

export function useNotificationTapHandler() {
    useEffect(() => {
        const sub =
            Notifications.addNotificationResponseReceivedListener(
                response => {
                    const data = response.notification.request.content.data;

                    if (data?.taskId) { 
                        // example action
                        // router.push(`/task/${data.taskId}`);
                    }
                }
            );

        return () => sub.remove();
    }, []);
}
