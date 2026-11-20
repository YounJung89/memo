// 에디터 화면(DOM)과 저장 형식(Block[])을 서로 바꾼다. 브라우저에서만 쓴다.
import type { Block, TextPart } from "./memos";

const clean = (text: string) => text.replace(/ /g, " ");

function isBold(el: HTMLElement): boolean {
  if (el.tagName === "B" || el.tagName === "STRONG") return true;
  const weight = el.style.fontWeight;
  return weight === "bold" || (weight !== "" && Number(weight) >= 600);
}

function pushPart(parts: TextPart[], text: string, bold: boolean) {
  if (!text) return;
  const last = parts[parts.length - 1];
  if (last && !!last.bold === bold) last.text += text;
  else parts.push(bold ? { text, bold: true } : { text });
}

function collectNode(node: Node, bold: boolean, parts: TextPart[]) {
  if (node.nodeType === Node.TEXT_NODE) {
    pushPart(parts, clean(node.textContent ?? ""), bold);
  } else if (node instanceof HTMLElement && node.tagName !== "BR") {
    node.childNodes.forEach((child) => collectNode(child, bold || isBold(node), parts));
  }
}

function paragraphBlock(parts: TextPart[]): Block | null {
  const trimmed = parts.map((p) => ({ ...p }));
  if (trimmed.length) trimmed[0].text = trimmed[0].text.trimStart();
  if (trimmed.length) trimmed[trimmed.length - 1].text = trimmed[trimmed.length - 1].text.trimEnd();
  const filled = trimmed.filter((p) => p.text);
  return filled.length ? { type: "paragraph", parts: filled } : null;
}

export function domToBlocks(root: HTMLElement): Block[] {
  const blocks: Block[] = [];
  let loose: TextPart[] = []; // 줄 바깥에 바로 놓인 글자
  const flush = () => {
    const block = paragraphBlock(loose);
    if (block) blocks.push(block);
    loose = [];
  };

  // 브라우저가 문단(p, div) 안에 제목·목록을 넣어 만들 수 있어서, 문단 안쪽도 같은 방식으로 훑는다
  const walk = (parent: Node) => {
    parent.childNodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        collectNode(node, false, loose);
        return;
      }
      const text = () => clean(node.textContent ?? "").trim();
      switch (node.tagName) {
        case "H1":
        case "H2":
          flush();
          if (text()) blocks.push({ type: "heading", text: text() });
          break;
        case "H3":
        case "H4":
          flush();
          if (text()) blocks.push({ type: "subheading", text: text() });
          break;
        case "UL":
        case "OL": {
          flush();
          const items = [...node.querySelectorAll("li")]
            .map((li) => clean(li.textContent ?? "").trim())
            .filter(Boolean);
          if (items.length) blocks.push({ type: "list", items });
          break;
        }
        case "P":
        case "DIV":
          flush();
          walk(node);
          flush();
          break;
        case "BR":
          flush();
          break;
        default:
          collectNode(node, false, loose);
      }
    });
  };
  walk(root);
  flush();
  return blocks;
}

export function blocksToDom(blocks: Block[], root: HTMLElement) {
  const nodes = blocks.map((block) => {
    switch (block.type) {
      case "heading": {
        const h = document.createElement("h2");
        h.textContent = block.text;
        return h;
      }
      case "subheading": {
        const h = document.createElement("h3");
        h.textContent = block.text;
        return h;
      }
      case "paragraph": {
        const p = document.createElement("p");
        for (const part of block.parts) {
          if (part.bold) {
            const b = document.createElement("b");
            b.textContent = part.text;
            p.append(b);
          } else {
            p.append(part.text);
          }
        }
        return p;
      }
      case "list": {
        const ul = document.createElement("ul");
        for (const item of block.items) {
          const li = document.createElement("li");
          li.textContent = item;
          ul.append(li);
        }
        return ul;
      }
    }
  });
  root.replaceChildren(...nodes);
}
