// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// ✅ Use the SAME Firebase project for both authentication and database
// This matches your firebaseAuth.ts configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQht7omyqofEubwmWJ90rsfZoEmxvIgCs",
  authDomain: "hydro-aid.firebaseapp.com",
  projectId: "hydro-aid",
  storageBucket: "hydro-aid.appspot.com",
  messagingSenderId: "1064760985523",
  appId: "1:1064760985523:web:378df2c0f4c1d39d25adc6",
  measurementId: "G-WY0DED9S0Q",
};

// ✅ Initialize Firebase once (default app) for Firestore/Storage (HydroAid project)
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// ✅ Export Firestore, Storage, and Auth
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);