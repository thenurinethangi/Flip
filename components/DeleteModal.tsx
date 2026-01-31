import { deleteSubtaskBySubtaskId } from "@/services/subtaskService";
import { deleteTaskByTaskId } from "@/services/taskService";
import { Trash2 } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type DeleteTargetType = "task" | "subtask";

interface DeleteModalProps {
    visible: boolean;
    onClose: () => void;
    onCloseTaskEditModel: () => void;
    targetId: string | null;
    targetType: DeleteTargetType;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    visible,
    onClose,
    onCloseTaskEditModel,
    targetId,
    targetType,
}) => {
    if (!visible) {
        return null;
    }

    const label = targetType === "task" ? "Delete task" : "Delete subtask";

    async function handleDeleteTask() {
        if (targetId && targetType === 'task') {
            try {
                await deleteTaskByTaskId(targetId);
            }
            catch (e) {
                console.log(e);
            }
        }
        else if (targetId && targetType === 'subtask') {
            try {
                await deleteSubtaskBySubtaskId(targetId);
            }
            catch (e) {
                console.log(e);
            }
        }
        onClose();
        onCloseTaskEditModel();
    }

    return (
        <View style={styles.overlay} pointerEvents="box-none">
            <Pressable style={styles.backdrop} onPress={onClose} />
            <TouchableOpacity onPress={handleDeleteTask} style={styles.card}>
                <View style={styles.row}>
                    <Trash2 size={20} color="#E24A4A" />
                    <Text style={styles.text}>{label}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default DeleteModal;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 85,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.12)",
    },
    card: {
        width: 192,
        backgroundColor: "#fff",
        borderRadius: 6,
        paddingVertical: 3,
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
    text: {
        fontSize: 16,
        color: "#1A1A1A",
        fontWeight: "400",
    },
});
