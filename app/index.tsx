import { ThemeContext } from "@/context/themeContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
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

// Illustration Components
const ReminderIllustration = () => (
  <Svg width={280} height={280} viewBox="0 0 280 280">
    <Defs>
      <LinearGradient id="taskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#4A90E2" stopOpacity="1" />
        <Stop offset="100%" stopColor="#357ABD" stopOpacity="1" />
      </LinearGradient>
      <LinearGradient id="clipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#2E7D9B" stopOpacity="1" />
        <Stop offset="100%" stopColor="#1E5A7A" stopOpacity="1" />
      </LinearGradient>
    </Defs>
    <Ellipse cx="140" cy="250" rx="85" ry="12" fill="#000" opacity="0.08" />
    <Rect
      x="50"
      y="65"
      width="120"
      height="155"
      rx="12"
      fill="#F8FBFF"
      opacity="0.5"
    />
    <Rect
      x="48"
      y="63"
      width="120"
      height="155"
      rx="12"
      fill="white"
      stroke="url(#taskGrad)"
      strokeWidth="3"
    />
    <Rect x="75" y="48" width="70" height="20" rx="5" fill="url(#clipGrad)" />
    <Circle cx="85" cy="58" r="3" fill="white" />
    <Circle cx="105" cy="58" r="3" fill="white" />
    <Circle cx="125" cy="58" r="3" fill="white" />
    <Rect
      x="62"
      y="88"
      width="12"
      height="12"
      rx="3"
      stroke="#FF6B6B"
      strokeWidth="2.5"
      fill="none"
    />
    <Path
      d="M 66 94 L 70 98 L 77 88"
      stroke="#FF6B6B"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect x="80" y="88" width="65" height="7" rx="3.5" fill="#FFE0E6" />
    <Rect
      x="62"
      y="112"
      width="12"
      height="12"
      rx="3"
      stroke="#FFA500"
      strokeWidth="2.5"
      fill="none"
    />
    <Rect x="80" y="112" width="62" height="7" rx="3.5" fill="#FFF4E6" />
    <Rect
      x="62"
      y="136"
      width="12"
      height="12"
      rx="3"
      stroke="#4A90E2"
      strokeWidth="2.5"
      fill="none"
    />
    <Path
      d="M 66 142 L 70 146 L 77 136"
      stroke="#4A90E2"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect x="80" y="136" width="57" height="7" rx="3.5" fill="#E6F2FF" />
    <Rect
      x="62"
      y="160"
      width="12"
      height="12"
      rx="3"
      stroke="#66BB6A"
      strokeWidth="2.5"
      fill="none"
    />
    <Rect x="80" y="160" width="52" height="7" rx="3.5" fill="#E8F5E9" />
  </Svg>
);

const EisenhowerIllustration = () => (
  <Svg width={280} height={280} viewBox="0 0 280 280">
    <Defs>
      <LinearGradient id="urgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FF6B9D" stopOpacity="1" />
        <Stop offset="100%" stopColor="#E85A8B" stopOpacity="1" />
      </LinearGradient>
      <LinearGradient id="impGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FFA500" stopOpacity="1" />
        <Stop offset="100%" stopColor="#FF8C00" stopOpacity="1" />
      </LinearGradient>
      <LinearGradient id="lowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#4A90E2" stopOpacity="1" />
        <Stop offset="100%" stopColor="#357ABD" stopOpacity="1" />
      </LinearGradient>
    </Defs>
    <Ellipse cx="140" cy="250" rx="85" ry="12" fill="#000" opacity="0.08" />
    <Line
      x1="140"
      y1="50"
      x2="140"
      y2="230"
      stroke="#D5D5D5"
      strokeWidth="2.5"
    />
    <Line
      x1="50"
      y1="140"
      x2="230"
      y2="140"
      stroke="#D5D5D5"
      strokeWidth="2.5"
    />
    <Rect
      x="55"
      y="60"
      width="75"
      height="70"
      rx="12"
      fill="#FFF5F8"
      stroke="url(#urgGrad)"
      strokeWidth="3"
    />
    <Circle cx="140" cy="100" r="7" fill="url(#urgGrad)" />
    <Path
      d="M 135 98 L 140 103 L 150 92"
      stroke="white"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect
      x="150"
      y="60"
      width="75"
      height="70"
      rx="12"
      fill="#FFF9F0"
      stroke="url(#impGrad)"
      strokeWidth="3"
    />
    <Circle cx="235" cy="100" r="7" fill="url(#impGrad)" />
    <Rect
      x="55"
      y="150"
      width="75"
      height="70"
      rx="12"
      fill="#F0F8FF"
      stroke="url(#lowGrad)"
      strokeWidth="3"
    />
    <Path
      d="M 135 188 L 140 193 L 150 182"
      stroke="#4A90E2"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect
      x="150"
      y="150"
      width="75"
      height="70"
      rx="12"
      fill="#F8F8F8"
      stroke="#BFBFBF"
      strokeWidth="3"
    />
  </Svg>
);

const CalendarIllustration = () => (
  <Svg width={280} height={280} viewBox="0 0 280 280">
    <Defs>
      <LinearGradient id="calGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#4A90E2" stopOpacity="1" />
        <Stop offset="100%" stopColor="#2E5C8A" stopOpacity="1" />
      </LinearGradient>
    </Defs>
    <Ellipse cx="140" cy="250" rx="85" ry="12" fill="#000" opacity="0.08" />
    <Rect
      x="48"
      y="73"
      width="145"
      height="155"
      rx="12"
      fill="#000"
      opacity="0.05"
    />
    <Rect
      x="46"
      y="70"
      width="145"
      height="155"
      rx="12"
      fill="white"
      stroke="#D0D0D0"
      strokeWidth="2.5"
    />
    <Rect x="46" y="70" width="145" height="42" rx="12" fill="url(#calGrad)" />
    <Circle cx="63" cy="80" r="4" fill="white" />
    <Circle cx="100" cy="80" r="4" fill="white" />
    <Circle cx="137" cy="80" r="4" fill="white" />
    <Line x1="56" y1="125" x2="181" y2="125" stroke="#E8E8E8" strokeWidth="1" />
    <Line x1="56" y1="152" x2="181" y2="152" stroke="#E8E8E8" strokeWidth="1" />
    <Line x1="56" y1="179" x2="181" y2="179" stroke="#E8E8E8" strokeWidth="1" />
    <Line
      x1="98"
      y1="125"
      x2="98"
      y2="215"
      stroke="#E8E8E8"
      strokeWidth="0.7"
    />
    <Line
      x1="140"
      y1="125"
      x2="140"
      y2="215"
      stroke="#E8E8E8"
      strokeWidth="0.7"
    />
    <Circle cx="160" cy="165" r="12" fill="#66BB6A" opacity="0.9" />
    <Path
      d="M 156 163 L 160 167 L 168 157"
      stroke="white"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const HabitIllustration = () => (
  <Svg width={280} height={280} viewBox="0 0 280 280">
    <Defs>
      <LinearGradient id="habitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#4A90E2" stopOpacity="1" />
        <Stop offset="100%" stopColor="#357ABD" stopOpacity="1" />
      </LinearGradient>
    </Defs>
    <Ellipse cx="140" cy="250" rx="85" ry="12" fill="#000" opacity="0.08" />
    <Rect
      x="48"
      y="73"
      width="145"
      height="155"
      rx="12"
      fill="#000"
      opacity="0.04"
    />
    <Rect
      x="46"
      y="70"
      width="145"
      height="155"
      rx="12"
      fill="white"
      stroke="url(#habitGrad)"
      strokeWidth="3"
    />
    <Line
      x1="55"
      y1="108"
      x2="185"
      y2="108"
      stroke="#D5D5D5"
      strokeWidth="1.5"
    />
    <Circle cx="68" cy="130" r="11" fill="#4A90E2" />
    <Path
      d="M 64 128 L 68 132 L 74 122"
      stroke="white"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="100" cy="130" r="11" fill="#4A90E2" opacity="0.65" />
    <Circle cx="132" cy="130" r="11" fill="#4A90E2" opacity="0.35" />
    <Circle cx="164" cy="130" r="11" fill="#4A90E2" opacity="0.15" />
    <Circle cx="68" cy="162" r="11" fill="#FFA500" />
    <Path
      d="M 64 160 L 68 164 L 74 154"
      stroke="white"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="100" cy="162" r="11" fill="#FFA500" opacity="0.65" />
    <Circle cx="132" cy="162" r="11" fill="#FFA500" opacity="0.35" />
    <Circle cx="164" cy="162" r="11" fill="#FFA500" opacity="0.15" />
    <Circle cx="68" cy="194" r="11" fill="#9C27B0" />
    <Path
      d="M 64 192 L 68 196 L 74 186"
      stroke="white"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="100" cy="194" r="11" fill="#9C27B0" opacity="0.65" />
    <Circle cx="132" cy="194" r="11" fill="#9C27B0" opacity="0.35" />
    <Circle cx="164" cy="194" r="11" fill="#9C27B0" opacity="0.15" />
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
const Blob1 = ({ color = "#E3E9FB" }) => (
  <Svg
    width={410}
    height={410}
    viewBox="0 0 400 400"
    style={{ position: "absolute" }}
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
    />
    <Circle cx="90" cy="340" r="15" fill={color} opacity="0.4" />
    <Circle cx="480" cy="700" r="22" fill={color} opacity="0.3" />
  </Svg>
);

// Blob 2 - Wide Horizontal Blob
const Blob2 = ({ color = "#E3E9FB" }) => (
  <Svg
    width={430}
    height={490}
    viewBox="0 0 400 400"
    style={{ position: "absolute" }}
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
    <Circle cx="95" cy="305" r="12" fill={color} opacity="0.35" />
  </Svg>
);

// Blob 3 - Rounded Square Blob
const Blob3 = ({ color = "#E3E9FB" }) => (
  <Svg
    width={400}
    height={400}
    viewBox="0 0 400 400"
    style={{ position: "absolute" }}
  >
    <Path
      d="M 190 80
         C 245 75, 285 90, 305 130
         C 320 165, 318 200, 305 235
         C 292 270, 265 295, 220 305
         C 180 313, 140 310, 105 290
         C 70 270, 55 240, 55 200
         C 55 160, 68 125, 95 100
         C 125 75, 155 80, 190 80 Z"
      fill={color}
      opacity="0.6"
    />
    {/* <Circle cx="110" cy="330" r="28" fill={color} opacity="0.4" /> */}
    <Circle cx="290" cy="315" r="14" fill={color} opacity="0.38" />
  </Svg>
);

// Blob 4 - Droplet/Teardrop Shape
const Blob4 = ({ color = "#E3E9FB" }) => (
  <Svg
    width={410}
    height={410}
    viewBox="0 0 400 400"
    style={{ position: "absolute" }}
  >
    <Path
      d="M 190 55
         C 240 55, 275 70, 300 100
         C 325 130, 338 170, 335 210
         C 332 250, 315 290, 280 315
         C 245 340, 200 350, 155 335
         C 110 320, 75 285, 60 240
         C 45 195, 52 150, 75 115
         C 98 80, 135 60, 175 56
         C 183 55, 192 55, 190 55 Z"
      fill={color}
      opacity="0.6"
    />
    <Circle cx="75" cy="330" r="12" fill={color} opacity="0.42" />
    <Circle cx="315" cy="345" r="15" fill={color} opacity="0.37" />
  </Svg>
);

// Blob 5 - Asymmetric Irregular Blob
const Blob5 = ({ color = "#E3E9FB" }) => (
  <Svg
    width={400}
    height={400}
    viewBox="0 0 400 400"
    style={{ position: "absolute" }}
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
    <Circle cx="95" cy="55" r="13" fill={color} opacity="0.42" />
  </Svg>
);

export const BlobShapes = [Blob1, Blob2, Blob3, Blob4, Blob5];

export { Blob1, Blob2, Blob3, Blob4, Blob5 };

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

  const [active, setActive] = useState(0);

  const prevActive = useRef(active);

  const translateX = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const blobScale = useRef(new Animated.Value(1)).current;
  const blobOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const intervels = setInterval(() => {
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
            toValue: 1,
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
    }, 2000);

    return () => clearInterval(intervels);
  }, [active]);

  const BlobComponent = BlobShapes[active];
  const Illustration = slides[active].Illustration;

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme === 'light' ? '#F5F5F5' : '#000000' }]}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          // onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.mainScrollView}
        >
          <View style={styles.slideContainer}>
            <View style={styles.illustrationContainer}>
              <BlobComponent color={currentTheme === 'light' ? "#BBDEFB" : "#4A6FA5"} />
              <Animated.View
                style={[
                  styles.illustration,
                  { opacity, transform: [{ translateX }] },
                ]}
              >
                <Illustration />
              </Animated.View>
            </View>
          </View>
        </ScrollView>

        {/* Text */}
        <View style={styles.textContainer}>
          <Animated.Text style={[styles.slideText, { color: currentTheme === 'light' ? '#000000' : '#FAFAFA' }]}>
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
          <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme === 'light' ? '#E0E0E0' : '#1E201E' }]}>
            <View style={styles.iconContainer}>
              <FontAwesome6 name="user-large" size={17} color="#4772FA" />
            </View>
            <Text style={[styles.buttonText, { color: currentTheme === 'light' ? '#000000' : '#FAFAFA' }]}>Sign in with Email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme === 'light' ? '#E0E0E0' : '#1E201E' }]}>
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
            <Text style={[styles.buttonText, { color: currentTheme === 'light' ? '#000000' : '#FAFAFA' }]}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <StatusBar style={currentTheme === "light" ? "light" : "dark"} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 100,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#333",
  },
  mainScrollView: {
    flexGrow: 0,
    marginTop: 70,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
  },
  illustrationContainer: {
    height: 330,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  blob: {
    position: "absolute",
    width: 240,
    height: 220,
  },
  illustration: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  textContainer: {
    marginTop: 10,
    height: 80,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 60,
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
