import type { ActivityId } from "@/lib/activities";

type Props = {
  id: ActivityId;
  className?: string;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

const PATHS: Record<ActivityId, React.ReactNode> = {
  store: (
    <>
      <path d="M4.4 9h15.2l-1 11.2H5.4L4.4 9Z" />
      <path d="M8.6 9V7.2a3.4 3.4 0 0 1 6.8 0V9" />
      <path d="M4.4 9 6 4.6h12L19.6 9" />
    </>
  ),
  restaurant: (
    <>
      <path d="M3.6 17.6h16.8" />
      <path d="M6 17.6a6 6 0 0 1 12 0" />
      <path d="M12 7.6v2.6" />
      <path d="M10.6 6.4a1.4 1.4 0 1 1 2.8 0" />
    </>
  ),
  office: (
    <>
      <rect x="3.2" y="8.2" width="17.6" height="11.8" rx="2" />
      <path d="M9 8.2V6.4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.8" />
      <path d="M3.2 13.2h17.6" />
      <path d="M11 12.8h2v1.6h-2z" />
    </>
  ),
  clinic: (
    <>
      <path d="M12 4.2 4.6 7.4v5.2c0 4.2 3 7.9 7.4 9 4.4-1.1 7.4-4.8 7.4-9V7.4L12 4.2Z" />
      <path d="M12 9.6v5.4M9.3 12.3h5.4" />
    </>
  ),
  services: (
    <>
      <path d="M3 16.4h1.9l2-5.6h9.4l2 5.6H20" />
      <path d="M6.9 10.8V8.2a1.4 1.4 0 0 1 1.4-1.4h7.4a1.4 1.4 0 0 1 1.4 1.4v2.6" />
      <circle cx="7.4" cy="17.6" r="1.6" />
      <circle cx="16.6" cy="17.6" r="1.6" />
    </>
  ),
  other: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="8.4" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.6" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function ActivityIcon({ id, className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...stroke}>
      {PATHS[id]}
    </svg>
  );
}
