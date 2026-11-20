import type { Metadata } from "next";
import { WriteScreen } from "./WriteScreen";

export const metadata: Metadata = { title: "새 메모" };

export default function WritePage() {
  return <WriteScreen />;
}
