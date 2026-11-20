"use client";

import { useState } from "react";
import { Chip } from "./Chip";

type FilterChipsProps = {
  labels: string[];
  defaultSelected?: string;
};

// 분류 칩 줄. 칩을 누르면 선택이 바뀐다 (선택은 하나).
export function FilterChips({ labels, defaultSelected = labels[0] }: FilterChipsProps) {
  const [selected, setSelected] = useState(defaultSelected);
  return (
    <>
      {labels.map((label) => (
        <Chip
          key={label}
          label={label}
          selected={label === selected}
          onClick={() => setSelected(label)}
        />
      ))}
    </>
  );
}
