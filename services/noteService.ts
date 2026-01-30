import {
    addDoc,
    collection,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

export const getNotesByTaskId = async (id: string) => {
    const notesRef = collection(db, "notes");

    const q = query(notesRef, where("taskId", "==", id));

    const snapshot = await getDocs(q);

    if (snapshot.docs[0]) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as {
            id: string;
            taskId: string | null;
            subtaskId: string | null;
            note: string;
        };
    }
    else {
        return { id: '', taskId: '', subtaskId: '', note: '' };
    }
};

export const AddOrEditNotesByTaskId = async (note: any, taskId: string) => {
    if (!taskId) {
        return;
    }

    const notesRef = collection(db, "notes");

    const q = query(notesRef, where("taskId", "==", taskId));

    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
        await updateDoc(snapshot.docs[0].ref, {
            note: note.note,
        });
    } else {
        await addDoc(collection(db, "notes"), {
            taskId: taskId,
            subtaskId: null,
            note: note.note,
        });
    }
};
