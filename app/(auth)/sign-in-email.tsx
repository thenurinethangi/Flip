import { ThemeContext } from "@/context/themeContext";
import { registerOrLoginUser } from "@/services/authService";
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const SignInEmail = () => {

  const { currentTheme } = useContext(ThemeContext);
  const router = useRouter();

  const [tab, setTab] = useState('email');

  const [isDisabledB1, setIsDisabledB1] = useState(true);
  const [isDisabledB2, setIsDisabledB2] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [securityTextEnable, setSecurityTextEnable] = useState<boolean>(true);

  async function handleNext() {
    if (!isDisabledB1) {
      setTab('password');
    }
  }

  async function handleSignIn() {
    if (!isDisabledB2) {
      try {
        const res = await registerOrLoginUser(email, password);
        console.log(res);
        if (res.success) {
          router.replace('/(tabs)');
        }
        else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
          });
        }
      }
      catch (e) {
        console.log(e);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Unable to sign in, please try again later!',
        });
      }
    }
  }


  return (
    <SafeAreaView
      className={`flex-1 ${currentTheme === "light" ? "bg-gray-100" : "bg-black"}`}
    >
      {/* Header */}
      <View className="px-4 py-2">
        <TouchableOpacity
          onPress={() => {
            if (tab === 'password') {
              setTab('email');
            }
            else {
              router.back();
            }
          }}
          className="w-10 h-10 justify-center"
        >
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={24}
            color={currentTheme === "light" ? "black" : "white"}
          />
        </TouchableOpacity>
      </View>

      {tab === 'email'
        ? <View>
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
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                if (emailRegex.test(text) && text.trim().length > 0) {
                  setIsDisabledB1(false);
                }
                else {
                  setIsDisabledB1(true);
                }
              }}
              className={`px-4 py-4 rounded-lg text-[15px] ${currentTheme === "light" ? "bg-[#EEEEEE] text-black" : "bg-gray-900 text-white"}`}
            />
          </View>

          {/* Continue Button */}
          <View className="px-6 mb-6">
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={isDisabledB1 ? 1 : 0.7}
              style={{ opacity: isDisabledB1 ? 0.5 : 1 }}
              className="bg-blue-500 py-3 rounded-lg items-center"
            >
              <Text className="text-white text-base font-semibold">Next</Text>
            </TouchableOpacity>
          </View>
        </View>
        : ''}

      {tab === 'password'
        ? <View>
          {/* Title */}
          <View className="px-6 mt-12 mb-3">
            <Text
              className={`text-2xl font-normal tracking-wide ${currentTheme === "light" ? "text-gray-900" : "text-white"}`}
            >
              Enter a Password
            </Text>
          </View>

          {/* Sub Title */}
          <View className="px-6 mb-6">
            <Text
              className={`text-[15px] font-normal tracking-wide ${currentTheme === "light" ? "text-[#666666]" : "text-gray-500"}`}
            >
              Sign in with {email}
            </Text>
          </View>

          {/* Email Input */}
          <View className="px-6 mb-6 relative">
            <TextInput
              secureTextEntry={securityTextEnable}
              placeholder="Password: 6-64 characters"
              placeholderTextColor={currentTheme === "light" ? "#999" : "#666"}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setIsDisabledB2(text.trim().length < 6);
              }}
              className={`px-4 py-4 rounded-lg text-[15px] relative ${currentTheme === "light" ? "bg-[#EEEEEE] text-black" : "bg-gray-900 text-white"}`}
            />
            {securityTextEnable
              ? <Feather onPress={() => setSecurityTextEnable(false)} name="eye-off" size={19} color="gray" className="absolute right-10 top-4 opacity-80" />
              : <Feather onPress={() => setSecurityTextEnable(true)} name="eye" size={19} color="gray" className="absolute right-10 top-4 opacity-80" />
            }
          </View>

          {/* Continue Button */}
          <View className="px-6 mb-6">
            <TouchableOpacity
              onPress={handleSignIn}
              activeOpacity={isDisabledB2 ? 1 : 0.7}
              style={{ opacity: isDisabledB2 ? 0.5 : 1 }}
              className="bg-blue-500 py-3 rounded-lg items-center"
            >
              <Text className="text-white text-base font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Forgot password */}
          <View className="px-6 mb-6">
            <Text
              className={`text-[15px] text-center font-normal tracking-wide opacity-65 ${currentTheme === "light" ? "text-[#666666]" : "text-gray-500"}`}
            >
              Forgot Password
            </Text>
          </View>
        </View>
        : ''}

    </SafeAreaView>
  );
};

export default SignInEmail;
