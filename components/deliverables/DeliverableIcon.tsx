import type { DeliverableIconId } from "@/lib/deliverables";

type Props = {
  id: DeliverableIconId;
  className?: string;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

/** Thin, quiet, one weight throughout. The icons are furniture, not decoration. */
const PATHS: Record<DeliverableIconId, React.ReactNode> = {
  logo: (
    <>
      <path d="M12 3.6 19.2 8v8L12 20.4 4.8 16V8L12 3.6Z" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  guidelines: (
    <>
      <path d="M5 4.5h9.5A2.5 2.5 0 0 1 17 7v12.5H7.5A2.5 2.5 0 0 1 5 17V4.5Z" />
      <path d="M17 19.5H19M8 8.5h6M8 12h6M8 15.5h3.5" />
    </>
  ),
  palette: (
    <>
      <path d="M12 4a8 8 0 0 0 0 16c1.2 0 1.8-.9 1.8-1.8 0-1.4 1-2 2.2-2h1.2A2.8 2.8 0 0 0 20 13.4 8 8 0 0 0 12 4Z" />
      <circle cx="8.6" cy="10.4" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="8.4" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.4" cy="10.4" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  type: (
    <>
      <path d="M5 6.5h14" />
      <path d="M12 6.5V19" />
      <path d="M9 19h6" />
    </>
  ),
  svg: (
    <>
      <rect x="4.5" y="5" width="15" height="14" rx="2" />
      <path d="M8.5 15.5c1.8 0 2.4-1.2 2.4-2.6 0-2-2.8-1.6-2.8-3.2 0-.9.7-1.4 1.7-1.4" />
      <path d="M13.2 8.4l1.6 6.8 1.6-6.8" />
    </>
  ),
  pdf: (
    <>
      <path d="M6.5 3.6h7.2L18 8v12.4H6.5V3.6Z" />
      <path d="M13.4 3.6V8H18" />
      <path d="M9.4 16.4v-4h1.4a1.3 1.3 0 0 1 0 2.6H9.4" />
    </>
  ),
  png: (
    <>
      <rect x="4.5" y="5.5" width="15" height="13" rx="2" />
      <path d="M4.5 15l3.6-3.4 3 2.8 3.2-3.4 4.2 4" />
      <circle cx="9.2" cy="9.4" r="1.2" />
    </>
  ),
  icons: (
    <>
      <rect x="4.6" y="4.6" width="6" height="6" rx="1.4" />
      <rect x="13.4" y="4.6" width="6" height="6" rx="3" />
      <rect x="4.6" y="13.4" width="6" height="6" rx="3" />
      <path d="M16.4 13.4l3 6h-6l3-6Z" />
    </>
  ),
  pattern: (
    <>
      <rect x="4.5" y="4.5" width="15" height="15" rx="2" />
      <path d="M4.5 9.5h15M4.5 14.5h15M9.5 4.5v15M14.5 4.5v15" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  social: (
    <>
      <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="16.2" cy="7.8" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  card: (
    <>
      <rect x="3.6" y="6.5" width="16.8" height="11" rx="2" />
      <path d="M6.6 10.4h4M6.6 13.6h6.4" />
      <circle cx="16.6" cy="11.4" r="1.8" />
    </>
  ),
  letterhead: (
    <>
      <rect x="6" y="3.6" width="12" height="16.8" rx="1.6" />
      <path d="M8.8 7.4h4.4M8.8 11h6.4M8.8 14.2h6.4M8.8 17.4h3.4" />
    </>
  ),
  envelope: (
    <>
      <rect x="3.6" y="6" width="16.8" height="12" rx="2" />
      <path d="M3.6 8.2 12 13.4l8.4-5.2" />
    </>
  ),
  profile: (
    <>
      <path d="M6 4.6h9l3 3v11.8H6V4.6Z" />
      <path d="M15 4.6v3h3" />
      <path d="M8.8 12.4h6.4M8.8 15.6h4.2" />
      <circle cx="10.4" cy="9.2" r="1.4" />
    </>
  ),
  print: (
    <>
      <path d="M7 9V4.6h10V9" />
      <rect x="4.5" y="9" width="15" height="6.4" rx="1.6" />
      <path d="M7 13.6h10v5.8H7v-5.8Z" />
    </>
  ),
  digital: (
    <>
      <rect x="3.6" y="5" width="16.8" height="11" rx="2" />
      <path d="M9 19h6M12 16v3" />
    </>
  ),
};

export default function DeliverableIcon({ id, className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...stroke}>
      {PATHS[id]}
    </svg>
  );
}
