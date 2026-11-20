"use client";

import { CardContainer } from "./CardContainer";
import { CardHeader } from "./CardHeader";
import { MemoItem } from "./MemoItem";
import type { Memo } from "@/lib/memos";
import { toMemo, useSavedMemos } from "@/lib/saved-memos";

// "최근 메모" 카드 — 내가 저장한 메모(최신순)가 시안의 예시 메모 위에 보인다
export function RecentMemos({ sampleMemos }: { sampleMemos: Memo[] }) {
  const saved = useSavedMemos();
  const memos = [...(saved ?? []).map(toMemo), ...sampleMemos];

  return (
    <CardContainer label="최근 메모">
      <CardHeader title="최근 메모" action />
      {memos.map((memo) => (
        <MemoItem
          key={memo.id}
          id={memo.id}
          label={memo.label}
          title={memo.title}
          preview={memo.preview}
          date={memo.date}
        />
      ))}
    </CardContainer>
  );
}
