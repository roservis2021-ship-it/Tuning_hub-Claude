"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isInternalVisitor } from "@/lib/internal-traffic";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (isInternalVisitor()) return;
    if (pathname.startsWith("/panel-2847")) return;
    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
