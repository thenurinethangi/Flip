import { AppIcon } from "@/components/ui/icon-symbol";
import { ColorContext } from "@/context/colorContext";
import { ThemeContext } from "@/context/themeContext";
import { editCountdown } from "@/services/countdownService";
import { ChevronRight, Pencil, X } from "lucide-react-native";
import React, { useContext, useEffect, useState } from "react";
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
import DatePickerMinimalModal from "./DatePickerMinimalModal";
import SelectionModal from "./SelectionModal";

interface EditCountdownModalProps {
    visible: boolean;
    onClose: () => void;
    countdown: any;
}

export type CountdownTypeId = "Holiday" | "Birthday" | "Anniversary" | "Countdown";

const typeLabelMap: Record<CountdownTypeId, string> = {
    Holiday: "Holiday",
    Birthday: "Birthday",
    Anniversary: "Anniversary",
    Countdown: "Countdown",
};

const typeColorMap: Record<CountdownTypeId, string> = {
    Holiday: "#10B981",
    Birthday: "#F87171",
    Anniversary: "#EC4899",
    Countdown: "#3B82F6",
};

const typeBgColorMap: Record<CountdownTypeId, string> = {
    Holiday: "#D1FAE5",
    Birthday: "#FECACA",
    Anniversary: "#FBCFE8",
    Countdown: "#BFDBFE",
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


const EditCountdownModal: React.FC<EditCountdownModalProps> = ({ visible, onClose, countdown }) => {
    if (!visible) return null;

    const { currentTheme } = useContext(ThemeContext);
    const { colorTheme } = useContext(ColorContext);
    const isDark = currentTheme === "dark";
    const cardBg = isDark ? "#1B1B1B" : "#FFFFFF";
    const textPrimary = isDark ? "#E5E7EB" : "#111827";
    const textSecondary = isDark ? "#9CA3AF" : "#9CA3AF";
    const divider = isDark ? "#1F2937" : "#F1F2F5";

    const todayStr = new Date().toLocaleDateString("en-CA");

    const resolvedType: CountdownTypeId = countdown.type ?? "Countdown";
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

    useEffect(() => {
        setCountdownName(countdown?.countdownName || '');
        setSelectedDate(countdown?.date || todayStr);
        setSelectedReminder(countdown?.reminder || 'None');
        setSelectedRepeat(countdown?.repeat || 'None');

    }, [countdown?.id, visible]);

    async function handleEditCountdown() {

        if (countdownName.trim() === '') {
            return;
        }

        const editedCountdown = {
            id: countdown?.id,
            countdownName,
            date: selectedDate,
            reminder: selectedReminder,
            repeat: selectedRepeat,
            type: countdown?.type
        }

        try {
            await editCountdown(editedCountdown);
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
                <SafeAreaView className={`flex-1 ${isDark ? "bg-[#0B0F0E]" : "bg-[#F5F6F8]"}`}>
                    <View className="px-5 pt-2">
                        <View className="flex-row items-center gap-x-4">
                            <Pressable onPress={onClose} className="p-1">
                                <X size={22} color={textPrimary} />
                            </Pressable>
                            <Text className="text-[18px] font-semibold" style={{ color: textPrimary }}>Add</Text>
                        </View>
                    </View>

                    <View className="items-center mt-6">
                        <View className="relative">
                            <View className="w-[72px] h-[72px] rounded-full items-center justify-center" style={{ backgroundColor: iconBgColor }}>
                                <AppIcon name={`${resolvedType === 'Countdown' ? 'Hourglass' : resolvedType === 'Anniversary' ? 'Heart' : resolvedType === 'Birthday' ? 'Cake' : 'Balloon'}`} size={28} color={iconColor} />
                            </View>
                            <View className="absolute bottom-0 right-0 w-[22px] h-[22px] rounded-full items-center justify-center shadow-lg shadow-black/10" style={{ backgroundColor: isDark ? "#111827" : "#FFFFFF" }}>
                                <Pencil size={12} color={textSecondary} />
                            </View>
                        </View>
                    </View>

                    <View className="px-5 mt-6">
                        <View className="rounded-[16px] px-4 py-3 flex-row items-center justify-between" style={{ backgroundColor: cardBg }}>
                            <TextInput
                                value={countdownName}
                                onChangeText={setCountdownName}
                                placeholder="Name"
                                placeholderTextColor={isDark ? "#6B7280" : "#C5C9D3"}
                                className="flex-1 text-[15px]"
                                style={{ color: textPrimary }}
                            />
                            {/* <Bookmark size={18} color="#9CA3AF" /> */}
                        </View>

                        <View className="rounded-[16px] mt-4 overflow-hidden" style={{ backgroundColor: cardBg }}>
                            <View className="flex-row items-center justify-between px-4 py-[14px]">
                                <Text className="text-[15px]" style={{ color: textPrimary }}>Date</Text>
                                <View className="flex-row items-center gap-x-2">
                                    <TouchableWithoutFeedback onPress={() => setShowDate(true)}>
                                        <Text className="text-[15px]" style={{ color: textSecondary }}>{formatDateShort(selectedDate)}</Text>
                                    </TouchableWithoutFeedback>
                                    <ChevronRight size={18} color={isDark ? "#6B7280" : "#C5C9D3"} />
                                </View>
                            </View>
                            <View className="h-[1px]" style={{ backgroundColor: divider }} />
                            <View className="flex-row items-center justify-between px-4 py-[14px]">
                                <Text className="text-[15px]" style={{ color: textPrimary }}>Reminder</Text>
                                <View className="flex-row items-center gap-x-2">
                                    <TouchableWithoutFeedback onPress={() => setActiveSubModal('reminder')}>
                                        <Text className="text-[15px]" style={{ color: textSecondary }}>{selectedReminder}</Text>
                                    </TouchableWithoutFeedback>
                                    <X size={16} color={isDark ? "#6B7280" : "#C5C9D3"} />
                                </View>
                            </View>
                            <View className="h-[1px]" style={{ backgroundColor: divider }} />
                            <View className="flex-row items-center justify-between px-4 py-[14px]">
                                <Text className="text-[15px]" style={{ color: textPrimary }}>Repeat</Text>
                                <View className="flex-row items-center gap-x-2">
                                    <TouchableWithoutFeedback onPress={() => setActiveSubModal('repeat')}>
                                        <Text className="text-[15px]" style={{ color: textSecondary }}>{selectedRepeat}</Text>
                                    </TouchableWithoutFeedback>
                                    <ChevronRight size={18} color={isDark ? "#6B7280" : "#C5C9D3"} />
                                </View>
                            </View>
                        </View>

                        <View className="rounded-[16px] mt-4 overflow-hidden" style={{ backgroundColor: cardBg }}>
                            <View className="flex-row items-center justify-between px-4 py-[14px]">
                                <Text className="text-[15px]" style={{ color: textPrimary }}>Type</Text>
                                <View className="flex-row items-center gap-x-2">
                                    <Text className="text-[15px]" style={{ color: textSecondary }}>
                                        {countdown?.type ? typeLabelMap[countdown?.type as CountdownTypeId] : "Countdown"}
                                    </Text>
                                    <ChevronRight size={18} color={isDark ? "#6B7280" : "#C5C9D3"} />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="mt-auto px-5 pb-6">
                        <TouchableOpacity onPress={handleEditCountdown} className="items-center" style={{ borderRadius: 15, paddingBlock: 13, backgroundColor: colorTheme }}>
                            <Text className="text-white text-[16px] font-semibold">Edit</Text>
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

export default EditCountdownModal;
