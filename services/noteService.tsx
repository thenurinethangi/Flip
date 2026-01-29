import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";

export const addNotesForTask = async (notes: any[], taskId: string) => {

    const ids = notes.map((n) => n.id)

    const notesRef = collection(db, "notes");
    const q = query(notesRef,
        where('taskId', '==', taskId)
    );

    const snapshot = await getDocs(q);
    const existingDocs = snapshot.docs;
    const existingIdSet = new Set(existingDocs.map((docItem) => docItem.id));

    const shouldBeDeleteNotes = existingDocs.filter((docItem) => !ids.includes(docItem.id));
    for (let i = 0; i < shouldBeDeleteNotes.length; i++) {
        const element = shouldBeDeleteNotes[i];
        await deleteDoc(doc(db, "notes", element.id));
    }

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const sequenceNo = i + 1;

        if (existingIdSet.has(note.id)) {
            await updateDoc(doc(db, "notes", note.id), { sequenceNo });
            continue;
        }

        if (String(note.id).startsWith("note-")) {
            await addDoc(collection(db, "notes"), {
                taskId: taskId,
                subtaskId: note.subtaskId ?? null,
                content: note.content,
                contentType: note.contentType,
                name: note.name,
                size: note.size,
                sequenceNo,
                isUploading: false,
                uploadError: false,
            });
        }
    }
};