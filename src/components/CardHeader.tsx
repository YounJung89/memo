import { Icon } from "./Icon";
import styles from "./components.module.css";

type CardHeaderProps = {
  title: string;
  pin?: boolean;
  action?: boolean;
};

export function CardHeader({ title, pin = false, action = false }: CardHeaderProps) {
  return (
    <div className={styles.cardHeader}>
      {pin && (
        <span className={styles.pin}>
          <Icon name="pin" size={16} />
        </span>
      )}
      <h2 className={`${styles.cardHeaderTitle} label-md`}>{title}</h2>
      {action && (
        <a href="#" className={`${styles.action} caption-md`}>
          전체 보기
          <Icon name="chevron-right" size={16} />
        </a>
      )}
    </div>
  );
}
