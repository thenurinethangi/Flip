import { ThemeContext } from "@/context/themeContext";
import React, { useContext, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface NicknameModalProps {
    visible: boolean;
    initialValue?: string;
    onClose: () => void;
    onSave: (name: string) => void;
}

const NicknameModal: React.FC<NicknameModalProps> = ({
    visible,
    initialValue = "",
    onClose,
    onSave,
}) => {
    const [name, setName] = useState(initialValue);
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const cardBg = isDark ? "#1B1B1B" : "#FFFFFF";
    const textPrimary = isDark ? "#E5E7EB" : "#111827";
    const textSecondary = isDark ? "#9CA3AF" : "#64748B";

    return (
        <Modal
            visible={visible}
            presentationStyle="fullScreen"
            statusBarTranslucent
            animationType="slide"
            onRequestClose={onClose}
        >
            <SafeAreaView className={`flex-1 ${isDark ? "bg-[#0B0F0E]" : "bg-[#F5F6F8]"}`}>
                <View className="px-4 pt-2 flex-row items-center justify-between">
                    <TouchableOpacity onPress={onClose}>
                        <Text className="text-[15px]" style={{ color: textSecondary }}>Cancel</Text>
                    </TouchableOpacity>
                    <Text className="text-[16px] font-semibold" style={{ color: textPrimary }}>Nickname</Text>
                    <TouchableOpacity onPress={() => onSave(name.trim())}>
                        <Text className="text-[15px] text-[#4772FA] font-semibold">Save</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-6 px-4">
                    <View className="rounded-[14px] px-4 py-2" style={{ backgroundColor: cardBg }}>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter nickname"
                            placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                            className="text-[15px]"
                            style={{ color: textPrimary }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default NicknameModal;
