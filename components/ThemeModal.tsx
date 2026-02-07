import { ColorContext } from "@/context/colorContext";
import { ThemeContext } from "@/context/themeContext";
import { ArrowLeft } from "lucide-react-native";
import React, { useContext, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ThemeModalProps {
  visible: boolean;
  onClose: () => void;
}

const COLOR_SERIES = [
  { label: "Default", color: "#4772FA" },
  { label: "Teal", color: "#7ED6E3" },
  { label: "Turquoise", color: "#78E0D0" },
  { label: "Matcha", color: "#C7E2B1" },
  { label: "Sunshine", color: "#FFD28E" },
  { label: "Peach", color: "#F7B2C4" },
  { label: "Lilac", color: "#C9B8FF" },
  { label: "Pearl", color: "#EDEDED" },
  { label: "Pebble", color: "#7D7F85" },
  { label: "Sky", color: "#B7E6FF" },
];

const ThemeModal: React.FC<ThemeModalProps> = ({ visible, onClose }) => {

  const { currentTheme, toggleTheme, useSystemTheme, setUseSystemTheme } = useContext(ThemeContext);
  const { colorTheme, toggleColor } = useContext(ColorContext);

  const [mode, setMode] = useState(useSystemTheme ? 'system' : currentTheme);
  const [color, setColor] = useState(colorTheme);

  function handleChangeMode(x: string) {
    setMode(x);

    if (x === 'system') {
      setUseSystemTheme(true);
    }
    else if (x === 'light') {
      toggleTheme('light');
    }
    else if (x === 'dark') {
      toggleTheme('dark');
    }
  }

  function handleChangeColor(color: string) {
    setColor(color);
    toggleColor(color);
  }


  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-[#F5F6F8]">
        <View className="px-4 pt-3 flex-row items-center gap-x-4">
          <TouchableOpacity onPress={onClose}>
            <ArrowLeft size={22} color="#222" strokeWidth={2} />
          </TouchableOpacity>
          <View className="flex-row items-center gap-x-5">
            <Text className="text-[18px] font-semibold text-[#111827]">Theme</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
          <View className="px-4">
            <View className="bg-white rounded-[16px] px-4 py-4 shadow-xl shadow-black/10">
              <View className="flex-row items-center justify-between py-4">
                <Text className="text-[15px] text-[#111827] font-medium">
                  Light Mode
                </Text>
                <Pressable
                  onPress={() => handleChangeMode('light')}
                  className="w-[19px] h-[19px] rounded-full border border-[#CBD5E1] items-center justify-center"
                >
                  {mode === 'light' ? (
                    <View className="w-[12px] h-[12px] rounded-full bg-[#4F6EF7]" />
                  ) : null}
                </Pressable>
              </View>

              <View className="flex-row items-center justify-between py-4">
                <Text className="text-[15px] text-[#111827] font-medium">
                  Dark Mode
                </Text>
                <Pressable
                  onPress={() => handleChangeMode('dark')}
                  className="w-[19px] h-[19px] rounded-full border border-[#CBD5E1] items-center justify-center"
                >
                  {mode === 'dark' ? (
                    <View className="w-[12px] h-[12px] rounded-full bg-[#4F6EF7]" />
                  ) : null}
                </Pressable>
              </View>

              <View className="flex-row items-center justify-between py-4">
                <Text className="text-[15px] text-[#111827] font-medium">
                  System
                </Text>
                <Pressable
                  onPress={() => handleChangeMode('system')}
                  className="w-[19px] h-[19px] rounded-full border border-[#CBD5E1] items-center justify-center"
                >
                  {mode === 'system' ? (
                    <View className="w-[12px] h-[12px] rounded-full bg-[#4F6EF7]" />
                  ) : null}
                </Pressable>
              </View>

            </View>

            <View className="bg-white rounded-[18px] mt-4 px-4 py-4 shadow-xl shadow-black/10">
              <Text className="text-[15px] font-semibold text-[#111827] mb-3">Color Series</Text>
              <View className="flex-row flex-wrap justify-between">
                {COLOR_SERIES.map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    onPress={() => handleChangeColor(item.color)}
                    className="items-center mb-4"
                    style={{ width: "30%" }}
                  >
                    <View className="w-[64px] h-[64px] rounded-[14px] items-center justify-center" style={{ backgroundColor: item.color }}>
                      {color === item.color ? (
                        <View className="w-[18px] h-[18px] rounded-full bg-white items-center justify-center">
                          <Text className="text-[12px] text-[#4F6EF7]">✓</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text className="text-[12px] text-[#9CA3AF] mt-2">{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ height: 24 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default ThemeModal;
