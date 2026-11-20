"use client";

import { useEffect, useRef, useState } from "react";
import { blocksToDom, domToBlocks } from "@/lib/editor-blocks";
import type { Block } from "@/lib/memos";
import styles from "./components.module.css";

type RichEditorProps = {
  initialBlocks?: Block[];
  onChange: (blocks: Block[]) => void;
};

type Active = { bold: boolean; heading: boolean; subheading: boolean; list: boolean };
const NONE: Active = { bold: false, heading: false, subheading: false, list: false };

function ButtonFormat({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.buttonFormat} ${active ? styles.buttonFormatActive : ""} label-md`}
      aria-pressed={active}
      onMouseDown={(event) => event.preventDefault()} // 글자 선택이 풀리지 않게
      onClick={onPress}
    >
      {label}
    </button>
  );
}

// Editor — 서식 막대(Editor/Toolbar) + 본문. 굵게·제목·소제목·목록을 저장 형식(Block[])으로 넘긴다.
export function RichEditor({ initialBlocks, onChange }: RichEditorProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Active>(NONE);

  const syncEmpty = () => {
    const body = bodyRef.current;
    if (body) body.dataset.empty = String((body.textContent ?? "").trim() === "");
  };

  useEffect(() => {
    // 새 줄은 div로 — 목록·제목과 섞여도 올바른 구조로 남는다
    document.execCommand("defaultParagraphSeparator", false, "div");
  }, []);

  // 저장해 둔 초안을 불러왔을 때 한 번 채운다
  useEffect(() => {
    if (initialBlocks && bodyRef.current) {
      blocksToDom(initialBlocks, bodyRef.current);
      bodyRef.current.dataset.empty = String(initialBlocks.length === 0);
    }
  }, [initialBlocks]);

  // 커서가 있는 글자의 서식을 버튼에 보여준다 (State=Active)
  useEffect(() => {
    const refresh = () => {
      const body = bodyRef.current;
      const selection = window.getSelection();
      if (!body || !selection || !selection.anchorNode || !body.contains(selection.anchorNode)) {
        setActive(NONE);
        return;
      }
      const block = String(document.queryCommandValue("formatBlock")).toLowerCase();
      setActive({
        bold: document.queryCommandState("bold"),
        heading: block === "h2",
        subheading: block === "h3",
        list: document.queryCommandState("insertUnorderedList"),
      });
    };
    document.addEventListener("selectionchange", refresh);
    return () => document.removeEventListener("selectionchange", refresh);
  }, []);

  const handleInput = () => {
    syncEmpty();
    if (bodyRef.current) onChange(domToBlocks(bodyRef.current));
  };

  const apply = (command: () => void) => {
    bodyRef.current?.focus();
    command();
    handleInput();
  };

  const toggleBlock = (tag: "h2" | "h3") =>
    apply(() => {
      const current = String(document.queryCommandValue("formatBlock")).toLowerCase();
      document.execCommand("formatBlock", false, current === tag ? "p" : tag);
    });

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar} role="toolbar" aria-label="서식">
        <ButtonFormat label="B" active={active.bold} onPress={() => apply(() => document.execCommand("bold"))} />
        <ButtonFormat label="제목" active={active.heading} onPress={() => toggleBlock("h2")} />
        <ButtonFormat label="소제목" active={active.subheading} onPress={() => toggleBlock("h3")} />
        <ButtonFormat
          label="목록"
          active={active.list}
          onPress={() => apply(() => document.execCommand("insertUnorderedList"))}
        />
      </div>
      <div className={styles.editorDivider} />
      <div
        ref={bodyRef}
        className={`${styles.editorBody} rich`}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="본문"
        data-placeholder="내용을 입력하세요"
        data-empty="true"
        onInput={handleInput}
      />
    </div>
  );
}
