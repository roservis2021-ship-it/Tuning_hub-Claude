import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || "(default)");
const auth = getAuth(app);

const EMAIL = "test@tuninghub.test";
const PASSWORD = "TEST123";

const cred = await createUserWithEmailAndPassword(auth, EMAIL, PASSWORD);
console.log("Cuenta creada:", cred.user.uid);

await setDoc(doc(db, "users", cred.user.uid), {
  email: EMAIL,
  name: "TEST",
  premium: false,
  createdAt: serverTimestamp(),
});

await signOut(auth);
await signInWithEmailAndPassword(auth, process.env.FIREBASE_SERVER_EMAIL, process.env.FIREBASE_SERVER_PASSWORD);
await updateDoc(doc(db, "users", cred.user.uid), {
  premium: true,
  premiumVehicleId: null,
});

console.log("Premium activado para", EMAIL, "/ uid:", cred.user.uid);
process.exit(0);
