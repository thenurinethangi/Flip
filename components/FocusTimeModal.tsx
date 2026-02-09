import { ColorContext } from "@/context/colorContext";
import { ThemeContext } from "@/context/themeContext";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

interface FocusTimeModalProps {
    visible: boolean;
    initialMinutes: number;
    onClose: () => void;
    onSave: (minutes: number) => void;
}

const FocusTimeModal: React.FC<FocusTimeModalProps> = ({
    visible,
    initialMinutes,
    onClose,
    onSave,
}) => {
    const { currentTheme } = useContext(ThemeContext);
    const { colorTheme } = useContext(ColorContext);
    const isDark = currentTheme === "dark";

    const [minutes, setMinutes] = useState(String(initialMinutes));

    useEffect(() => {
        setMinutes(String(initialMinutes));
    }, [initialMinutes, visible]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 items-center justify-center bg-black/50 px-6">
                <View className="w-full max-w-[320px] rounded-[16px] px-4 py-5" style={{ backgroundColor: isDark ? '#1B1B1B' : '#FFFFFF' }}>
                    <Text className="text-[16px] font-semibold" style={{ color: isDark ? '#E5E7EB' : '#111827' }}>Set Focus Time</Text>
                    <Text className="text-[13px] mt-1" style={{ color: isDark ? '#9CA3AF' : '#9CA3AF' }}>Enter minutes (e.g., 60, 120)</Text>

                    <View className="mt-4 rounded-[10px] px-3 py-[3px]" style={{ borderWidth: 1, borderColor: isDark ? '#374151' : '#e5e7ebe1' }}>
                        <TextInput
                            value={minutes}
                            onChangeText={(text) => {
                                if (Number.isNaN(Number(text))) {
                                    Alert.alert('Enter focus time in minutes!');
                                }
                                else {
                                    setMinutes(text);
                                }
                            }}
                            keyboardType="number-pad"
                            placeholder={minutes}
                            placeholderTextColor="#9CA3AF"
                            className="text-[16px]"
                            style={{ color: isDark ? '#E5E7EB' : '#111827' }}
                        />
                    </View>

                    <View className="mt-5 flex-row items-center justify-end gap-x-1">
                        <TouchableOpacity onPress={onClose} className="px-3 py-2">
                            <Text className="text-[15px]" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                const value = Math.max(1, Number(minutes));
                                if (!Number.isNaN(value) && value > 180) {
                                    Alert.alert('Focus time must be under 180 minutes!');
                                }
                                else {
                                    onSave(Number.isNaN(value) ? initialMinutes : value);
                                }
                            }}
                            className="px-3 py-2 rounded-[10px]"
                        >
                            <Text className="text-[15px] font-semibold" style={{ color: colorTheme }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default FocusTimeModal;
