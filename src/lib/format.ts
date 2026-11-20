// 날짜 표시. 서버에서 계산하므로 기기와 상관없이 한국 시간(Asia/Seoul)으로 고정한다.
const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
});

type Seoul = { year: number; month: number; day: number; hour: number; minute: number };

function seoul(date: Date): Seoul {
  const parts: Record<string, number> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== "literal") parts[part.type] = Number(part.value);
  }
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour % 24,
    minute: parts.minute,
  };
}

const dayNumber = (s: Seoul) => Math.floor(Date.UTC(s.year, s.month - 1, s.day) / 86_400_000);

/** 오늘 / 어제 / 10월 30일 */
export function dayLabel(date: Date, now: Date): string {
  const diff = dayNumber(seoul(now)) - dayNumber(seoul(date));
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  const s = seoul(date);
  return `${s.month}월 ${s.day}일`;
}

/** 오전 9:12 */
export function clockLabel(date: Date): string {
  const { hour, minute } = seoul(date);
  return `${hour < 12 ? "오전" : "오후"} ${hour % 12 === 0 ? 12 : hour % 12}:${String(minute).padStart(2, "0")}`;
}

/** 10월 30일 오전 9:12 */
export function dateTimeLabel(date: Date): string {
  const s = seoul(date);
  return `${s.month}월 ${s.day}일 ${clockLabel(date)}`;
}
