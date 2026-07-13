import type { StyleId } from "@/lib/styles";

type Props = {
  id: StyleId;
  className?: string;
};

/**
 * Material boards, not previews.
 *
 * No logo, no mockup, no brand. Each tile is the style's *material*: how it
 * holds space, how it takes light, how hard its edges are. The founder should
 * be able to point at one and say "that one" without ever seeing a logo.
 */
const TILES: Record<StyleId, React.ReactNode> = {
  minimal: (
    <>
      <defs>
        <linearGradient id="tile-minimal-paper" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#F7EFE3" />
          <stop offset="1" stopColor="#E2D6C4" />
        </linearGradient>
      </defs>
      <rect width="320" height="220" fill="url(#tile-minimal-paper)" />
      {/* one rule, one mark, and a great deal of nothing */}
      <line
        x1="48"
        y1="150"
        x2="272"
        y2="150"
        stroke="#0A0E14"
        strokeWidth="1"
        opacity="0.35"
      />
      <circle
        cx="228"
        cy="82"
        r="16"
        fill="none"
        stroke="#0A0E14"
        strokeWidth="1.2"
        opacity="0.5"
      />
      <rect
        x="48"
        y="76"
        width="52"
        height="6"
        rx="3"
        fill="#0A0E14"
        opacity="0.75"
      />
      <rect
        x="48"
        y="96"
        width="96"
        height="4"
        rx="2"
        fill="#0A0E14"
        opacity="0.28"
      />
    </>
  ),

  luxury: (
    <>
      <defs>
        <linearGradient id="tile-luxury-field" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0C0A08" />
          <stop offset="1" stopColor="#161009" />
        </linearGradient>
        <linearGradient id="tile-luxury-foil" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#9A6A28" />
          <stop offset="0.42" stopColor="#F6E3B8" />
          <stop offset="0.68" stopColor="#C08B3A" />
          <stop offset="1" stopColor="#6B4718" />
        </linearGradient>
      </defs>
      <rect width="320" height="220" fill="url(#tile-luxury-field)" />
      {/* foil sweep, then the restraint that makes it luxury */}
      <path
        d="M0 168 C 80 140, 150 190, 320 128 L320 220 L0 220 Z"
        fill="url(#tile-luxury-foil)"
        opacity="0.9"
      />
      <path
        d="M0 150 C 90 122, 160 172, 320 108"
        fill="none"
        stroke="#F6E3B8"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <line
        x1="48"
        y1="58"
        x2="272"
        y2="58"
        stroke="#D4A853"
        strokeWidth="0.7"
        opacity="0.55"
      />
      <line
        x1="48"
        y1="70"
        x2="180"
        y2="70"
        stroke="#D4A853"
        strokeWidth="0.7"
        opacity="0.28"
      />
      <circle
        cx="248"
        cy="46"
        r="10"
        fill="none"
        stroke="#D4A853"
        strokeWidth="0.8"
        opacity="0.5"
      />
    </>
  ),

  modern: (
    <>
      <defs>
        <linearGradient id="tile-modern-field" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#12100E" />
          <stop offset="1" stopColor="#0A0908" />
        </linearGradient>
      </defs>
      <rect width="320" height="220" fill="url(#tile-modern-field)" />
      {/* hard geometry, decisive angles, nothing soft */}
      <rect x="40" y="44" width="86" height="86" fill="#E2D2BC" />
      <rect x="140" y="44" width="42" height="42" fill="#D4A853" />
      <rect
        x="140"
        y="98"
        width="42"
        height="32"
        fill="#E2D2BC"
        opacity="0.35"
      />
      <path d="M200 44 L280 44 L280 130 Z" fill="#D4A853" opacity="0.85" />
      <line
        x1="40"
        y1="160"
        x2="280"
        y2="160"
        stroke="#E2D2BC"
        strokeWidth="2"
        opacity="0.35"
      />
      <line
        x1="40"
        y1="176"
        x2="176"
        y2="176"
        stroke="#D4A853"
        strokeWidth="2"
        opacity="0.6"
      />
    </>
  ),

  classic: (
    <>
      <defs>
        <linearGradient id="tile-classic-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B140D" />
          <stop offset="1" stopColor="#0D0906" />
        </linearGradient>
      </defs>
      <rect width="320" height="220" fill="url(#tile-classic-field)" />
      {/* symmetry, a framed field, and rules that know their place */}
      <rect
        x="26"
        y="22"
        width="268"
        height="176"
        fill="none"
        stroke="#C08B3A"
        strokeWidth="1"
        opacity="0.6"
      />
      <rect
        x="34"
        y="30"
        width="252"
        height="160"
        fill="none"
        stroke="#C08B3A"
        strokeWidth="0.5"
        opacity="0.35"
      />
      <path
        d="M160 66 C 186 86, 186 134, 160 154 C 134 134, 134 86, 160 66 Z"
        fill="none"
        stroke="#E2D2BC"
        strokeWidth="1"
        opacity="0.55"
      />
      <circle cx="160" cy="110" r="6" fill="#D4A853" opacity="0.8" />
      <line
        x1="66"
        y1="110"
        x2="120"
        y2="110"
        stroke="#C08B3A"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <line
        x1="200"
        y1="110"
        x2="254"
        y2="110"
        stroke="#C08B3A"
        strokeWidth="0.8"
        opacity="0.5"
      />
    </>
  ),

  bold: (
    <>
      <defs>
        <linearGradient id="tile-bold-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6E3B8" />
          <stop offset="1" stopColor="#C08B3A" />
        </linearGradient>
      </defs>
      <rect width="320" height="220" fill="#080706" />
      {/* mass against void — the loudest thing in the room */}
      <path d="M0 0 L190 0 L120 220 L0 220 Z" fill="url(#tile-bold-gold)" />
      <rect x="150" y="40" width="132" height="26" fill="#E45C5F" />
      <rect
        x="150"
        y="82"
        width="98"
        height="26"
        fill="#F7EFE3"
        opacity="0.9"
      />
      <rect
        x="150"
        y="124"
        width="132"
        height="10"
        fill="#D4A853"
        opacity="0.7"
      />
      <circle cx="262" cy="176" r="22" fill="#F7EFE3" opacity="0.9" />
    </>
  ),

  elegant: (
    <>
      <defs>
        <linearGradient id="tile-elegant-field" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#191512" />
          <stop offset="1" stopColor="#0B0908" />
        </linearGradient>
        <linearGradient id="tile-elegant-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D4A853" stopOpacity="0" />
          <stop offset="0.5" stopColor="#F6E3B8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#D4A853" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="320" height="220" fill="url(#tile-elegant-field)" />
      {/* fine arcs, wide margins, and light held at a low level */}
      <path
        d="M40 176 C 96 62, 224 62, 280 176"
        fill="none"
        stroke="url(#tile-elegant-line)"
        strokeWidth="1"
      />
      <path
        d="M62 176 C 108 88, 212 88, 258 176"
        fill="none"
        stroke="#E2D2BC"
        strokeWidth="0.6"
        opacity="0.35"
      />
      <path
        d="M86 176 C 122 112, 198 112, 234 176"
        fill="none"
        stroke="#E2D2BC"
        strokeWidth="0.5"
        opacity="0.2"
      />
      <line
        x1="40"
        y1="176"
        x2="280"
        y2="176"
        stroke="#D4A853"
        strokeWidth="0.7"
        opacity="0.6"
      />
      <circle cx="160" cy="72" r="3.5" fill="#F6E3B8" opacity="0.9" />
    </>
  ),
};

export default function StyleTile({ id, className }: Props) {
  return (
    <svg
      viewBox="0 0 320 220"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {TILES[id]}
    </svg>
  );
}
