import { ColorContext } from "@/context/colorContext";
import { ThemeContext } from "@/context/themeContext";
import { Check, Clock, X } from "lucide-react-native";
import React, { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface Props {
    visible: boolean;
    onClose: () => void;
    onConfirm: (time: string) => void;
}

const TimePickerModal: React.FC<Props> = ({ visible, onClose, onConfirm }) => {
    const { currentTheme } = useContext(ThemeContext);
    const { colorTheme } = useContext(ColorContext);
    const isDark = currentTheme === "dark";
    const cardBg = isDark ? "#1B1B1B" : "#fff";
    const textPrimary = isDark ? "#E5E7EB" : "#111827";
    const textSecondary = isDark ? "#9CA3AF" : "#666";

    const [time, setTime] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);

    const formatTime = (date: Date) => {
        let hours = date.getHours(); 
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours === 0 ? 12 : hours; 

        const mins = minutes.toString().padStart(2, "0");

        return `${hours}:${mins} ${ampm}`;
    };

    return (
        <Modal
            isVisible={visible}
            style={{ margin: 0, justifyContent: "flex-end" }}
            onBackdropPress={onClose}
            backdropOpacity={0.3}
        >
            <View style={[styles.container, { backgroundColor: cardBg }] }>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <X size={22} color={textPrimary} />
                    </TouchableOpacity>

                    <Text style={[styles.title, { color: textPrimary }]}>Pick Time</Text>

                    <TouchableOpacity
                        disabled={!time}
                        onPress={() => time && onConfirm(formatTime(time))}
                    >
                        <Check size={22} color={colorTheme} />
                    </TouchableOpacity>
                </View>

                {/* Time Row */}
                <TouchableOpacity
                    style={styles.timeRow}
                    onPress={() => setShowPicker(true)}
                >
                    <Clock size={20} color={textSecondary} />
                    <Text style={[styles.timeText, { color: textPrimary }]}>
                        {time ? formatTime(time) : "Select time"}
                    </Text>
                </TouchableOpacity>

                {/* Native Time Picker */}
                <DateTimePickerModal
                    isVisible={showPicker}
                    mode="time"
                    date={time ?? new Date()}
                    onConfirm={(date) => {
                        setTime(date);
                        setShowPicker(false);
                    }}
                    onCancel={() => setShowPicker(false)}
                    accentColor={colorTheme}
                />

                <TouchableOpacity onPress={() => setTime(null)}>
                    <Text style={[styles.clear, { color: isDark ? "#FCA5A5" : "red" }]}>Clear</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default TimePickerModal;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        paddingBottom: 30,
    },
    header: {
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        gap: 12,
    },
    timeText: {
        fontSize: 18,
    },
    clear: {
        textAlign: "center",
        color: "red",
        marginTop: 16,
        fontSize: 16,
    },
});
