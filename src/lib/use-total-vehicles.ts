"use client";

import { useEffect, useState } from "react";

export function useTotalVehicles(): number | null {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/public-stats")
      .then((res) => res.json())
      .then((data: { totalVehicles: number | null }) => {
        if (typeof data.totalVehicles === "number") setTotal(data.totalVehicles);
      })
      .catch(() => {});
  }, []);

  return total;
}
