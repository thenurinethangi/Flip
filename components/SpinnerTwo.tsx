import React, { useContext } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { ThemeContext } from "@/context/themeContext";
import { ColorContext } from "@/context/colorContext";

type SpinnerProps = {
    size?: number | "small" | "large";
};

export default function SpinnerTwo({ size = "large" }: SpinnerProps) {
    const { currentTheme } = useContext(ThemeContext);
    const { colorTheme } = useContext(ColorContext);

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: currentTheme === "light" ? "#DDE4FF" : "#000000" },
            ]}
        >
            <ActivityIndicator size={size} color={colorTheme} />
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
