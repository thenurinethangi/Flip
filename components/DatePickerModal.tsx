import { ColorContext } from "@/context/colorContext";
import { ThemeContext } from "@/context/themeContext";
import { Bell, Check, Clock, Repeat, X } from "lucide-react-native";
import React, { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Modal from "react-native-modal";
import SelectionModal from "./SelectionModal";
import TimePickerModal from "./TimePickerModal";

interface Props {
    visible: boolean;
    date: string;
    choooseDate: (date: string) => void;
    onClose: () => void;
    selectedTime: string;
    setSelectedTime: (value: string) => void;
    selectedReminder: string;
    setSelectedReminder: (value: string) => void;
    selectedRepeat: string;
    setSelectedRepeat: (value: string) => void;
}

const CustomCalendarModal: React.FC<Props> = ({
    visible,
    date,
    choooseDate,
    onClose,
    selectedTime,
    setSelectedTime,
    selectedReminder,
    setSelectedReminder,
    selectedRepeat,
    setSelectedRepeat,
}) => {
    const todayStr = new Date().toLocaleDateString("en-CA");
    const { currentTheme } = useContext(ThemeContext);
    const { colorTheme } = useContext(ColorContext);
    const isDark = currentTheme === "dark";
    const textPrimary = isDark ? "#E5E7EB" : "#374151";
    const textSecondary = isDark ? "#9CA3AF" : "#999";
    const cardBg = isDark ? "#1B1B1B" : "#fff";

    const [activeSubModal, setActiveSubModal] = useState<"time" | "reminder" | "repeat" | null>(null);

    const reminderOptions = [
        { id: "1", label: "None", isAvailable: true },
        { id: "2", label: "At time of task", isAvailable: selectedTime !== "None" },
        { id: "3", label: "5 minutes before", isAvailable: selectedTime !== "None" },
        { id: "4", label: "30 minutes before", isAvailable: selectedTime !== "None" },
        { id: "5", label: "1 hour before", isAvailable: selectedTime !== "None" },
        { id: "6", label: "On the day", isAvailable: true },
        { id: "7", label: "1 day early", isAvailable: true },
    ];

    const repeatOptions = [
        { id: "1", label: "None", isAvailable: true },
        { id: "2", label: "Daily", isAvailable: true },
        { id: "3", label: "Weekly", isAvailable: true },
        { id: "4", label: "Monthly", isAvailable: true },
    ];

    return (
        <Modal
            isVisible={visible}
            style={{ margin: 0, justifyContent: "flex-end" }}
            backdropOpacity={0.3}
            onBackdropPress={onClose}
        >
            <View style={[styles.container, { backgroundColor: cardBg }] }>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <X size={22} color={textPrimary} />
                    </TouchableOpacity>

                    <View style={styles.tabs}>
                        <Text style={[styles.activeTab, { color: textPrimary }]}>Date</Text>
                    </View>

                    <Check onPress={onClose} size={22} color={colorTheme} />
                </View>

                {/* Calendar */}
                <Calendar
                    current={date || todayStr}
                    onDayPress={(day) => {
                        choooseDate(day.dateString);
                    }}
                    markedDates={{
                        [date]: {
                            selected: true,
                            selectedColor: colorTheme,
                        },
                    }}
                    theme={{
                        selectedDayBackgroundColor: colorTheme,
                        todayTextColor: colorTheme,
                        arrowColor: colorTheme,
                        monthTextColor: isDark ? "#E5E7EB" : "#222",
                        dayTextColor: isDark ? "#E5E7EB" : "#111827",
                        textDisabledColor: isDark ? "#4B5563" : "#9CA3AF",
                        calendarBackground: cardBg,
                        textSectionTitleColor: isDark ? "#9CA3AF" : "#6B7280",
                        textDayFontSize: 14,
                        textMonthFontSize: 16,
                    }}
                />

                {/* Options */}
                <TouchableOpacity
                    className="mt-2"
                    style={styles.option}
                    onPress={() => setActiveSubModal("time")}
                >
                    <Clock size={20} color={isDark ? "#9CA3AF" : "#666"} />
                    <Text style={[styles.optionText, { color: textPrimary }]}>Time</Text>
                    <Text style={[styles.optionValue, { color: selectedTime !== "None" ? colorTheme : textSecondary }]}> 
                        {selectedTime}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.option}
                    onPress={() => setActiveSubModal("reminder")}
                >
                    <Bell size={20} color={isDark ? "#9CA3AF" : "#666"} />
                    <Text style={[styles.optionText, { color: textPrimary }]}>Reminder</Text>
                    <Text style={[styles.optionValue, { color: selectedReminder !== "None" ? colorTheme : textSecondary }]}> 
                        {selectedReminder}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.option}
                    onPress={() => setActiveSubModal("repeat")}
                >
                    <Repeat size={20} color={isDark ? "#9CA3AF" : "#666"} />
                    <Text style={[styles.optionText, { color: textPrimary }]}>Repeat</Text>
                    <Text style={[styles.optionValue, { color: selectedRepeat !== "None" ? colorTheme : textSecondary }]}> 
                        {selectedRepeat}
                    </Text>
                </TouchableOpacity>

                {/* Clear */}
                <TouchableOpacity onPress={() => choooseDate(todayStr)}>
                    <Text style={[styles.clear, { color: isDark ? "#FCA5A5" : "red" }]}>Clear</Text>
                </TouchableOpacity>
            </View>

            <TimePickerModal
                visible={activeSubModal === "time"}
                onClose={() => setActiveSubModal(null)}
                onConfirm={(time) => {
                    setSelectedTime(time);
                    setActiveSubModal(null);
                }}
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
        </Modal>
    );
};

export default CustomCalendarModal;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        paddingBottom: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    tabs: {
        flexDirection: "row",
        gap: 20,
    },
    tab: {
        color: "#999",
        fontSize: 16,
    },
    activeTab: {
        color: "#374151",
        fontSize: 16,
        fontWeight: "600",
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    optionText: {
        flex: 1,
        fontSize: 15,
    },
    optionValue: {
        color: "#999",
    },
    clear: {
        textAlign: "center",
        color: "red",
        marginTop: 10,
        fontSize: 16,
    },
});
