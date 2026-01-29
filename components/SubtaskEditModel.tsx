import { AppIcon } from "@/components/ui/icon-symbol";
import { subscribeSubTasksByTaskId, updateSubTask, updateSubTaskStatusByTaskId } from "@/services/subtaskService";
import { getNotesByTaskId, update } from "@/services/taskService";
import Checkbox from "expo-checkbox";
import {
    ArrowLeft,
    Camera,
    ChevronsUpDown,
    Flag,
    Paperclip,
    Repeat
} from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomCalendarModal from "./DatePickerModal";
import PriorityModal from "./PriorityModal";
import TaskTypeModal from "./TaskTypeModal";

type TaskEditModalProps = {
    visible: boolean;
    task: any | null;
    onClose: () => void;
};

type BlockType =
    | "note"
    | "bullet"
    | "number"
    | "link"
    | "document"
    | "image";

type Block = {
    id: string;
    type: BlockType;
    text: string;
};

type TaskFormModel = {
    id?: string;
    taskname: string;
    note: string;
    date: string;
    time: string;
    reminder: string;
    repeat: string;
    priorityLevel: string;
    taskId: string,
    taskType: string;
    tags: string;
    status: string;
};

const createBlock = (type: BlockType): Block => ({
    id: `${type}-${Date.now()}-${Math.random()}`,
    type,
    text: "",
});

const formatHeaderDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const input = new Date(dateStr);
    const today = new Date();
    input.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffDays =
        (input.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    const datePart = input.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    if (diffDays === 0) return `Today, ${datePart}`;
    if (diffDays === 1) return `Tomorrow, ${datePart}`;
    return input.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
};

const taskTypeLabelMap: Record<string, string> = {
    inbox: "Inbox",
    work: "Work",
    personal: "Personal",
    note: "Note",
    study: "Study",
    none: "Inbox",
};

const priorityColorMap: Record<string, string> = {
    none: "#9BA2AB",
    low: "#2F6BFF",
    medium: "#F2B233",
    high: "#E24A4A",
};

export default function SubtaskEditModal({
    visible,
    task,
    onClose,
}: TaskEditModalProps) {
    const [taskForm, setTaskForm] = useState<TaskFormModel>({
        taskname: "",
        note: "",
        date: "",
        time: "",
        reminder: "",
        repeat: "",
        priorityLevel: "none",
        taskId: "",
        taskType: "none",
        tags: "",
        status: "pending",
    });
    const [blocks, setBlocks] = useState<Block[]>([]);
    const editorRef = useRef<RichEditor | null>(null);
    const [linkModalVisible, setLinkModalVisible] = useState(false);
    const [linkTitle, setLinkTitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");

    const [priorityVisible, setPriorityVisible] = useState(false);
    const [taskTypeVisible, setTaskTypeVisible] = useState(false);
    const [showDate, setShowDate] = useState(false);

    useEffect(() => {
        const nextForm: TaskFormModel = {
            id: task?.id,
            taskname: task?.taskname ?? "",
            note: task?.note ?? "",
            date: task?.date ?? "",
            time: task?.time ?? "",
            reminder: task?.reminder ?? "",
            repeat: task?.repeat ?? "",
            priorityLevel: task?.priorityLevel ?? "none",
            taskId: task?.taskId ?? "",
            taskType: task?.taskType ?? "none",
            tags: task?.tags ?? "",
            status: task?.status ?? "pending",
        };
        setTaskForm(nextForm);
        if (editorRef.current) {
            editorRef.current.setContentHTML(nextForm.note);
        }
    }, [task]);

    useEffect(() => {
        const getNotes = async () => {
            try {
                if (task?.id) {
                    const res = await getNotesByTaskId(task.id);
                    console.log('NOTES', res);
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        getNotes();
    }, [task]);

    const headerDate = useMemo(() => formatHeaderDate(taskForm.date), [taskForm.date]);
    const taskDate = taskForm.date ?? "";

    const addBlock = (type: BlockType) => {
        setBlocks((prev) => [...prev, createBlock(type)]);
    };

    const disableSpellcheck = () => {
        editorRef.current?.commandDOM(
            "document.body.setAttribute('spellcheck','false');document.documentElement.setAttribute('spellcheck','false');const editor=document.querySelector('[contenteditable=true]');if(editor){editor.setAttribute('spellcheck','false');}"
        );
    };

    const openLinkModal = () => {
        setLinkModalVisible(true);
    };

    const closeLinkModal = () => {
        setLinkModalVisible(false);
        setLinkTitle("");
        setLinkUrl("");
    };

    const handleInsertLink = () => {
        const rawUrl = linkUrl.trim();
        if (!rawUrl) return;
        const normalizedUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
        const title = linkTitle.trim() || normalizedUrl;
        editorRef.current?.insertLink(title, normalizedUrl);
        closeLinkModal();
    };

    const taskTypeLabel = taskTypeLabelMap[(taskForm.taskType ?? "none").toLowerCase()] ?? "Inbox";

    const isNotPastDate = (dateStr: string): boolean => {
        const [year, month, day] = dateStr.split("-").map(Number);

        const inputDate = new Date(year, month - 1, day);
        inputDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return inputDate >= today;
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

    const editableTags = taskForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag && tag !== "#");


    async function editTask() {
        onClose();
        console.log(taskForm);

        try {
            await updateSubTask(taskForm);
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <SafeAreaView className='flex-1 bg-white' style={{ paddingTop: 0 }}>
                <KeyboardAvoidingView
                    className='flex-1'
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View className='px-4 pt-3 pb-3 border-b border-gray-100'>
                        <View className='flex-row items-center justify-between'>
                            <View className='flex-row items-center gap-x-4'>
                                <TouchableOpacity onPress={editTask}>
                                    <ArrowLeft size={22} color="#222" strokeWidth={2} className="opacity-70" />
                                </TouchableOpacity>
                                <View className='flex-row items-center gap-x-1'>
                                    <Text onPress={() => setTaskTypeVisible(true)} className='text-[16.5px] font-semibold text-[#222]'>{taskTypeLabel}</Text>
                                    <ChevronsUpDown size={16} color="#6b7280" />
                                </View>
                            </View>
                            <View className="flex-row items-center gap-x-5">
                                <TouchableOpacity onPress={() => setPriorityVisible(true)}>
                                    <Flag size={21} color={priorityColorMap[taskForm.priorityLevel] ?? "#9BA2AB"} />
                                </TouchableOpacity>
                                <AppIcon name="EllipsisVertical" color="#6b7280" size={21} />
                            </View>
                        </View>

                        <View className='flex-row items-center gap-x-2 mt-[23px]'>
                            <View className='flex-row items-center gap-x-[14px]'>
                                <View
                                    className="-translate-y-2"
                                    style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 5,
                                        borderWidth: 1.5,
                                        borderColor: taskForm.status !== "pending" ? "transparent" : priorityColorMap[taskForm.priorityLevel],
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Checkbox
                                        value={taskForm.status !== "pending"}
                                        onValueChange={(value) =>
                                            setTaskForm((prev) => ({
                                                ...prev,
                                                status: value ? "complete" : "pending",
                                            }))
                                        }
                                        color={taskForm.status !== "pending" ? '#4772FA' : "transparent"}
                                        style={{ width: 18, height: 18, borderRadius: 4 }}
                                    />
                                </View>
                                <View className="gap-y-[3px]">
                                    <Text onPress={() => setShowDate(true)} className={`text-[15.5px] ${taskDate && isNotPastDate(taskDate) ? 'text-primary' : 'text-red-500'}`}>{headerDate}{taskForm.time != 'None' ? ',' : ''} {taskForm.time != 'None' ? taskForm.time : ''}</Text>
                                    {taskForm.reminder != 'None' ? (
                                        <View className="flex-row items-center gap-x-1">
                                            <Text className="text-gray-500 text-[11px]">{taskForm.repeat}</Text>
                                            <Repeat size={11} color="#9E9E9E" />
                                        </View>
                                    ) : null}

                                </View>
                            </View>
                        </View>
                    </View>

                    <ScrollView className='flex-1 px-4 pt-2' contentContainerStyle={{ paddingBottom: 140 }}>
                        <TextInput
                            className='text-[22px] font-semibold text-[#111]'
                            placeholder='Task name'
                            placeholderTextColor='#9ca3af'
                            value={taskForm.taskname}
                            onChangeText={(value) =>
                                setTaskForm((prev) => ({ ...prev, taskname: value }))
                            }
                        />

                        <View className='-translate-y-1'>
                            <RichEditor
                                ref={editorRef}
                                placeholder="Write Note ..."
                                initialContentHTML={taskForm.note}
                                onChange={(value) =>
                                    setTaskForm((prev) => ({ ...prev, note: value }))
                                }
                                editorInitializedCallback={disableSpellcheck}
                                editorStyle={{
                                    backgroundColor: "#fff",
                                    color: "#222",
                                    contentCSSText: `
      body {
        font-size: 16px;
        line-height: 24px;
      }
      p {
        line-height: 24px;
        margin: 0;
      }
      div {
        line-height: 24px;
      }
    `,
                                }}
                                style={{ minHeight: 120 }}
                            />

                        </View>

                        {blocks.length > 0 && (
                            <View className='mt-4'>
                                {blocks.map((block) => (
                                    <View key={block.id} className='mb-4'>
                                        <Text className='text-[12px] uppercase text-gray-400 mb-1'>
                                            {block.type}
                                        </Text>
                                        <TextInput
                                            className='text-[15px] text-[#111]'
                                            placeholder={`Add ${block.type}`}
                                            placeholderTextColor='#9ca3af'
                                            multiline
                                            value={block.text}
                                            onChangeText={(text) =>
                                                setBlocks((prev) =>
                                                    prev.map((b) => (b.id === block.id ? { ...b, text } : b))
                                                )
                                            }
                                        />
                                    </View>
                                ))}
                            </View>
                        )}

                        <View className="mt-[7.5px] px-2 flex-row items-center gap-x-1 flex-wrap">
                            {editableTags.map((tag, index) => (
                                <TextInput
                                    key={`${tag}-${index}`}
                                    value={`#${tag}`}
                                    onChangeText={(value) => {
                                        const nextValue = value.replace(/^#/, "").trim();
                                        setTaskForm((prev) => {
                                            const nextTags = prev.tags
                                                .split(",")
                                                .map((t) => t.trim())
                                                .filter((t) => t && t !== "#");
                                            nextTags[index] = nextValue;
                                            return {
                                                ...prev,
                                                tags: nextTags.filter(Boolean).join(","),
                                            };
                                        });
                                    }}
                                    className="text-[12px] text-[#374151] bg-[#F3F4F6] px-2 py-1 rounded-full min-w-[30px]"
                                    placeholder="#tag"
                                    placeholderTextColor="#9CA3AF"
                                />
                            ))}
                        </View>

                    </ScrollView>

                    <View className='absolute bottom-0 left-0 right-0 bg-white px-4 py-3'>
                        <View className='flex-row items-center gap-x-5'>
                            <View style={{ flex: 1, minWidth: 0 }}>
                                <RichToolbar
                                    editor={editorRef}
                                    actions={[
                                        actions.setBold,
                                        actions.setItalic,
                                        actions.setUnderline,
                                        actions.insertOrderedList,
                                        actions.insertBulletsList,
                                        actions.insertLink,
                                        actions.alignRight,
                                        actions.alignLeft,
                                        actions.alignCenter,
                                        actions.heading1,
                                        actions.heading2,
                                        actions.heading3,
                                        actions.heading4,
                                        actions.heading5,
                                        actions.heading6,
                                    ]}
                                    onInsertLink={openLinkModal}
                                    iconTint="#7E8591"
                                    selectedIconTint="#222"
                                    iconMap={{
                                        [actions.heading1]: ({ tintColor }: { tintColor?: string }) => (
                                            <Text style={{ color: tintColor, fontSize: 13, fontWeight: "400" }}>H1</Text>
                                        ),
                                        [actions.heading2]: ({ tintColor }: { tintColor?: string }) => (
                                            <Text style={{ color: tintColor, fontSize: 13, fontWeight: "400" }}>H2</Text>
                                        ),
                                        [actions.heading3]: ({ tintColor }: { tintColor?: string }) => (
                                            <Text style={{ color: tintColor, fontSize: 13, fontWeight: "400" }}>H3</Text>
                                        ),
                                        [actions.heading4]: ({ tintColor }: { tintColor?: string }) => (
                                            <Text style={{ color: tintColor, fontSize: 13, fontWeight: "400" }}>H4</Text>
                                        ),
                                        [actions.heading5]: ({ tintColor }: { tintColor?: string }) => (
                                            <Text style={{ color: tintColor, fontSize: 13, fontWeight: "400" }}>H5</Text>
                                        ),
                                        [actions.heading6]: ({ tintColor }: { tintColor?: string }) => (
                                            <Text style={{ color: tintColor, fontSize: 13, fontWeight: "400" }}>H6</Text>
                                        ),
                                    }}
                                    style={{ backgroundColor: "transparent", borderWidth: 0 }}
                                />
                            </View>
                            <Pressable onPress={() => addBlock("document")}>
                                <Paperclip size={18} color="#7E8591" />
                            </Pressable>
                            <Pressable onPress={() => addBlock("image")}>
                                <Camera size={18} color="#7E8591" />
                            </Pressable>
                        </View>
                    </View>

                    {/* link model */}
                    <Modal
                        transparent
                        animationType="fade"
                        visible={linkModalVisible}
                        onRequestClose={closeLinkModal}
                    >
                        <View className='flex-1 items-center justify-center bg-black/40 px-6'>
                            <View className='w-full rounded-3xl bg-white px-6 pt-7 pb-6'>
                                <Text className='text-[17px] font-semibold text-[#111]'>Add URL</Text>
                                <TextInput
                                    className='mt-4 rounded-xl bg-gray-100 px-4 py-4 text-[15px] text-[#111]'
                                    placeholder='Title (optional)'
                                    placeholderTextColor='#9ca3af'
                                    value={linkTitle}
                                    onChangeText={setLinkTitle}
                                />
                                <TextInput
                                    className='mt-3 rounded-xl bg-gray-100 px-4 py-4 text-[15px] text-[#111]'
                                    placeholder='https://example.com'
                                    placeholderTextColor='#9ca3af'
                                    keyboardType='url'
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    value={linkUrl}
                                    onChangeText={setLinkUrl}
                                />
                                <View className='mt-5 flex-row items-center justify-end gap-x-1'>
                                    <Pressable onPress={closeLinkModal} className='px-3 py-2'>
                                        <Text className='text-[16px] text-gray-400'>Cancel</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={handleInsertLink}
                                        className='px-2 py-2'
                                    >
                                        <Text className='text-[16px] font-semibold text-primary'>Insert</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* priority model */}
                    <PriorityModal
                        visible={priorityVisible}
                        selectedPriority={taskForm.priorityLevel}
                        onClose={() => setPriorityVisible(false)}
                        onSelect={(p) =>
                            setTaskForm((prev) => ({ ...prev, priorityLevel: p }))
                        }
                    />

                    {/* task type model */}
                    <TaskTypeModal
                        visible={taskTypeVisible}
                        selectedTaskType={taskForm.taskType}
                        onClose={() => setTaskTypeVisible(false)}
                        onSelect={(t) =>
                            setTaskForm((prev) => ({ ...prev, taskType: t }))
                        }
                    />

                    <CustomCalendarModal
                        visible={showDate}
                        date={taskForm.date}
                        choooseDate={(d) =>
                            setTaskForm((prev) => ({ ...prev, date: d }))
                        }
                        onClose={() => setShowDate(false)}
                        selectedTime={taskForm.time}
                        setSelectedTime={(t) =>
                            setTaskForm((prev) => ({ ...prev, time: t }))
                        }
                        selectedReminder={taskForm.reminder}
                        setSelectedReminder={(r) =>
                            setTaskForm((prev) => ({ ...prev, reminder: r }))
                        }
                        selectedRepeat={taskForm.repeat}
                        setSelectedRepeat={(rt) =>
                            setTaskForm((prev) => ({ ...prev, repeat: rt }))
                        }
                    />

                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}