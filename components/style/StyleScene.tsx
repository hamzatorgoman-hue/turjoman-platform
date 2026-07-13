"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import PersonalityGlyph from "@/components/personality/PersonalityGlyph";
import SharedActivitySlot from "@/components/scene/SharedActivitySlot";
import { getActivity } from "@/lib/activities";
import { resetActivity, useActivity } from "@/lib/activity-store";
import { fadeIn, riseIn, stage } from "@/lib/motion";
import { getPersonality } from "@/lib/personalities";
import { resetPersonality, usePersonality } from "@/lib/personality-store";
import { advanceScene, backScene } from "@/lib/scene-store";
import { resetFlight } from "@/lib/shared-flight";
import { resetStyle, useStyle } from "@/lib/style-store";
import StyleSelector from "./StyleSelector";

/**
 * Scene 03 — the design language.
 *
 * Not a colour picker and not a generator: six material boards, and a director
 * asking which room the founder wants to walk into.
 *
 * The decisions already made stay on screen. The activity card arrives through
 * the existing shared element system (it lands in <SharedActivitySlot />); the
 * chosen personality is carried beside it, so the founder can see the brief
 * assembling rather than trusting that it is.
 */
export default function StyleScene() {
  const { selected: activity } = useActivity();
  const { selected: personality } = usePersonality();
  const { phase } = useStyle();

  const chosenActivity = activity ? getActivity(activity) : null;
  const chosenPersonality = personality ? getPersonality(personality) : null;

  useEffect(() => {
    if (phase === "handoff") advanceScene();
  }, [phase]);

  const goBack = () => {
    resetStyle();
    resetPersonality();
    backScene();
  };

  const startOver = () => {
    resetStyle();
    resetPersonality();
    resetFlight();
    resetActivity();
    backScene();
    backScene();
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={stage}
      aria-labelledby="style-title"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink-900 px-[var(--edge)] pb-16 pt-24 md:pt-28"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(80%_55%_at_78%_-8%,rgba(212,168,83,0.11),transparent_66%),radial-gradient(60%_45%_at_6%_100%,rgba(76,116,158,0.06),transparent_70%)]"
      />
      <div
        aria-hidden
        className="grain absolute inset-0 -z-10 opacity-[0.04] mix-blend-overlay"
      />

      <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col">
        {/* the brief so far, and the question now */}
        <div className="flex flex-col-reverse items-start gap-10 lg:flex-row-reverse lg:items-end lg:justify-between lg:gap-16">
          <motion.div variants={fadeIn} className="flex items-end gap-5">
            <div className="flex flex-col items-center gap-3">
              <SharedActivitySlot />
              <p className="font-body text-xs font-light text-sand-400">
                {chosenActivity ? chosenActivity.label : "نشاطك"}
              </p>
            </div>

            {chosenPersonality ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-[10.5rem] w-[7.6rem] flex-col items-center justify-center gap-3 rounded-2xl border border-gold-500/[0.28] bg-[linear-gradient(180deg,rgba(26,19,13,0.82)_0%,rgba(9,6,4,0.92)_100%)] px-3 text-center shadow-panel">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold-500/[0.26] bg-ink-700/60 text-gold-300">
                    <PersonalityGlyph
                      id={chosenPersonality.id}
                      className="h-6 w-6"
                    />
                  </span>
                  <span className="font-body text-sm text-sand-200">
                    {chosenPersonality.label}
                  </span>
                  <span className="block h-[2px] w-6 rounded-full bg-gold-bar opacity-70" />
                </div>
                <p className="font-body text-xs font-light text-sand-400">
                  شخصيتك
                </p>
              </div>
            ) : null}
          </motion.div>

          <div className="flex max-w-[36rem] flex-col items-start">
            <motion.p
              variants={riseIn}
              className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-ink-800/55 px-4 py-1.5 font-body text-[0.78rem] font-light tracking-wide text-sand-200"
            >
              الخطوة الثالثة · الاتجاه البصري
            </motion.p>

            <motion.h2
              id="style-title"
              variants={riseIn}
              className="mt-6 font-display text-3xl font-extrabold leading-[1.3] text-sand-100 md:text-4xl lg:text-[2.9rem]"
            >
              كيف تريد أن يبدو
              <span className="gold-text"> مشروعك</span>؟
            </motion.h2>

            <motion.p
              variants={riseIn}
              className="mt-5 font-body text-[0.95rem] font-light leading-[2] text-sand-300"
            >
              اختر الأسلوب الأقرب لرؤيتك. يمكنك تعديله لاحقًا.
            </motion.p>
          </div>
        </div>

        <motion.div variants={fadeIn} className="mt-12 lg:mt-14">
          <StyleSelector />
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            type="button"
            onClick={goBack}
            className="rounded-full border border-gold-500/[0.26] bg-ink-800/60 px-5 py-2.5 font-body text-sm font-light text-sand-300 transition-colors duration-500 hover:border-gold-300/[0.5] hover:text-sand-100"
          >
            رجوع
          </button>
          <button
            type="button"
            onClick={startOver}
            className="inline-flex min-h-[2.75rem] items-center px-1 font-body text-xs font-light text-sand-400 underline-offset-4 transition-colors duration-500 hover:text-sand-200 hover:underline"
          >
            تغيير النشاط
          </button>
          <p className="font-body text-xs font-light text-sand-400">
            اختيارك ينقلك تلقائيًا إلى الخطوة التالية.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
