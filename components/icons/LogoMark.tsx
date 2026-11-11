export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Desert sun arc */}
      <path
        d="M8 23a12 12 0 0 1 24 0"
        stroke="#FF7A1A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M5 27h30"
        stroke="#FF7A1A"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Water droplet */}
      <path
        d="M20 9.5C20 9.5 13.5 17.2 13.5 22.5a6.5 6.5 0 0 0 13 0C26.5 17.2 20 9.5 20 9.5Z"
        fill="#1E9BD7"
        stroke="#0B2A4A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 22.8a2.5 2.5 0 0 0 2.5 2.5"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

