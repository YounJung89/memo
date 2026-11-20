// 작성 중인 초안은 저장 전의 임시 글이라 이 기기(로컬 스토리지)에만 둔다.
import { isLabel, parseBlocks, type Block, type MemoLabel } from "./memos";

export type Draft = {
  title: string;
  category: string;
  label: MemoLabel;
  blocks: Block[];
};

const DRAFT_KEY = "memo-app:draft";

export function loadDraft(): Draft | null {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");
    if (
      typeof data === "object" &&
      data !== null &&
      "title" in data &&
      "category" in data &&
      "label" in data &&
      "blocks" in data &&
      typeof data.title === "string" &&
      typeof data.category === "string" &&
      isLabel(data.label)
    ) {
      return { title: data.title, category: data.category, label: data.label, blocks: parseBlocks(data.blocks) };
    }
  } catch {
    // 깨진 초안은 없는 것으로 본다
  }
  return null;
}

export function saveDraft(draft: Draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // 저장 공간이 없거나 막혀 있으면 자동 저장만 건너뛴다
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // 무시
  }
}
