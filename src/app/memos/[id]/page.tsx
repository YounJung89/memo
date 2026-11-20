import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { IconButton } from "@/components/IconButton";
import { getMemoById } from "@/lib/memo-store";
import { MemoArticle } from "./MemoArticle";
import styles from "./page.module.css";

// params(URL 데이터)를 읽고 메모를 Supabase 에서 가져오는 부분만 Suspense 안으로 —
// 나머지(뒤로가기 줄, 아래 버튼)는 화면 틀로 먼저 보인다
async function MemoContent({ params }: Pick<PageProps<"/memos/[id]">, "params">) {
  const { id } = await params;
  const memo = await getMemoById(id);
  if (!memo) notFound();
  return <MemoArticle memo={memo} />;
}

export default function MemoDetail({ params }: PageProps<"/memos/[id]">) {
  return (
    <div className={styles.page}>
      <nav className={styles.navBar} aria-label="메모 상세 메뉴">
        <IconButton icon="chevron-left" label="뒤로" href="/" />
        <div className={styles.actions}>
          <IconButton icon="pin-24" label="고정" />
          <IconButton icon="share" label="공유" />
          <IconButton icon="more" label="더보기" />
        </div>
      </nav>

      <main className={styles.main}>
        <Suspense fallback={<div className={styles.card} aria-busy="true" />}>
          <MemoContent params={params} />
        </Suspense>
      </main>

      <div className={styles.footer}>
        <ButtonPrimary label="수정하기" />
      </div>
    </div>
  );
}
