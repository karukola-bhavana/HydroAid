import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase project used for Google Authentication (HydroAid)
const authConfig = {
  apiKey: "AIzaSyAQht7omyqofEubwmWJ90rsfZoEmxvIgCs",
  authDomain: "hydro-aid.firebaseapp.com",
  projectId: "hydro-aid",
  storageBucket: "hydro-aid.appspot.com", // fixed domain
  messagingSenderId: "1064760985523",
  appId: "1:1064760985523:web:378df2c0f4c1d39d25adc6",
  measurementId: "G-WY0DED9S0Q",
};

// Use a named app to avoid conflicts with the default app
const AUTH_APP_NAME = "hydro-aid-auth";
const authApp = getApps().find((a) => a.name === AUTH_APP_NAME) || initializeApp(authConfig, AUTH_APP_NAME);

export const auth = getAuth(authApp);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });


