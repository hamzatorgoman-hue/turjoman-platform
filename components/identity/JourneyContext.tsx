"use client";

import PersonalityGlyph from "@/components/personality/PersonalityGlyph";
import SharedActivitySlot from "@/components/scene/SharedActivitySlot";
import StyleTile from "@/components/style/StyleTile";
import { getActivity } from "@/lib/activities";
import { useActivity } from "@/lib/activity-store";
import { getPersonality } from "@/lib/personalities";
import { usePersonality } from "@/lib/personality-store";
import { getStyle } from "@/lib/styles";
import { useStyle } from "@/lib/style-store";

/**
 * The journey so far, kept on screen: the activity card that flew in from the
 * Hero through the existing shared element system, and beside it the personality
 * and the style. The board is a proposal — the founder should be able to see, in
 * one glance, exactly which three answers produced it.
 */
export default function JourneyContext() {
  const { selected: activity } = useActivity();
  const { selected: personality } = usePersonality();
  const { selected: style } = useStyle();

  const chosenActivity = activity ? getActivity(activity) : null;
  const chosenPersonality = personality ? getPersonality(personality) : null;
  const chosenStyle = style ? getStyle(style) : null;

  return (
    <ul className="flex flex-wrap items-end gap-4">
      <li className="flex flex-col items-center gap-2">
        <SharedActivitySlot />
        <p className="font-body text-[0.68rem] font-light text-sand-400">
          {chosenActivity ? chosenActivity.label : "نشاطك"}
        </p>
      </li>

      {chosenPersonality ? (
        <li className="flex flex-col items-center gap-2">
          <div className="flex h-[10.5rem] w-[7.6rem] flex-col items-center justify-center gap-3 rounded-2xl border border-gold-500/[0.28] bg-[linear-gradient(180deg,rgba(26,19,13,0.82)_0%,rgba(9,6,4,0.92)_100%)] px-3 text-center shadow-panel">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold-500/[0.26] bg-ink-700/60 text-gold-300">
              <PersonalityGlyph id={chosenPersonality.id} className="h-6 w-6" />
            </span>
            <span className="font-body text-sm text-sand-200">
              {chosenPersonality.label}
            </span>
            <span className="block h-[2px] w-6 rounded-full bg-gold-bar opacity-70" />
          </div>
          <p className="font-body text-[0.68rem] font-light text-sand-400">
            شخصيتك
          </p>
        </li>
      ) : null}

      {chosenStyle ? (
        <li className="flex flex-col items-center gap-2">
          <div className="flex h-[10.5rem] w-[7.6rem] flex-col overflow-hidden rounded-2xl border border-gold-500/[0.28] bg-[linear-gradient(180deg,rgba(26,19,13,0.82)_0%,rgba(9,6,4,0.92)_100%)] shadow-panel">
            <StyleTile id={chosenStyle.id} className="h-[6.4rem] w-full" />
            <span className="flex flex-1 flex-col items-center justify-center gap-2">
              <span className="font-body text-sm text-sand-200">
                {chosenStyle.label}
              </span>
              <span className="block h-[2px] w-6 rounded-full bg-gold-bar opacity-70" />
            </span>
          </div>
          <p className="font-body text-[0.68rem] font-light text-sand-400">
            أسلوبك
          </p>
        </li>
      ) : null}
    </ul>
  );
}
