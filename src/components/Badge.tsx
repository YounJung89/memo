import type { MemoLabel } from "@/lib/memos";
import styles from "./components.module.css";

// 메모의 분류 배지. 색은 메모의 색 라벨을 따른다.
export function Badge({ label, color }: { label: string; color: MemoLabel }) {
  return <span className={`${styles.badge} ${styles[color]} caption-sm`}>{label}</span>;
}
