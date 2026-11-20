import Link from "next/link";
import { Icon } from "./Icon";
import type { MemoLabel } from "@/lib/memos";
import styles from "./components.module.css";

type MemoItemProps = {
  id: string;
  label: MemoLabel;
  title: string;
  preview: string;
  date: string;
};

// 메모 목록의 한 줄. 누르면 메모 상세로 이동한다.
export function MemoItem({ id, label, title, preview, date }: MemoItemProps) {
  return (
    <Link href={`/memos/${id}`} className={styles.memoItem}>
      <span className={`${styles.tile} ${styles[label]}`}>
        <Icon name="note" size={22} />
      </span>
      <span className={styles.memoContent}>
        <span className={`${styles.memoTitle} title-md`}>{title}</span>
        <span className={`${styles.memoPreview} body-sm`}>{preview}</span>
      </span>
      <span className={`${styles.memoDate} caption-sm`}>{date}</span>
    </Link>
  );
}
