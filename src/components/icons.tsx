type IconProps = { className?: string };

function base(children: React.ReactNode, className?: string) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      {children}
    </svg>
  );
}

export function BackIcon({ className }: IconProps) {
  return base(<path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />, className);
}

export function MenuDotsIcon({ className }: IconProps) {
  return base(
    <>
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>,
    className
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return base(<path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />, className);
}

export function EngineIcon({ className }: IconProps) {
  return base(
    <>
      <path d="M3 13v4h2v-4M5 13h9l3 3h4v-3h-3l-2-3H8L5 13Z" strokeLinejoin="round" />
      <path d="M9 10v-2M13 10v-2" strokeLinecap="round" />
    </>,
    className
  );
}

export function GaugeIcon({ className }: IconProps) {
  return base(
    <>
      <path d="M4 15a8 8 0 1 1 16 0" strokeLinecap="round" />
      <path d="M12 15l4-5" strokeLinecap="round" />
      <path d="M12 15h.01" strokeLinecap="round" />
    </>,
    className
  );
}

export function TorqueIcon({ className }: IconProps) {
  return base(
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" strokeLinecap="round" />
    </>,
    className
  );
}

export function TurboIcon({ className }: IconProps) {
  return base(
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 12 6.5 8.5M12 12l6-1M12 12l-1 6.5" strokeLinecap="round" />
    </>,
    className
  );
}

export function KeyIcon({ className }: IconProps) {
  return base(
    <>
      <circle cx="8" cy="12" r="3.2" />
      <path d="M11 12h10M17 12v3M20 12v3" strokeLinecap="round" />
    </>,
    className
  );
}

export function DrivetrainIcon({ className }: IconProps) {
  return base(
    <>
      <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
      <circle cx="5" cy="5" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="19" cy="5" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="5" cy="19" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="19" cy="19" r="1.6" fill="currentColor" stroke="none" />
    </>,
    className
  );
}

export function ChipIcon({ className }: IconProps) {
  return base(
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.2" />
      <path d="M9 3v3M13 3v3M9 18v3M13 18v3M3 9h3M3 13h3M18 9h3M18 13h3" strokeLinecap="round" />
    </>,
    className
  );
}

export function ChainIcon({ className }: IconProps) {
  return base(
    <>
      <circle cx="9" cy="9" r="4" />
      <circle cx="15" cy="15" r="4" />
      <path d="M11.5 6.5 12.5 6.5M6.5 11.5v1M17.5 11.5v1M11.5 17.5h1" strokeLinecap="round" />
    </>,
    className
  );
}

export function ClipboardNavIcon({ className }: IconProps) {
  return base(
    <>
      <path d="M7 4h10v16H7z" strokeLinejoin="round" />
      <path d="M9 4V3h6v1" strokeLinejoin="round" />
      <path d="M9.5 10h5M9.5 14h5" strokeLinecap="round" />
    </>,
    className
  );
}

export function WrenchNavIcon({ className }: IconProps) {
  return base(
    <path
      d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.6-2.6z"
      strokeLinejoin="round"
      strokeLinecap="round"
    />,
    className
  );
}

export function PulseNavIcon({ className }: IconProps) {
  return base(<path d="M3 12h4l2-7 4 14 2-7h6" strokeLinecap="round" strokeLinejoin="round" />, className);
}

export function HeadsetNavIcon({ className }: IconProps) {
  return base(
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" strokeLinecap="round" />
      <rect x="3" y="13" width="4" height="6" rx="1.2" />
      <rect x="17" y="13" width="4" height="6" rx="1.2" />
      <path d="M20 19v1a2 2 0 0 1-2 2h-3" strokeLinecap="round" />
    </>,
    className
  );
}

export function ChartSmallIcon({ className }: IconProps) {
  return base(<path d="M4 17V11M9.5 17V7M15 17v-5M20 17V9" strokeLinecap="round" />, className);
}

export function FuelIcon({ className }: IconProps) {
  return base(<path d="M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9Z" strokeLinejoin="round" />, className);
}

export function OdometerIcon({ className }: IconProps) {
  return base(
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M9 15l1.5-5M15 15l-1.5-5M12 9v-1" strokeLinecap="round" />
    </>,
    className
  );
}

export function MessageFabIcon({ className }: IconProps) {
  return base(
    <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9.5L5 20v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" strokeLinejoin="round" />,
    className
  );
}

export function LockIcon({ className }: IconProps) {
  return base(
    <>
      <rect x="5" y="10" width="14" height="10" rx="1.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </>,
    className
  );
}

export function ShieldCheckIcon({ className }: IconProps) {
  return base(
    <>
      <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    className
  );
}

export function TargetIcon({ className }: IconProps) {
  return base(
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </>,
    className
  );
}

export function CrownIcon({ className }: IconProps) {
  return base(
    <path d="M4 17h16l1-9-5 3-4-5-4 5-5-3 1 9Z" strokeLinejoin="round" strokeLinecap="round" />,
    className
  );
}

export function CheckCircleIcon({ className }: IconProps) {
  return base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    className
  );
}

export function TrendUpIcon({ className }: IconProps) {
  return base(
    <>
      <path d="M3 16l6-6 4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    className
  );
}

export function RefreshIcon({ className }: IconProps) {
  return base(
    <>
      <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" strokeLinecap="round" />
      <path d="M18 3v4h-4M6 21v-4h4" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    className
  );
}
