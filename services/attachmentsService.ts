import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

export const addAttachmentsForTask = async (notes: any[], taskId: string) => {
  const ids = notes.map((n) => n.id);

  const notesRef = collection(db, "attachments");
  const q = query(notesRef, where("taskId", "==", taskId));

  const snapshot = await getDocs(q);
  const existingDocs = snapshot.docs;
  const existingIdSet = new Set(existingDocs.map((docItem) => docItem.id));

  const shouldBeDeleteNotes = existingDocs.filter(
    (docItem) => !ids.includes(docItem.id),
  );
  for (let i = 0; i < shouldBeDeleteNotes.length; i++) {
    const element = shouldBeDeleteNotes[i];
    await deleteDoc(doc(db, "attachments", element.id));
  }

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const sequenceNo = i + 1;

    if (existingIdSet.has(note.id)) {
      await updateDoc(doc(db, "attachments", note.id), { sequenceNo });
      continue;
    }

    if (String(note.id).startsWith("note-")) {
      await addDoc(collection(db, "attachments"), {
        taskId: taskId,
        subtaskId: note.subtaskId ?? null,
        content: note.content,
        contentType: note.contentType,
        name: note.name,
        size: note.size,
        sequenceNo,
        isUploading: false,
        uploadError: false,
        createdAt: new Date(),
      });
    }
  }
};

export const getAttachmentsByTaskId = async (id: string) => {
  const notesRef = collection(db, "attachments");

  const q = query(notesRef, where("taskId", "==", id));

  const snapshot = await getDocs(q);

  const attachments = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return attachments.sort((a: any, b: any) => {
    const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
    const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
    return aTime - bTime;
  });
};
