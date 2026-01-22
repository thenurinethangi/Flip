import { ThemeContext } from "@/context/themeContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignInEmail = () => {
  const { currentTheme } = useContext(ThemeContext);
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(true);
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView
      className={`flex-1 ${currentTheme === "light" ? "bg-gray-100" : "bg-black"}`}
    >
      {/* Header */}
      <View className="px-4 py-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 justify-center"
        >
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={24}
            color={currentTheme === "light" ? "black" : "white"}
          />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View className="px-6 mt-12 mb-8">
        <Text
          className={`text-2xl font-normal tracking-wide ${currentTheme === "light" ? "#222" : "text-white"}`}
        >
          Sign in / Sign up
        </Text>
      </View>

      {/* Email Input */}
      <View className="px-6 mb-6">
        <TextInput
          placeholder="Email"
          placeholderTextColor={currentTheme === "light" ? "#999" : "#666"}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setIsDisabled(text.trim().length === 0);
          }}
          className={`px-4 py-4 rounded-lg text-[15px] ${currentTheme === "light" ? "bg-[#EEEEEE] text-black" : "bg-gray-900 text-white"}`}
        />
      </View>

      {/* Continue Button */}
      <View className="px-6 mb-6">
        <TouchableOpacity
          onPress={() => {
            if (!isDisabled) {
              // Handle next button press
              router.push('/sign-in-password');
              console.log("Next pressed with email:", email);
            }
          }}
          activeOpacity={isDisabled ? 1 : 0.7}
          style={{ opacity: isDisabled ? 0.5 : 1 }}
          className="bg-blue-500 py-3 rounded-lg items-center"
        >
          <Text className="text-white text-base font-semibold">Next</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style={currentTheme === "light" ? "dark" : "light"} />
    </SafeAreaView>
  );
};

export default SignInEmail;
