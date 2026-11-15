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

      const pageCitySlug =
        document.querySelector("[data-city-slug]")?.getAttribute("data-city-slug") ?? undefined;
      const serviceSlug =
        document.querySelector("[data-service-slug]")?.getAttribute("data-service-slug") ?? undefined;

      const phoneAnchor = target.closest<HTMLAnchorElement>("a[data-phone]");
      if (phoneAnchor) {
        const callLocation = phoneAnchor.getAttribute("data-call-location") ?? "unknown";
        const phoneNumber = phoneAnchor.getAttribute("href")?.replace(/^tel:/, "") ?? "";
        trackGa4Event("phone_click", {
          call_location: callLocation,
          page_path: pathname,
          ...(pageCitySlug ? { city_slug: pageCitySlug } : {}),
          ...(serviceSlug ? { service_slug: serviceSlug } : {}),
          phone_number: phoneNumber,
        });
        return;
      }

      const serviceFromCityAnchor = target.closest<HTMLAnchorElement>("a[data-service-click-from-city]");
      if (serviceFromCityAnchor) {
        const targetSvc = serviceFromCityAnchor.getAttribute("data-service-click-from-city") ?? "";
        const fromCity = serviceFromCityAnchor.getAttribute("data-from-city-slug") ?? pageCitySlug ?? "";
        trackGa4Event("service_click_from_city", {
          city_slug: fromCity,
          service_slug: targetSvc,
          page_path: pathname,
        });
        return;
      }

      const relatedAnchor = target.closest<HTMLAnchorElement>("a[data-related-service]");
      if (relatedAnchor) {
        trackGa4Event("related_service_click", {
          from_slug: relatedAnchor.getAttribute("data-from-slug") ?? "",
          to_slug: relatedAnchor.getAttribute("data-related-service") ?? "",
          page_path: pathname,
        });
        return;
      }

      const cityAnchor = target.closest<HTMLAnchorElement>("a[data-track-city]");
      if (cityAnchor) {
        const fromSlug = cityAnchor.getAttribute("data-from-slug") ?? pageCitySlug ?? "";
        const toSlug = cityAnchor.getAttribute("data-to-slug") ?? "";
        trackGa4Event("city_chip_click", {
          city: cityAnchor.getAttribute("data-track-city") ?? "",
          from_slug: fromSlug,
          to_slug: toSlug,
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
        return;
      }

      const emailAnchor = target.closest<HTMLAnchorElement>("a[data-track-email]");
      if (emailAnchor) {
        trackGa4Event("contact_email_click", {
          page_path: pathname,
        });
        return;
      }

      const smsAnchor = target.closest<HTMLAnchorElement>("a[data-track-sms]");
      if (smsAnchor) {
        trackGa4Event("contact_sms_click", {
          page_path: pathname,
        });
        return;
      }

      const rocAnchor = target.closest<HTMLAnchorElement>("a[data-track-roc]");
      if (rocAnchor) {
        trackGa4Event("roc_verify_click", {
          page_path: pathname,
        });
        return;
      }
    };

    const onToggle = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLDetailsElement && target.open) {
        const faqId = target.getAttribute("data-faq-id");
        if (faqId) {
          const pageCitySlug =
            document.querySelector("[data-city-slug]")?.getAttribute("data-city-slug") ?? undefined;
          const serviceSlug =
            document.querySelector("[data-service-slug]")?.getAttribute("data-service-slug") ?? undefined;
          trackGa4Event("faq_open", {
            question_id: faqId,
            ...(pageCitySlug ? { city_slug: pageCitySlug } : {}),
            ...(serviceSlug ? { service_slug: serviceSlug } : {}),
            page_path: pathname,
          });
        }
      }
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const currentProgress = (window.scrollY / scrollable) * 100;
      const thresholds = [25, 50, 75, 90];
      for (const t of thresholds) {
        if (currentProgress >= t && !firedDepths.has(t)) {
          firedDepths.add(t);
          trackGa4Event("scroll_depth", {
            percent: t,
            page_path: pathname,
          });
        }
      }
    };

    window.addEventListener("click", onClick, { capture: true });
    window.addEventListener("toggle", onToggle, { capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("toggle", onToggle, { capture: true });
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
