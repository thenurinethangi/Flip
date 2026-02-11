import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function requestNotificationPermission() {
  if (typeof Notifications.getPermissionsAsync !== "function") return;
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
}

export async function initNotifications() {
  if (typeof Notifications.setNotificationHandler !== "function") return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (typeof Notifications.getPermissionsAsync !== "function") return;
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }

  if (
    Platform.OS === "android" &&
    typeof Notifications.setNotificationChannelAsync === "function"
  ) {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "default",
    });
  }
}
