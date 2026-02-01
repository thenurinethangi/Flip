import { AppIcon } from "@/components/ui/icon-symbol";
import { Bookmark, ChevronRight, HelpCircle, Pencil, X } from "lucide-react-native";
import React from "react";
import {
    Modal,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { CountdownTypeId } from "./CountdownTypeModal";

interface AddCountdownModalProps {
  visible: boolean;
  onClose: () => void;
  type?: CountdownTypeId | null;
}

const typeLabelMap: Record<CountdownTypeId, string> = {
  holiday: "Holiday",
  birthday: "Birthday",
  anniversary: "Anniversary",
  countdown: "Countdown",
};

const AddCountdownModal: React.FC<AddCountdownModalProps> = ({
  visible,
  onClose,
  type,
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-[#F5F6F8]">
        <View className="px-5 pt-2">
          <View className="flex-row items-center gap-x-4">
            <Pressable onPress={onClose} className="p-1">
              <X size={22} color="#111827" />
            </Pressable>
            <Text className="text-[18px] font-semibold text-[#111827]">Add</Text>
          </View>
        </View>

        <View className="items-center mt-6">
          <View className="relative">
            <View className="w-[72px] h-[72px] rounded-full bg-[#8EC5F8] items-center justify-center">
              <AppIcon name="Hourglass" size={28} color="#2F6BFF" />
            </View>
            <View className="absolute bottom-0 right-0 w-[22px] h-[22px] rounded-full bg-white items-center justify-center shadow-lg shadow-black/10">
              <Pencil size={12} color="#6B7280" />
            </View>
          </View>
        </View>

        <View className="px-5 mt-6">
          <View className="bg-white rounded-[16px] px-4 py-3 flex-row items-center justify-between">
            <TextInput
              placeholder="Name"
              placeholderTextColor="#C5C9D3"
              className="flex-1 text-[15px] text-[#111827]"
            />
            <Bookmark size={18} color="#9CA3AF" />
          </View>

          <View className="bg-white rounded-[16px] mt-4 overflow-hidden">
            <View className="flex-row items-center justify-between px-4 py-[14px]">
              <Text className="text-[15px] text-[#111827]">Date</Text>
              <View className="flex-row items-center gap-x-2">
                <Text className="text-[14px] text-[#9CA3AF]">None</Text>
                <ChevronRight size={18} color="#C5C9D3" />
              </View>
            </View>
            <View className="h-[1px] bg-[#F1F2F5]" />
            <View className="flex-row items-center justify-between px-4 py-[14px]">
              <Text className="text-[15px] text-[#111827]">Reminder</Text>
              <View className="flex-row items-center gap-x-2">
                <Text className="text-[14px] text-[#9CA3AF]">On the day, 3 days early</Text>
                <X size={16} color="#C5C9D3" />
              </View>
            </View>
            <View className="h-[1px] bg-[#F1F2F5]" />
            <View className="flex-row items-center justify-between px-4 py-[14px]">
              <Text className="text-[15px] text-[#111827]">Repeat</Text>
              <View className="flex-row items-center gap-x-2">
                <Text className="text-[14px] text-[#9CA3AF]">None</Text>
                <ChevronRight size={18} color="#C5C9D3" />
              </View>
            </View>
          </View>

          <View className="bg-white rounded-[16px] mt-4 overflow-hidden">
            <View className="flex-row items-center justify-between px-4 py-[14px]">
              <Text className="text-[15px] text-[#111827]">Type</Text>
              <View className="flex-row items-center gap-x-2">
                <Text className="text-[14px] text-[#9CA3AF]">
                  {type ? typeLabelMap[type] : "Countdown"}
                </Text>
                <ChevronRight size={18} color="#C5C9D3" />
              </View>
            </View>
            <View className="h-[1px] bg-[#F1F2F5]" />
            <View className="flex-row items-center justify-between px-4 py-[14px]">
              <View className="flex-row items-center gap-x-2">
                <Text className="text-[15px] text-[#111827]">Show in Smart List</Text>
                <HelpCircle size={16} color="#C5C9D3" />
              </View>
              <View className="flex-row items-center gap-x-2">
                <Text className="text-[14px] text-[#9CA3AF]">On the day</Text>
                <ChevronRight size={18} color="#C5C9D3" />
              </View>
            </View>
          </View>
        </View>

        <View className="mt-auto px-5 pb-6">
          <TouchableOpacity className="bg-[#4772FA] rounded-[14px] py-4 items-center">
            <Text className="text-white text-[16px] font-semibold">Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddCountdownModal;
