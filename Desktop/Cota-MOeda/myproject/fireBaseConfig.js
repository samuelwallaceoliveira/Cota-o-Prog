// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0UWCh4lzbPhZNM5lvpWVewjbU8W4tdKk",
  authDomain: "asamuelfirebase.firebaseapp.com",
  projectId: "asamuelfirebase",
  storageBucket: "asamuelfirebase.firebasestorage.app",
  messagingSenderId: "896025683789",
  appId: "1:896025683789:web:e4eae7cae1b2f28718f904"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 