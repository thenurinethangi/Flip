import { Bell, Check, Clock, Repeat, X } from "lucide-react-native";
import React, { useState } from "react";
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
}

const DatePickerMinimalModal: React.FC<Props> = ({
    visible,
    date,
    choooseDate,
    onClose,
}) => {
    const todayStr = new Date().toLocaleDateString("en-CA");

    return (
        <Modal
            isVisible={visible}
            style={{ margin: 0, justifyContent: "flex-end" }}
            backdropOpacity={0.3}
            onBackdropPress={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <X size={22} />
                    </TouchableOpacity>

                    <View style={styles.tabs}>
                        <Text style={styles.activeTab}>Date</Text>
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
                        monthTextColor: "#222",
                        textDayFontSize: 14,
                        textMonthFontSize: 16,
                    }}
                />

                {/* Clear */}
                <TouchableOpacity onPress={() => choooseDate(todayStr)}>
                    <Text style={styles.clear}>Clear</Text>
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
