import { ThemeContext } from "@/context/themeContext";
import { Check, X } from "lucide-react-native";
import React, { useContext } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Modal from "react-native-modal";

interface Item {
    id: string;
    label: string;
    isAvailable?: boolean;
}

interface ListProps {
    visible: boolean;
    title: string;
    data: Item[];
    selectedValue: string;
    onClose: () => void;
    onSelect: (val: string) => void;
}

const SelectionModal: React.FC<ListProps> = ({ visible, title, data, selectedValue, onClose, onSelect, }) => {
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textPrimary = isDark ? "#E5E7EB" : "#333";
    const textSecondary = isDark ? "#9CA3AF" : "#999";
    const cardBg = isDark ? "#1B1B1B" : "#fff";
    const divider = isDark ? "#1F2937" : "#EEE";

    return (
        <Modal
            isVisible={visible}
            style={{ margin: 0, justifyContent: "flex-end" }}
            onBackdropPress={onClose}
        >
            <View style={[styles.container, { backgroundColor: cardBg }]}>
                <View style={[styles.header, { borderBottomColor: divider }]}>
                    <TouchableOpacity onPress={onClose}>
                        <X size={22} color={textPrimary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: textPrimary }]}>{title}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Check size={22} color="#4772FA" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => {
                                if (item.isAvailable) {
                                    onSelect(item.label);
                                }
                            }}
                        >
                            <Text
                                className={item.isAvailable ? "" : "line-through"}
                                style={[
                                    styles.itemText,
                                    { color: textPrimary },
                                    selectedValue === item.label && styles.selectedText,
                                ]}
                            >
                                {item.label}
                            </Text>
                            <View
                                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
                            >
                                <View
                                    style={[
                                        styles.radio,
                                        item.isAvailable ? styles.radio : styles.radioInActive,
                                        selectedValue === item.label && styles.radioActive,
                                        isDark && { borderColor: "#374151" },
                                    ]}
                                >
                                    {selectedValue === item.label && (
                                        <View style={styles.radioInner} />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                <TouchableOpacity>
                    <Text style={[styles.clear, { color: isDark ? "#FCA5A5" : "red" }]} onPress={() => onSelect('None')}>Clear</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default SelectionModal;

const styles = StyleSheet.create({
    container: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
        maxHeight: "80%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: "#EEE",
    },
    headerTitle: { fontSize: 17, fontWeight: "600" },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 18,
        alignItems: "center",
    },
    itemText: { fontSize: 16, color: "#333" },
    selectedText: { color: "#4772FA", fontWeight: "500" },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#DDD",
        justifyContent: "center",
        alignItems: "center",
    },
    radioActive: { borderColor: "#4772FA" },
    radioInActive: { borderColor: "#DDD", opacity: 0.1 },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#4772FA",
    },
    clear: { textAlign: "center", color: "red", marginTop: 10, fontSize: 16 },
});
