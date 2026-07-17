"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase-client";

type UserDoc = {
  email: string;
  premium: boolean;
  premiumVehicleId?: string;
  createdAt?: unknown;
};

type AuthContextValue = {
  user: User | null;
  userDoc: UserDoc | null;
  loading: boolean;
  refreshUserDoc: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  userDoc: null,
  loading: true,
  refreshUserDoc: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUserDoc(uid: string) {
    const snap = await getDoc(doc(db, "users", uid));
    setUserDoc(snap.exists() ? (snap.data() as UserDoc) : null);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await loadUserDoc(firebaseUser.uid);
      } else {
        setUserDoc(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function refreshUserDoc() {
    if (user) await loadUserDoc(user.uid);
  }

  return <AuthContext.Provider value={{ user, userDoc, loading, refreshUserDoc }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
