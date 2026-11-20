import { Suspense } from "react";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { CardContainer } from "@/components/CardContainer";
import { CardHeader } from "@/components/CardHeader";
import { FilterChips } from "@/components/FilterChips";
import { MemoItem } from "@/components/MemoItem";
import { listMemos } from "@/lib/memo-store";
import type { Memo } from "@/lib/memos";
import styles from "./page.module.css";

function HomeHeader({ count }: { count: number | null }) {
  return (
    <header className={styles.header}>
      <p className={`${styles.date} caption-md`}>10월 30일 금요일</p>
      <h1 className={`${styles.title} heading-xl`}>
        오늘까지 메모를
        <br />
        <em>{count === null ? "…" : count}개</em> 남겼어요
      </h1>
    </header>
  );
}

function MemoRows({ memos }: { memos: Memo[] }) {
  return memos.map((memo) => (
    <MemoItem
      key={memo.id}
      id={memo.id}
      label={memo.label}
      title={memo.title}
      preview={memo.preview}
      date={memo.date}
    />
  ));
}

// 메모는 Supabase 에서 요청할 때마다 새로 읽는다 (다른 기기에서 쓴 메모도 바로 보인다)
async function HomeContent() {
  const memos = await listMemos();
  const pinned = memos.filter((memo) => memo.pinned);
  const recent = memos.filter((memo) => !memo.pinned);

  return (
    <>
      <HomeHeader count={memos.length} />

      <nav className={styles.filter} aria-label="메모 분류">
        <FilterChips labels={["전체", "업무", "개인", "아이디어"]} />
      </nav>

      {pinned.length > 0 && (
        <CardContainer label="고정한 메모">
          <CardHeader title="고정한 메모" pin />
          <MemoRows memos={pinned} />
        </CardContainer>
      )}

      <CardContainer label="최근 메모">
        <CardHeader title="최근 메모" action />
        <MemoRows memos={recent} />
      </CardContainer>
    </>
  );
}

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Suspense fallback={<HomeHeader count={null} />}>
          <HomeContent />
        </Suspense>
      </main>

      <div className={styles.footer}>
        <ButtonPrimary label="새 메모 쓰기" icon href="/write" />
      </div>
    </div>
  );
}
