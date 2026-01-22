import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "./../global.css";

import ThemeProvider, { ThemeContext } from "@/context/themeContext";
import { useContext } from "react";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in-email" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={currentTheme === "light" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
