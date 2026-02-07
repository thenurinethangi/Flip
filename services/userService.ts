import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

export type UserProfile = {
  id: string;
  userId: string;
  avatar?: string;
  name?: string;
  email?: string;
};

export const getUser = async (userId: string): Promise<UserProfile[]> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("userId", "==", userId));
  const usersDocs = await getDocs(q);

  return usersDocs.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<UserProfile, "id">),
  }));
};

export const updateUser = async (userData: UserProfile) => {
  await updateDoc(doc(db, "users", userData.id), {
    avatar: userData.avatar,
    name: userData.name,
  });
};

export const createUser = async (userData: UserProfile) => {
  const docRef = await addDoc(collection(db, "users"), {
    userId: userData.userId,
    avatar: userData.avatar,
    name: userData.name,
    email: userData.email,
  });
  return docRef.id;
};

export const deleteUserProfile = async (userDocId: string) => {
  await deleteDoc(doc(db, "users", userDocId));
};

export const subscribeUser = (
  userId: string,
  onUser: (user: UserProfile | null) => void,
  onError?: (error: Error) => void,
) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("userId", "==", userId));

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onUser(null);
        return;
      }
      const docSnap = snapshot.docs[0];
      onUser({
        id: docSnap.id,
        ...(docSnap.data() as Omit<UserProfile, "id">),
      });
    },
    (error) => {
      if (onError) onError(error as Error);
    },
  );
};
