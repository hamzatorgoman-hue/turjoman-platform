import type { ActivityId } from "@/lib/activities";
import type { PersonalityId } from "@/lib/personalities";
import type { StyleId } from "@/lib/styles";
import DirectionSymbol from "./DirectionSymbol";

type Props = {
  activity: ActivityId;
  personality: PersonalityId;
  style: StyleId;
  ink: string;
  accent: string;
  className?: string;
};

/**
 * The board's symbol slot.
 *
 * It holds the Direction Symbol — geometry derived from the three answers — not
 * a logo and not a placeholder box. The board labels it as a direction, so the
 * founder reads it as one.
 */
export default function BoardSymbol({
  activity,
  personality,
  style,
  ink,
  accent,
  className,
}: Props) {
  return (
    <DirectionSymbol
      activity={activity}
      personality={personality}
      style={style}
      accent={accent}
      ink={ink}
      className={className}
    />
  );
}
