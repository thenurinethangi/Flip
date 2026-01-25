import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from "react-native";
import Modal from "react-native-modal";
import { X, Check, Crown } from "lucide-react-native";

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

    return (
        <Modal
            isVisible={visible}
            style={{ margin: 0, justifyContent: "flex-end" }}
            onBackdropPress={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <X size={22} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{title}</Text>
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
                    <Text style={styles.clear} onPress={() => onSelect('None')}>Clear</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default SelectionModal;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
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
