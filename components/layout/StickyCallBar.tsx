"use client";

import { useEffect, useState } from "react";
import { PhoneIcon } from "@/components/icons/Icons";
import styles from "./StickyCallBar.module.css";

export function StickyCallBar({
  display,
  e164,
}: {
  display: string;
  e164: string;
}) {
  const [hiddenByMenu, setHiddenByMenu] = useState(false);

  useEffect(() => {
    const onMenuToggle = (event: Event) => {
      const custom = event as CustomEvent<{ open: boolean }>;
      setHiddenByMenu(Boolean(custom.detail?.open));
    };
    window.addEventListener("pvp:menu-toggle", onMenuToggle);
    return () => window.removeEventListener("pvp:menu-toggle", onMenuToggle);
  }, []);

  if (hiddenByMenu) return null;

  const cleanE164 = e164.replace(/[^\d+]/g, "") || "+16028350102";

  return (
    <div className={styles.bar} role="region" aria-label="Quick call bar">
      <a
        href={`tel:${cleanE164}`}
        data-phone=""
        data-call-location="sticky-bar"
        className={`btn-call ${styles.fullBtn}`}
      >
        <PhoneIcon size={20} />
        <span>
          Call Now · <span data-phone-display="">{display}</span>
        </span>
      </a>
    </div>
  );
}
