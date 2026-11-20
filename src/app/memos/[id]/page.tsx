import { Suspense } from "react";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { IconButton } from "@/components/IconButton";
import { getMemo, memos } from "@/lib/memos";
import { MemoArticle } from "./MemoArticle";
import { SavedMemoContent } from "./SavedMemoContent";
import styles from "./page.module.css";

export function generateStaticParams() {
  return memos.map((memo) => ({ id: memo.id }));
}

// params(URL 데이터)를 읽는 부분만 Suspense 안으로 — 나머지(뒤로가기 줄, 아래 버튼)는 화면 틀로 먼저 보인다
async function MemoContent({ params }: Pick<PageProps<"/memos/[id]">, "params">) {
  const { id } = await params;
  const memo = getMemo(id);
  // 시안의 예시 메모가 아니면, 이 브라우저에 저장한 메모에서 찾는다
  return memo ? <MemoArticle memo={memo} /> : <SavedMemoContent id={id} />;
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
