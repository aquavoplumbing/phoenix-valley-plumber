import { ExternalLinkIcon } from "@/components/icons/Icons";

export function SourceLink({
  href,
  label = "Source",
  variant = "default",
}: {
  href: string;
  label?: string;
  variant?: "default" | "light" | "inherit";
}) {
  const color =
    variant === "light"
      ? "#7DD3FC"
      : variant === "inherit"
        ? "inherit"
        : "var(--water-700)";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "0.8125rem",
        fontWeight: 600,
        color,
        textDecoration: "underline",
        textUnderlineOffset: "3px",
      }}
    >
      <span>{label}</span>
      <ExternalLinkIcon size={12} />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

