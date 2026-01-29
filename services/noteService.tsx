import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";

export const addNotesForTask = async (notes: any[], taskId: string) => {

    console.log(notes,taskId)

    const ids = notes.map((n) => n.id)

    const notesRef = collection(db, "notes");
    const q = query(notesRef,
        where('taskId', '==', taskId)
    );

    const snapshot = await getDocs(q);

    const sequenceShouldUpdateNotes = snapshot.docs.filter((doc) => ids.includes(doc.id));

    let no = 0;
    for (let i = 0; i < sequenceShouldUpdateNotes.length; i++) {
        const element = sequenceShouldUpdateNotes[i];
        await updateDoc(doc(db, 'note', element.id), { sequenceNo: i + 1 })
        no++;
    }

    const shouldBeDeleteNotes = snapshot.docs.filter((doc) => !ids.includes(doc.id));

    for (let i = 0; i < shouldBeDeleteNotes.length; i++) {
        const element = shouldBeDeleteNotes[i];
        await deleteDoc(doc(db, 'note', element.id))
    }

    const shouldBeAddNotes = notes.filter((note) => String(note.id).startsWith('note-'));

    for (let i = 0; i < shouldBeAddNotes.length; i++) {
        no++;
        const element = shouldBeAddNotes[i];
        await addDoc(collection(db, 'note'), {
            taskId: taskId,
            subtaskId: null,
            content: element.id,
            contentType: element.contentType,
            name: element.name,
            size: element.size,
            sequenceNo: no,
            isUploading: false,
            uploadError: false,
        })
    }
};