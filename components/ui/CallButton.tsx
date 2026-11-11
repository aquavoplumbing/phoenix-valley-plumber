import { PhoneIcon } from "@/components/icons/Icons";
import { isPlaceholderValue } from "@/lib/config";
import { PhoneLink } from "./PhoneLink";

export function CallButton({
  display,
  e164,
  location,
  label = "Call Now",
  size = "md",
  className = "",
  showNumber = true,
}: {
  display: string;
  e164: string;
  location: string;
  label?: string;
  size?: "md" | "lg";
  className?: string;
  showNumber?: boolean;
}) {
  const isMissing = isPlaceholderValue(display) || isPlaceholderValue(e164);

  return (
    <PhoneLink
      display={display}
      e164={e164}
      location={location}
      ariaLabel={showNumber ? undefined : `${label} ${display}`}
      className={`btn-call ${size === "lg" ? "btn-call--lg" : ""} ${className}`.trim()}
    >
      <PhoneIcon size={20} />
      <span>
        {label}
        {showNumber ? (
          <>
            {" · "}
            <span data-phone-display="">{display}</span>
          </>
        ) : null}
      </span>
      {isMissing && process.env.NODE_ENV !== "production" ? (
        <span className="todo-badge">TODO</span>
      ) : null}
    </PhoneLink>
  );
}
