import type { ReactNode } from "react";
import { isPlaceholderValue } from "@/lib/config";

export interface PhoneLinkProps {
  display: string;
  e164: string;
  location: string;
  className?: string;
  ariaLabel?: string;
  children?: ReactNode;
  prefix?: string;
}

export function PhoneLink({
  display,
  e164,
  location,
  className = "",
  ariaLabel,
  children,
  prefix,
}: PhoneLinkProps) {
  const isMissing = isPlaceholderValue(display) || isPlaceholderValue(e164);
  const cleanE164 = e164.replace(/[^\d+]/g, "") || "+16028350102";

  return (
    <a
      href={`tel:${cleanE164}`}
      data-phone=""
      data-call-location={location}
      className={className}
      aria-label={ariaLabel}
    >
      {children ?? (
        <>
          {prefix ? <span>{prefix}</span> : null}
          <span data-phone-display="">{display}</span>
          {isMissing && process.env.NODE_ENV !== "production" ? (
            <span className="todo-badge" title="Update phone in data/site.json">
              TODO: phone
            </span>
          ) : null}
        </>
      )}
    </a>
  );
}
