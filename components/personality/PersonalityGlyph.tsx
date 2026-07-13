import type { PersonalityId } from "@/lib/personalities";

type Props = {
  id: PersonalityId;
  className?: string;
};

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

/**
 * Abstract, not literal. Each glyph is the personality's rhythm — measured,
 * clean, soft, sharp — so the shape says as much as the label.
 */
const GLYPHS: Record<PersonalityId, React.ReactNode> = {
  luxury: (
    <>
      <path d="M16 4.5 24 12l-8 7.5L8 12l8-7.5Z" />
      <path d="M16 9.5 18.5 12 16 14.5 13.5 12 16 9.5Z" />
      <path d="M4 24h24" />
    </>
  ),
  modern: (
    <>
      <circle cx="16" cy="14" r="8.5" />
      <path d="M7.5 14h17" />
      <path d="M4 24h24" />
    </>
  ),
  warm: (
    <>
      <path d="M16 21.5c-4.5-2.8-7-5.3-7-8.4A4.1 4.1 0 0 1 16 10a4.1 4.1 0 0 1 7 3.1c0 3.1-2.5 5.6-7 8.4Z" />
      <path d="M4 24h24" />
    </>
  ),
  bold: (
    <>
      <path d="M17.5 4 9 15.5h5.5L13 22l9-11.5h-5.5L17.5 4Z" />
      <path d="M4 24h24" />
    </>
  ),
  trusted: (
    <>
      <path d="M16 4.5 8 7.8v5.6c0 4.3 3.2 8 8 9.1 4.8-1.1 8-4.8 8-9.1V7.8L16 4.5Z" />
      <path d="m12.6 13.6 2.4 2.4 4.6-5" />
      <path d="M4 26h24" />
    </>
  ),
  heritage: (
    <>
      <path d="M16 4.5c3 3.2 4.5 6 4.5 8.5S19 18.4 16 21.5c-3-3.1-4.5-5.9-4.5-8.5S13 7.7 16 4.5Z" />
      <path d="M16 6.5v15" />
      <path d="M4 24h24" />
    </>
  ),
  playful: (
    <>
      <path d="M6 17c2.5-4 5-6 7.5-6s5 2 7.5 6" />
      <circle cx="11" cy="8.5" r="1.6" />
      <circle cx="21" cy="12" r="1.6" />
      <path d="M4 24h24" />
    </>
  ),
  innovative: (
    <>
      <circle cx="16" cy="13" r="3.2" />
      <path d="M16 4v3.5M16 18.5V22M7 13h3.2M21.8 13H25" />
      <path d="M9.6 6.6 12 9M20 17l2.4 2.4M22.4 6.6 20 9M12 17l-2.4 2.4" />
      <path d="M4 26h24" />
    </>
  ),
};

export default function PersonalityGlyph({ id, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className} {...base}>
      {GLYPHS[id]}
    </svg>
  );
}
