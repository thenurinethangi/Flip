import { Check, Flag } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type PriorityId = "high" | "medium" | "low" | "none";

interface PriorityModalProps {
    visible: boolean;
    selectedPriority: string;
    onClose: () => void;
    onSelect?: (priority: PriorityId) => void;
}

const priorityOptions: { id: PriorityId; label: string; color: string }[] = [
    { id: "high", label: "High Priority", color: "#E24A4A" },
    { id: "medium", label: "Medium Priority", color: "#F2B233" },
    { id: "low", label: "Low Priority", color: "#2F6BFF" },
    { id: "none", label: "No Priority", color: "#B6B6B6" },
];

const PriorityModal: React.FC<PriorityModalProps> = ({
    visible,
    selectedPriority,
    onClose,
    onSelect,
}) => {

    const handleSelect = (priority: PriorityId) => {
        onSelect?.(priority);
        onClose();
    };

    if (!visible) {
        return null;
    }

    return (
        <View style={styles.overlay} pointerEvents="box-none">
            <Pressable style={styles.backdrop} onPress={onClose} />
            <View style={styles.card}>
                {priorityOptions.map((option, index) => (
                    <TouchableOpacity
                        key={option.id}
                        style={[
                            styles.row,
                            index === priorityOptions.length - 1 && styles.rowLast,
                        ]}
                        onPress={() => handleSelect(option.id)}
                    >
                        <Flag size={20} color={option.color} />
                        <Text style={styles.text}>{option.label}</Text>
                        {selectedPriority === option.id && (
                            <Check size={18} color="#2F6BFF" style={styles.check} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default PriorityModal;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 160,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.12)",
    },
    card: {
        width: 200,
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 10,
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
        fontSize: 16,
        color: "#1A1A1A",
        fontWeight: "400",
    },
});
