"use client";

import { useEffect, useState } from "react";
import { CloseIcon, PhoneIcon } from "@/components/icons/Icons";
import styles from "./FloatingCallPill.module.css";

const DISMISS_KEY = "pvp_floating_call_dismissed";

export function FloatingCallPill({
  display,
  e164,
}: {
  display: string;
  e164: string;
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const syncVisibility = () => {
      try {
        if (window.sessionStorage.getItem(DISMISS_KEY) === "1") {
          setDismissed(true);
          setVisible(false);
          return;
        }
      } catch {
        // sessionStorage may be unavailable in restricted contexts
      }
      setVisible(window.scrollY > 540);
    };

    const raf = window.requestAnimationFrame(syncVisibility);
    window.addEventListener("scroll", syncVisibility, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", syncVisibility);
    };
  }, []);

  if (dismissed || !visible) return null;

  const cleanE164 = e164.replace(/[^\d+]/g, "") || "+16028350102";

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  };

  return (
    <div className={styles.wrapper} role="region" aria-label="Floating call shortcut">
      <a
        href={`tel:${cleanE164}`}
        data-phone=""
        data-call-location="floating-pill"
        aria-label={`Call ${display}`}
        className={`btn-call ${styles.pillLink}`}
      >
        <PhoneIcon size={18} />
        <span data-phone-display="">{display}</span>
      </a>
      <button
        type="button"
        className={styles.dismissBtn}
        aria-label="Dismiss floating call button"
        onClick={handleDismiss}
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}
