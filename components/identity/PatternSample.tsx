import type { PatternId } from "@/lib/identity-direction";

type Props = {
  pattern: PatternId;
  accent: string;
  surface: string;
  neutral: string;
  className?: string;
};

/**
 * The pattern is the brand's texture — what fills a bag, a wall, a menu back.
 * It is drawn from the direction's own colours, so it is never decoration
 * bolted on afterwards.
 */
export default function PatternSample({
  pattern,
  accent,
  surface,
  neutral,
  className,
}: Props) {
  const id = `pattern-${pattern}`;

  return (
    <svg
      viewBox="0 0 160 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill={surface} />
          {pattern === "grid" ? (
            <>
              <path
                d="M0 0H20M0 0V20"
                stroke={neutral}
                strokeWidth="0.5"
                opacity="0.6"
              />
              <circle cx="10" cy="10" r="1" fill={accent} />
            </>
          ) : null}
          {pattern === "weave" ? (
            <>
              <path
                d="M0 10h20M10 0v20"
                stroke={neutral}
                strokeWidth="1.4"
                opacity="0.5"
              />
              <path
                d="M0 0l20 20M20 0L0 20"
                stroke={accent}
                strokeWidth="0.6"
                opacity="0.55"
              />
            </>
          ) : null}
          {pattern === "arcs" ? (
            <>
              <path
                d="M0 20a10 10 0 0 1 20 0"
                fill="none"
                stroke={accent}
                strokeWidth="0.9"
              />
              <path
                d="M0 10a10 10 0 0 1 20 0"
                fill="none"
                stroke={neutral}
                strokeWidth="0.6"
                opacity="0.7"
              />
            </>
          ) : null}
          {pattern === "chevron" ? (
            <path
              d="M0 14l10-8 10 8"
              fill="none"
              stroke={accent}
              strokeWidth="1.4"
            />
          ) : null}
          {pattern === "dots" ? (
            <>
              <circle cx="5" cy="5" r="2.6" fill={accent} />
              <circle cx="15" cy="15" r="2.6" fill={neutral} opacity="0.65" />
            </>
          ) : null}
          {pattern === "waves" ? (
            <path
              d="M0 14c5-8 15-8 20 0"
              fill="none"
              stroke={accent}
              strokeWidth="0.8"
              opacity="0.85"
            />
          ) : null}
        </pattern>
      </defs>
      <rect width="160" height="100" fill={`url(#${id})`} />
    </svg>
  );
}
