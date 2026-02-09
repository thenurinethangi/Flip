import { ThemeContext } from "@/context/themeContext";
import { deleteCountdown } from "@/services/countdownService";
import { Pencil, Trash2 } from "lucide-react-native";
import React, { useContext } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface DeleteModalProps {
    visible: boolean;
    onClose: () => void;
    countdown: any;
    onShowEdit: () => void;
}

const CountdownOptionModal: React.FC<DeleteModalProps> = ({ visible, onClose, countdown, onShowEdit }) => {
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textPrimary = isDark ? "#E5E7EB" : "#2B2B2B";
    const iconColor = isDark ? "#E5E7EB" : "#2B2B2B";

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
                <Pressable style={[styles.backdrop, { backgroundColor: isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.12)" }]} onPress={onClose} />
                <View style={[styles.card, { backgroundColor: isDark ? "#1B1B1B" : "#fff" }] }>
                    <Pressable onPress={onShowEdit} style={styles.row}>
                        {({ pressed }) => (
                            <View style={[styles.rowContent, pressed && styles.rowPressed, pressed && isDark && styles.rowPressedDark]}>
                                <Pencil size={20} color={iconColor} />
                                <Text style={[styles.text, { color: textPrimary }]}>Edit</Text>
                            </View>
                        )}
                    </Pressable>
                    <Pressable onPress={handleDeleteCountdown} style={styles.row}>
                        {({ pressed }) => (
                            <View style={[styles.rowContent, pressed && styles.rowPressed, pressed && isDark && styles.rowPressedDark]}>
                                <Trash2 size={20} color={iconColor} />
                                <Text style={[styles.text, { color: textPrimary }]}>Delete</Text>
                            </View>
                        )}
                    </Pressable>
                </View>
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
    },
    card: {
        width: 192,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    row: {
        borderRadius: 12,
        overflow: "hidden",
    },
    rowContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: 18,
    },
    rowPressed: {
        flex: 1,
        backgroundColor: "#E5E7EB",
    },
    rowPressedDark: {
        backgroundColor: "#111827",
    },
    text: {
        fontSize: 16,
        fontWeight: "400",
    },
});
