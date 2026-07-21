import type { Metadata } from "next";
import { PanelClient } from "./PanelClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminPanelPage() {
  return <PanelClient />;
}
