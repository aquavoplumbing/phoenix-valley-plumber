"use client";

import { useEffect, useState } from "react";
import type { SiteConfig } from "@/lib/config";
import { computeOpenStatus, type OpenStatus } from "@/lib/hours";
import styles from "./StatusBadge.module.css";

export function StatusBadge({
  hours,
  initialStatus,
  variant = "light",
  compact = false,
}: {
  hours: SiteConfig["hours"];
  initialStatus: OpenStatus;
  variant?: "light" | "dark";
  compact?: boolean;
}) {
  const [status, setStatus] = useState<OpenStatus>(initialStatus);

  useEffect(() => {
    const update = () => {
      setStatus(computeOpenStatus(hours, new Date()));
    };
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [hours]);

  const text = compact ? status.shortLabel : status.label;

  return (
    <span
      className={`${styles.badge} ${variant === "dark" ? styles.dark : styles.light}`}
      aria-live="polite"
    >
      <span
        className={`${styles.dot} ${status.isOpen ? styles.dotOpen : styles.dotClosed}`}
        aria-hidden="true"
      />
      <span className={styles.text}>{text}</span>
    </span>
  );
}

