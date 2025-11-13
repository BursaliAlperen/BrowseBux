import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD36a9fGxVK6a4VK57wYMSnWLNMz-68InU",
  authDomain: "browbux.firebaseapp.com",
  databaseURL: "https://browbux-default-rtdb.firebaseio.com",
  projectId: "browbux",
  storageBucket: "browbux.firebasestorage.app",
  messagingSenderId: "135970632609",
  appId: "1:135970632609:web:4d86a4073c827f7d2bd1e0",
  measurementId: "G-ZJNNTTJTZM"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };