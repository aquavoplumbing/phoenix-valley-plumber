export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 560 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label=""
      aria-hidden="true"
      style={{ width: "100%", height: "auto" }}
    >
      <defs>
        <linearGradient id="heroCardBg" x1="0" y1="0" x2="560" y2="440" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#123F6B" />
          <stop offset="100%" stopColor="#0B2A4A" />
        </linearGradient>
        <linearGradient id="copperPipe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF9B4E" />
          <stop offset="100%" stopColor="#E8650A" />
        </linearGradient>
        <linearGradient id="waterDropGrad" x1="280" y1="120" x2="280" y2="290" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#56C4F5" />
          <stop offset="100%" stopColor="#1E9BD7" />
        </linearGradient>
      </defs>

      <rect width="560" height="440" rx="24" fill="url(#heroCardBg)" />

      {/* Subtle desert horizon contour lines */}
      <path
        d="M0 325 Q 110 295, 220 320 T 440 310 T 560 328 L 560 440 L 0 440 Z"
        fill="#0A233E"
        opacity="0.7"
      />
      <path
        d="M0 365 Q 140 340, 280 362 T 560 355 L 560 440 L 0 440 Z"
        fill="#081C32"
        opacity="0.85"
      />

      {/* Desert sun glow */}
      <circle cx="430" cy="110" r="56" fill="#FF7A1A" opacity="0.14" />
      <circle cx="430" cy="110" r="32" fill="#FF7A1A" opacity="0.22" />

      {/* Main plumbing pipe network */}
      <path
        d="M52 140 H 196 A 24 24 0 0 1 220 164 V 230"
        stroke="url(#copperPipe)"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M52 140 H 196 A 24 24 0 0 1 220 164 V 230"
        stroke="#FFD2AD"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.45"
      />

      {/* Horizontal branch pipe */}
      <path
        d="M340 240 H 480 A 22 22 0 0 0 502 218 V 150"
        stroke="#2B6CA3"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M340 240 H 480 A 22 22 0 0 0 502 218 V 150"
        stroke="#8BD6FA"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />

      {/* Pipe collars / fittings */}
      <rect x="115" y="124" width="18" height="32" rx="4" fill="#FAF6EF" />
      <rect x="405" y="224" width="18" height="32" rx="4" fill="#FAF6EF" />

      {/* Central water shield / droplet emblem */}
      <circle cx="280" cy="212" r="88" fill="#1E9BD7" opacity="0.16" />
      <circle cx="280" cy="212" r="68" fill="#E6F4FB" opacity="0.1" stroke="#56C4F5" strokeWidth="1.5" strokeDasharray="6 6" />
      <path
        d="M280 124 C 280 124 226 188 226 228 A 54 54 0 0 0 334 228 C 334 188 280 124 280 124 Z"
        fill="url(#waterDropGrad)"
      />
      <path
        d="M256 226 A 24 24 0 0 0 280 250"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Pressure gauge accent */}
      <g transform="translate(115, 250)">
        <circle cx="38" cy="38" r="32" fill="#0B2A4A" stroke="#FF7A1A" strokeWidth="4" />
        <circle cx="38" cy="38" r="22" fill="#FAF6EF" />
        <path d="M38 38 L 51 25" stroke="#0B2A4A" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="38" cy="38" r="4" fill="#FF7A1A" />
      </g>

      {/* Wrench silhouette accent */}
      <g transform="translate(385, 286)" opacity="0.9">
        <rect x="0" y="10" width="96" height="16" rx="8" fill="#E6F4FB" opacity="0.22" />
        <circle cx="96" cy="18" r="14" fill="#E6F4FB" opacity="0.25" />
      </g>
    </svg>
  );
}

