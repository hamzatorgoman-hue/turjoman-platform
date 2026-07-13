type Props = {
  className?: string;
  id?: string;
  title?: string;
};

/**
 * Turjoman monogram: a shielded pin (the "guide" marker) carrying the T stem
 * and the O aperture. Rendered as vector — never as an image.
 */
export default function TurjomanMark({
  className,
  id = "turjoman-mark",
  title = "ترجمان",
}: Props) {
  const gold = `${id}-gold`;
  const goldSoft = `${id}-gold-soft`;

  return (
    <svg
      viewBox="0 0 120 150"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gold} x1="12" y1="6" x2="108" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F6E3B8" />
          <stop offset="0.38" stopColor="#D4A853" />
          <stop offset="0.62" stopColor="#9A6A28" />
          <stop offset="1" stopColor="#E8C97A" />
        </linearGradient>
        <linearGradient id={goldSoft} x1="30" y1="0" x2="90" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E8C97A" />
          <stop offset="1" stopColor="#8A5F22" />
        </linearGradient>
      </defs>

      {/* pin body */}
      <path
        d="M60 148 12 96V14a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v82L60 148Z"
        fill="rgba(11,8,6,0.72)"
        stroke={`url(#${gold})`}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* T crossbar */}
      <rect x="30" y="26" width="60" height="9" rx="2" fill={`url(#${gold})`} />
      {/* T stem */}
      <rect x="55.5" y="26" width="9" height="46" rx="2" fill={`url(#${goldSoft})`} />

      {/* O aperture */}
      <circle cx="60" cy="88" r="21" fill="none" stroke={`url(#${gold})`} strokeWidth="7" />
      <circle cx="60" cy="88" r="7.5" fill={`url(#${goldSoft})`} />

      {/* node accents */}
      <circle cx="24" cy="88" r="3.2" fill="#D4A853" opacity="0.85" />
      <circle cx="96" cy="88" r="3.2" fill="#D4A853" opacity="0.85" />
    </svg>
  );
}
