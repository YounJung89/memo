import { Badge } from "@/components/Badge";
import { MemoListItem } from "@/components/MemoListItem";
import { countChars, type Block, type Memo } from "@/lib/memos";
import styles from "./page.module.css";

function BodyBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      return <h2 className={`${styles.heading} title-lg`}>{block.text}</h2>;
    case "subheading":
      return <h3 className={`${styles.subheading} title-md`}>{block.text}</h3>;
    case "paragraph":
      return (
        <p className={`${styles.paragraph} body-md`}>
          {block.parts.map((part, i) =>
            part.bold ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>,
          )}
        </p>
      );
    case "list":
      return (
        <ul className={styles.list}>
          {block.items.map((item, i) => (
            <MemoListItem key={i} text={item} />
          ))}
        </ul>
      );
  }
}

// Content/Memo — 메모 한 개의 상세 카드
export function MemoArticle({ memo }: { memo: Memo }) {
  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <Badge label={memo.category} color={memo.label} />
        <span className={`${styles.metaDate} caption-sm`}>{memo.createdAt}</span>
      </div>
      <h1 className={`${styles.title} heading-lg`}>{memo.title}</h1>
      <div className={styles.divider} role="separator" />
      <div className={styles.body}>
        {memo.blocks.map((block, i) => (
          <BodyBlock key={i} block={block} />
        ))}
      </div>
      <p className={`${styles.footnote} caption-sm`}>
        {countChars(memo)}자 · {memo.updatedAt} 수정
      </p>
    </article>
  );
}
