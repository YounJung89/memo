import type { ReactNode } from "react";
import styles from "./components.module.css";

export function CardContainer({ children, label }: { children: ReactNode; label: string }) {
  return (
    <section className={styles.cardContainer} aria-label={label}>
      {children}
    </section>
  );
}
