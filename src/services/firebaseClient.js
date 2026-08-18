import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your live Firebase Web App configuration from console.firebase.google.com
export const firebaseConfig = {
  apiKey: "AIzaSyBYSCFATM9-J6JeExm1jyeG9xNzwfqCPKM",
  authDomain: "grozo-control-tower.firebaseapp.com",
  projectId: "grozo-control-tower",
  storageBucket: "grozo-control-tower.firebasestorage.app",
  messagingSenderId: "631946189792",
  appId: "1:631946189792:web:5f284268e9f15f1b61e985",
  measurementId: "G-4RLZ7ZTC1D"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore & Auth instances
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("🔥 Live Firebase & Cloud Firestore connected to project: grozo-control-tower");
