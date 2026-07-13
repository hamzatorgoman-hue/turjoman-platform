"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getActivity } from "@/lib/activities";
import { EVENTS, track } from "@/lib/analytics";
import { resetActivity, useActivity } from "@/lib/activity-store";
import {
  buildDirection,
  VARIANTS,
  type VariantId,
} from "@/lib/identity-direction";
import {
  resetIdentity,
  selectIdentity,
  useIdentity,
} from "@/lib/identity-store";
import { fadeIn, riseIn, stage } from "@/lib/motion";
import { resetPersonality, usePersonality } from "@/lib/personality-store";
import { advanceScene, backScene } from "@/lib/scene-store";
import { resetFlight } from "@/lib/shared-flight";
import { resetStyle, useStyle } from "@/lib/style-store";
import IdentityBoard from "./IdentityBoard";
import JourneyContext from "./JourneyContext";

const BENEFITS = [
  "ألوان وخطوط مبنية على إجاباتك، لا على قالب جاهز",
  "ملفات جاهزة للطباعة والنشر عند التسليم",
  "تعديلات حتى تصل إلى الشكل الذي تريده",
];

/**
 * Scene 04 — the first thing the founder receives instead of gives.
 *
 * The board is *derived*, not generated: the three answers resolve to one
 * direction through fixed rules (lib/identity-direction.ts). Nothing here is a
 * final logo, and the symbol says so on its face — it shows the space the mark
 * will occupy, not the mark.
 */
export default function IdentityScene() {
  const { selected: activity } = useActivity();
  const { selected: personality } = usePersonality();
  const { selected: style } = useStyle();
  const { phase } = useIdentity();
  const reduced = useReducedMotion();

  const [variant, setVariant] = useState<VariantId>("core");

  useEffect(() => {
    if (phase === "handoff") advanceScene();
  }, [phase]);

  // A previewed variant is a signal: it says the first proposal was not quite it.
  // The board's opening state is not a change, so the first pass is skipped —
  // otherwise every founder would appear to have rejected a direction they never saw.
  const firstBoard = useRef(true);
  useEffect(() => {
    if (firstBoard.current) {
      firstBoard.current = false;
      return;
    }
    track(EVENTS.identityVariantChanged, { direction: variant });
  }, [variant]);

  // The scene cannot be reached without the three answers; this is a guard, not a state.
  if (!activity || !personality || !style) return null;

  const direction = buildDirection(activity, personality, style, variant);
  const chosenActivity = getActivity(activity);

  const commit = () =>
    selectIdentity(variant, { reduceMotion: Boolean(reduced) });

  const goBack = () => {
    resetIdentity();
    resetStyle();
    backScene();
  };

  const startOver = () => {
    resetIdentity();
    resetStyle();
    resetPersonality();
    resetFlight();
    resetActivity();
    backScene();
    backScene();
    backScene();
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={stage}
      aria-labelledby="identity-title"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink-900 px-[var(--edge)] pb-16 pt-24 md:pt-28"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(75%_55%_at_20%_-8%,rgba(212,168,83,0.12),transparent_66%),radial-gradient(60%_45%_at_95%_100%,rgba(76,116,158,0.06),transparent_70%)]"
      />
      <div
        aria-hidden
        className="grain absolute inset-0 -z-10 opacity-[0.04] mix-blend-overlay"
      />

      <div className="mx-auto grid w-full max-w-[84rem] flex-1 gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        {/* RIGHT in RTL: the board */}
        <motion.div variants={fadeIn} className="order-1 flex flex-col gap-5">
          <IdentityBoard
            direction={direction}
            style={style}
            activity={activity}
            personality={personality}
            boardKey={`${style}-${personality}-${activity}-${variant}`}
          />

          <div
            role="group"
            aria-label="اتجاهات بديلة"
            className="flex flex-wrap gap-2.5"
          >
            {VARIANTS.map((option) => {
              const active = option.id === variant;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setVariant(option.id)}
                  className={[
                    "rounded-full border px-4 py-2 text-start font-body text-xs font-light transition-colors duration-500",
                    active
                      ? "border-gold-300/70 bg-ink-700/70 text-sand-100"
                      : "border-gold-500/[0.24] bg-ink-800/50 text-sand-400 hover:border-gold-300/[0.5] hover:text-sand-200",
                  ].join(" ")}
                >
                  <span className="block">{option.label}</span>
                  <span className="mt-0.5 block text-[0.62rem] opacity-70">
                    {option.note}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* LEFT in RTL: what it is, why it matters, what happens next */}
        <div className="order-2 flex flex-col items-start">
          <motion.p
            variants={riseIn}
            className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-ink-800/55 px-4 py-1.5 font-body text-[0.78rem] font-light tracking-wide text-sand-200"
          >
            الخطوة الرابعة · الاتجاه الأولي
          </motion.p>

          <motion.h2
            id="identity-title"
            variants={riseIn}
            className="mt-6 font-display text-3xl font-extrabold leading-[1.3] text-sand-100 md:text-4xl lg:text-[2.9rem]"
          >
            هذه هي <span className="gold-text">البداية</span>...
          </motion.h2>

          <motion.p
            variants={riseIn}
            className="mt-5 max-w-[34rem] font-body text-[0.95rem] font-light leading-[2] text-sand-300"
          >
            بناءً على نشاطك وشخصية علامتك وأسلوبها، أنشأنا اتجاهًا أوليًا
            لهويتك. يمكنك تعديله لاحقًا.
          </motion.p>

          <motion.ul variants={riseIn} className="mt-8 flex flex-col gap-3.5">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-gold-500/40 text-gold-300">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden>
                    <path
                      d="m5 12.6 4.4 4.4L19 7.4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="font-body text-sm font-light leading-7 text-sand-300">
                  {benefit}
                </span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            variants={riseIn}
            className="mt-10 flex w-full flex-col gap-4"
          >
            <button
              type="button"
              onClick={commit}
              className="group relative inline-flex h-[3.4rem] w-full max-w-[19rem] items-center justify-center gap-3 overflow-hidden rounded-full bg-gold-bar px-8 font-body text-[0.95rem] font-semibold text-ink-900 shadow-cta transition-transform duration-500 ease-out hover:-translate-y-0.5"
            >
              تابع بهذا الاتجاه
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1"
              >
                <path
                  d="M19 12H5m0 0 6-6m-6 6 6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <p className="font-body text-xs font-light text-sand-400">
              لا شيء نهائي الآن — الاتجاه يُعدَّل معك قبل التسليم.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12 w-full">
            <p className="mb-4 font-body text-[0.72rem] font-light tracking-wide text-sand-400">
              مبني على اختياراتك — {chosenActivity.label}
            </p>
            <JourneyContext />
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
              البدء من جديد
            </button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
