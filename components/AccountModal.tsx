import { AppIcon } from "@/components/ui/icon-symbol";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ visible, onClose }) => {
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
          <Text className="text-[18px] font-semibold text-[#111827]">Account</Text>
        </View>

        <View className="mt-6 px-4">
          <View className="bg-white rounded-[18px] overflow-hidden">
            <View className="px-4 py-4 flex-row items-center justify-between">
              <Text className="text-[15px] text-[#111827]">Avatar</Text>
              <View className="w-[36px] h-[36px] rounded-full bg-[#4F6EF7]" />
            </View>
            <View className="h-[1px] bg-[#EEF0F5]" />
            <TouchableOpacity className="px-4 py-4 flex-row items-center justify-between">
              <Text className="text-[15px] text-[#111827]">Nickname</Text>
              <View className="flex-row items-center gap-x-2">
                <Text className="text-[14px] text-[#9CA3AF]">Thenuri Nathangi</Text>
                <AppIcon name="chevronRight" color="#C5C9D3" size={18} />
              </View>
            </TouchableOpacity>
            <View className="h-[1px] bg-[#EEF0F5]" />
            <TouchableOpacity className="px-4 py-4 flex-row items-center justify-between">
              <Text className="text-[15px] text-[#111827]">Email</Text>
              <View className="flex-row items-center gap-x-2">
                <Text className="text-[14px] text-[#9CA3AF]">thenurinathangi@gmail.com</Text>
                <AppIcon name="chevronRight" color="#C5C9D3" size={18} />
              </View>
            </TouchableOpacity>
            <View className="h-[1px] bg-[#EEF0F5]" />
            <TouchableOpacity className="px-4 py-4 flex-row items-center justify-between">
              <Text className="text-[15px] text-[#111827]">2-Step Verification</Text>
              <AppIcon name="chevronRight" color="#C5C9D3" size={18} />
            </TouchableOpacity>
            <View className="h-[1px] bg-[#EEF0F5]" />
            <TouchableOpacity className="px-4 py-4 flex-row items-center justify-between">
              <Text className="text-[15px] text-[#111827]">Device Management</Text>
              <AppIcon name="chevronRight" color="#C5C9D3" size={18} />
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-[18px] overflow-hidden mt-4">
            <TouchableOpacity className="px-4 py-4 flex-row items-center justify-between">
              <Text className="text-[15px] text-[#111827]">Google</Text>
              <View className="flex-row items-center gap-x-2">
                <Text className="text-[14px] text-[#9CA3AF]">Thenuri Nathangi</Text>
                <AppIcon name="chevronRight" color="#C5C9D3" size={18} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-auto px-4 pb-6">
          <TouchableOpacity className="border border-[#EF4444] rounded-[14px] py-3 items-center">
            <Text className="text-[#EF4444] text-[15px] font-semibold">Delete Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AccountModal;
