"use client";

import { useEffect } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { isInternalVisitor } from "@/lib/internal-traffic";

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

function getVisitorId(): string {
  const key = "th_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function PresenceBeacon() {
  useEffect(() => {
    if (isInternalVisitor()) return;

    const sessionId = getSessionId();
    const visitorId = getVisitorId();

    function beat() {
      setDoc(doc(db, "presence", sessionId), { lastSeen: serverTimestamp() }).catch(() => {});
    }

    beat();
    const id = setInterval(beat, HEARTBEAT_MS);

    const today = new Date().toISOString().slice(0, 10);
    setDoc(doc(db, "dailyVisits", `${today}_${visitorId}`), { date: today, visitorId, lastSeen: serverTimestamp() }).catch(
      () => {}
    );

    return () => clearInterval(id);
  }, []);

  return null;
}
