import { FocusedTask } from "@/app/(tabs)/focus";
import { AppIcon } from "@/components/ui/icon-symbol";
import { ColorContext } from "@/context/colorContext";
import { ThemeContext } from "@/context/themeContext";
import { subscribeSubTasksByTaskId } from "@/services/subtaskService";
import {
    subscribeOverdueTasks,
    subscribePendingTasksByDate,
} from "@/services/taskService";
import Checkbox from "expo-checkbox";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableNativeFeedback,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    FadeOutUp,
    Layout,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const getPriorityColor = (priority?: string) => {
    switch ((priority ?? "none").toLowerCase()) {
        case "high":
            return "#E24A4A";
        case "medium":
            return "#F2B233";
        case "low":
            return "#2F6BFF";
        default:
            return "#B8BFC8";
    }
};

interface FocusTaskModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (task: FocusedTask) => void;
}

const FocusTaskModal: React.FC<FocusTaskModalProps> = ({
    visible,
    onClose,
    onSelect,
}) => {
    const { currentTheme } = useContext(ThemeContext);
    const { colorTheme } = useContext(ColorContext);
    const isDark = currentTheme === "dark";
    const cardBg = isDark ? "#1B1B1B" : "#FFFFFF";
    const textPrimary = isDark ? "#E5E7EB" : "#111827";
    const textSecondary = isDark ? "#9CA3AF" : "#9CA3AF";
    const todayStr = new Date().toLocaleDateString("en-CA");

    const [todayIncompleteTasks, setTodayIncompleteTasks] = useState<any[]>([]);
    const [overdueTasks, setOverdueTasks] = useState<any[]>([]);
    const [expandedTaskIds, setExpandedTaskIds] = useState<
        Record<string, boolean>
    >({});

    useEffect(() => {
        const unsubscribe = subscribePendingTasksByDate(
            todayStr,
            (tasks) => {
                setTodayIncompleteTasks(tasks);
            },
            (error) => console.log(error),
        );

        return unsubscribe;
    }, [todayStr]);

    useEffect(() => {
        const unsubscribe = subscribeOverdueTasks(
            todayStr,
            (tasks) => setOverdueTasks(tasks),
            (error) => console.log(error),
        );

        return unsubscribe;
    }, [todayStr]);

    const subtaskUnsubscribers = useRef<Record<string, () => void>>({});

    const updateSubtasksForTask = (taskId: string, subtasks: any[]) => {
        setTodayIncompleteTasks((prev) =>
            prev.map((item) =>
                item.task.id === taskId ? { ...item, subtasks } : item,
            ),
        );
        setTodayIncompleteTasks((prev) =>
            prev.map((item) =>
                item.task.id === taskId ? { ...item, subtasks } : item,
            ),
        );
        setOverdueTasks((prev) =>
            prev.map((item) =>
                item.task.id === taskId ? { ...item, subtasks } : item,
            ),
        );
    };

    useEffect(() => {
        const allTasks = [...todayIncompleteTasks, ...overdueTasks];
        const activeTaskIds = new Set(allTasks.map((item) => item.task.id));

        activeTaskIds.forEach((taskId) => {
            if (!subtaskUnsubscribers.current[taskId]) {
                subtaskUnsubscribers.current[taskId] = subscribeSubTasksByTaskId(
                    taskId,
                    (subtasks) => updateSubtasksForTask(taskId, subtasks),
                    (error) => console.log(error),
                );
            }
        });

        Object.keys(subtaskUnsubscribers.current).forEach((taskId) => {
            if (!activeTaskIds.has(taskId)) {
                subtaskUnsubscribers.current[taskId]();
                delete subtaskUnsubscribers.current[taskId];
            }
        });
    }, [todayIncompleteTasks, overdueTasks]);

    const toggleSubtasks = (taskId: string) => {
        setExpandedTaskIds((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    function handleSelectTask(id: string, taskname: string, type: string) {
        onSelect({ id, taskname, type });
        onClose();
    }

    const renderTaskRow = (item: any, index: number) => (
        <View key={index} className={`mb-1`} style={{ backgroundColor: cardBg }}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onSelect(item.task.id)}
            >
                <Animated.View
                    layout={Layout.springify().damping(18).stiffness(180)}
                    entering={FadeInDown.duration(200)}
                    exiting={FadeOutUp.duration(150)}
                    className={`w-full box-content rounded-[10px] pl-[5px] py-4 h-[48px] flex-row items-center justify-between`}
                    style={{ backgroundColor: cardBg }}
                >
                    <View
                        className="flex-row items-center gap-x-3 flex-1"
                        pointerEvents="box-none"
                    >
                        <View pointerEvents="auto">
                            <Checkbox
                                value={item.task.status !== "pending"}
                                color={getPriorityColor(item.task.priorityLevel)}
                                style={{
                                    transform: [{ scale: 0.87 }],
                                    borderRadius: 10,
                                    borderWidth: 2,
                                }}
                            />
                        </View>
                        <View className="w-[82%]">
                            <Text
                                className="text-[15.5px] flex-1"
                                style={{ color: textPrimary }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                onPress={() => {
                                    handleSelectTask(item.task.id, item.task.taskname, "task");
                                }}
                            >
                                {item.task.taskname}
                            </Text>
                        </View>
                    </View>
                    {item.subtasks?.filter((x: any) => x.status !== "complete").length >
                        0 && (
                            <TouchableOpacity
                                onPress={() => toggleSubtasks(item.task.id)}
                                className="pl-[7px]"
                            >
                                <AppIcon
                                    name={
                                        expandedTaskIds[item.task.id] ? "ChevronDown" : "chevronRight"
                                    }
                                    color={isDark ? "#6B7280" : "#9ca3af"}
                                    size={15}
                                />
                            </TouchableOpacity>
                        )}
                </Animated.View>
            </TouchableOpacity>

            {expandedTaskIds[item.task.id] && item.subtasks?.length > 0 && (
                <View className="mt-1 ml-4">
                    {item.subtasks
                        .filter((x: any) => x.status !== "complete")
                        .map((subtask: any) => (
                            <Animated.View
                                layout={Layout.springify().damping(18).stiffness(180)}
                                entering={FadeInDown.duration(200)}
                                exiting={FadeOutUp.duration(150)}
                                key={subtask.id}
                                className="w-full box-content rounded-[10px] pl-[21px] pr-4 py-3 h-[46px] flex-row items-center justify-between mb-2"
                                style={{ backgroundColor: cardBg }}
                            >
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        handleSelectTask(subtask.id, subtask.taskname, "subtask");
                                    }}
                                >
                                    <View className="flex-row items-center justify-between w-full">
                                        <View className="flex-row items-center gap-x-3">
                                            <View>
                                                <Checkbox
                                                    value={subtask.status !== "pending"}
                                                    color={
                                                        subtask.status !== "pending"
                                                            ? "#B8BFC8"
                                                            : getPriorityColor(subtask.priorityLevel)
                                                    }
                                                    style={{
                                                        transform: [{ scale: 0.85 }],
                                                        borderRadius: 10,
                                                        borderWidth: 2,
                                                    }}
                                                />
                                            </View>
                                            <TouchableNativeFeedback
                                                onPress={() => {
                                                    handleSelectTask(subtask.id, subtask.taskname, "subtask");
                                                }}
                                            >
                                                <Text
                                                    className={`text-[14.5px] ${subtask.status !== "pending" ? "text-gray-400 line-through" : ""}`}
                                                    style={{ color: subtask.status !== "pending" ? "#9CA3AF" : textPrimary }}
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                >
                                                    {subtask.taskname}
                                                </Text>
                                            </TouchableNativeFeedback>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </Animated.View>
                        ))}
                </View>
            )}
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#000000]' : 'bg-[#F5F6F8]'}`}>
                <View className="px-4 pt-2 flex-row items-center gap-x-4">
                    <Pressable
                        onPress={onClose}
                        className="w-[32px] h-[32px] rounded-full items-center justify-center"
                    >
                        <AppIcon name="X" color={isDark ? "#E5E7EB" : "#111827"} size={21} />
                    </Pressable>
                    <View className="flex-row items-center gap-x-6">
                        <Text className="text-[17px] font-semibold" style={{ color: textSecondary }}>
                            Task
                        </Text>
                    </View>
                </View>

                <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
                    <View className="px-4">
                        <View className="rounded-[16px] px-4 py-1 flex-row items-center gap-x-2" style={{ backgroundColor: isDark ? "#1B1B1B" : "#EEEEEE" }}>
                            <AppIcon name="search" size={18} color={isDark ? "#9CA3AF" : "#9CA3AF"} />
                            <TextInput
                                placeholder="Search"
                                placeholderTextColor="#9CA3AF"
                                className="flex-1 text-[15px]"
                                style={{ color: textPrimary }}
                            />
                        </View>

                        <View className="px-1 mt-4 flex-row items-center gap-x-[5px]">
                            <View className="w-[22px] h-[22px] rounded-[6px] items-center justify-center" style={{ backgroundColor: isDark ? "#111827" : "#EEF2FF" }}>
                                <AppIcon name="Calendar" color={isDark ? "#9CA3AF" : "#9CA3AF"} size={16} />
                            </View>
                            <Text className="text-[15px] font-semibold" style={{ color: textPrimary }}>
                                Today
                            </Text>
                            <AppIcon name="chevronRight" size={16} color={isDark ? "#6B7280" : "#C5C9D3"} />
                        </View>

                        <Text className="px-2 mt-2 text-[13px]" style={{ color: textSecondary }}>
                            You can select a task to start a pomo to keep focused.
                        </Text>

                        <View className="mt-4 rounded-[16px] px-4 py-2" style={{ backgroundColor: cardBg }}>
                            <View className="flex-row items-center justify-between py-2">
                                <Text className="text-[14px] tracking-widest font-semibold" style={{ color: textPrimary }}>
                                    TODAY
                                </Text>
                                <AppIcon name="ChevronDown" size={18} color={isDark ? "#6B7280" : "#C5C9D3"} />
                            </View>
                            {todayIncompleteTasks.map(renderTaskRow)}
                        </View>

                        <View className="mt-4 rounded-[16px] px-4 py-2 mb-6" style={{ backgroundColor: cardBg }}>
                            <View className="flex-row items-center justify-between py-2">
                                <Text className="text-[14px] tracking-widest font-semibold" style={{ color: textPrimary }}>
                                    OVERDUE
                                </Text>
                                <AppIcon name="ChevronDown" size={18} color={isDark ? "#6B7280" : "#C5C9D3"} />
                            </View>
                            {overdueTasks.map(renderTaskRow)}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

export default FocusTaskModal;
