import type { Ref } from "react";
import styles from "./components.module.css";

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
};

// Input/Field — 제목 입력 칸. 입력 중에는 파란 테두리, 비어 있으면 회색 안내 문구
export function InputField({ label, value, onChange, placeholder, inputRef }: InputFieldProps) {
  return (
    <label className={styles.inputField}>
      <span className={`${styles.inputLabel} caption-sm`}>{label}</span>
      <input
        ref={inputRef}
        className={`${styles.inputValue} title-md`}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
