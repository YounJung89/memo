import Link from "next/link";
import { Icon, type IconName } from "./Icon";
import styles from "./components.module.css";

type IconButtonProps = {
  icon: IconName;
  label: string; // 스크린 리더용 이름
  href?: string; // 있으면 링크, 없으면 버튼
};

// Button/Icon — 40×40 누르는 영역 가운데에 24px 아이콘
export function IconButton({ icon, label, href }: IconButtonProps) {
  if (href) {
    return (
      <Link href={href} className={styles.iconButton} aria-label={label}>
        <Icon name={icon} size={24} />
      </Link>
    );
  }
  return (
    <button type="button" className={styles.iconButton} aria-label={label}>
      <Icon name={icon} size={24} />
    </button>
  );
}
