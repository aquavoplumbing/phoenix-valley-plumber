"use client";

import { useEffect } from "react";

export function TocActive() {
  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>("article h2[id], article h3[id]"));
    if (headings.length === 0) return;

    const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("nav[aria-label='On this page'] a[href^='#']"));
    if (tocLinks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible headings
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0 && visible[0]?.target) {
          const activeId = visible[0].target.id;
          tocLinks.forEach((link) => {
            const href = link.getAttribute("href")?.replace("#", "");
            if (href === activeId) {
              link.setAttribute("aria-current", "true");
              link.classList.add("toc-active");
            } else {
              link.removeAttribute("aria-current");
              link.classList.remove("toc-active");
            }
          });
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, []);

  return null;
}
