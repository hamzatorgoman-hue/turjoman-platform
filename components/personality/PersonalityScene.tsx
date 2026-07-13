"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import SharedActivitySlot from "@/components/scene/SharedActivitySlot";
import { resetActivity, useActivity } from "@/lib/activity-store";
import { getActivity } from "@/lib/activities";
import { fadeIn, riseIn, stage } from "@/lib/motion";
import { usePersonality, resetPersonality } from "@/lib/personality-store";
import { backScene, advanceScene } from "@/lib/scene-store";
import { resetFlight } from "@/lib/shared-flight";
import PersonalitySelector from "./PersonalitySelector";

/**
 * Scene 02 — the tone of the brand.
 *
 * The activity chosen in the Hero arrives here as the same object: the flight
 * layer flies it into <SharedActivitySlot />, which then owns it. The scene
 * itself only has to offer the slot a place to land.
 *
 * When a personality is chosen, the scene hands off exactly the way the Hero
 * did. The next scene does not exist yet, so the stage holds the request until
 * it does — nothing here needs to change when it lands.
 */
export default function PersonalityScene() {
  const { selected: activity } = useActivity();
  const { phase } = usePersonality();

  const chosenActivity = activity ? getActivity(activity) : null;

  useEffect(() => {
    if (phase === "handoff") advanceScene();
  }, [phase]);

  const goBack = () => {
    resetPersonality();
    resetFlight();
    resetActivity();
    backScene();
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={stage}
      aria-labelledby="personality-title"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink-900 px-[var(--edge)] pb-16 pt-24 md:pt-28"
    >
      {/* the room is behind us; this scene is lit only by the work itself */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(85%_60%_at_72%_-5%,rgba(212,168,83,0.10),transparent_65%),radial-gradient(70%_50%_at_10%_100%,rgba(76,116,158,0.07),transparent_70%)]"
      />
      <div
        aria-hidden
        className="grain absolute inset-0 -z-10 opacity-[0.04] mix-blend-overlay"
      />

      <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col">
        {/* header: what was chosen, and what is being asked now */}
        <div className="flex flex-col-reverse items-start gap-10 lg:flex-row-reverse lg:items-end lg:justify-between lg:gap-16">
          <motion.div
            variants={fadeIn}
            className="flex flex-col items-center gap-3"
          >
            <SharedActivitySlot />
            <p className="font-body text-xs font-light text-sand-400">
              {chosenActivity ? `نشاطك: ${chosenActivity.label}` : "نشاطك"}
            </p>
          </motion.div>

          <div className="flex max-w-[36rem] flex-col items-start">
            <motion.p
              variants={riseIn}
              className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-ink-800/55 px-4 py-1.5 font-body text-[0.78rem] font-light tracking-wide text-sand-200"
            >
              الخطوة الثانية · شخصية العلامة
            </motion.p>

            <motion.h2
              id="personality-title"
              variants={riseIn}
              className="mt-6 font-display text-3xl font-extrabold leading-[1.3] text-sand-100 md:text-4xl lg:text-[2.9rem]"
            >
              كيف تريد أن يشعر
              <span className="gold-text"> عميلك</span> تجاهك؟
            </motion.h2>

            <motion.p
              variants={riseIn}
              className="mt-5 font-body text-[0.95rem] font-light leading-[2] text-sand-300"
            >
              اختر شخصية واحدة. هي التي ستحدد الألوان والخطوط ونبرة الكلام في
              هويتك، وليست مجرد وصف.
            </motion.p>
          </div>
        </div>

        <motion.div variants={fadeIn} className="mt-12 lg:mt-14">
          <PersonalitySelector />
        </motion.div>

        <motion.div variants={fadeIn} className="mt-10 flex items-center gap-4">
          <button
            type="button"
            onClick={goBack}
            className="rounded-full border border-gold-500/[0.26] bg-ink-800/60 px-5 py-2.5 font-body text-sm font-light text-sand-300 transition-colors duration-500 hover:border-gold-300/[0.5] hover:text-sand-100"
          >
            رجوع
          </button>
          <p className="font-body text-xs font-light text-sand-400">
            اختيارك ينقلك تلقائيًا إلى الخطوة التالية.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
