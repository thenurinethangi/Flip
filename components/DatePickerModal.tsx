import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Calendar } from "react-native-calendars";
import { X, Check, Clock, Bell, Repeat } from "lucide-react-native";
import TimePickerModal from "./TimePickerModal";
import SelectionModal from "./SelectionModal";

interface Props {
    visible: boolean;
    onClose: () => void;
}

const CustomCalendarModal: React.FC<Props> = ({ visible, onClose }) => {

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);

    // 1. Add these states inside CustomCalendarModal
    const [activeSubModal, setActiveSubModal] = useState<"time" | "reminder" | "repeat" | null>(null);

    // Values to display in the rows
    const [selectedTime, setSelectedTime] = useState("None");
    const [selectedReminder, setSelectedReminder] = useState("None");
    const [selectedRepeat, setSelectedRepeat] = useState("None");

    // 2. Data for the lists (matching your screenshots)
    const reminderOptions = [
        { id: "1", label: "None", isAvailable: true },
        { id: "2", label: "At time of task", isAvailable: selectedTime !== 'None' },
        { id: "3", label: "5 minutes before", isAvailable: selectedTime !== 'None' },
        { id: "4", label: "30 minutes before", isAvailable: selectedTime !== 'None' },
        { id: "5", label: "1 hour before", isAvailable: selectedTime !== 'None' },
        { id: "6", label: "On the day", isAvailable: true },
        { id: "7", label: "1 day early", isAvailable: true },

    ];

    const repeatOptions = [
        { id: "1", label: "None", isAvailable: true },
        { id: "2", label: "Daily", isAvailable: true },
        { id: "3", label: "Weekly", isAvailable: true },
        { id: "4", label: "Monthly", isAvailable: true },
    ];

    function done() {
        console.log(selectedTime)
        console.log(selectedReminder)
        console.log(selectedRepeat)
        console.log(selectedDate);
    }

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

                    <Check onPress={done} size={22} color="#4772FA" />
                </View>

                {/* Calendar */}
                <Calendar
                    current={todayStr}
                    onDayPress={(day) => {
                        setSelectedDate(day.dateString);
                    }}
                    markedDates={{
                        [selectedDate]: {
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

                {/* Options */}
                {/* Time Option */}
                <TouchableOpacity
                    className="mt-2"
                    style={styles.option}
                    onPress={() => setActiveSubModal("time")}
                >
                    <Clock size={20} color="#666" />
                    <Text style={styles.optionText}>Time</Text>
                    <Text style={[styles.optionValue, selectedTime !== "None" && { color: '#4772FA' }]}>
                        {selectedTime}
                    </Text>
                </TouchableOpacity>

                {/* Reminder Option */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => setActiveSubModal("reminder")}
                >
                    <Bell size={20} color="#666" />
                    <Text style={styles.optionText}>Reminder</Text>
                    <Text style={[styles.optionValue, selectedReminder !== "None" && { color: '#4772FA' }]}>
                        {selectedReminder}
                    </Text>
                </TouchableOpacity>

                {/* Repeat Option */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => setActiveSubModal("repeat")}
                >
                    <Repeat size={20} color="#666" />
                    <Text style={styles.optionText}>Repeat</Text>
                    <Text style={[styles.optionValue, selectedRepeat !== "None" && { color: '#4772FA' }]}>
                        {selectedRepeat}
                    </Text>
                </TouchableOpacity>

                {/* Clear */}
                <TouchableOpacity onPress={() => setSelectedDate(todayStr)}>
                    <Text style={styles.clear}>Clear</Text>
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
        color: "#4772FA",
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
