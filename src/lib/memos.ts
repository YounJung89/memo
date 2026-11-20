// 시안(Mobile/Home, Mobile/Detail)의 예시 데이터. 나중에 실제 저장소로 바꾼다.
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
  date: string; // 목록에 보이는 날짜
  createdAt: string; // 상세 화면의 날짜
  updatedAt: string; // 상세 화면 아래 "… 수정"
  charCount?: number;
  blocks: Block[];
};

export const memos: Memo[] = [
  {
    id: "design-review",
    label: "blue",
    category: "업무",
    title: "디자인 리뷰 회의록",
    preview: "검수 기준과 다음 할 일 정리",
    date: "오늘",
    createdAt: "10월 30일",
    updatedAt: "오늘",
    blocks: [{ type: "paragraph", parts: [{ text: "검수 기준과 다음 할 일 정리" }] }],
  },
  {
    id: "hiking",
    label: "green",
    category: "개인",
    title: "주말 등산 준비",
    preview: "물 두 병, 간식, 바람막이 챙기기",
    date: "어제",
    createdAt: "10월 30일 오전 9:12",
    updatedAt: "오늘 오전 9:12",
    charCount: 198,
    blocks: [
      { type: "heading", text: "준비물 정리" },
      {
        type: "paragraph",
        parts: [
          { text: "토요일 아침 7시에 출발한다. 날씨가 흐릴 수 있어 " },
          { text: "바람막이는 꼭 챙긴다", bold: true },
          { text: "." },
        ],
      },
      { type: "subheading", text: "챙길 것" },
      { type: "list", items: ["물 두 병과 간식", "바람막이와 여분 양말", "보조 배터리"] },
      { type: "subheading", text: "일정" },
      {
        type: "paragraph",
        parts: [
          { text: "오전 7시", bold: true },
          { text: " 집 앞에서 모여 출발한다. 정상까지 약 두 시간 걸린다." },
        ],
      },
      { type: "subheading", text: "남은 질문" },
      { type: "paragraph", parts: [{ text: "비가 오면 일정을 일요일로 미룰지 전날 밤에 다시 정한다." }] },
    ],
  },
  {
    id: "groceries",
    label: "pink",
    category: "개인",
    title: "장보기 목록",
    preview: "우유, 계란, 사과, 커피 원두",
    date: "오늘",
    createdAt: "10월 30일",
    updatedAt: "오늘",
    blocks: [{ type: "list", items: ["우유", "계란", "사과", "커피 원두"] }],
  },
  {
    id: "app-icon",
    label: "orange",
    category: "아이디어",
    title: "앱 아이콘 아이디어",
    preview: "메모지 모서리가 접힌 모양",
    date: "오늘",
    createdAt: "10월 30일",
    updatedAt: "오늘",
    blocks: [{ type: "paragraph", parts: [{ text: "메모지 모서리가 접힌 모양" }] }],
  },
  {
    id: "book",
    label: "green",
    category: "개인",
    title: "읽을 책",
    preview: "디자인 시스템 책 두 권",
    date: "어제",
    createdAt: "10월 29일",
    updatedAt: "어제",
    blocks: [{ type: "paragraph", parts: [{ text: "디자인 시스템 책 두 권" }] }],
  },
];

export const pinnedMemoIds = ["design-review", "hiking"];
export const recentMemoIds = ["groceries", "app-icon", "book"];

export function getMemo(id: string): Memo | undefined {
  return memos.find((memo) => memo.id === id);
}

export function countChars(memo: Memo): number {
  if (memo.charCount !== undefined) return memo.charCount;
  const text = memo.blocks
    .map((b) =>
      b.type === "paragraph" ? b.parts.map((p) => p.text).join("") : b.type === "list" ? b.items.join("") : b.text,
    )
    .join("");
  return text.length;
}
