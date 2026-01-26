import { AppIcon } from "@/components/ui/icon-symbol";
import Checkbox from "expo-checkbox";
import {
  ArrowLeft,
  Bold,
  Camera,
  ChevronsUpDown,
  Flag,
  Italic,
  Link2,
  List,
  ListOrdered,
  Paperclip,
  Underline,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";

type TaskEditModalProps = {
  visible: boolean;
  task: any | null;
  onClose: () => void;
  onAddSubtask: () => void;
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

export default function TaskEditModal({
  visible,
  task,
  onClose,
  onAddSubtask,
}: TaskEditModalProps) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [noteHeight, setNoteHeight] = useState(96);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [checked, setChecked] = useState(false);
  const [priority, setPriority] = useState("none");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [caseMode, setCaseMode] = useState<"none" | "upper" | "lower">("none");

  useEffect(() => {
    setTitle(task?.taskname ?? "");
    setNote(task?.note ?? "");
    setChecked(task?.status ? task.status !== "pending" : false);
    setPriority(task?.priorityLevel ?? "none");
  }, [task]);

  const headerDate = useMemo(() => formatHeaderDate(task?.date), [task?.date]);
  const taskDate = task?.date ?? "";

  const addBlock = (type: BlockType) => {
    setBlocks((prev) => [...prev, createBlock(type)]);
  };

  const togglePriority = () => {
    setPriority((prev) => {
      if (prev === "none") return "low";
      if (prev === "low") return "medium";
      if (prev === "medium") return "high";
      return "none";
    });
  };

  const taskTypeLabel = taskTypeLabelMap[(task?.taskType ?? "none").toLowerCase()] ?? "Inbox";

  const isNotPastDate = (dateStr: string): boolean => {
    const [year, month, day] = dateStr.split("-").map(Number);

    const inputDate = new Date(year, month - 1, day);
    inputDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate >= today;
  };

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
                <TouchableOpacity onPress={onClose}>
                  <ArrowLeft size={22} color="#222" strokeWidth={2} className="opacity-70" />
                </TouchableOpacity>
                <View className='flex-row items-center gap-x-1'>
                  <Text className='text-[16.5px] font-semibold text-[#222]'>{taskTypeLabel}</Text>
                  <ChevronsUpDown size={16} color="#6b7280" />
                </View>
              </View>
              <View className="flex-row items-center gap-x-5">
                <TouchableOpacity onPress={togglePriority}>
                  <Flag size={21} color={priorityColorMap[priority] ?? "#9BA2AB"} />
                </TouchableOpacity>
                <AppIcon name="EllipsisVertical" color="#6b7280" size={21} />
              </View>
            </View>

            <View className='flex-row items-center gap-x-2 mt-[23px]'>
              <View className='flex-row items-center gap-x-3'>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    borderWidth: 1.5,
                    borderColor: checked ? "transparent" : priorityColorMap[priority],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Checkbox
                    value={checked}
                    onValueChange={setChecked}
                    color={checked ? '#4772FA' : "transparent"}
                    style={{ width: 18, height: 18, borderRadius: 4 }}
                  />
                </View>
                <Text className={`text-[15.5px] ${taskDate && isNotPastDate(taskDate) ? 'text-primary' : 'text-red-500'}`}>{headerDate}</Text>
              </View>
            </View>
          </View>

          <ScrollView className='flex-1 px-4 pt-4' contentContainerStyle={{ paddingBottom: 140 }}>
            <TextInput
              className='text-[22px] font-semibold text-[#111]'
              placeholder='Task name'
              placeholderTextColor='#9ca3af'
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              className='mt-3 text-[16px] text-[#222]'
              placeholder='Description'
              placeholderTextColor='#9ca3af'
              multiline
              scrollEnabled={false}
              value={note}
              onChangeText={setNote}
              onContentSizeChange={(e) =>
                setNoteHeight(Math.max(96, e.nativeEvent.contentSize.height))
              }
              style={{
                height: noteHeight,
                fontWeight: bold ? "600" : "400",
                fontStyle: italic ? "italic" : "normal",
                textDecorationLine: underline ? "underline" : "none",
                textTransform:
                  caseMode === "upper"
                    ? "uppercase"
                    : caseMode === "lower"
                      ? "lowercase"
                      : "none",
              }}
            />

            <View className='mt-4'>
              <TouchableOpacity onPress={onAddSubtask} className='flex-row items-center gap-x-2 py-2'>
                <AppIcon name="Plus" size={18} color="#6b7280" />
                <Text className='text-[15px] text-[#6b7280]'>Add subtask</Text>
              </TouchableOpacity>
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
          </ScrollView>

          <View className='absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-4 py-3'>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className='flex-row items-center gap-x-5'>
                <Pressable onPress={() => setBold((prev) => !prev)}>
                  <Bold size={18} color={bold ? "#222" : "#6b7280"} />
                </Pressable>
                <Pressable onPress={() => setItalic((prev) => !prev)}>
                  <Italic size={18} color={italic ? "#222" : "#6b7280"} />
                </Pressable>
                <Pressable onPress={() => setUnderline((prev) => !prev)}>
                  <Underline size={18} color={underline ? "#222" : "#6b7280"} />
                </Pressable>
                <Pressable onPress={() => setCaseMode((prev) => (prev === "upper" ? "none" : "upper"))}>
                  <Text className='text-[14px] font-semibold text-[#6b7280]'>AA</Text>
                </Pressable>
                <Pressable onPress={() => setCaseMode((prev) => (prev === "lower" ? "none" : "lower"))}>
                  <Text className='text-[14px] font-semibold text-[#6b7280]'>aa</Text>
                </Pressable>
                <Pressable onPress={() => addBlock("link")}>
                  <Link2 size={18} color="#6b7280" />
                </Pressable>
                <Pressable onPress={() => addBlock("document")}>
                  <Paperclip size={18} color="#6b7280" />
                </Pressable>
                <Pressable onPress={() => addBlock("image")}>
                  <Camera size={18} color="#6b7280" />
                </Pressable>
                <Pressable onPress={() => addBlock("number")}>
                  <ListOrdered size={18} color="#6b7280" />
                </Pressable>
                <Pressable onPress={() => addBlock("bullet")}>
                  <List size={18} color="#6b7280" />
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}