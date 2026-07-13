"use client";

import { motion } from "framer-motion";
import JourneyContext from "@/components/identity/JourneyContext";
import { useActivity, resetActivity } from "@/lib/activity-store";
import { buildDirection } from "@/lib/identity-direction";
import { resetIdentity, useIdentity } from "@/lib/identity-store";
import { MOCKUPS } from "@/lib/mockups";
import { fadeIn, riseIn, stage } from "@/lib/motion";
import { resetPersonality, usePersonality } from "@/lib/personality-store";
import { advanceScene, backScene } from "@/lib/scene-store";
import { resetFlight } from "@/lib/shared-flight";
import { resetStyle, useStyle } from "@/lib/style-store";
import MockupCard from "./MockupCard";
import MockupSurface from "./MockupSurface";

/**
 * Scene 05 — the same direction, applied.
 *
 * Nothing new is invented here: every surface is drawn from the direction the
 * founder already approved, and carries the same Direction Symbol — geometry
 * derived from their three answers, not a logo. Showing an invented mark would
 * be selling a picture we cannot deliver. What the gallery promises is the
 * *standard* of execution, and that promise is one we keep.
 */
export default function MockupScene() {
  const { selected: activity } = useActivity();
  const { selected: personality } = usePersonality();
  const { selected: style } = useStyle();
  const { selected: variant } = useIdentity();

  if (!activity || !personality || !style) return null;

  const direction = buildDirection(
    activity,
    personality,
    style,
    variant ?? "core",
  );

  const goBack = () => {
    resetIdentity();
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
    backScene();
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={stage}
      aria-labelledby="mockups-title"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink-900 px-[var(--edge)] pb-16 pt-24 md:pt-28"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_82%_-6%,rgba(212,168,83,0.11),transparent_66%),radial-gradient(55%_45%_at_4%_100%,rgba(76,116,158,0.06),transparent_70%)]"
      />
      <div
        aria-hidden
        className="grain absolute inset-0 -z-10 opacity-[0.04] mix-blend-overlay"
      />

      <div className="mx-auto flex w-full max-w-[84rem] flex-1 flex-col">
        <div className="flex flex-col items-start">
          <motion.p
            variants={riseIn}
            className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-ink-800/55 px-4 py-1.5 font-body text-[0.78rem] font-light tracking-wide text-sand-200"
          >
            الخطوة الخامسة · التطبيقات
          </motion.p>

          <motion.h2
            id="mockups-title"
            variants={riseIn}
            className="mt-6 font-display text-3xl font-extrabold leading-[1.3] text-sand-100 md:text-4xl lg:text-[2.9rem]"
          >
            هكذا يمكن أن تبدو <span className="gold-text">هويتك</span>
          </motion.h2>

          <motion.p
            variants={riseIn}
            className="mt-5 max-w-[36rem] font-body text-[0.95rem] font-light leading-[2] text-sand-300"
          >
            هذه معاينات توضيحية لمستوى التنفيذ المتوقع.
          </motion.p>
        </div>

        {/* the large one: the identity in a room, not on a screen */}
        <motion.figure
          variants={fadeIn}
          className="relative mt-10 overflow-hidden rounded-3xl border border-gold-500/[0.26] shadow-[0_50px_120px_-60px_rgba(0,0,0,0.95)]"
        >
          <div className="relative aspect-[16/9] w-full">
            <MockupSurface
              kind="hero"
              direction={direction}
              style={style}
              activity={activity}
              personality={personality}
              className="h-full w-full"
            />
          </div>
          <figcaption className="flex flex-wrap items-center justify-between gap-3 bg-ink-800/70 px-6 py-4 backdrop-blur-md">
            <span className="font-body text-sm text-sand-200">
              واجهة المكان
            </span>
            <span className="font-body text-[0.7rem] font-light text-sand-400">
              الرمز هنا رمز اتجاه هندسي — وليس الشعار النهائي
            </span>
          </figcaption>
        </motion.figure>

        {/* the gallery */}
        <motion.div
          variants={stage}
          className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {MOCKUPS.map((item) => (
            <motion.div key={item.kind} variants={riseIn}>
              <MockupCard
                item={item}
                direction={direction}
                style={style}
                activity={activity}
                personality={personality}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* journey context + next step */}
        <motion.div
          variants={fadeIn}
          className="mt-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="mb-4 font-body text-[0.72rem] font-light tracking-wide text-sand-400">
              كل ما سبق مبني على اختياراتك
            </p>
            <JourneyContext />
          </div>

          <div className="flex flex-col items-start gap-4">
            <button
              type="button"
              onClick={() => advanceScene()}
              className="group inline-flex h-[3.4rem] items-center justify-center gap-3 rounded-full bg-gold-bar px-8 font-body text-[0.95rem] font-semibold text-ink-900 shadow-cta transition-transform duration-500 ease-out hover:-translate-y-0.5"
            >
              اختر باقتك
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

            <div className="flex flex-wrap items-center gap-4">
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
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
