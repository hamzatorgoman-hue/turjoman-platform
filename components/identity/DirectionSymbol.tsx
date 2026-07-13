import type { ActivityId } from "@/lib/activities";
import type { PersonalityId } from "@/lib/personalities";
import type { StyleId } from "@/lib/styles";

/**
 * The Direction Symbol.
 *
 * Not a logo. Not a mark. Not generated. It is the *geometry* of the direction:
 * three answers resolved into one construction, by fixed rules.
 *
 *   style       → the frame        (how the shape holds space)
 *   activity    → the core         (what sits at the centre)
 *   personality → the modulation   (weight, rotation, rhythm, satellites)
 *
 * No text. No initials. No letters. No name. The same three answers always
 * produce the same construction — which is exactly why the founder can read it
 * as a *direction* rather than mistake it for the final brand mark.
 *
 * Everything is drawn on a 120×120 field, centred on (60, 60), so it can be
 * dropped into a board, a sign, a cup or a van without redrawing.
 */

type Modulation = {
  stroke: number;
  rotation: number;
  /** Dots on the outer orbit — a rhythm, never a decoration. */
  satellites: 0 | 3 | 4;
  innerRing: boolean;
  round: boolean;
  filledCore: boolean;
};

const MODULATION: Record<PersonalityId, Modulation> = {
  luxury: {
    stroke: 1.4,
    rotation: 0,
    satellites: 0,
    innerRing: true,
    round: false,
    filledCore: false,
  },
  modern: {
    stroke: 2.4,
    rotation: 0,
    satellites: 0,
    innerRing: false,
    round: false,
    filledCore: false,
  },
  warm: {
    stroke: 2.2,
    rotation: 15,
    satellites: 0,
    innerRing: false,
    round: true,
    filledCore: false,
  },
  bold: {
    stroke: 3.6,
    rotation: 0,
    satellites: 0,
    innerRing: false,
    round: false,
    filledCore: true,
  },
  trusted: {
    stroke: 2,
    rotation: 0,
    satellites: 4,
    innerRing: true,
    round: false,
    filledCore: false,
  },
  heritage: {
    stroke: 1.8,
    rotation: 30,
    satellites: 0,
    innerRing: true,
    round: false,
    filledCore: false,
  },
  playful: {
    stroke: 2.2,
    rotation: 12,
    satellites: 3,
    innerRing: false,
    round: true,
    filledCore: false,
  },
  innovative: {
    stroke: 1.8,
    rotation: 45,
    satellites: 4,
    innerRing: false,
    round: false,
    filledCore: false,
  },
};

/** style → frame: the outer construction the core lives inside. */
function frame(style: StyleId, accent: string, stroke: number) {
  switch (style) {
    case "minimal":
      return (
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke={accent}
          strokeWidth={stroke * 0.7}
        />
      );
    case "luxury":
      return (
        <>
          <path
            d="M60 12 101 36v48L60 108 19 84V36L60 12Z"
            fill="none"
            stroke={accent}
            strokeWidth={stroke}
          />
          <path
            d="M60 24 91 42v36L60 96 29 78V42L60 24Z"
            fill="none"
            stroke={accent}
            strokeWidth={stroke * 0.45}
            opacity="0.55"
          />
        </>
      );
    case "modern":
      return (
        <path
          d="M60 12 108 60 60 108 12 60Z"
          fill="none"
          stroke={accent}
          strokeWidth={stroke}
        />
      );
    case "classic":
      return (
        <>
          <circle
            cx="60"
            cy="60"
            r="47"
            fill="none"
            stroke={accent}
            strokeWidth={stroke * 0.8}
          />
          <circle
            cx="60"
            cy="60"
            r="39"
            fill="none"
            stroke={accent}
            strokeWidth={stroke * 0.35}
            opacity="0.6"
          />
          <path
            d="M60 6v10M60 104v10M6 60h10M104 60h10"
            stroke={accent}
            strokeWidth={stroke * 0.8}
            strokeLinecap="butt"
          />
        </>
      );
    case "bold":
      return <rect x="12" y="12" width="96" height="96" rx="6" fill={accent} />;
    case "elegant":
      return (
        <>
          <path
            d="M60 10c26 20 38 32 38 50s-12 30-38 50c-26-20-38-32-38-50s12-30 38-50Z"
            fill="none"
            stroke={accent}
            strokeWidth={stroke * 0.8}
          />
          <path
            d="M22 60h76"
            stroke={accent}
            strokeWidth={stroke * 0.3}
            opacity="0.5"
          />
        </>
      );
  }
}

/** activity → core: the shape at the centre of the construction. */
function core(
  activity: ActivityId,
  stroke: number,
  fill: string,
  line: string,
  round: boolean,
) {
  const common = {
    fill: fill,
    stroke: line,
    strokeWidth: stroke,
    strokeLinejoin: round ? ("round" as const) : ("miter" as const),
    strokeLinecap: round ? ("round" as const) : ("butt" as const),
  };

  switch (activity) {
    case "store":
      return (
        <rect
          x="45"
          y="45"
          width="30"
          height="30"
          rx={round ? 6 : 0}
          {...common}
        />
      );
    case "restaurant":
      return <circle cx="60" cy="60" r="16" {...common} />;
    case "office":
      return (
        <rect
          x="53"
          y="41"
          width="14"
          height="38"
          rx={round ? 7 : 0}
          {...common}
        />
      );
    case "clinic":
      return (
        <path d="M53 41h14v12h12v14H67v12H53V67H41V53h12V41Z" {...common} />
      );
    case "services":
      return <path d="M60 42 78 76H42L60 42Z" {...common} />;
    case "other":
      return <path d="M60 42 76 51v18l-16 9-16-9V51l16-9Z" {...common} />;
  }
}

function satellites(count: 0 | 3 | 4, accent: string, radius = 52) {
  if (count === 0) return null;
  const step = 360 / count;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const angle = ((step * i - 90) * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={60 + radius * Math.cos(angle)}
            cy={60 + radius * Math.sin(angle)}
            r={2.6}
            fill={accent}
          />
        );
      })}
    </g>
  );
}

export type DirectionSymbolProps = {
  activity: ActivityId;
  personality: PersonalityId;
  style: StyleId;
  /** The direction's accent — the symbol is never coloured independently. */
  accent: string;
  /** The direction's ink, used where the frame is a solid mass. */
  ink: string;
};

/**
 * The symbol as a group, so it can be composed into any mockup surface without
 * nesting an <svg> inside an <svg>.
 */
export function DirectionSymbolGlyph({
  activity,
  personality,
  style,
  accent,
  ink,
  x = 0,
  y = 0,
  size = 120,
}: DirectionSymbolProps & { x?: number; y?: number; size?: number }) {
  const mod = MODULATION[personality];
  const scale = size / 120;

  // On a solid frame the construction reverses out, exactly as it would in print.
  const solid = style === "bold";
  const lineColor = solid ? ink : accent;
  const coreFill = mod.filledCore ? (solid ? ink : accent) : "none";

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {frame(style, accent, mod.stroke)}

      {mod.innerRing ? (
        <circle
          cx="60"
          cy="60"
          r="30"
          fill="none"
          stroke={lineColor}
          strokeWidth={mod.stroke * 0.35}
          opacity="0.55"
        />
      ) : null}

      <g transform={`rotate(${mod.rotation} 60 60)`}>
        {core(activity, mod.stroke, coreFill, lineColor, mod.round)}
      </g>

      {satellites(mod.satellites, lineColor)}
    </g>
  );
}

/** Standalone symbol, for the board and anywhere else that wants it on its own. */
export default function DirectionSymbol({
  className,
  ...props
}: DirectionSymbolProps & { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <DirectionSymbolGlyph {...props} />
    </svg>
  );
}
