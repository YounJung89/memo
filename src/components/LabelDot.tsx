import type { MemoLabel } from "@/lib/memos";
import styles from "./components.module.css";

type LabelDotProps = {
  color: MemoLabel;
  name: string; // 스크린 리더용 색 이름
  selected: boolean;
  onSelect: () => void;
};

const dotClass: Record<MemoLabel, string> = {
  blue: styles.dotBlue,
  green: styles.dotGreen,
  orange: styles.dotOrange,
  pink: styles.dotPink,
};

// Label/Dot — 색 라벨 고르기. 고른 색은 바깥에 파란 테두리(2px)
export function LabelDot({ color, name, selected, onSelect }: LabelDotProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={name}
      className={`${styles.labelDot} ${selected ? styles.labelDotSelected : ""}`}
      onClick={onSelect}
    >
      <span className={`${styles.dot} ${dotClass[color]}`} />
    </button>
  );
}
