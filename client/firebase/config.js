import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const APP_ID = "lingobridge";

function readEnv(key) {
  return import.meta?.env?.[key] || undefined;
}

const firebaseConfig = {
  apiKey: readEnv("VITE_FIREBASE_API_KEY"),
  authDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: readEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: readEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: readEnv("VITE_FIREBASE_APP_ID"),
};

const hasConfig = Object.values(firebaseConfig).every(Boolean);

let app = null;
let auth = null;
let db = null;

if (hasConfig) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export const firebaseReady = Boolean(db && auth);

export async function ensureAuth(customToken) {
  if (!firebaseReady) {
    return { userId: "local-anon", user: null };
  }
  const a = auth;
  const user = a.currentUser;
  if (user) return { userId: user.uid, user };
  return new Promise((resolve, reject) => {
    onAuthStateChanged(a, (u) => {
      if (u) resolve({ userId: u.uid, user: u });
    });
    (async () => {
      try {
        if (customToken) {
          await signInWithCustomToken(a, customToken);
        } else {
          await signInAnonymously(a);
        }
      } catch (e) {
        reject(e);
      }
    })();
  });
}

export { app, auth, db };
