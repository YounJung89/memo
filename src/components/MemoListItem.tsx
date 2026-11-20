import styles from "./components.module.css";

// 본문의 목록 한 줄. 앞에 점이 붙고 글이 길면 다음 줄로 이어진다.
export function MemoListItem({ text }: { text: string }) {
  return (
    <li className={`${styles.memoListItem} body-md`}>
      <span aria-hidden="true">•</span>
      <span className={styles.memoListText}>{text}</span>
    </li>
  );
}
