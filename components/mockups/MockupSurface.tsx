import { DirectionSymbolGlyph } from "@/components/identity/DirectionSymbol";
import type { ActivityId } from "@/lib/activities";
import type { Direction } from "@/lib/identity-direction";
import type { PersonalityId } from "@/lib/personalities";
import type { StyleId } from "@/lib/styles";
import PatternDef from "./PatternDef";

export type MockupKind =
  | "hero"
  | "card"
  | "sign"
  | "cup"
  | "bag"
  | "box"
  | "uniform"
  | "vehicle"
  | "social";

type Props = {
  kind: MockupKind;
  direction: Direction;
  style: StyleId;
  activity: ActivityId;
  personality: PersonalityId;
  className?: string;
};

/**
 * Mockups, not fakes.
 *
 * Every surface here is drawn from the identity direction the founder already
 * chose: its ink, its accent, its surface, its texture, its type. The symbol is
 * still the placeholder aperture from the board — the mark has not been designed
 * yet, and pretending otherwise would be selling a picture we cannot deliver.
 *
 * What these show is *presentation quality*: how the work will be applied, and
 * to what standard.
 */

export default function MockupSurface({
  kind,
  direction,
  style,
  activity,
  personality,
  className,
}: Props) {
  const ink = direction.primary[0].hex;
  const accent = direction.primary[1].hex;
  const surface = direction.secondary[0].hex;
  const neutral = direction.secondary[1].hex;
  const shade = direction.secondary[2].hex;

  const patternId = `mk-${kind}-pattern`;
  const displayClass = direction.typography.displayClass;
  const latinClass = direction.typography.latinClass;

  const defs = (
    <defs>
      <PatternDef
        id={patternId}
        pattern={direction.pattern}
        accent={accent}
        surface={surface}
        neutral={neutral}
      />
      <linearGradient id={`mk-${kind}-studio`} x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" stopColor="#191410" />
        <stop offset="1" stopColor="#0A0806" />
      </linearGradient>
      <linearGradient id={`mk-${kind}-sheen`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.16" />
        <stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`mk-${kind}-pool`} cx="0.5" cy="1" r="0.8">
        <stop offset="0" stopColor="#000000" stopOpacity="0.45" />
        <stop offset="1" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>
  );

  const studio = (
    <rect width="400" height="260" fill={`url(#mk-${kind}-studio)`} />
  );
  const pool = (
    <ellipse
      cx="200"
      cy="248"
      rx="150"
      ry="16"
      fill={`url(#mk-${kind}-pool)`}
    />
  );

  /* ------------------------------------------------------------------ hero */
  if (kind === "hero") {
    return (
      <svg
        viewBox="0 0 960 540"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        className={className}
      >
        <defs>
          <PatternDef
            id={patternId}
            pattern={direction.pattern}
            accent={accent}
            surface={surface}
            neutral={neutral}
          />
          <linearGradient id="mk-hero-room" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0" stopColor="#1B1611" />
            <stop offset="1" stopColor="#080605" />
          </linearGradient>
          <linearGradient id="mk-hero-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0.30" />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* the room */}
        <rect width="960" height="540" fill="url(#mk-hero-room)" />
        {/* textured feature wall */}
        <rect
          x="0"
          y="0"
          width="520"
          height="420"
          fill={`url(#${patternId})`}
          opacity="0.9"
        />
        <rect x="0" y="0" width="520" height="420" fill="#000" opacity="0.12" />

        {/* backlit brand wall */}
        <rect x="560" y="60" width="360" height="300" fill={ink} />
        <rect
          x="560"
          y="60"
          width="360"
          height="300"
          fill="url(#mk-hero-glow)"
          opacity="0.6"
        />
        <DirectionSymbolGlyph
          x={620}
          y={110}
          size={110}
          activity={activity}
          personality={personality}
          style={style}
          accent={accent}
          ink={ink}
        />
        <text
          x={760}
          y={175}
          textAnchor="middle"
          className={displayClass}
          fontSize="40"
          fill={surface}
        >
          {direction.arabicName}
        </text>
        <text
          x={760}
          y={210}
          textAnchor="middle"
          className={latinClass}
          fontSize="13"
          fill={accent}
        >
          {direction.latinName}
        </text>
        <rect x="700" y="232" width="120" height="2" fill={accent} />

        {/* counter */}
        <rect x="0" y="420" width="960" height="120" fill={shade} />
        <rect
          x="0"
          y="420"
          width="960"
          height="3"
          fill={accent}
          opacity="0.5"
        />

        {/* a card and a cup on the counter — silhouettes, not props */}
        <g>
          <rect x="120" y="450" width="150" height="90" rx="4" fill={surface} />
          <DirectionSymbolGlyph
            x={140}
            y={468}
            size={44}
            activity={activity}
            personality={personality}
            style={style}
            accent={accent}
            ink={surface}
          />
          <text
            x={196}
            y={508}
            className={displayClass}
            fontSize="15"
            fill={ink}
          >
            {direction.arabicName}
          </text>
        </g>
        <g>
          <path d="M330 540 L344 462 h64 l14 78 Z" fill={surface} />
          <rect x="336" y="486" width="80" height="26" fill={accent} />
          <DirectionSymbolGlyph
            x={362}
            y={488}
            size={22}
            activity={activity}
            personality={personality}
            style={style}
            accent={ink}
            ink={accent}
          />
        </g>

        <rect width="960" height="540" fill="#000" opacity="0.06" />
      </svg>
    );
  }

  /* ------------------------------------------------------- business card */
  if (kind === "card") {
    return (
      <svg
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        className={className}
      >
        {defs}
        {studio}
        {pool}
        {/* back of card: the texture */}
        <g transform="rotate(-8 150 120)">
          <rect
            x="52"
            y="58"
            width="190"
            height="112"
            rx="4"
            fill={`url(#${patternId})`}
          />
          <rect
            x="52"
            y="58"
            width="190"
            height="112"
            rx="4"
            fill={`url(#mk-card-sheen)`}
          />
        </g>
        {/* front of card: the identity */}
        <g transform="rotate(4 250 150)">
          <rect x="158" y="96" width="196" height="116" rx="4" fill={surface} />
          <DirectionSymbolGlyph
            x={176}
            y={112}
            size={46}
            activity={activity}
            personality={personality}
            style={style}
            accent={accent}
            ink={surface}
          />
          <text
            x={176}
            y={186}
            className={displayClass}
            fontSize="17"
            fill={ink}
          >
            {direction.arabicName}
          </text>
          <text
            x={176}
            y={202}
            className={latinClass}
            fontSize="7"
            fill={neutral}
          >
            {direction.latinName}
          </text>
          <rect x="300" y="180" width="36" height="2" fill={accent} />
          <rect
            x="158"
            y="96"
            width="196"
            height="116"
            rx="4"
            fill={`url(#mk-card-sheen)`}
          />
        </g>
      </svg>
    );
  }

  /* ------------------------------------------------------------ store sign */
  if (kind === "sign") {
    return (
      <svg
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        className={className}
      >
        {defs}
        <rect width="400" height="260" fill="#0B0908" />
        {/* facade */}
        <rect x="20" y="30" width="360" height="200" fill={shade} />
        <rect
          x="40"
          y="150"
          width="140"
          height="80"
          fill="#050403"
          opacity="0.85"
        />
        <rect
          x="220"
          y="150"
          width="140"
          height="80"
          fill="#050403"
          opacity="0.85"
        />
        {/* illuminated sign panel */}
        <rect x="60" y="56" width="280" height="70" rx="4" fill={ink} />
        <rect
          x="60"
          y="56"
          width="280"
          height="70"
          rx="4"
          fill={accent}
          opacity="0.10"
        />
        <DirectionSymbolGlyph
          x={78}
          y={66}
          size={50}
          activity={activity}
          personality={personality}
          style={style}
          accent={accent}
          ink={ink}
        />
        <text
          x={210}
          y={100}
          textAnchor="middle"
          className={displayClass}
          fontSize="24"
          fill={surface}
        >
          {direction.arabicName}
        </text>
        {/* spill of light down the facade */}
        <path
          d="M60 126 L340 126 L380 190 L20 190 Z"
          fill={accent}
          opacity="0.08"
        />
      </svg>
    );
  }

  /* ------------------------------------------------------------- coffee cup */
  if (kind === "cup") {
    return (
      <svg
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        className={className}
      >
        {defs}
        {studio}
        {pool}
        <g>
          {/* cup */}
          <path d="M148 236 L136 78 h128 l-12 158 Z" fill={surface} />
          <path d="M136 78 h128 l-2 22 H138 Z" fill={neutral} opacity="0.45" />
          {/* lid */}
          <rect x="130" y="62" width="140" height="18" rx="4" fill={ink} />
          {/* sleeve */}
          <path d="M143 190 L138 120 h124 l-5 70 Z" fill={accent} />
          <DirectionSymbolGlyph
            x={176}
            y={132}
            size={48}
            activity={activity}
            personality={personality}
            style={style}
            accent={ink}
            ink={accent}
          />
          <path
            d="M148 236 L136 78 h128 l-12 158 Z"
            fill={`url(#mk-cup-sheen)`}
          />
        </g>
      </svg>
    );
  }

  /* ----------------------------------------------------------- shopping bag */
  if (kind === "bag") {
    return (
      <svg
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        className={className}
      >
        {defs}
        {studio}
        {pool}
        {/* handles */}
        <path
          d="M160 74 q40 -34 80 0"
          fill="none"
          stroke={neutral}
          strokeWidth="4"
        />
        {/* body */}
        <rect x="120" y="72" width="160" height="164" fill={ink} />
        <rect
          x="120"
          y="72"
          width="160"
          height="60"
          fill={`url(#${patternId})`}
          opacity="0.9"
        />
        <DirectionSymbolGlyph
          x={176}
          y={148}
          size={52}
          activity={activity}
          personality={personality}
          style={style}
          accent={accent}
          ink={ink}
        />
        <text
          x={200}
          y={224}
          textAnchor="middle"
          className={latinClass}
          fontSize="8"
          fill={accent}
        >
          {direction.latinName}
        </text>
        {/* fold */}
        <path d="M120 72 h160 l-14 12 H134 Z" fill="#000" opacity="0.25" />
        <rect
          x="120"
          y="72"
          width="160"
          height="164"
          fill={`url(#mk-bag-sheen)`}
        />
      </svg>
    );
  }

  /* ---------------------------------------------------------- packaging box */
  if (kind === "box") {
    return (
      <svg
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        className={className}
      >
        {defs}
        {studio}
        {pool}
        {/* lid (top face) */}
        <path d="M200 66 L316 108 L200 150 L84 108 Z" fill={surface} />
        {/* front-left face */}
        <path d="M84 108 L200 150 v78 L84 186 Z" fill={ink} />
        {/* front-right face */}
        <path d="M316 108 L200 150 v78 l116 -42 Z" fill={shade} />
        {/* the mark on the lid, the texture on the side */}
        <DirectionSymbolGlyph
          x={172}
          y={82}
          size={56}
          activity={activity}
          personality={personality}
          style={style}
          accent={accent}
          ink={surface}
        />
        <path
          d="M316 108 L200 150 v78 l116 -42 Z"
          fill={`url(#${patternId})`}
          opacity="0.35"
        />
        <path d="M84 108 L200 150 v78 L84 186 Z" fill={`url(#mk-box-sheen)`} />
        {/* seal */}
        <rect
          x="186"
          y="186"
          width="28"
          height="28"
          rx="14"
          fill={accent}
          opacity="0.9"
        />
      </svg>
    );
  }

  /* ---------------------------------------------------------------- uniform */
  if (kind === "uniform") {
    return (
      <svg
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        className={className}
      >
        {defs}
        {studio}
        {/* apron */}
        <path
          d="M168 40 h64 l10 22 q42 12 42 54 v106 q0 14 -14 14 h-140 q-14 0 -14 -14 V116 q0 -42 42 -54 Z"
          fill={ink}
        />
        {/* neck strap */}
        <path
          d="M168 40 q32 -26 64 0"
          fill="none"
          stroke={neutral}
          strokeWidth="4"
        />
        {/* pocket band in accent */}
        <rect
          x="140"
          y="170"
          width="120"
          height="34"
          fill={accent}
          opacity="0.9"
        />
        <DirectionSymbolGlyph
          x={176}
          y={92}
          size={48}
          activity={activity}
          personality={personality}
          style={style}
          accent={accent}
          ink={ink}
        />
        <text
          x={200}
          y={226}
          textAnchor="middle"
          className={latinClass}
          fontSize="7"
          fill={neutral}
        >
          {direction.latinName}
        </text>
      </svg>
    );
  }

  /* ---------------------------------------------------------------- vehicle */
  if (kind === "vehicle") {
    return (
      <svg
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        className={className}
      >
        {defs}
        {studio}
        {pool}
        {/* van body */}
        <path
          d="M46 190 V120 q0 -12 12 -12 h110 l40 -34 h96 q14 0 14 14 v102 Z"
          fill={surface}
        />
        {/* windows */}
        <path d="M182 108 l32 -28 h60 v28 Z" fill={ink} opacity="0.8" />
        {/* livery band, carrying the texture */}
        <rect
          x="46"
          y="150"
          width="272"
          height="26"
          fill={`url(#${patternId})`}
        />
        <rect
          x="46"
          y="150"
          width="272"
          height="26"
          fill={accent}
          opacity="0.18"
        />
        <DirectionSymbolGlyph
          x={66}
          y={116}
          size={40}
          activity={activity}
          personality={personality}
          style={style}
          accent={accent}
          ink={surface}
        />
        <text x={128} y={144} className={displayClass} fontSize="16" fill={ink}>
          {direction.arabicName}
        </text>
        {/* wheels */}
        <circle cx="100" cy="196" r="20" fill="#0B0908" />
        <circle cx="100" cy="196" r="8" fill={neutral} />
        <circle cx="266" cy="196" r="20" fill="#0B0908" />
        <circle cx="266" cy="196" r="8" fill={neutral} />
      </svg>
    );
  }

  /* --------------------------------------------------------- social profile */
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={className}
    >
      {defs}
      {studio}
      {/* phone frame */}
      <rect
        x="112"
        y="18"
        width="176"
        height="230"
        rx="18"
        fill="#0A0908"
        stroke={neutral}
        strokeWidth="1.5"
        opacity="0.95"
      />
      {/* cover photo */}
      <rect
        x="122"
        y="30"
        width="156"
        height="52"
        rx="6"
        fill={`url(#${patternId})`}
      />
      {/* avatar */}
      <circle
        cx="152"
        cy="86"
        r="22"
        fill={ink}
        stroke={surface}
        strokeWidth="2"
      />
      <DirectionSymbolGlyph
        x={136}
        y={70}
        size={32}
        activity={activity}
        personality={personality}
        style={style}
        accent={accent}
        ink={ink}
      />
      {/* name + handle */}
      <text
        x={186}
        y={84}
        className={displayClass}
        fontSize="13"
        fill={surface}
      >
        {direction.arabicName}
      </text>
      <text x={186} y={98} className={latinClass} fontSize="6" fill={accent}>
        {direction.latinName}
      </text>
      {/* post grid */}
      <g>
        <rect x="122" y="120" width="48" height="48" fill={ink} />
        <rect
          x="176"
          y="120"
          width="48"
          height="48"
          fill={`url(#${patternId})`}
        />
        <rect
          x="230"
          y="120"
          width="48"
          height="48"
          fill={accent}
          opacity="0.85"
        />
        <rect
          x="122"
          y="174"
          width="48"
          height="48"
          fill={`url(#${patternId})`}
        />
        <rect
          x="176"
          y="174"
          width="48"
          height="48"
          fill={accent}
          opacity="0.6"
        />
        <rect x="230" y="174" width="48" height="48" fill={ink} />
      </g>
      <DirectionSymbolGlyph
        x={238}
        y={128}
        size={32}
        activity={activity}
        personality={personality}
        style={style}
        accent={ink}
        ink={accent}
      />
    </svg>
  );
}
