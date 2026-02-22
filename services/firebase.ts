
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmTcNMlhY5eSkbxf_EnT9akmN7jpgkSYI",
  authDomain: "second-brain-142aa.firebaseapp.com",
  projectId: "second-brain-142aa",
  storageBucket: "second-brain-142aa.appspot.com",
  messagingSenderId: "1011652142359",
  appId: "1:1011652142359:web:46a5a1386884d5de18c352"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Placeholder function for saving data to Firestore is removed as we are not using it yet.
export const saveNoteToFirestore = async (userId: string, note: { title: string, content: string }) => {
  if (!userId) return;
  const notesCollection = collection(db, `users/${userId}/notes`);
  const newNote = {
    ...note,
    createdAt: new Date(),
  };
  return await addDoc(notesCollection, newNote);
};
