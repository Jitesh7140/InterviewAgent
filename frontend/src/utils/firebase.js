import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,  
  authDomain: "interviewagent-ab5f4.firebaseapp.com",
  projectId: "interviewagent-ab5f4",
  storageBucket: "interviewagent-ab5f4.firebasestorage.app",
  messagingSenderId: "726602416990",
  appId: "1:726602416990:web:e217809a14feee11d905cf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const Auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { Auth, provider };
