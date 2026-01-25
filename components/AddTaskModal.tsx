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
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Modal from "react-native-modal";
import PriorityModal, { type PriorityId } from "./../components/PriorityModal";
import TaskTypeModal, { type TaskTypeId } from "./../components/TaskTypeModal";

interface AddTaskModalProps {
    visible: boolean;
    onClose: () => void;
    onOpenCalendar: () => void;
    selectedDate: string;
    selectedTime: string;
    selectedReminder: string;
    selectedRepeat: string;
    selectedPriority: string;
    selectedTaskType: string;
    tags: string;
    setSelectedDate: (value: string) => void;
    setSelectedTime: (value: string) => void;
    setSelectedReminder: (value: string) => void;
    setSelectedRepeat: (value: string) => void;
    setSelectedPriority: (value: string) => void;
    setSelectedTaskType: (value: string) => void;
    setTags: (value: string) => void;
    onAddTask: (payload: {
        title: string;
        date: string;
        time: string;
        reminder: string;
        repeat: string;
        priority: string;
        taskType: string;
        tags: string;
    }) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
    visible,
    onClose,
    onOpenCalendar,
    selectedDate,
    selectedTime,
    selectedReminder,
    selectedRepeat,
    selectedPriority,
    selectedTaskType,
    tags,
    setSelectedPriority,
    setSelectedTaskType,
    onAddTask,
}) => {

    const [text, setText] = useState<string>("");
    const [height, setHeight] = useState<number>(70);
    const inputRef = useRef<TextInput>(null);
    const [priorityVisible, setPriorityVisible] = useState<boolean>(false);
    const [taskTypeVisible, setTaskTypeVisible] = useState<boolean>(false);

    const handleModalShow = () => {
        inputRef.current?.focus();
    };

    const formatTaskDate = (dateStr: string) => {
        const input = new Date(dateStr);
        const today = new Date();

        input.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffDays =
            (input.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Tomorrow";

        return input.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
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
                                <TouchableOpacity onPress={onOpenCalendar} className="flex-row items-center">
                                    <Calendar size={22} color="#4772FA" />
                                    <Text className="text-primary ml-2">{formatTaskDate(selectedDate)}</Text>
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

                            <TouchableOpacity
                                style={styles.addBtn}
                                onPress={() => {
                                    onAddTask({
                                        title: text,
                                        date: selectedDate,
                                        time: selectedTime,
                                        reminder: selectedReminder,
                                        repeat: selectedRepeat,
                                        priority: selectedPriority,
                                        taskType: selectedTaskType,
                                        tags,
                                    });
                                    setText("");
                                    onClose();
                                }}
                            >
                                <SendHorizontal color="#fff" fill="#fff" size={21} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <PriorityModal
                        visible={priorityVisible}
                        onClose={() => setPriorityVisible(false)}
                        onSelect={setSelectedPriority}
                    />

                    <TaskTypeModal
                        visible={taskTypeVisible}
                        onClose={() => setTaskTypeVisible(false)}
                        onSelect={setSelectedTaskType}
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
