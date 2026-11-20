// Supabase 의 memos 표에서 메모를 읽고 쓴다.
import { clockLabel, dateTimeLabel, dayLabel } from "./format";
import type { Draft } from "./draft";
import { countChars, isLabel, makePreview, parseBlocks, type Memo } from "./memos";
import { supabase } from "./supabase";

type MemoRow = {
  id: string;
  title: string;
  category: string;
  label: string;
  pinned: boolean;
  blocks: unknown;
  created_at: string;
  updated_at: string;
};

const COLUMNS = "id, title, category, label, pinned, blocks, created_at, updated_at";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function rowToMemo(row: MemoRow, now: Date): Memo {
  const created = new Date(row.created_at);
  const updated = new Date(row.updated_at);
  const blocks = parseBlocks(row.blocks);
  const memo: Memo = {
    id: row.id,
    label: isLabel(row.label) ? row.label : "blue",
    category: row.category,
    title: row.title,
    preview: makePreview(blocks),
    pinned: row.pinned,
    date: dayLabel(created, now),
    createdAt: dateTimeLabel(created),
    updatedAt: `${dayLabel(updated, now)} ${clockLabel(updated)}`,
    blocks,
  };
  memo.charCount = countChars(memo);
  return memo;
}

/** 모든 메모, 최신순 */
export async function listMemos(): Promise<Memo[]> {
  const { data, error } = await supabase
    .from("memos")
    .select(COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`메모를 불러오지 못했어요: ${error.message}`);
  const now = new Date();
  return (data as MemoRow[]).map((row) => rowToMemo(row, now));
}

/** id 로 메모 한 개. 없거나 id 모양이 틀리면 null */
export async function getMemoById(id: string): Promise<Memo | null> {
  if (!UUID.test(id)) return null;
  const { data, error } = await supabase.from("memos").select(COLUMNS).eq("id", id).maybeSingle();
  if (error) throw new Error(`메모를 불러오지 못했어요: ${error.message}`);
  return data ? rowToMemo(data as MemoRow, new Date()) : null;
}

/** 새 메모 저장. 만든 메모의 id 를 돌려준다 */
export async function createMemo(input: Draft): Promise<string> {
  const { data, error } = await supabase
    .from("memos")
    .insert({
      title: input.title,
      category: input.category,
      label: input.label,
      blocks: input.blocks,
    })
    .select("id")
    .single();
  if (error) throw new Error(`메모를 저장하지 못했어요: ${error.message}`);
  return data.id as string;
}
