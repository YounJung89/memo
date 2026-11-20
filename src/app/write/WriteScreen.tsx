"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { Chip } from "@/components/Chip";
import { IconButton } from "@/components/IconButton";
import { InputField } from "@/components/InputField";
import { LabelDot } from "@/components/LabelDot";
import { RichEditor } from "@/components/RichEditor";
import { clearDraft, loadDraft, saveDraft } from "@/lib/draft";
import { createMemo } from "@/lib/memo-store";
import type { Block, MemoLabel } from "@/lib/memos";
import styles from "./page.module.css";

const CATEGORIES = ["업무", "개인", "아이디어"];
const COLORS: { color: MemoLabel; name: string }[] = [
  { color: "blue", name: "파랑" },
  { color: "green", name: "초록" },
  { color: "orange", name: "주황" },
  { color: "pink", name: "분홍" },
];

const subscribeNone = () => () => {};

// 저장해 둔 초안은 브라우저에서만 읽을 수 있으므로, 화면이 브라우저에 뜬 뒤에 폼을 그린다
export function WriteScreen() {
  const inBrowser = useSyncExternalStore(subscribeNone, () => true, () => false);
  return inBrowser ? <WriteForm /> : <div className={styles.page} aria-busy="true" />;
}

function WriteForm() {
  const router = useRouter();
  const [draft] = useState(loadDraft); // 쓰던 초안이 있으면 이어서 쓴다
  const [title, setTitle] = useState(draft?.title ?? "");
  const [category, setCategory] = useState(draft?.category ?? "개인");
  const [label, setLabel] = useState<MemoLabel>(draft?.label ?? "green");
  const [edits, setEdits] = useState(0); // 본문을 고칠 때마다 +1 (자동 저장 신호)
  const [autosaved, setAutosaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const blocksRef = useRef<Block[]>(draft?.blocks ?? []);
  const titleRef = useRef<HTMLInputElement>(null);
  const savedRef = useRef(false); // 저장하기를 누른 뒤에는 초안을 다시 만들지 않는다

  // 고칠 때마다 잠깐 기다렸다가 초안을 자동 저장
  useEffect(() => {
    if (edits === 0 && title === (draft?.title ?? "") && category === (draft?.category ?? "개인") && label === (draft?.label ?? "green")) {
      return; // 아직 아무것도 안 고쳤다
    }
    const timer = window.setTimeout(() => {
      if (savedRef.current) return;
      if (!title.trim() && blocksRef.current.length === 0) {
        clearDraft();
        setAutosaved(false);
        return;
      }
      saveDraft({ title, category, label, blocks: blocksRef.current });
      setAutosaved(true);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [title, category, label, edits, draft]);

  // 저장하기: Supabase 에 저장한 뒤 홈으로. 저장하는 동안에는 다시 눌러도 중복 저장되지 않는다
  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      titleRef.current?.focus(); // 제목이 비어 있으면 제목 칸으로
      return;
    }
    if (saving) return;
    setSaving(true);
    setSaveError(false);
    try {
      await createMemo({ title: trimmed, category, label, blocks: blocksRef.current });
    } catch {
      setSaving(false);
      setSaveError(true);
      return;
    }
    savedRef.current = true;
    clearDraft();
    router.push("/");
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navBar} aria-label="메모 작성 메뉴">
        <IconButton icon="chevron-left" label="뒤로" href="/" />
        <span
          className={`${styles.autosaved} caption-sm ${autosaved ? "" : styles.hidden}`}
          role="status"
        >
          자동 저장됨
        </span>
      </nav>

      <main className={styles.main}>
        <InputField
          label="제목"
          value={title}
          onChange={setTitle}
          placeholder="제목을 입력하세요"
          inputRef={titleRef}
        />

        <div className={styles.options}>
          <div className={styles.row}>
            <span className={`${styles.rowLabel} caption-sm`}>분류</span>
            {CATEGORIES.map((name) => (
              <Chip
                key={name}
                label={name}
                selected={name === category}
                onClick={() => setCategory(name)}
              />
            ))}
          </div>
          <div className={styles.row} role="radiogroup" aria-label="색">
            <span className={`${styles.rowLabel} caption-sm`}>색</span>
            {COLORS.map(({ color, name }) => (
              <LabelDot
                key={color}
                color={color}
                name={name}
                selected={color === label}
                onSelect={() => setLabel(color)}
              />
            ))}
          </div>
        </div>

        <RichEditor
          initialBlocks={draft?.blocks}
          onChange={(blocks) => {
            blocksRef.current = blocks;
            setEdits((n) => n + 1);
          }}
        />
      </main>

      <div className={styles.footer}>
        {saveError && (
          <p className={`${styles.error} caption-md`} role="alert">
            저장하지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.
          </p>
        )}
        <ButtonPrimary label={saving ? "저장 중…" : "저장하기"} onClick={handleSave} disabled={saving} />
      </div>
    </div>
  );
}
