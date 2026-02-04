import { AppIcon } from "@/components/ui/icon-symbol";
import { Bookmark, ChevronRight, HelpCircle, Pencil, X } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { CountdownTypeId } from "./CountdownTypeModal";
import DatePickerMinimalModal from "./DatePickerMinimalModal";
import SelectionModal from "./SelectionModal";
import { add } from "@/services/countdownService";

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

const typeColorMap: Record<CountdownTypeId, string> = {
    holiday: "#10B981",
    birthday: "#F87171",
    anniversary: "#EC4899",
    countdown: "#3B82F6",
};

const typeBgColorMap: Record<CountdownTypeId, string> = {
    holiday: "#D1FAE5",
    birthday: "#FECACA",
    anniversary: "#FBCFE8",
    countdown: "#BFDBFE",
};

export const formatDateShort = (dateStr: string): string => {
    if (!dateStr) return '';

    const [year, month, day] = dateStr.split('-');

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const monthName = months[Number(month) - 1];
    const dayNumber = Number(day);

    return `${monthName} ${dayNumber}, ${year}`;
};


const AddCountdownModal: React.FC<AddCountdownModalProps> = ({ visible, onClose, type, }) => {
    if (!visible) return null;

    const todayStr = new Date().toLocaleDateString("en-CA");

    const resolvedType: CountdownTypeId = type ?? "countdown";
    const iconColor = typeColorMap[resolvedType];
    const iconBgColor = typeBgColorMap[resolvedType];

    const [showDate, setShowDate] = useState<boolean>(false);
    const [activeSubModal, setActiveSubModal] = useState<"time" | "reminder" | "repeat" | null>(null);

    const [countdownName, setCountdownName] = useState('');
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [selectedReminder, setSelectedReminder] = useState('None');
    const [selectedRepeat, setSelectedRepeat] = useState('None');

    const reminderOptions = [
        { id: "1", label: "None", isAvailable: true },
        { id: "2", label: "1 day early", isAvailable: true },
        { id: "3", label: "2 day early", isAvailable: true },
        { id: "4", label: "5 day early", isAvailable: true },
        { id: "5", label: "1 week early", isAvailable: true },
        { id: "6", label: "2 week early", isAvailable: true },
        { id: "7", label: "1 month early", isAvailable: true },
    ];

    const repeatOptions = [
        { id: "1", label: "None", isAvailable: true },
        { id: "2", label: "Weekly", isAvailable: true },
        { id: "3", label: "Monthly", isAvailable: true },
        { id: "4", label: "Yearly", isAvailable: true },
    ];

    async function handleAddNewCountdown() {

        if (countdownName.trim() === '') {
            return;
        }

        const newCountdown = {
            countdownName,
            date: selectedDate,
            reminder: selectedReminder,
            repeat: selectedRepeat,
            type: typeLabelMap[type || 'countdown']
        }

        try {
            const id = await add(newCountdown);
            console.log(id);
        }
        catch (e) {
            console.log(e);
            Alert.alert('Fail!, Please try later');
        }
        onClose();
    }


    return (
        <>
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
                            <View className="w-[72px] h-[72px] rounded-full items-center justify-center" style={{ backgroundColor: iconBgColor }}>
                                <AppIcon name={`${resolvedType === 'countdown' ? 'Hourglass' : resolvedType === 'anniversary' ? 'Heart' : resolvedType === 'birthday' ? 'Cake' : 'Gift'}`} size={28} color={iconColor} />
                            </View>
                            <View className="absolute bottom-0 right-0 w-[22px] h-[22px] rounded-full bg-white items-center justify-center shadow-lg shadow-black/10">
                                <Pencil size={12} color="#6B7280" />
                            </View>
                        </View>
                    </View>

                    <View className="px-5 mt-6">
                        <View className="bg-white rounded-[16px] px-4 py-3 flex-row items-center justify-between">
                            <TextInput
                                onChangeText={setCountdownName}
                                placeholder="Name"
                                placeholderTextColor="#C5C9D3"
                                className="flex-1 text-[15px] text-[#111827]"
                            />
                            {/* <Bookmark size={18} color="#9CA3AF" /> */}
                        </View>

                        <View className="bg-white rounded-[16px] mt-4 overflow-hidden">
                            <View className="flex-row items-center justify-between px-4 py-[14px]">
                                <Text className="text-[15px] text-[#111827]">Date</Text>
                                <View className="flex-row items-center gap-x-2">
                                    <TouchableWithoutFeedback onPress={() => setShowDate(true)}>
                                        <Text className="text-[15px] text-[#9CA3AF]">{formatDateShort(selectedDate)}</Text>
                                    </TouchableWithoutFeedback>
                                    <ChevronRight size={18} color="#C5C9D3" />
                                </View>
                            </View>
                            <View className="h-[1px] bg-[#F1F2F5]" />
                            <View className="flex-row items-center justify-between px-4 py-[14px]">
                                <Text className="text-[15px] text-[#111827]">Reminder</Text>
                                <View className="flex-row items-center gap-x-2">
                                    <TouchableWithoutFeedback onPress={() => setActiveSubModal('reminder')}>
                                        <Text className="text-[15px] text-[#9CA3AF]">{selectedReminder}</Text>
                                    </TouchableWithoutFeedback>
                                    <X size={16} color="#C5C9D3" />
                                </View>
                            </View>
                            <View className="h-[1px] bg-[#F1F2F5]" />
                            <View className="flex-row items-center justify-between px-4 py-[14px]">
                                <Text className="text-[15px] text-[#111827]">Repeat</Text>
                                <View className="flex-row items-center gap-x-2">
                                    <TouchableWithoutFeedback onPress={() => setActiveSubModal('repeat')}>
                                        <Text className="text-[15px] text-[#9CA3AF]">{selectedRepeat}</Text>
                                    </TouchableWithoutFeedback>
                                    <ChevronRight size={18} color="#C5C9D3" />
                                </View>
                            </View>
                        </View>

                        <View className="bg-white rounded-[16px] mt-4 overflow-hidden">
                            <View className="flex-row items-center justify-between px-4 py-[14px]">
                                <Text className="text-[15px] text-[#111827]">Type</Text>
                                <View className="flex-row items-center gap-x-2">
                                    <Text className="text-[15px] text-[#9CA3AF]">
                                        {type ? typeLabelMap[type] : "Countdown"}
                                    </Text>
                                    <ChevronRight size={18} color="#C5C9D3" />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="mt-auto px-5 pb-6">
                        <TouchableOpacity onPress={handleAddNewCountdown} className="bg-[#4772FA] items-center" style={{ borderRadius: 15, paddingBlock: 13 }}>
                            <Text className="text-white text-[16px] font-semibold">Save</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>

            <DatePickerMinimalModal
                visible={showDate}
                date={selectedDate}
                choooseDate={setSelectedDate}
                onClose={() => setShowDate(false)}
            />

            <SelectionModal
                visible={activeSubModal === "reminder"}
                title="Reminder"
                data={reminderOptions}
                selectedValue={selectedReminder}
                onClose={() => setActiveSubModal(null)}
                onSelect={(val) => {
                    setSelectedReminder(val);
                    setActiveSubModal(null);
                }}
            />

            <SelectionModal
                visible={activeSubModal === "repeat"}
                title="Repeat"
                data={repeatOptions}
                selectedValue={selectedRepeat}
                onClose={() => setActiveSubModal(null)}
                onSelect={(val) => {
                    setSelectedRepeat(val);
                    setActiveSubModal(null);
                }}
            />
        </>
    );
};

export default AddCountdownModal;
