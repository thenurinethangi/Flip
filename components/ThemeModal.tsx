import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ThemeModalProps {
  visible: boolean;
  onClose: () => void;
}

const COLOR_SERIES = [
  { label: "Default", color: "#4F6EF7" },
  { label: "Teal", color: "#7ED6E3" },
  { label: "Turquoise", color: "#78E0D0" },
  { label: "Matcha", color: "#C7E2B1" },
  { label: "Sunshine", color: "#FFD28E" },
  { label: "Peach", color: "#F7B2C4" },
  { label: "Lilac", color: "#C9B8FF" },
  { label: "Pearl", color: "#EDEDED" },
  { label: "Pebble", color: "#7D7F85" },
  { label: "Dark", color: "#111111" },
  { label: "Material You", color: "#B7E6FF" },
];

const SEASONS = [
  { label: "Spring", color: "#CFE7A2" },
  { label: "Summer", color: "#9ADCF4" },
  { label: "Autumn", color: "#F6C2A5" },
  { label: "Winter", color: "#BBD4F6" },
];

const ThemeModal: React.FC<ThemeModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-[#F5F6F8]">
        <View className="px-4 pt-2 flex-row items-center gap-x-4">
          <TouchableOpacity onPress={onClose}>
            <ArrowLeft size={22} color="#222" strokeWidth={2} />
          </TouchableOpacity>
          <View className="flex-row items-center gap-x-5">
            <Text className="text-[18px] font-semibold text-[#111827]">Theme</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
          <View className="px-4">
            <TouchableOpacity className="bg-white rounded-[16px] px-4 py-4 flex-row items-center justify-between shadow-sm shadow-black/5">
              <Text className="text-[15px] text-[#111827] font-medium">
                Go with the system dark mode
              </Text>
              <Text className="text-[14px] text-[#9CA3AF]">Off</Text>
            </TouchableOpacity>

            <View className="bg-white rounded-[18px] mt-4 px-4 py-4 shadow-sm shadow-black/5">
              <Text className="text-[15px] font-semibold text-[#111827] mb-3">Color Series</Text>
              <View className="flex-row flex-wrap justify-between">
                {COLOR_SERIES.map((item, index) => (
                  <View key={item.label} className="items-center mb-4" style={{ width: "30%" }}>
                    <View className="w-[64px] h-[64px] rounded-[14px]" style={{ backgroundColor: item.color }} />
                    <Text className="text-[12px] text-[#9CA3AF] mt-2">{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="bg-white rounded-[18px] mt-4 px-4 py-4 shadow-sm shadow-black/5">
              <Text className="text-[15px] font-semibold text-[#111827] mb-3">Seasons Series</Text>
              <View className="flex-row flex-wrap justify-between">
                {SEASONS.map((item) => (
                  <View key={item.label} className="items-center mb-4" style={{ width: "48%" }}>
                    <View className="w-full h-[90px] rounded-[14px]" style={{ backgroundColor: item.color }} />
                    <Text className="text-[12px] text-[#9CA3AF] mt-2">{item.label}</Text>
                  </View>
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
