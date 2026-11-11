import type { SVGProps } from "react";
import type { ServiceIconName } from "@/lib/routes";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function BaseIcon({
  size = 24,
  children,
  ...rest
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </BaseIcon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </BaseIcon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m6 9 6 6 6-6" />
    </BaseIcon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m15 18-6-6 6-6" />
    </BaseIcon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m9 18 6-6-6-6" />
    </BaseIcon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </BaseIcon>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </BaseIcon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </BaseIcon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </BaseIcon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M20 6 9 17l-5-5" />
    </BaseIcon>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg
      width={props.size ?? 20}
      height={props.size ?? 20}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </BaseIcon>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </BaseIcon>
  );
}

export function SirenIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 18v-6a5 5 0 0 1 10 0v6" />
      <path d="M5 18a2 2 0 0 0-2 2v1h18v-1a2 2 0 0 0-2-2H5Z" />
      <path d="M12 2v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </BaseIcon>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3q1 4 4 6.5t3 5.5a7 7 0 1 1-14 0 5.5 5.5 0 0 1 2.2-4.4Q9 9.2 9.5 6.5 11 4.5 12 3Z" />
      <path d="M12 19a3 3 0 0 0 3-3c0-1.5-1-2.5-3-4-2 1.5-3 2.5-3 4a3 3 0 0 0 3 3Z" />
    </BaseIcon>
  );
}

export function HeaterIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="6" y="4" width="12" height="16" rx="3" />
      <path d="M9 4V2" />
      <path d="M15 4V2" />
      <path d="M10 11c0 1.2 1 1.8 2 2.5 1-.7 2-1.3 2-2.5 0-.9-.7-1.7-2-2.5-1.3.8-2 1.6-2 2.5Z" />
      <path d="M9 17h6" />
    </BaseIcon>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M13 2 4 14h7l-1 8 10-12h-7l0-8Z" />
    </BaseIcon>
  );
}

export function DrainIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v5" />
      <path d="M12 16v5" />
      <path d="M3 12h5" />
      <path d="M16 12h5" />
    </BaseIcon>
  );
}

export function JetIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 12h8" />
      <path d="m12 9 4 3-4 3" />
      <path d="M16 7c2 0 4 2 4 5s-2 5-4 5" />
      <path d="M2 8h4" />
      <path d="M2 16h4" />
    </BaseIcon>
  );
}

export function PipeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 8h10a4 4 0 0 1 4 4v9" />
      <path d="M3 13h9a1 1 0 0 1 1 1v7" />
      <path d="M3 6v9" />
      <path d="M11 21h8" />
    </BaseIcon>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="7" width="13" height="10" rx="2" />
      <path d="m16 10 5-3v10l-5-3" />
      <circle cx="9.5" cy="12" r="2.2" />
    </BaseIcon>
  );
}

export function DropletIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 2.7C12 2.7 6 9.5 6 14a6 6 0 0 0 12 0c0-4.5-6-11.3-6-11.3Z" />
      <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
    </BaseIcon>
  );
}

export function WrenchIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
    </BaseIcon>
  );
}

export function ToiletIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 3h6a1 1 0 0 1 1 1v7H6V4a1 1 0 0 1 1-1Z" />
      <path d="M5 11h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5H9a4 4 0 0 1-4-4v-2Z" />
      <path d="M8 17v4h7v-4" />
    </BaseIcon>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 5h16l-6 7.5V19l-4 2v-8.5L4 5Z" />
    </BaseIcon>
  );
}

export function AwardIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="9" r="6" />
      <path d="m15.477 14.89 1.515 6.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-6.526" />
    </BaseIcon>
  );
}

const SERVICE_ICONS: Record<ServiceIconName, (props: IconProps) => React.JSX.Element> = {
  siren: SirenIcon,
  flame: FlameIcon,
  heater: HeaterIcon,
  bolt: BoltIcon,
  drain: DrainIcon,
  jet: JetIcon,
  pipe: PipeIcon,
  camera: CameraIcon,
  droplet: DropletIcon,
  wrench: WrenchIcon,
  toilet: ToiletIcon,
  filter: FilterIcon,
  shield: ShieldIcon,
};

export function ServiceIcon({
  name,
  ...props
}: IconProps & { name: ServiceIconName }) {
  const Component = SERVICE_ICONS[name] ?? WrenchIcon;
  return <Component {...props} />;
}

