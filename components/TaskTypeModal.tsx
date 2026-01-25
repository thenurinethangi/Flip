import {
    BookOpen,
    Briefcase,
    Check,
    FileText,
    Home,
    Inbox
} from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type TaskTypeId = "none" | "work" | "personal" | "note" | "welcome" | "study";

interface TaskTypeModalProps {
    visible: boolean;
    selectedTaskType: string;
    onClose: () => void;
    onSelect?: (type: TaskTypeId) => void;
}

const taskTypeOptions: {
    id: TaskTypeId;
    label: string;
    color: string;
    Icon: React.ComponentType<{ size?: number; color?: string }>;
}[] = [
        { id: "none", label: "None", color: "#2F6BFF", Icon: Inbox },
        { id: "work", label: "Work", color: "#8B5E3C", Icon: Briefcase },
        { id: "personal", label: "Personal", color: "#D47C2C", Icon: Home },
        { id: "note", label: "Note", color: "#66BB6A", Icon: FileText },
        { id: "study", label: "Study", color: "#B55CC5", Icon: BookOpen },
    ];

const TaskTypeModal: React.FC<TaskTypeModalProps> = ({
    visible,
    selectedTaskType,
    onClose,
    onSelect,
}) => {

    const handleSelect = (type: TaskTypeId) => {
        onSelect?.(type);
        onClose();
    };

    if (!visible) {
        return null;
    }

    return (
        <View style={styles.overlay} pointerEvents="box-none">
            <Pressable style={styles.backdrop} onPress={onClose} />
            <View style={styles.card}>
                {taskTypeOptions.map((option, index) => (
                    <TouchableOpacity
                        key={option.id}
                        style={[
                            styles.row,
                            index === taskTypeOptions.length - 1 && styles.rowLast,
                        ]}
                        onPress={() => handleSelect(option.id)}
                    >
                        <option.Icon size={20} color={option.color} />
                        <Text style={styles.text}>{option.label}</Text>
                        {selectedTaskType === option.id && (
                            <Check size={18} color="#2F6BFF" style={styles.check} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default TaskTypeModal;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 95,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.12)",
    },
    card: {
        width: 190,
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 18,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 10,
    },
    check: {
        marginLeft: "auto",
    },
    rowLast: {
        paddingBottom: 12,
    },
    text: {
        fontSize: 15.5,
        color: "#1A1A1A",
        fontWeight: "500",
    },
});
