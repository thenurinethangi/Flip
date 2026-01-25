import {
    Calendar,
    Flag,
    MoreHorizontal,
    MoveRight,
    SendHorizontal,
    Tag,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Modal from "react-native-modal";
import PriorityModal from "./../components/PriorityModal";
import TaskTypeModal from "./../components/TaskTypeModal";

interface AddTaskModalProps {
    visible: boolean;
    onClose: () => void;
    onOpenCalendar: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ visible, onClose, onOpenCalendar }) => {

    const [text, setText] = useState<string>("");
    const [height, setHeight] = useState<number>(70);
    const inputRef = useRef<TextInput>(null);
    const [priorityVisible, setPriorityVisible] = useState<boolean>(false);
    const [taskTypeVisible, setTaskTypeVisible] = useState<boolean>(false);

    const handleModalShow = () => {
        inputRef.current?.focus();
    };


    return (
        <>
            <Modal
                isVisible={visible}
                style={styles.modal}
                backdropOpacity={0.3}
                onBackdropPress={onClose}
                onModalShow={handleModalShow}
                avoidKeyboard
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.sheet}
                >
                    <View style={styles.container}>
                        {/* Input */}
                        <TextInput
                            ref={inputRef}
                            className="-translate-y-1.5"
                            placeholder="What would you like to do?"
                            placeholderTextColor="#999"
                            multiline
                            value={text}
                            onChangeText={setText}
                            onContentSizeChange={(e) =>
                                setHeight(e.nativeEvent.contentSize.height)
                            }
                            style={[styles.input, { height: Math.max(70, height) }]}
                        />

                        {/* Bottom Row */}
                        <View style={styles.bottomRow}>
                            <View style={styles.iconRow}>
                                <TouchableOpacity onPress={onOpenCalendar}>
                                    <Calendar size={22} color="#9BA2AB" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setPriorityVisible(true)}>
                                    <Flag size={22} color="#9BA2AB" />
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <Tag size={22} color="#9BA2AB" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setTaskTypeVisible(true)}>
                                    <MoveRight size={22} color="#9BA2AB" />
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <MoreHorizontal size={22} color="#9BA2AB" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.addBtn}>
                                <SendHorizontal color="#fff" fill="#fff" size={21} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <PriorityModal
                        visible={priorityVisible}
                        onClose={() => setPriorityVisible(false)}
                    />

                    <TaskTypeModal
                        visible={taskTypeVisible}
                        onClose={() => setTaskTypeVisible(false)}
                    />
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
};

export default AddTaskModal;

const styles = StyleSheet.create({
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    sheet: {
        flex: 1,
        justifyContent: "flex-end",
    },
    container: {
        backgroundColor: "#fff",
        padding: 16,
        paddingTop: 0,
        borderTopLeftRadius: 21,
        borderTopRightRadius: 21,
    },
    input: {
        fontSize: 16.5,
        color: "#000",
        paddingVertical: 6,
    },
    bottomRow: {
        marginTop: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    iconRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
    },
    addBtn: {
        backgroundColor: "#2F6BFF",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 22,
    },
    addText: {
        color: "#fff",
        fontWeight: "600",
    },
});
