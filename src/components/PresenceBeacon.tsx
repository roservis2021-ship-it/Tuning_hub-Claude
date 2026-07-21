"use client";

import { useEffect } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

const HEARTBEAT_MS = 20_000;

function getSessionId(): string {
  const key = "th_presence_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function PresenceBeacon() {
  useEffect(() => {
    const sessionId = getSessionId();

    function beat() {
      setDoc(doc(db, "presence", sessionId), { lastSeen: serverTimestamp() }).catch(() => {});
    }

    beat();
    const id = setInterval(beat, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, []);

  return null;
}
