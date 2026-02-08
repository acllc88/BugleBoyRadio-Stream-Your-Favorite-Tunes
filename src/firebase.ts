import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6e9fIbHQvCcF5CX5QsZ_6DQNRgVQ7i1k",
  authDomain: "bugleboyradio.firebaseapp.com",
  projectId: "bugleboyradio",
  storageBucket: "bugleboyradio.firebasestorage.app",
  messagingSenderId: "90667224681",
  appId: "1:90667224681:web:8de1b9f01dc24e34d75cf8",
  measurementId: "G-Z300YZ8Q8K",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
