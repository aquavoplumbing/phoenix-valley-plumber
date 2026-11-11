"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealCallback = () => void;

let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, RevealCallback>();

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
    return null;
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
            const cb = callbacks.get(entry.target);
            if (cb) {
              cb();
              callbacks.delete(entry.target);
            }
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px 80px 0px" }
    );
  }
  return sharedObserver;
}

export function ScrollReveal({
  children,
  variant = "up",
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  variant?: "up" | "left" | "right" | "scale";
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.setAttribute("data-reveal", "visible");
      return;
    }

    const observer = getSharedObserver();
    if (!observer) {
      el.setAttribute("data-reveal", "visible");
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      el.setAttribute("data-reveal", "pending");
      callbacks.set(el, () => el.setAttribute("data-reveal", "visible"));
      observer.observe(el);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      callbacks.delete(el);
      observer.unobserve(el);
    };
  }, []);

  const variantClass =
    variant === "left"
      ? "reveal-left"
      : variant === "right"
        ? "reveal-right"
        : variant === "scale"
          ? "reveal-scale"
          : "reveal";

  return (
    <div
      ref={ref}
      className={`${variantClass} ${className}`.trim()}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
