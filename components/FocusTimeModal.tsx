import React, { useEffect, useState } from "react";
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
            <View className="flex-1 items-center justify-center bg-black/30 px-6">
                <View className="w-full max-w-[320px] rounded-[16px] bg-white px-4 py-5">
                    <Text className="text-[16px] font-semibold text-[#111827]">Set Focus Time</Text>
                    <Text className="text-[13px] text-[#9CA3AF] mt-1">Enter minutes (e.g., 60, 120)</Text>

                    <View className="mt-4 rounded-[10px] border border-[#e5e7ebe1] px-3 py-[3px]">
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
                            className="text-[16px] text-[#111827]"
                        />
                    </View>

                    <View className="mt-5 flex-row items-center justify-end gap-x-1">
                        <TouchableOpacity onPress={onClose} className="px-3 py-2">
                            <Text className="text-[15px] text-[#64748B]">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                const value = Math.max(6, Number(minutes));
                                if (!Number.isNaN(value) && value > 180) {
                                    Alert.alert('Focus time must be under 180 minutes!');
                                }
                                else {
                                    onSave(Number.isNaN(value) ? initialMinutes : value);
                                }
                            }}
                            className="px-3 py-2 rounded-[10px]"
                        >
                            <Text className="text-[15px] font-semibold text-primary">Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default FocusTimeModal;
