"use client";

import { useEffect } from "react";

export function NotFoundTracker() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
      if (Array.isArray(dl)) {
        dl.push({
          event: "not_found_view",
          path,
        });
      }
    }
  }, []);

  return null;
}
