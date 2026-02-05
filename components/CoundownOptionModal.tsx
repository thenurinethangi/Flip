import { deleteCountdown } from "@/services/countdownService";
import { Pencil, Trash2 } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DeleteModalProps {
    visible: boolean;
    onClose: () => void;
    countdown: any;
    onShowEdit: () => void;
}

const CountdownOptionModal: React.FC<DeleteModalProps> = ({ visible, onClose, countdown, onShowEdit }) => {

    async function handleDeleteCountdown() {
        if (countdown?.id) {
            try {
                await deleteCountdown(countdown?.id);
            }
            catch (e) {
                console.log(e);
            }
        }
        onClose();
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay} pointerEvents="box-none">
                <Pressable style={styles.backdrop} onPress={onClose} />
                <TouchableOpacity style={styles.card}>
                    <Pressable onPress={onShowEdit} style={styles.row}>
                        <Pencil size={20} color="#2B2B2B" />
                        <Text style={styles.text}>Edit</Text>
                    </Pressable>
                    <Pressable onPress={handleDeleteCountdown} style={styles.row}>
                        <Trash2 size={20} color="#2B2B2B" />
                        <Text style={styles.text}>Delete</Text>
                    </Pressable>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default CountdownOptionModal;

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
        borderRadius: 20,
        paddingVertical: 3,
        paddingHorizontal: 18,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
    },
    text: {
        fontSize: 16,
        color: "#2B2B2B",
        fontWeight: "400",
    },
});
