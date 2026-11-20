"use client";

import { toMemo, useSavedMemos } from "@/lib/saved-memos";
import { MemoArticle } from "./MemoArticle";
import styles from "./page.module.css";

// 시안의 예시 메모가 아닌 id — 이 브라우저에 저장한 메모에서 찾는다
export function SavedMemoContent({ id }: { id: string }) {
  const saved = useSavedMemos();

  if (saved === null) return <div className={styles.card} aria-busy="true" />;

  const found = saved.find((memo) => memo.id === id);
  if (!found) {
    return (
      <div className={styles.card}>
        <p className={`${styles.paragraph} body-md`}>메모를 찾을 수 없어요.</p>
      </div>
    );
  }
  return <MemoArticle memo={toMemo(found)} />;
}
