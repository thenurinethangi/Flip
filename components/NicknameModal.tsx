import React, { useState } from "react";
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

    return (
        <Modal
            visible={visible}
            presentationStyle="fullScreen"
            statusBarTranslucent
            animationType="slide"
            onRequestClose={onClose}
        >
            <SafeAreaView className="flex-1 bg-[#F5F6F8]">
                <View className="px-4 pt-2 flex-row items-center justify-between">
                    <TouchableOpacity onPress={onClose}>
                        <Text className="text-[15px] text-[#64748B]">Cancel</Text>
                    </TouchableOpacity>
                    <Text className="text-[16px] font-semibold text-[#111827]">Nickname</Text>
                    <TouchableOpacity onPress={() => onSave(name.trim())}>
                        <Text className="text-[15px] text-[#4772FA] font-semibold">Save</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-6 px-4">
                    <View className="bg-white rounded-[14px] px-4 py-2">
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter nickname"
                            placeholderTextColor="#9CA3AF"
                            className="text-[15px] text-[#111827]"
                        />
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default NicknameModal;
