"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import styles from "./PhoenixProblems.module.css";

export interface ProblemItem {
  id: string;
  label: string;
  title: string;
  body: string;
  links: Array<{ label: string; href: string }>;
}

export function ProblemsTabs({ items }: { items: ProblemItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIdx = (index + 1) % items.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIdx = (index - 1 + items.length) % items.length;
    } else if (e.key === "Home") {
      nextIdx = 0;
    } else if (e.key === "End") {
      nextIdx = items.length - 1;
    }

    if (nextIdx !== null) {
      e.preventDefault();
      const nextItem = items[nextIdx];
      if (nextItem) {
        setActiveId(nextItem.id);
        tabRefs.current[nextIdx]?.focus();
      }
    }
  };

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <div className={styles.tabsShell}>
      <div className={styles.tabList} role="tablist" aria-label="Common Phoenix plumbing issues">
        {items.map((item, idx) => {
          const isSelected = item.id === activeId;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              id={`tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${item.id}`}
              tabIndex={isSelected ? 0 : -1}
              className={`${styles.tabBtn} ${isSelected ? styles.tabActive : ""}`}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {activeItem ? (
        <div
          key={activeItem.id}
          id={`panel-${activeItem.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeItem.id}`}
          tabIndex={0}
          className={styles.panel}
        >
          <h3 className={styles.panelTitle}>{activeItem.title}</h3>
          <p className={styles.panelBody}>{activeItem.body}</p>
          <div className={styles.panelLinks}>
            <span className={styles.relatedLabel}>Related services:</span>
            {activeItem.links.map((link) => (
              <Link key={link.href} href={link.href} className={styles.relatedLink}>
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

