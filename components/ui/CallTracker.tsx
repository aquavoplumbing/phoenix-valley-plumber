"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackGa4Event } from "@/lib/analytics";

export function CallTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Support dynamic number insertion (DNI) via window.__PHONE_OVERRIDE__
    const override = window.__PHONE_OVERRIDE__;
    if (override && override.display && override.e164) {
      const cleanE164 = override.e164.replace(/[^\d+]/g, "");
      const phoneLinks = document.querySelectorAll<HTMLAnchorElement>("a[data-phone]");
      phoneLinks.forEach((link) => {
        link.href = `tel:${cleanE164}`;
        const displayNodes = link.querySelectorAll("[data-phone-display]");
        if (displayNodes.length > 0) {
          displayNodes.forEach((node) => {
            node.textContent = override.display;
          });
        }
        link.setAttribute("aria-label", `Call ${override.display}`);
      });
    }
  }, [pathname]);

  useEffect(() => {
    const firedDepths = new Set<number>();

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const phoneAnchor = target.closest<HTMLAnchorElement>("a[data-phone]");
      if (phoneAnchor) {
        const callLocation = phoneAnchor.getAttribute("data-call-location") ?? "unknown";
        const phoneNumber = phoneAnchor.getAttribute("href")?.replace(/^tel:/, "") ?? "";
        trackGa4Event("phone_click", {
          call_location: callLocation,
          page_path: pathname,
          phone_number: phoneNumber,
        });
        return;
      }

      const cityAnchor = target.closest<HTMLAnchorElement>("a[data-track-city]");
      if (cityAnchor) {
        trackGa4Event("city_chip_click", {
          city: cityAnchor.getAttribute("data-track-city") ?? "",
          page_path: pathname,
        });
        return;
      }

      const contactAnchor = target.closest<HTMLAnchorElement>("a[data-track-contact]");
      if (contactAnchor) {
        trackGa4Event("contact_page_click", {
          location: contactAnchor.getAttribute("data-track-contact") ?? "unknown",
          page_path: pathname,
        });
      }
    };

    const onToggle = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLDetailsElement && target.open) {
        const faqId = target.getAttribute("data-faq-id");
        if (faqId) {
          trackGa4Event("faq_open", {
            question_id: faqId,
            page_path: pathname,
          });
        }
      }
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = Math.round((window.scrollY / scrollable) * 100);
      for (const threshold of [25, 50, 75, 100]) {
        if (percent >= threshold && !firedDepths.has(threshold)) {
          firedDepths.add(threshold);
          trackGa4Event("scroll_depth", {
            percent_scrolled: threshold,
            page_path: pathname,
          });
        }
      }
    };

    document.addEventListener("click", onClick);
    document.addEventListener("toggle", onToggle, true);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("toggle", onToggle, true);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}

