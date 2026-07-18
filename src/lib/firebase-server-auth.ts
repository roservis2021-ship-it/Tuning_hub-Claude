import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-client";

export async function asServerAccount() {
  await signInWithEmailAndPassword(auth, process.env.FIREBASE_SERVER_EMAIL!, process.env.FIREBASE_SERVER_PASSWORD!);
}
