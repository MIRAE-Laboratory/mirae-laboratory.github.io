import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

// Firebase configuration
// Replace these values with your Firebase project config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Collections ---
const questionsCol = () => collection(db, "qc_questions");
const metaDoc = () => doc(db, "qc_meta", "state");

// --- Questions CRUD ---
export const subscribeQuestions = (callback) => {
  const q = query(questionsCol(), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
};

export const addQuestion = async (text) => {
  await addDoc(questionsCol(), {
    text,
    createdAt: Date.now(),
  });
};

export const deleteQuestion = async (id) => {
  await deleteDoc(doc(db, "qc_questions", id));
};

export const deleteAllQuestions = async (questions) => {
  const promises = questions.map((q) =>
    deleteDoc(doc(db, "qc_questions", q.id))
  );
  await Promise.all(promises);
};

// --- Meta (summary & generated) ---
export const subscribeMeta = (callback) => {
  return onSnapshot(metaDoc(), (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    } else {
      callback({ summary: "", generated: "" });
    }
  });
};

export const updateMeta = async (fields) => {
  await setDoc(metaDoc(), fields, { merge: true });
};

export const getMeta = async () => {
  const snap = await getDoc(metaDoc());
  return snap.exists() ? snap.data() : { summary: "", generated: "" };
};
