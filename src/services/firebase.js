import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously as firebaseSignInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBjdCQ7hZRLnuyc00ALQ52c1QKXOrtI89M",
  authDomain: "passbook-e2a9e.firebaseapp.com",
  projectId: "passbook-e2a9e",
  storageBucket: "passbook-e2a9e.firebasestorage.app",
  messagingSenderId: "21930498184",
  appId: "1:21930498184:web:46f933445a52be5512e73d",
  measurementId: "G-KW9B9VQ81B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// התחברות אנונימית
export const signInAnonymously = () => firebaseSignInAnonymously(auth);

// הרשמה באימייל וסיסמה
export const signUpWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// התחברות באימייל וסיסמה
export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// התחברות עם גוגל
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// התנתקות
export const signOutUser = () => signOut(auth);

export { auth };