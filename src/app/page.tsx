import { ButtonPrimary } from "@/components/ButtonPrimary";
import { CardContainer } from "@/components/CardContainer";
import { CardHeader } from "@/components/CardHeader";
import { FilterChips } from "@/components/FilterChips";
import { MemoItem } from "@/components/MemoItem";
import { RecentMemos } from "@/components/RecentMemos";
import { getMemo, pinnedMemoIds, recentMemoIds, type Memo } from "@/lib/memos";
import styles from "./page.module.css";

const pickMemos = (ids: string[]) => ids.map(getMemo).filter((memo): memo is Memo => !!memo);

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <p className={`${styles.date} caption-md`}>10월 30일 금요일</p>
          <h1 className={`${styles.title} heading-xl`}>
            오늘까지 메모를
            <br />
            <em>128개</em> 남겼어요
          </h1>
        </header>

        <nav className={styles.filter} aria-label="메모 분류">
          <FilterChips labels={["전체", "업무", "개인", "아이디어"]} />
        </nav>

        <CardContainer label="고정한 메모">
          <CardHeader title="고정한 메모" pin />
          {pickMemos(pinnedMemoIds).map((memo) => (
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

        <RecentMemos sampleMemos={pickMemos(recentMemoIds)} />
      </main>

      <div className={styles.footer}>
        <ButtonPrimary label="새 메모 쓰기" icon href="/write" />
      </div>
    </div>
  );
}
