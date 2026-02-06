import { Cake, Gift, Heart, Hourglass, Balloon } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type CountdownTypeId = "holiday" | "birthday" | "anniversary" | "countdown";

interface CountdownTypeModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect?: (type: CountdownTypeId) => void;
}

const options: Array<{
    id: CountdownTypeId;
    label: string;
    color: string;
    Icon: typeof Gift;
}> = [
        { id: "holiday", label: "Holiday", color: "#10B981", Icon: Balloon },
        { id: "birthday", label: "Birthday", color: "#F87171", Icon: Cake },
        { id: "anniversary", label: "Anniversary", color: "#EC4899", Icon: Heart },
        { id: "countdown", label: "Countdown", color: "#3B82F6", Icon: Hourglass },
    ];

const CountdownTypeModal: React.FC<CountdownTypeModalProps> = ({
    visible,
    onClose,
    onSelect,
}) => {
    if (!visible) return null;

    return (
        <View style={styles.overlay} pointerEvents="box-none">
            <Pressable style={styles.backdrop} onPress={onClose} />
            <View className="items-center gap-y-4">
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={styles.row}
                        onPress={() => {
                            onSelect?.(option.id);
                            onClose();
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.label}>{option.label}</Text>
                        <View style={styles.iconWrap}>
                            <option.Icon size={21} color={option.color} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default CountdownTypeModal;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        paddingBottom: 110,
        paddingRight: 23,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#F5F6F8",
        opacity: 0.95,
    },
    container: {
        gap: 16,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        justifyContent: "flex-end",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
        width: 110,
        textAlign: "right",
    },
    iconWrap: {
        width: 51,
        height: 51,
        borderRadius: '50%',
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
});
