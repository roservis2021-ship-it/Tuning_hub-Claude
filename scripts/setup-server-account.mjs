import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

const auth = getAuth(app);

const email = process.env.FIREBASE_SERVER_EMAIL;
const password = process.env.FIREBASE_SERVER_PASSWORD;

if (!email || !password) {
  throw new Error("Define FIREBASE_SERVER_EMAIL y FIREBASE_SERVER_PASSWORD en .env antes de ejecutar este script");
}

const cred = await createUserWithEmailAndPassword(auth, email, password);
console.log("SERVER_UID=" + cred.user.uid);
