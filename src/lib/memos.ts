// 메모의 모양(타입)과, 모양을 다루는 작은 도구들. 메모 자체는 Supabase(memos 표)에 있다.
export type MemoLabel = "blue" | "green" | "orange" | "pink";

export type TextPart = { text: string; bold?: boolean };
export type Block =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; parts: TextPart[] }
  | { type: "list"; items: string[] };

export type Memo = {
  id: string;
  label: MemoLabel;
  category: string; // 상세 화면의 분류 배지
  title: string;
  preview: string;
  pinned: boolean;
  date: string; // 목록에 보이는 날짜
  createdAt: string; // 상세 화면의 날짜
  updatedAt: string; // 상세 화면 아래 "… 수정"
  charCount?: number;
  blocks: Block[];
};

const LABELS: MemoLabel[] = ["blue", "green", "orange", "pink"];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function isLabel(v: unknown): v is MemoLabel {
  return typeof v === "string" && (LABELS as string[]).includes(v);
}

export function isBlock(v: unknown): v is Block {
  if (!isRecord(v)) return false;
  switch (v.type) {
    case "heading":
    case "subheading":
      return typeof v.text === "string";
    case "paragraph":
      return Array.isArray(v.parts) && v.parts.every((p) => isRecord(p) && typeof p.text === "string");
    case "list":
      return Array.isArray(v.items) && v.items.every((i) => typeof i === "string");
    default:
      return false;
  }
}

/** 저장소에서 읽은 값은 믿지 않고, 모양이 맞는 블록만 쓴다 */
export function parseBlocks(value: unknown): Block[] {
  return Array.isArray(value) ? value.filter(isBlock) : [];
}

export function blockText(block: Block): string {
  switch (block.type) {
    case "paragraph":
      return block.parts.map((p) => p.text).join("");
    case "list":
      return block.items.join(", ");
    default:
      return block.text;
  }
}

/** 목록에 보이는 한 줄 미리보기: 본문(문단·목록) 첫 줄. 본문이 없으면 제목 글 */
export function makePreview(blocks: Block[]): string {
  const body = blocks.filter((b) => b.type === "paragraph" || b.type === "list");
  for (const block of [...body, ...blocks]) {
    const text = blockText(block).trim();
    if (text) return text.slice(0, 80);
  }
  return "";
}

export function countChars(memo: Memo): number {
  if (memo.charCount !== undefined) return memo.charCount;
  return memo.blocks
    .map((b) => (b.type === "list" ? b.items.join("") : blockText(b)))
    .join("").length;
}
