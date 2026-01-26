import { SendHorizontal } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Modal from "react-native-modal";

interface AddSubtaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddSubtask: (payload: { title: string }) => void;
}

const AddSubtaskModal: React.FC<AddSubtaskModalProps> = ({
  visible,
  onClose,
  onAddSubtask,
}) => {
  const [text, setText] = useState<string>("");
  const [height, setHeight] = useState<number>(64);
  const inputRef = useRef<TextInput>(null);

  const handleModalShow = () => {
    inputRef.current?.focus();
  };

  const handleAdd = () => {
    if (!text.trim()) return;
    onAddSubtask({ title: text.trim() });
    setText("");
    onClose();
  };

  return (
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
          <TextInput
            ref={inputRef}
            placeholder="Add subtask"
            placeholderTextColor="#9BA2AB"
            multiline
            value={text}
            onChangeText={setText}
            onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
            style={[styles.input, { height: Math.max(64, height) }]}
          />
          <View style={styles.bottomRow}>
            <View />
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <SendHorizontal color="#fff" fill="#fff" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddSubtaskModal;

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
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
  },
  input: {
    fontSize: 16.5,
    color: "#111",
    paddingVertical: 6,
  },
  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addBtn: {
    backgroundColor: "#2F6BFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 22,
  },
});