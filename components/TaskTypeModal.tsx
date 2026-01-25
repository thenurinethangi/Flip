import {
    BookOpen,
    Briefcase,
    Check,
    FileText,
    Hand,
    Home,
    Inbox,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type TaskTypeId = "none" | "work" | "personal" | "note" | "welcome" | "study";

interface TaskTypeModalProps {
    visible: boolean;
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
        { id: "note", label: "Note", color: "#8A8A8A", Icon: FileText },
        { id: "welcome", label: "Welcome", color: "#F2B233", Icon: Hand },
        { id: "study", label: "Study", color: "#B55CC5", Icon: BookOpen },
    ];

const TaskTypeModal: React.FC<TaskTypeModalProps> = ({
    visible,
    onClose,
    onSelect,
}) => {
    const [selected, setSelected] = useState<TaskTypeId>("none");

    useEffect(() => {
        if (visible) {
            setSelected("none");
        }
    }, [visible]);

    const handleSelect = (type: TaskTypeId) => {
        setSelected(type);
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
                        {selected === option.id && (
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
        paddingBottom: 170,
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
