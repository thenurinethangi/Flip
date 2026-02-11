import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export function useNotificationTapHandler() {
  useEffect(() => {
    if (
      typeof Notifications.addNotificationResponseReceivedListener !==
      "function"
    ) {
      return;
    }

    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        if (data?.taskId) {
          // example action
          // router.push(`/task/${data.taskId}`);
        }
      },
    );

    return () => sub.remove();
  }, []);
}
