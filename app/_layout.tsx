import { Stack } from "expo-router";
import "react-native-reanimated";
import "./../global.css";

import { CustomToast } from "@/components/custom-toast";
import { initNotifications } from "@/config/notificationConfig";
import { AuthProvider } from "@/context/authContext";
import ColorProvider from "@/context/colorContext";
import ThemeProvider, { ThemeContext } from "@/context/themeContext";
import { useNotificationTapHandler } from "@/hooks/useNotificationTapHandler";
import { useContext, useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast, { ToastConfig } from "react-native-toast-message";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://0c66663953dacb57de87257a32bde2b3@o4510866521325568.ingest.us.sentry.io/4510866528141312',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

function RootLayoutContent() {
  const { currentTheme } = useContext(ThemeContext);

  useNotificationTapHandler();
  useEffect(() => {
    initNotifications();
  }, []);

  const toastConfig: ToastConfig = {
    success: ({ text1, text2 }) => (
      <CustomToast text1={text1} text2={text2} type="success" />
    ),
    error: ({ text1, text2 }) => (
      <CustomToast text1={text1} text2={text2} type="error" />
    ),
    warning: ({ text1, text2 }) => (
      <CustomToast text1={text1} text2={text2} type="warning" />
    ),
    info: ({ text1, text2 }) => (
      <CustomToast text1={text1} text2={text2} type="info" />
    ),
  };

  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      <Toast config={toastConfig} />

      <StatusBar
        barStyle={currentTheme === "light" ? "dark-content" : "light-content"}
        backgroundColor={currentTheme === "light" ? "#FAFBFC" : "#000000"}
        translucent={false}
      />
    </>
  );
}

export default Sentry.wrap(function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider>
          <ColorProvider>
            <RootLayoutContent />
          </ColorProvider>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
});