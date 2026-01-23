import { Stack } from "expo-router";
import "react-native-reanimated";
import "./../global.css";

import ThemeProvider, { ThemeContext } from "@/context/themeContext";
import { useContext } from "react";
import { StatusBar } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContent() {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in-email" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in-password" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={currentTheme === "light" ? "light" : "dark"} />
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
