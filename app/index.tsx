import { ThemeContext } from "@/context/themeContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Enhanced Illustration Components
const ReminderIllustration = () => (
  <Svg width={300} height={300} viewBox="0 0 300 300">
    <Defs>
      <LinearGradient id="taskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#667EEA" stopOpacity="1" />
        <Stop offset="100%" stopColor="#764BA2" stopOpacity="1" />
      </LinearGradient>
      <LinearGradient id="clipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#4A5568" stopOpacity="1" />
        <Stop offset="100%" stopColor="#2D3748" stopOpacity="1" />
      </LinearGradient>
      <LinearGradient id="paperShine" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <Stop offset="100%" stopColor="#F7FAFC" stopOpacity="1" />
      </LinearGradient>
    </Defs>

    <Ellipse cx="150" cy="270" rx="90" ry="15" fill="#000" opacity="0.1" />

    <Rect x="70" y="75" width="140" height="180" rx="15" fill="#E2E8F0" opacity="0.3" />

    <Rect x="68" y="72" width="140" height="180" rx="15" fill="url(#paperShine)"
      stroke="url(#taskGrad)" strokeWidth="3.5" />

    <Rect x="95" y="55" width="86" height="25" rx="8" fill="url(#clipGrad)" />
    <Circle cx="108" cy="67.5" r="4" fill="#CBD5E0" />
    <Circle cx="130" cy="67.5" r="4" fill="#CBD5E0" />
    <Circle cx="168" cy="67.5" r="4" fill="#CBD5E0" />

    <Rect x="85" y="100" width="16" height="16" rx="4" fill="#FFF5F7" stroke="#F687B3" strokeWidth="2.5" />
    <Path d="M 89 108 L 93 112 L 101 102" stroke="#F687B3" strokeWidth="2.5"
      fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Rect x="108" y="100" width="80" height="10" rx="5" fill="#FED7E2" />

    <Rect x="85" y="130" width="16" height="16" rx="4" fill="#FFFAF0" stroke="#F6AD55" strokeWidth="2.5" />
    <Rect x="108" y="130" width="75" height="10" rx="5" fill="#FEEBC8" />

    <Rect x="85" y="160" width="16" height="16" rx="4" fill="#EBF8FF" stroke="#667EEA" strokeWidth="2.5" />
    <Path d="M 89 168 L 93 172 L 101 162" stroke="#667EEA" strokeWidth="2.5"
      fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Rect x="108" y="160" width="70" height="10" rx="5" fill="#BEE3F8" />

    <Rect x="85" y="190" width="16" height="16" rx="4" fill="#F0FFF4" stroke="#68D391" strokeWidth="2.5" />
    <Rect x="108" y="190" width="65" height="10" rx="5" fill="#C6F6D5" />

    <Rect x="85" y="220" width="16" height="16" rx="4" fill="#FAF5FF" stroke="#B794F4" strokeWidth="2.5" />
    <Rect x="108" y="220" width="60" height="10" rx="5" fill="#E9D8FD" />
  </Svg>
);

const EisenhowerIllustration = () => (
  <Svg width={300} height={300} viewBox="0 0 300 300">
    <Defs>
      <LinearGradient id="urgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#F093FB" stopOpacity="1" />
        <Stop offset="100%" stopColor="#F5576C" stopOpacity="1" />
      </LinearGradient>
      <LinearGradient id="impGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FCCF31" stopOpacity="1" />
        <Stop offset="100%" stopColor="#F55555" stopOpacity="1" />
      </LinearGradient>
      <LinearGradient id="schedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#4FACFE" stopOpacity="1" />
        <Stop offset="100%" stopColor="#00F2FE" stopOpacity="1" />
      </LinearGradient>
      <LinearGradient id="delegGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#A8EDEA" stopOpacity="1" />
        <Stop offset="100%" stopColor="#FED6E3" stopOpacity="1" />
      </LinearGradient>
    </Defs>

    <Ellipse cx="150" cy="270" rx="95" ry="15" fill="#000" opacity="0.1" />

    <Line x1="150" y1="65" x2="150" y2="245" stroke="#CBD5E0" strokeWidth="3" />
    <Line x1="65" y1="155" x2="235" y2="155" stroke="#CBD5E0" strokeWidth="3" />

    <Rect x="72" y="72" width="70" height="75" rx="14" fill="#FFF5F7"
      stroke="url(#urgGrad)" strokeWidth="3.5" />
    <Circle cx="107" cy="110" r="6" fill="url(#urgGrad)" />
    <Circle cx="107" cy="128" r="6" fill="url(#urgGrad)" opacity="0.6" />

    <Rect x="158" y="72" width="70" height="75" rx="14" fill="#FFFAF0"
      stroke="url(#impGrad)" strokeWidth="3.5" />
    <Circle cx="193" cy="110" r="6" fill="url(#impGrad)" />
    <Circle cx="193" cy="128" r="6" fill="url(#impGrad)" opacity="0.6" />

    <Rect x="72" y="163" width="70" height="75" rx="14" fill="#EBF8FF"
      stroke="url(#schedGrad)" strokeWidth="3.5" />
    <Circle cx="107" cy="200" r="6" fill="url(#schedGrad)" />

    <Rect x="158" y="163" width="70" height="75" rx="14" fill="#F7FAFC"
      stroke="url(#delegGrad)" strokeWidth="3.5" />
    <Circle cx="193" cy="200" r="6" fill="url(#delegGrad)" opacity="0.5" />
  </Svg>
);

const CalendarIllustration = () => (
  <Svg width={300} height={300} viewBox="0 0 300 300">
    <Defs>
      <LinearGradient id="calGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#667EEA" stopOpacity="1" />
        <Stop offset="100%" stopColor="#764BA2" stopOpacity="1" />
      </LinearGradient>
      <LinearGradient id="calShine" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
        <Stop offset="100%" stopColor="#F7FAFC" stopOpacity="1" />
      </LinearGradient>
    </Defs>

    <Ellipse cx="150" cy="270" rx="95" ry="15" fill="#000" opacity="0.1" />

    <Rect x="68" y="88" width="165" height="175" rx="16" fill="#000" opacity="0.05" />

    <Rect x="65" y="85" width="165" height="175" rx="16" fill="url(#calShine)"
      stroke="#E2E8F0" strokeWidth="2.5" />

    <Rect x="65" y="85" width="165" height="48" rx="16" fill="url(#calGrad)" />
    <Path d="M 65 120 Q 147.5 125 230 120" fill="url(#calGrad)" />

    <Circle cx="85" cy="95" r="5" fill="#FFFFFF" opacity="0.9" />
    <Circle cx="147.5" cy="95" r="5" fill="#FFFFFF" opacity="0.9" />
    <Circle cx="210" cy="95" r="5" fill="#FFFFFF" opacity="0.9" />

    <Rect x="110" y="105" width="75" height="12" rx="6" fill="#FFFFFF" opacity="0.3" />

    <Line x1="75" y1="145" x2="220" y2="145" stroke="#E2E8F0" strokeWidth="1.5" />
    <Line x1="75" y1="175" x2="220" y2="175" stroke="#E2E8F0" strokeWidth="1.5" />
    <Line x1="75" y1="205" x2="220" y2="205" stroke="#E2E8F0" strokeWidth="1.5" />
    <Line x1="75" y1="235" x2="220" y2="235" stroke="#E2E8F0" strokeWidth="1.5" />

    <Line x1="110" y1="145" x2="110" y2="250" stroke="#E2E8F0" strokeWidth="1" />
    <Line x1="147.5" y1="145" x2="147.5" y2="250" stroke="#E2E8F0" strokeWidth="1" />
    <Line x1="185" y1="145" x2="185" y2="250" stroke="#E2E8F0" strokeWidth="1" />

    <Circle cx="92.5" cy="160" r="4" fill="#F687B3" opacity="0.8" />
    <Circle cx="165" cy="190" r="14" fill="#68D391" opacity="0.9" />
    <Path d="M 161 188 L 165 192 L 173 182" stroke="white" strokeWidth="2.5"
      fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="202.5" cy="220" r="4" fill="#F6AD55" opacity="0.8" />
  </Svg>
);

const HabitIllustration = () => (
  <Svg width={300} height={300} viewBox="0 0 300 300">
    <Defs>
      <LinearGradient id="habitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#667EEA" stopOpacity="1" />
        <Stop offset="100%" stopColor="#764BA2" stopOpacity="1" />
      </LinearGradient>
      <LinearGradient id="streak1" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="#667EEA" stopOpacity="1" />
        <Stop offset="100%" stopColor="#667EEA" stopOpacity="0.3" />
      </LinearGradient>
      <LinearGradient id="streak2" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="#F6AD55" stopOpacity="1" />
        <Stop offset="100%" stopColor="#F6AD55" stopOpacity="0.3" />
      </LinearGradient>
      <LinearGradient id="streak3" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="#B794F4" stopOpacity="1" />
        <Stop offset="100%" stopColor="#B794F4" stopOpacity="0.3" />
      </LinearGradient>
    </Defs>

    <Ellipse cx="150" cy="270" rx="95" ry="15" fill="#000" opacity="0.1" />

    <Rect x="63" y="88" width="165" height="175" rx="16" fill="#000" opacity="0.04" />

    <Rect x="60" y="85" width="165" height="175" rx="16" fill="white"
      stroke="url(#habitGrad)" strokeWidth="3.5" />

    <Rect x="60" y="85" width="165" height="35" rx="16" fill="url(#habitGrad)" opacity="0.1" />

    <Line x1="70" y1="125" x2="215" y2="125" stroke="#E2E8F0" strokeWidth="2" />

    <Circle cx="82" cy="150" r="13" fill="#667EEA" />
    <Path d="M 78 148 L 82 152 L 88 142" stroke="white" strokeWidth="2.5"
      fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="117" cy="150" r="13" fill="url(#streak1)" opacity="0.85" />
    <Circle cx="152" cy="150" r="13" fill="url(#streak1)" opacity="0.5" />
    <Circle cx="187" cy="150" r="13" fill="url(#streak1)" opacity="0.25" />

    <Circle cx="82" cy="190" r="13" fill="#F6AD55" />
    <Path d="M 78 188 L 82 192 L 88 182" stroke="white" strokeWidth="2.5"
      fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="117" cy="190" r="13" fill="url(#streak2)" opacity="0.85" />
    <Circle cx="152" cy="190" r="13" fill="url(#streak2)" opacity="0.5" />
    <Circle cx="187" cy="190" r="13" fill="url(#streak2)" opacity="0.25" />

    <Circle cx="82" cy="230" r="13" fill="#B794F4" />
    <Path d="M 78 228 L 82 232 L 88 222" stroke="white" strokeWidth="2.5"
      fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="117" cy="230" r="13" fill="url(#streak3)" opacity="0.85" />
    <Circle cx="152" cy="230" r="13" fill="url(#streak3)" opacity="0.5" />
    <Circle cx="187" cy="230" r="13" fill="url(#streak3)" opacity="0.25" />
  </Svg>
);

const PomodoroIllustration = () => (
  <Svg width={280} height={280} viewBox="0 0 280 280">
    <Defs>
      <RadialGradient id="clockGrad" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#4A90E2" stopOpacity="0.15" />
        <Stop offset="100%" stopColor="#4A90E2" stopOpacity="0.6" />
      </RadialGradient>
      <LinearGradient id="tomatoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FF5252" stopOpacity="1" />
        <Stop offset="100%" stopColor="#E63946" stopOpacity="1" />
      </LinearGradient>
      <LinearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#4CAF50" stopOpacity="1" />
        <Stop offset="100%" stopColor="#388E3C" stopOpacity="1" />
      </LinearGradient>
    </Defs>
    <Ellipse cx="140" cy="250" rx="85" ry="12" fill="#000" opacity="0.08" />
    <Circle
      cx="90"
      cy="115"
      r="62"
      fill="none"
      stroke="#4A90E2"
      strokeWidth="3.5"
    />
    <Circle cx="90" cy="115" r="56" fill="url(#clockGrad)" />
    <Circle cx="90" cy="115" r="6" fill="#4A90E2" />
    <Path
      d="M 90 115 L 90 58"
      stroke="#4A90E2"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <Path
      d="M 90 115 L 137 115"
      stroke="#4A90E2"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <Circle cx="125" cy="115" r="3.5" fill="#4A90E2" />
    <Circle cx="90" cy="63" r="3.5" fill="#4A90E2" />
    <Circle cx="220" cy="160" r="32" fill="url(#tomatoGrad)" />
    <Ellipse cx="218" cy="158" rx="30" ry="32" fill="url(#tomatoGrad)" />
    <Path
      d="M 210 132 Q 220 128 230 132"
      stroke="url(#stemGrad)"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
    />
    <Path d="M 215 130 Q 218 123 222 130" fill="url(#stemGrad)" opacity="0.7" />
    <Ellipse cx="212" cy="168" rx="8" ry="5" fill="#FF7070" opacity="0.6" />
    <Ellipse cx="226" cy="158" rx="7" ry="6" fill="#FF7070" opacity="0.5" />
  </Svg>
);

// Blob 1 - Tall Vertical Blob (Original)
// Blob 1 - Soft Organic Blob (SLIGHTLY SMALLER)
// Blob 1 - Soft Organic Blob (MICRO REDUCTION)
const Blob1 = ({ color = "#E3E9FB" }) => (
  <Svg
    width={410}
    height={410}
    viewBox="0 0 400 400"
  >
    <Path
      d="M 190 70
         C 240 68, 280 85, 305 120
         C 325 150, 328 185, 320 220
         C 312 255, 290 285, 255 305
         C 220 325, 180 330, 140 318
         C 95 305, 60 275, 48 235
         C 36 195, 38 155, 55 120
         C 75 80, 110 70, 150 70
         C 165 69, 175 70, 190 70 Z"
      fill={color}
      opacity="0.6"
      transform="translate(200 200) scale(0.97) translate(-200 -200)"
    />
    <Circle cx="90" cy="340" r="15" fill={color} opacity="0.6" />
  </Svg>
);

// Blob 2 - Wide Horizontal Blob
const Blob2 = ({ color = "#E3E9FB" }) => (
  <Svg
    width={430}
    height={490}
    viewBox="0 0 400 400"
  >
    <Path
      d="
        M 200 85
        C 265 85, 315 115, 330 165
        C 345 215, 315 270, 255 300
        C 195 330, 120 315, 85 265
        C 50 215, 65 155, 110 120
        C 145 95, 170 85, 200 85 Z
      "
      fill={color}
      opacity="0.6"
    />
    <Circle cx="95" cy="305" r="12" fill={color} opacity="0.6" />
  </Svg>
);

// Blob 3 - Rounded Square Blob
const Blob3 = ({ color = "#E3E9FB" }) => (
  <Svg
    width={395}
    height={395}
    viewBox="0 0 400 400"
  >
    <Path
      d="M 200 55
         C 255 60, 305 85, 325 135
         C 345 185, 335 240, 305 280
         C 275 320, 225 345, 175 335
         C 125 325, 85 295, 70 250
         C 55 205, 65 150, 95 115
         C 125 80, 160 50, 200 55 Z"
      fill={color}
      opacity="0.6"
    />
    <Circle cx="70" cy="310" r="12" fill={color} opacity="0.6" />
    <Circle cx="290" cy="330" r="16" fill={color} opacity="0.6" />
  </Svg>
);

// Blob 4 - Droplet/Teardrop Shape
const Blob4 = ({ color = "#E3E9FB" }) => (
  <Svg
    width={410}
    height={410}
    viewBox="0 0 400 400"
  >
    <Path
      d="M 205 50
         C 260 45, 315 75, 335 120
         C 355 165, 345 225, 310 270
         C 275 315, 220 350, 170 335
         C 120 320, 80 285, 65 235
         C 50 185, 70 130, 105 100
         C 140 70, 170 50, 205 50 Z"
      fill={color}
      opacity="0.6"
    />
    <Circle cx="85" cy="325" r="13" fill={color} opacity="0.6" />
    <Circle cx="320" cy="340" r="15" fill={color} opacity="0.6" />
  </Svg>
);

// Blob 5 - Asymmetric Irregular Blob
const Blob5 = ({ color = "#E3E9FB" }) => (
  <Svg
    width={400}
    height={400}
    viewBox="0 0 400 400"
  >
    <Path
      d="M 190 75
         C 250 70, 290 95, 310 135
         C 325 170, 322 205, 305 240
         C 288 275, 258 300, 215 310
         C 175 318, 135 312, 100 285
         C 65 258, 48 220, 53 180
         C 58 145, 78 110, 115 88
         C 145 70, 165 75, 190 75 Z"
      fill={color}
      opacity="0.6"
    />
    <Circle cx="95" cy="55" r="13" fill={color} opacity="0.6" />
  </Svg>
);

export const BlobShapes = [Blob1, Blob2, Blob3, Blob4, Blob5];

const slides = [
  {
    title: "Create reminders and repetitions for tasks.",
    color: "#D4E3F4",
    Illustration: ReminderIllustration,
  },
  {
    title: "Use Eisenhower Matrix to prioritize tasks.",
    color: "#E8F5E9",
    Illustration: EisenhowerIllustration,
  },
  {
    title: "Organize schedule with calendar view.",
    color: "#FFF3E0",
    Illustration: CalendarIllustration,
  },
  {
    title: "Check-in to cultivate good habits.",
    color: "#F3E5F5",
    Illustration: HabitIllustration,
  },
  {
    title: "Improve focus with the Pomo.",
    color: "#E1F5FE",
    Illustration: PomodoroIllustration,
  },
];

export default function SignIn() {

  const { currentTheme } = useContext(ThemeContext);
  const router = useRouter();

  const [active, setActive] = useState(0);
  const prevActive = useRef(active);

  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const blobScale = useRef(new Animated.Value(1)).current;
  const blobOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      prevActive.current = active;

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -120,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blobOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(blobScale, {
          toValue: 0.85,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActive((prev) => (prev === 4 ? 0 : prev + 1));

        translateX.setValue(120);
        opacity.setValue(0);
        blobScale.setValue(1.15);
        blobOpacity.setValue(0);

        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blobOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blobScale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [active]);

  const BlobComponent = BlobShapes[active];
  const Illustration = slides[active].Illustration;

  return (
    <>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: currentTheme === "light" ? "#FAFBFC" : "#000000" },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Illustration Section */}
          <View style={styles.illustrationSection}>
            <Animated.View
              style={[
                styles.blobContainer,
                {
                  opacity: blobOpacity,
                  transform: [{ scale: blobScale }],
                },
              ]}
            >
              <BlobComponent
                color={currentTheme === "light" ? "#D6E4FF" : "#1E3A5F"}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.illustration,
                { opacity, transform: [{ translateX }] },
              ]}
            >
              <Illustration />
            </Animated.View>
          </View>

          {/* Text */}
          <View style={styles.textContainer}>
            <Animated.Text
              style={[
                styles.slideText,
                { color: currentTheme === "light" ? "#000000" : "#FAFAFA" },
              ]}
            >
              {slides[active].title}
            </Animated.Text>
          </View>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === active && styles.activeDot]}
              />
            ))}
          </View>

          {/* Sign In Options */}
          <View style={styles.signInContainer}>
            <TouchableOpacity
              onPress={() => router.push("/sign-in-email")}
              style={[
                styles.button,
                {
                  backgroundColor:
                    currentTheme === "light" ? "#E0E0E0" : "#191919",
                },
              ]}
            >
              <View style={styles.iconContainer}>
                <FontAwesome6 name="user-large" size={17} color="#4772FA" />
              </View>
              <Text
                style={[
                  styles.buttonText,
                  { color: currentTheme === "light" ? "#000000" : "#FAFAFA" },
                ]}
              >
                Sign in with Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    currentTheme === "light" ? "#E0E0E0" : "#191919",
                },
                {
                  borderColor:
                    currentTheme === "light" ? "none" : "gray",
                },
              ]}
            >
              <View style={styles.iconContainer}>
                <Svg width={20} height={20} viewBox="0 0 20 20">
                  <Path
                    d="M19.6 10.2c0-.7-.1-1.4-.2-2H10v3.8h5.4c-.2 1.2-1 2.2-2 2.9v2.5h3.2c1.9-1.7 3-4.3 3-7.2z"
                    fill="#4285F4"
                  />
                  <Path
                    d="M10 20c2.7 0 4.9-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H1.1v2.6C2.8 17.8 6.1 20 10 20z"
                    fill="#34A853"
                  />
                  <Path
                    d="M4.4 12c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V5.4H1.1C.4 6.8 0 8.4 0 10s.4 3.2 1.1 4.6l3.3-2.6z"
                    fill="#FBBC05"
                  />
                  <Path
                    d="M10 4c1.5 0 2.8.5 3.8 1.5l2.9-2.9C15 .9 12.7 0 10 0 6.1 0 2.8 2.2 1.1 5.4l3.3 2.6C5.2 5.8 7.4 4 10 4z"
                    fill="#EA4335"
                  />
                </Svg>
              </View>
              <Text
                style={[
                  styles.buttonText,
                  { color: currentTheme === "light" ? "#000000" : "#FAFAFA" },
                ]}
              >
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
  },
  illustrationSection: {
    height: 380,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  blobContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  illustration: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  textContainer: {
    marginTop: 5,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12
  },
  slideText: {
    fontSize: 14.5,
    color: "#333",
    textAlign: "center",
    fontWeight: "400",
    lineHeight: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
  },
  dot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 4,
    backgroundColor: "#BDBDBD",
    marginHorizontal: 3.5,
    opacity: 0.95,
  },
  activeDot: {
    backgroundColor: "#4772fa",
    width: 21,
  },
  signInContainer: {
    paddingHorizontal: 35,
    marginTop: 70,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 16,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "400",
  },
  othersButton: {
    alignItems: "center",
    paddingVertical: 16,
  },
  othersText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "400",
  },
  bottomActions: {
    position: "absolute",
    bottom: 30,
    right: 30,
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 54,
    height: 54,
    backgroundColor: "#4A6741",
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
  },
}); 