import { AppIcon } from "@/components/ui/icon-symbol";
import { addAttachmentsForSubtask, getAttachmentsBySubtaskId } from "@/services/attachmentsService";
import { AddOrEditNotesBySubtaskId, getNotesBySubtaskId } from "@/services/noteService";
import { updateSubTask } from "@/services/subtaskService";
import Checkbox from "expo-checkbox";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import {
    AlarmClock,
    ArrowLeft,
    Camera,
    ChevronsUpDown,
    CircleCheckBig,
    Flag,
    Paperclip,
    Repeat,
    Timer,
    X,
} from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import { SafeAreaView } from "react-native-safe-area-context";
import CameraModel from "./Camera";
import CustomCalendarModal from "./DatePickerModal";
import DeleteModal from "./DeleteModal";
import PriorityModal from "./PriorityModal";
import TaskTypeModal from "./TaskTypeModal";
import Spinner from "./spinner";
import { getFocusTimeAndPomoCountByTask } from "@/services/focusService";

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

type Notes = {
    id: string;
    taskId: string | null;
    subtaskId: string | null;
    note: string;
};

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

    const [isloading, setIsloading] = useState(true);

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

    const [attachments, setAttachments] = useState<any[]>([]);
    const [notes, setNotes] = useState<Notes>({
        id: "",
        taskId: null,
        subtaskId: null,
        note: "",
    });

    const editorRef = useRef<RichEditor | null>(null);
    const prevSubtaskIdRef = useRef<string | null>(null);
    const [linkModalVisible, setLinkModalVisible] = useState(false);
    const [linkTitle, setLinkTitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");

    const [priorityVisible, setPriorityVisible] = useState(false);
    const [taskTypeVisible, setTaskTypeVisible] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const [showCameraModel, setShowCameraModel] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [attachmentsLoaded, setAttachmentsLoaded] = useState(false);
    const [notesLoaded, setNotesLoaded] = useState(false);

    const [image, setImage] = useState<string>("");

    const [focusAndPomos, setFocusAndPomos] = useState({
        count: 0,
        totalMinutes: 0
    });

    useEffect(() => {
        const checkFocusTimeAndPomos = async () => {
            if (!task?.id) {
                return;
            }
            try {
                const { count, totalMinutes } = await getFocusTimeAndPomoCountByTask(task?.id);
                setFocusAndPomos({
                    count,
                    totalMinutes
                });
            }
            catch (e) {
                console.log(e);
            }
        }
        checkFocusTimeAndPomos();
    }, [task]);

    useEffect(() => {
        if (!visible) {
            prevSubtaskIdRef.current = null;
            return;
        }

        const subtaskId = task?.id ?? null;
        if (subtaskId && prevSubtaskIdRef.current !== subtaskId) {
            prevSubtaskIdRef.current = subtaskId;
            setIsloading(true);
            setAttachments([]);
            setNotes({ id: "", taskId: null, subtaskId: null, note: "" });
            setAttachmentsLoaded(false);
            setNotesLoaded(false);
            if (editorRef.current) {
                editorRef.current.setContentHTML("");
            }
        }
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
    }, [task, visible]);

    useEffect(() => {
        const loadAllData = async () => {
            try {
                if (task?.id) {
                    // Load attachments
                    const attachmentsRes = await getAttachmentsBySubtaskId(task.id);
                    console.log("ATTACH", attachmentsRes);
                    setAttachments(attachmentsRes);
                    setAttachmentsLoaded(true);

                    // Load notes
                    const notesRes: Notes = await getNotesBySubtaskId(task.id);
                    console.log("NOTES", notesRes);
                    setNotes({
                        ...notesRes,
                        taskId: null,
                        subtaskId: task.id,
                    });
                    setNotesLoaded(true);

                    if (editorRef.current && notesRes.note) {
                        editorRef.current.setContentHTML(notesRes.note);
                    }
                    else if (editorRef.current) {
                        editorRef.current.setContentHTML("");
                    }

                }
                else {
                    setAttachments([]);
                    setNotes({ id: "", taskId: null, subtaskId: null, note: "" });
                    if (editorRef.current) {
                        editorRef.current.setContentHTML("");
                    }
                    setAttachmentsLoaded(true);
                    setNotesLoaded(true);
                }
            }
            catch (e) {
                console.log(e);
                setAttachments([]);
                setNotes({ id: "", taskId: null, subtaskId: null, note: "" });
                if (editorRef.current) {
                    editorRef.current.setContentHTML("");
                }
                setAttachmentsLoaded(true);
                setNotesLoaded(true);
            }
        };

        if (visible && task?.id) {
            loadAllData();
        }
        if (visible && !task?.id) {
            setIsloading(false);
            setAttachmentsLoaded(true);
            setNotesLoaded(true);
        }
    }, [task, visible]);

    useEffect(() => {
        if (!visible || !task?.id) return;
        if (attachmentsLoaded && notesLoaded) {
            setIsloading(false);
        }
    }, [attachmentsLoaded, notesLoaded, task?.id, visible]);

    const headerDate = useMemo(() => formatHeaderDate(taskForm.date), [taskForm.date]);
    const taskDate = taskForm.date ?? "";

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

    const formatBytes = (bytes: number) => {
        if (!bytes || bytes <= 0) return "0 B";
        const units = ["B", "KB", "MB", "GB"];
        const index = Math.min(
            Math.floor(Math.log(bytes) / Math.log(1024)),
            units.length - 1,
        );
        const value = bytes / Math.pow(1024, index);
        return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
    };

    const removeNote = (noteId: string) => {
        setAttachments((prev) => prev.filter((note) => note.id !== noteId));
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
            await addAttachmentsForSubtask(attachments, taskForm.id || "");
            await AddOrEditNotesBySubtaskId(
                { ...notes, taskId: null, subtaskId: taskForm.id || null },
                taskForm.id || "",
            );
        }
        catch (e) {
            console.log(e);
        }
    }

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets[0];

            console.log("File:", file);

            const noteId = `note-${Date.now()}-${Math.random()}`;
            const localNote = {
                id: noteId,
                taskId: null,
                subtaskId: task?.id ?? null,
                content: file.uri,
                contentType: file.mimeType || "",
                name: file.name,
                size: typeof file.size === "number" ? file.size : 0,
                sequenceNo: 0,
                isUploading: true,
                uploadError: false,
            };

            setAttachments((prev) => {
                const nextSequence = prev.length + 1;
                return [...prev, { ...localNote, sequenceNo: nextSequence }];
            });

            uploadToCloudinary(file.uri, file.mimeType || "", file.name)
                .then((secure_url) => {
                    setAttachments((prev) =>
                        prev.map((note) =>
                            note.id === noteId
                                ? { ...note, content: secure_url, isUploading: false }
                                : note,
                        ),
                    );
                })
                .catch((err) => {
                    console.log("Upload error:", err);
                    setAttachments((prev) =>
                        prev.map((note) =>
                            note.id === noteId
                                ? { ...note, isUploading: false, uploadError: true }
                                : note,
                        ),
                    );
                });
        } catch (err) {
            console.log("File pick error:", err);
        }
    };

    const uploadToCloudinary = async (
        fileUri: string,
        fileType: string,
        fileName: string,
    ) => {
        const data: FormData = new FormData();
        data.append("file", {
            uri: fileUri,
            type: fileType,
            name: fileName,
        } as any);
        data.append("upload_preset", "task_uploads");

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dbhdjxmh9/auto/upload",
            {
                method: "POST",
                body: data,
            },
        );

        return (await res.json()).secure_url;
    };

    const openFile = async (
        url: string,
        filename?: string,
        mimeType?: string,
    ) => {
        try {
            if (!url) return;

            const isRemote = /^https?:\/\//i.test(url);
            const isPdf =
                typeof mimeType === "string" &&
                mimeType.toLowerCase() === "application/pdf";

            if (isRemote && !isPdf) {
                await Linking.openURL(url);
                return;
            }

            const localPath = isRemote
                ? `${FileSystem.documentDirectory}${filename || `file-${Date.now()}.pdf`}`
                : url;

            if (isRemote) {
                await FileSystem.downloadAsync(url, localPath);
            }

            const fileInfo = await FileSystem.getInfoAsync(localPath);
            if (!fileInfo.exists) {
                console.log("File not found:", localPath, url, filename, mimeType);
                return;
            }

            const localUri =
                Platform.OS === "android"
                    ? await FileSystem.getContentUriAsync(localPath)
                    : localPath;

            await Linking.openURL(localUri);
        } catch (error) {
            console.log("File open error:", error);
        }
    };

    function handleAddClickedImageToNote(url: string) {
        const noteId = `note-${Date.now()}-${Math.random()}`;
        const localNote = {
            id: noteId,
            taskId: null,
            subtaskId: task?.id ?? null,
            content: url,
            contentType: "image/jpg",
            name: "Camera capture",
            size: 0,
            sequenceNo: 0,
            isUploading: true,
            uploadError: false,
        };

        setAttachments((prev) => {
            const nextSequence = prev.length + 1;
            return [...prev, { ...localNote, sequenceNo: nextSequence }];
        });

        uploadToCloudinary(url, "image/jpg", "Camera capture")
            .then((secure_url) => {
                setAttachments((prev) =>
                    prev.map((note) =>
                        note.id === noteId
                            ? { ...note, content: secure_url, isUploading: false }
                            : note,
                    ),
                );
            })
            .catch((err) => {
                console.log("Upload error:", err);
                setAttachments((prev) =>
                    prev.map((note) =>
                        note.id === noteId
                            ? { ...note, isUploading: false, uploadError: true }
                            : note,
                    ),
                );
            });

        setImage("");
    }

    return (
        <>
            <Modal
                visible={visible && isloading}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={onClose}
            >
                <View className="flex-1 bg-white items-center justify-center">
                    <Spinner />
                </View>
            </Modal>
            <Modal
                visible={visible && !isloading}
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
                                    <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
                                        <AppIcon name="EllipsisVertical" color="#6b7280" size={21} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className='flex-row items-center gap-x-2 mt-[23px]'>
                                <View className='flex-row items-center gap-x-[14px]'>
                                    <View
                                        className={`${taskForm.repeat !== 'None' ? '-translate-y-2' : ''}`}
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
                                        <View className="flex-row gap-x-[5px]">
                                            <Text
                                                onPress={() => setShowDate(true)}
                                                className={`text-[15.5px] ${taskDate && isNotPastDate(taskDate) ? "text-primary" : "text-red-500"} ${taskDate && !isNotPastDate(taskDate) && task?.status === 'complete' ? "text-[#9BA2AB]" : ""}`}
                                            >
                                                {headerDate}
                                                {taskForm.time != "None" ? "," : ""}{" "}
                                                {taskForm.time != "None" ? taskForm.time : ""}
                                            </Text>
                                            {taskForm.reminder !== 'None' ? <AlarmClock color={'#4772FA'} size={17} strokeWidth={1.7}></AlarmClock> : ''}
                                        </View>
                                        {taskForm.repeat != "None" ? (
                                            <View className="flex-row items-center gap-x-1">
                                                <Text className="text-gray-500 text-[11px]">
                                                    {taskForm.repeat}
                                                </Text>
                                                <Repeat size={11} color="#9E9E9E" />
                                            </View>
                                        ) : null}
                                    </View>
                                </View>
                            </View>
                        </View>

                        <ScrollView className='flex-1 px-4 pt-2' contentContainerStyle={{ paddingBottom: 140 }}>

                            {focusAndPomos.count > 0 ? (
                                <View className="flex-row items-center gap-x-2 px-[5px] mb-2">
                                    <View className="flex-row items-center gap-x-1">
                                        <CircleCheckBig size={18} color="#9E9E9E" />
                                        <Text className="text-gray-500 text-[11px]">
                                            {focusAndPomos.count}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center gap-x-1">
                                        <Timer size={19} color="#9E9E9E" />
                                        <Text className="text-gray-500 text-[11px]">
                                            {focusAndPomos.totalMinutes}m
                                        </Text>
                                    </View>
                                </View>
                            ) : null}

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
                                    initialContentHTML={notes.note}
                                    onChange={(value) =>
                                        setNotes((prev) => ({
                                            ...prev,
                                            note: value,
                                            taskId: null,
                                            subtaskId: taskForm.id || prev.subtaskId,
                                        }))
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

                            {attachments.length > 0 && (
                                <View className="mt-4">
                                    {attachments.map((note) => {
                                        const isImage =
                                            typeof note.contentType === "string" &&
                                            note.contentType.startsWith("image/");
                                        const isRemote =
                                            typeof note.content === "string" &&
                                            /^https?:\/\//i.test(note.content);
                                        return (
                                            <TouchableWithoutFeedback
                                                onPress={() =>
                                                    openFile(note.content, note.name, note.contentType)
                                                }
                                            >
                                                <View key={note.id} className="mb-4">
                                                    <View className="bg-gray-100 rounded-2xl p-3">
                                                        {isImage && note.content ? (
                                                            <View className="mb-2 overflow-hidden rounded-xl">
                                                                <Image
                                                                    source={{ uri: note.content }}
                                                                    style={{ width: "100%", height: 160 }}
                                                                    resizeMode="cover"
                                                                />
                                                            </View>
                                                        ) : null}
                                                        <View className="flex-row items-center justify-between">
                                                            <View style={{ flex: 1, paddingRight: 8 }}>
                                                                <Text
                                                                    className="text-[14px] text-[#111]"
                                                                    numberOfLines={1}
                                                                >
                                                                    {note.name || "Attachment"}
                                                                </Text>
                                                                <Text className="text-[12px] text-gray-500">
                                                                    {note.contentType || "file"}
                                                                    {typeof note.size === "number"
                                                                        ? ` • ${formatBytes(note.size)}`
                                                                        : ""}
                                                                    {note.content
                                                                        ? ` • ${isRemote ? "cloud" : "local"}`
                                                                        : ""}
                                                                </Text>
                                                            </View>
                                                            {note.isUploading ? (
                                                                <Text className="text-[12px] text-primary">
                                                                    Uploading...
                                                                </Text>
                                                            ) : null}
                                                            {note.uploadError ? (
                                                                <Text className="text-[12px] text-red-500">
                                                                    Failed
                                                                </Text>
                                                            ) : null}
                                                            {!note.isUploading && !note.uploadError ? (
                                                                <Pressable
                                                                    onPress={() => removeNote(note.id)}
                                                                    hitSlop={8}
                                                                >
                                                                    <X size={16} color="#9CA3AF" />
                                                                </Pressable>
                                                            ) : null}
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        );
                                    })}
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
                                <Pressable onPress={pickFile}>
                                    <Paperclip size={18} color="#7E8591" />
                                </Pressable>
                                <Pressable onPress={() => setShowCameraModel(true)}>
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

                        {/* Camera */}
                        <CameraModel
                            visible={showCameraModel}
                            uploadImage={(url: string) => {
                                setImage(url);
                                handleAddClickedImageToNote(url);
                            }}
                            removeImage={() => setImage("")}
                            onClose={() => {
                                setShowCameraModel(false);
                            }}
                        />

                        <DeleteModal
                            visible={showDeleteModal}
                            onClose={() => setShowDeleteModal(false)}
                            onCloseTaskEditModel={onClose}
                            targetId={task?.id ?? null}
                            targetType="subtask"
                        />

                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>
        </>
    );
}