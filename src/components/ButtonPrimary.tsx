import Link from "next/link";
import { Icon } from "./Icon";
import styles from "./components.module.css";

type ButtonPrimaryProps = {
  label: string;
  icon?: boolean;
  href?: string; // 있으면 다른 화면으로 가는 링크
  onClick?: () => void;
};

export function ButtonPrimary({ label, icon = false, href, onClick }: ButtonPrimaryProps) {
  const className = `${styles.buttonPrimary} button-md`;
  const content = (
    <>
      {icon && <Icon name="plus" size={20} />}
      {label}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}
