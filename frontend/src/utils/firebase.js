import { initializeApp } from "firebase/app"; 
import {getAuth , GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "interviewagent-dd5f5.firebaseapp.com",
  projectId: "interviewagent-dd5f5",
  storageBucket: "interviewagent-dd5f5.firebasestorage.app",
  messagingSenderId: "785907043890",
  appId: "1:785907043890:web:84016fdf57afc23ecab62b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const Auth = getAuth(app);

const provider = new GoogleAuthProvider(); 

export {Auth , provider};