import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export async function asServerAccount() {
  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
  const auth = getAuth(app);
  await signInWithEmailAndPassword(auth, process.env.FIREBASE_SERVER_EMAIL!, process.env.FIREBASE_SERVER_PASSWORD!);
}
