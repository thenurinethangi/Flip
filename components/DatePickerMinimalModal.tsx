import { ThemeContext } from "@/context/themeContext";
import { Check, X } from "lucide-react-native";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Modal from "react-native-modal";

interface Props {
    visible: boolean;
    date: string;
    choooseDate: (date: string) => void;
    onClose: () => void;
}

const DatePickerMinimalModal: React.FC<Props> = ({
    visible,
    date,
    choooseDate,
    onClose,
}) => {
    const todayStr = new Date().toLocaleDateString("en-CA");
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textPrimary = isDark ? "#E5E7EB" : "#374151";
    const cardBg = isDark ? "#1B1B1B" : "#fff";

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

                    <Check onPress={onClose} size={22} color="#4772FA" />
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
                            selectedColor: "#4772FA",
                        },
                    }}
                    theme={{
                        selectedDayBackgroundColor: "#4772FA",
                        todayTextColor: "#4772FA",
                        arrowColor: "#4772FA",
                        monthTextColor: isDark ? "#E5E7EB" : "#222",
                        dayTextColor: isDark ? "#E5E7EB" : "#111827",
                        textDisabledColor: isDark ? "#4B5563" : "#9CA3AF",
                        calendarBackground: cardBg,
                        textSectionTitleColor: isDark ? "#9CA3AF" : "#6B7280",
                        textDayFontSize: 14,
                        textMonthFontSize: 16,
                    }}
                />

                {/* Clear */}
                <TouchableOpacity onPress={() => choooseDate(todayStr)}>
                    <Text style={[styles.clear, { color: isDark ? "#FCA5A5" : "red" }]}>Clear</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default DatePickerMinimalModal;

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
