import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "@/context/themeContext";
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";

interface ToastProps {
  text1?: string;
  text2?: string;
  type?: "success" | "error" | "warning" | "info";
}

const ToastIcon = ({ type }: { type: ToastProps["type"] }) => {
  switch (type) {
    case "success":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Defs>
            <LinearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#10B981" />
              <Stop offset="100%" stopColor="#059669" />
            </LinearGradient>
          </Defs>
          <Circle cx="12" cy="12" r="10" fill="url(#successGrad)" />
          <Path
            d="M8 12.5L10.5 15L16 9.5"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case "error":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Defs>
            <LinearGradient id="errorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#EF4444" />
              <Stop offset="100%" stopColor="#DC2626" />
            </LinearGradient>
          </Defs>
          <Circle cx="12" cy="12" r="10" fill="url(#errorGrad)" />
          <Path
            d="M15 9L9 15M9 9L15 15"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case "warning":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Defs>
            <LinearGradient id="warningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#D97706" />
            </LinearGradient>
          </Defs>
          <Circle cx="12" cy="12" r="10" fill="url(#warningGrad)" />
          <Path
            d="M12 7V13"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <Circle cx="12" cy="16.5" r="1.2" fill="white" />
        </Svg>
      );
    case "info":
    default:
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Defs>
            <LinearGradient id="infoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#3B82F6" />
              <Stop offset="100%" stopColor="#2563EB" />
            </LinearGradient>
          </Defs>
          <Circle cx="12" cy="12" r="10" fill="url(#infoGrad)" />
          <Path
            d="M12 11V17"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <Circle cx="12" cy="7.5" r="1.2" fill="white" />
        </Svg>
      );
  }
};

export const CustomToast = ({ text1, text2, type = "info" }: ToastProps) => {
  const { currentTheme } = useContext(ThemeContext);
  const isLight = currentTheme === "light";

  const getAccentColor = () => {
    switch (type) {
      case "success":
        return "#10B981";
      case "error":
        return "#EF4444";
      case "warning":
        return "#F59E0B";
      case "info":
      default:
        return "#3B82F6";
    }
  };

  const getBackgroundColor = () => {
    if (isLight) {
      switch (type) {
        case "success":
          return "#F0FDF4";
        case "error":
          return "#FEF2F2";
        case "warning":
          return "#FFFBEB";
        case "info":
        default:
          return "#EFF6FF";
      }
    } else {
      switch (type) {
        case "success":
          return "#064E3B";
        case "error":
          return "#7F1D1D";
        case "warning":
          return "#78350F";
        case "info":
        default:
          return "#1E3A8A";
      }
    }
  };

  const getBorderColor = () => {
    if (isLight) {
      switch (type) {
        case "success":
          return "#86EFAC";
        case "error":
          return "#FCA5A5";
        case "warning":
          return "#FCD34D";
        case "info":
        default:
          return "#93C5FD";
      }
    } else {
      switch (type) {
        case "success":
          return "#059669";
        case "error":
          return "#DC2626";
        case "warning":
          return "#D97706";
        case "info":
        default:
          return "#2563EB";
      }
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
      ]}
    >
      {/* Accent Bar */}
      <View
        style={[
          styles.accentBar,
          { backgroundColor: getAccentColor() },
        ]}
      />

      {/* Icon */}
      <View style={styles.iconContainer}>
        <ToastIcon type={type} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {text1 && (
          <Text
            style={[
              styles.title,
              { color: isLight ? "#111827" : "#F9FAFB" },
            ]}
          >
            {text1}
          </Text>
        )}
        {text2 && (
          <Text
            style={[
              styles.message,
              { color: isLight ? "#4B5563" : "#D1D5DB" },
            ]}
          >
            {text2}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "92%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginHorizontal: 6,
    marginTop: 5,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconContainer: {
    marginLeft: 4,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "700",
    fontSize: 15.5,
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});