import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className={styles.nav} aria-label="Breadcrumb">
      <div className="container">
        <ol className={styles.list}>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={`${item.label}-${idx}`} className={styles.item}>
                {idx > 0 ? (
                  <span className={styles.sep} aria-hidden="true">
                    /
                  </span>
                ) : null}
                {isLast || !item.href ? (
                  <span className={styles.current} aria-current={isLast ? "page" : undefined}>
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

