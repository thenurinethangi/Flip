import { Stack } from "expo-router";
import "react-native-reanimated";
import "./../global.css";

import ThemeProvider, { ThemeContext } from "@/context/themeContext";
import { useContext } from "react";
import { StatusBar } from "react-native";
import Toast, { ToastConfig } from "react-native-toast-message";
import { CustomToast } from "@/components/custom-toast";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContent() {
  const { currentTheme } = useContext(ThemeContext);

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
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in-email" options={{ headerShown: false }} />
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

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
