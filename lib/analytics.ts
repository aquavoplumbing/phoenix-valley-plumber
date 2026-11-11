export type Ga4Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __PHONE_OVERRIDE__?: {
      display: string;
      e164: string;
    };
  }
}

export function trackGa4Event(eventName: string, params?: Ga4Params): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params ?? {});
}
