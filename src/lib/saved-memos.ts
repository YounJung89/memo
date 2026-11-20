// 내가 쓴 메모와 작성 중인 초안을 이 브라우저(로컬 스토리지)에 저장한다.
import { useSyncExternalStore } from "react";
import { countChars, type Block, type Memo, type MemoLabel } from "./memos";

export type SavedMemo = {
  id: string;
  label: MemoLabel;
  category: string;
  title: string;
  preview: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  blocks: Block[];
};

export type Draft = {
  title: string;
  category: string;
  label: MemoLabel;
  blocks: Block[];
};

const MEMOS_KEY = "memo-app:memos";
const DRAFT_KEY = "memo-app:draft";
const LABELS: MemoLabel[] = ["blue", "green", "orange", "pink"];

// ---------- 검증 (로컬 스토리지 값은 믿지 않는다) ----------
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isBlock(v: unknown): v is Block {
  if (!isRecord(v)) return false;
  switch (v.type) {
    case "heading":
    case "subheading":
      return typeof v.text === "string";
    case "paragraph":
      return (
        Array.isArray(v.parts) &&
        v.parts.every((p) => isRecord(p) && typeof p.text === "string")
      );
    case "list":
      return Array.isArray(v.items) && v.items.every((i) => typeof i === "string");
    default:
      return false;
  }
}

function isLabel(v: unknown): v is MemoLabel {
  return typeof v === "string" && (LABELS as string[]).includes(v);
}

function isSavedMemo(v: unknown): v is SavedMemo {
  return (
    isRecord(v) &&
    typeof v.id === "string" &&
    isLabel(v.label) &&
    typeof v.category === "string" &&
    typeof v.title === "string" &&
    typeof v.preview === "string" &&
    typeof v.createdAt === "string" &&
    typeof v.updatedAt === "string" &&
    Array.isArray(v.blocks) &&
    v.blocks.every(isBlock)
  );
}

function parseMemos(raw: string | null): SavedMemo[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isSavedMemo) : [];
  } catch {
    return [];
  }
}

// ---------- 저장된 메모 목록 (여러 화면이 함께 보는 저장소) ----------
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

let cachedRaw: string | null | undefined;
let cachedMemos: SavedMemo[] = [];

function readRaw(): string | null {
  try {
    return localStorage.getItem(MEMOS_KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): SavedMemo[] {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedMemos;
  cachedRaw = raw;
  cachedMemos = parseMemos(raw);
  return cachedMemos;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

/** 서버 렌더링과 첫 화면에서는 null (아직 읽지 않음), 그 뒤에는 저장된 메모(최신순) */
export function useSavedMemos(): SavedMemo[] | null {
  return useSyncExternalStore<SavedMemo[] | null>(subscribe, getSnapshot, () => null);
}

function makePreview(blocks: Block[]): string {
  for (const block of blocks) {
    const text =
      block.type === "paragraph"
        ? block.parts.map((p) => p.text).join("")
        : block.type === "list"
          ? block.items.join(", ")
          : block.text;
    if (text.trim()) return text.trim().slice(0, 80);
  }
  return "";
}

export function saveMemo(input: Draft): SavedMemo {
  const now = new Date().toISOString();
  const memo: SavedMemo = {
    id: `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    label: input.label,
    category: input.category,
    title: input.title,
    preview: makePreview(input.blocks),
    createdAt: now,
    updatedAt: now,
    blocks: input.blocks,
  };
  localStorage.setItem(MEMOS_KEY, JSON.stringify([memo, ...getSnapshot()]));
  emit();
  return memo;
}

// ---------- 작성 중인 초안 (자동 저장) ----------
export function loadDraft(): Draft | null {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");
    if (
      isRecord(data) &&
      typeof data.title === "string" &&
      typeof data.category === "string" &&
      isLabel(data.label) &&
      Array.isArray(data.blocks) &&
      data.blocks.every(isBlock)
    ) {
      return { title: data.title, category: data.category, label: data.label, blocks: data.blocks };
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

// ---------- 화면에 보이는 모양으로 바꾸기 (브라우저에서만 쓴다) ----------
const pad = (n: number) => String(n).padStart(2, "0");

function clock(d: Date): string {
  const h = d.getHours();
  return `${h < 12 ? "오전" : "오후"} ${h % 12 === 0 ? 12 : h % 12}:${pad(d.getMinutes())}`;
}

function dayLabel(d: Date, now: Date): string {
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOfDay(now) - startOfDay(d)) / 86_400_000);
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function toMemo(saved: SavedMemo): Memo {
  const now = new Date();
  const created = new Date(saved.createdAt);
  const updated = new Date(saved.updatedAt);
  const memo: Memo = {
    id: saved.id,
    label: saved.label,
    category: saved.category,
    title: saved.title,
    preview: saved.preview,
    date: dayLabel(created, now),
    createdAt: `${created.getMonth() + 1}월 ${created.getDate()}일 ${clock(created)}`,
    updatedAt: `${dayLabel(updated, now)} ${clock(updated)}`,
    blocks: saved.blocks,
  };
  memo.charCount = countChars(memo);
  return memo;
}
