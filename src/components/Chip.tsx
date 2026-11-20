import styles from "./components.module.css";

type ChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

export function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className={`${styles.chip} label-md`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
