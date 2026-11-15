import type { ServiceIconName } from "@/lib/routes";
import type { IconName } from "@/lib/service-schema";
import { ServiceIcon } from "./Icons";

export function ServiceHeroIllustration({
  icon,
  slug,
}: {
  icon: ServiceIconName | IconName;
  slug: string;
}) {
  const isEmergency = slug.includes("emergency") || slug.includes("burst");
  const accentColor = isEmergency ? "#FF7A1A" : "#1E9BD7";

  return (
    <svg
      viewBox="0 0 420 340"
      fill="none"
      aria-hidden="true"
      style={{ width: "100%", height: "auto", maxHeight: "340px" }}
    >
      <defs>
        <radialGradient id={`svc-glow-${slug}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.28" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Atmospheric glow */}
      <circle cx="210" cy="170" r="150" fill={`url(#svc-glow-${slug})`} />

      {/* Outer rings */}
      <circle
        cx="210"
        cy="170"
        r="128"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1.5"
        strokeDasharray="6 8"
      />
      <circle
        cx="210"
        cy="170"
        r="94"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(30,155,215,0.45)"
        strokeWidth="2"
      />

      {/* Sun-amber accent arc */}
      <path
        d="M 116 170 A 94 94 0 0 1 255 88"
        stroke="#FF7A1A"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Subtle Phoenix horizon line */}
      <path
        d="M 48 272 L 106 244 L 154 260 L 210 234 L 270 258 L 322 242 L 372 272"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center icon badge */}
      <g transform="translate(174, 134)">
        <ServiceIcon
          name={icon}
          size={72}
          stroke="#FFFFFF"
          strokeWidth={1.6}
        />
      </g>

      {/* Secondary decorative droplets / nodes */}
      <circle cx="118" cy="116" r="6" fill="#FF7A1A" opacity="0.85" />
      <circle cx="304" cy="218" r="5" fill="#1E9BD7" opacity="0.9" />
      <circle cx="294" cy="106" r="4" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}

export function PhoenixAngleIllustration({ slug }: { slug: string }) {
  if (slug.includes("water-heater") || slug.includes("tankless")) {
    return (
      <svg viewBox="0 0 360 280" fill="none" aria-hidden="true">
        <rect width="360" height="280" rx="20" fill="#FFFFFF" />
        {/* Tank body */}
        <rect x="115" y="42" width="130" height="190" rx="18" fill="#E6F4FB" stroke="#0B2A4A" strokeWidth="3" />
        {/* Top pipes */}
        <path d="M148 42V22M212 42V22" stroke="#0B2A4A" strokeWidth="4" strokeLinecap="round" />
        <circle cx="148" cy="22" r="5" fill="#1E9BD7" />
        <circle cx="212" cy="22" r="5" fill="#FF7A1A" />
        {/* Heating element / flame */}
        <path
          d="M180 108c10 12 15 20 15 29a15 15 0 1 1-30 0c0-9 5-17 15-29Z"
          fill="#FF7A1A"
          opacity="0.85"
        />
        {/* Hard-water scale layers at bottom */}
        <path
          d="M120 195 Q150 187 180 194 T240 193 L240 214 Q240 227 227 227 L133 227 Q120 227 120 214 Z"
          fill="#FAF6EF"
          stroke="#0B2A4A"
          strokeWidth="2"
        />
        <circle cx="145" cy="210" r="3" fill="#4A5A70" />
        <circle cx="168" cy="215" r="4" fill="#4A5A70" />
        <circle cx="195" cy="208" r="3" fill="#4A5A70" />
        <circle cx="218" cy="216" r="3.5" fill="#4A5A70" />
      </svg>
    );
  }

  if (slug.includes("slab") || slug.includes("leak") || slug.includes("repiping")) {
    return (
      <svg viewBox="0 0 360 280" fill="none" aria-hidden="true">
        <rect width="360" height="280" rx="20" fill="#FFFFFF" />
        {/* House outline */}
        <path d="M60 130 L180 48 L300 130" stroke="#0B2A4A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="84" y="130" width="192" height="64" fill="#FAF6EF" stroke="#0B2A4A" strokeWidth="3" />
        {/* Concrete slab */}
        <rect x="64" y="194" width="232" height="28" rx="4" fill="#E6F4FB" stroke="#0B2A4A" strokeWidth="3" />
        {/* Sub-slab pipe */}
        <path d="M40 242 H320" stroke="#0B2A4A" strokeWidth="6" strokeLinecap="round" />
        <path d="M40 242 H320" stroke="#1E9BD7" strokeWidth="2.5" strokeDasharray="8 6" />
        {/* Leak point */}
        <circle cx="180" cy="242" r="10" fill="#FF7A1A" opacity="0.25" />
        <circle cx="180" cy="242" r="5" fill="#FF7A1A" />
        <path d="M180 232 V210" stroke="#1E9BD7" strokeWidth="3" strokeDasharray="3 3" />
      </svg>
    );
  }

  if (slug.includes("drain") || slug.includes("sewer") || slug.includes("jetting") || slug.includes("camera")) {
    return (
      <svg viewBox="0 0 360 280" fill="none" aria-hidden="true">
        <rect width="360" height="280" rx="20" fill="#FFFFFF" />
        {/* Ground surface */}
        <path d="M24 104 H336" stroke="#0B2A4A" strokeWidth="2.5" strokeDasharray="6 6" />
        {/* Tree / root source */}
        <path d="M180 104 V62" stroke="#0B2A4A" strokeWidth="4" strokeLinecap="round" />
        <circle cx="180" cy="48" r="22" fill="#E6F4FB" stroke="#0B2A4A" strokeWidth="3" />
        {/* Pipe cross-section */}
        <rect x="36" y="168" width="288" height="44" rx="8" fill="#E6F4FB" stroke="#0B2A4A" strokeWidth="3" />
        {/* Roots entering pipe */}
        <path d="M180 104 C172 132 162 146 158 176" stroke="#FF7A1A" strokeWidth="3" strokeLinecap="round" />
        <path d="M180 104 C188 134 198 150 202 182" stroke="#FF7A1A" strokeWidth="3" strokeLinecap="round" />
        <path d="M180 124 C180 148 176 164 180 192" stroke="#FF7A1A" strokeWidth="2.5" strokeLinecap="round" />
        {/* Water flow arrow */}
        <path d="M64 190 H130" stroke="#1E9BD7" strokeWidth="4" strokeLinecap="round" />
        <path d="m120 182 10 8-10 8" stroke="#1E9BD7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 360 280" fill="none" aria-hidden="true">
      <rect width="360" height="280" rx="20" fill="#FFFFFF" />
      {/* Desert sun & valley horizon */}
      <circle cx="276" cy="72" r="26" fill="#FAF6EF" stroke="#FF7A1A" strokeWidth="3" />
      <path d="M36 196 L110 140 L170 172 L244 128 L324 196" stroke="#0B2A4A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Clean water wave */}
      <path
        d="M36 226 Q96 206 156 226 T276 226 T324 226"
        stroke="#1E9BD7"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="156" cy="186" r="28" fill="#E6F4FB" stroke="#0B2A4A" strokeWidth="3" />
      <path d="M156 170c0 0-11 12-11 19a11 11 0 0 0 22 0c0-7-11-19-11-19Z" fill="#1E9BD7" />
    </svg>
  );
}

