import type { IconStyleId } from "@/lib/identity-direction";

type Props = {
  iconStyle: IconStyleId;
  accent: string;
  ink: string;
  className?: string;
};

const SHAPES = [
  // location pin, receipt, clock — enough to show how the language behaves
  "M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z",
  "M6 3h12v18l-3-2-3 2-3-2-3 2V3Z",
  "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 3.6V12l3 1.8",
];

/**
 * How the icon set will be drawn: the weight of the line, whether corners are
 * cut or turned, whether shapes are filled. Same three shapes each time, so the
 * *language* is what changes, not the subject.
 */
export default function IconStyleSample({
  iconStyle,
  accent,
  ink,
  className,
}: Props) {
  const stroke =
    iconStyle === "hairline"
      ? 1
      : iconStyle === "geometric"
        ? 1.8
        : iconStyle === "rounded"
          ? 1.6
          : 0;

  const filled = iconStyle === "solid";
  const linecap = iconStyle === "rounded" ? "round" : "square";

  return (
    <div
      className={["flex items-center gap-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      {SHAPES.map((d) => (
        <svg key={d} viewBox="0 0 24 24" aria-hidden className="h-8 w-8">
          <path
            d={d}
            fill={filled ? accent : "none"}
            stroke={filled ? ink : accent}
            strokeWidth={filled ? 0.6 : stroke}
            strokeLinecap={linecap}
            strokeLinejoin={iconStyle === "rounded" ? "round" : "miter"}
            opacity={filled ? 0.95 : 1}
          />
        </svg>
      ))}
    </div>
  );
}
