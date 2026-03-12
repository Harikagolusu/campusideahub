import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Dummy config for local/dev - to be replaced with actual user's config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy_api_key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy_domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy_id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy_bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID || "dummy_sender",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy_appid"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
