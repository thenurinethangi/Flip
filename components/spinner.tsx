import React, { useContext } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { ThemeContext } from "@/context/themeContext";

type SpinnerProps = {
  size?: number | "small" | "large";
};

export default function Spinner({ size = "large" }: SpinnerProps) {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme === "light" ? "#FAFBFC" : "#000000" },
      ]}
    >
      <ActivityIndicator size={size} color="#4772FA" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                 
    justifyContent: "center", 
    alignItems: "center",     
  },
});
