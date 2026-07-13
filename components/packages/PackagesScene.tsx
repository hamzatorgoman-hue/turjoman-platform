"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import JourneyContext from "@/components/identity/JourneyContext";
import { fadeIn, riseIn, stage } from "@/lib/motion";
import { PACKAGES, type PackageTier } from "@/lib/packages";
import { selectPackage, usePackage } from "@/lib/package-store";
import { advanceScene, backScene } from "@/lib/scene-store";
import CompareSheet from "./CompareSheet";
import PackageCard from "./PackageCard";

/**
 * Scene 07 — the decision.
 *
 * Everything that could be shown has been shown. What is left is a single
 * question, asked once, with room around it. No countdown, no struck-through
 * price, no scarcity: the founder has enough to decide, and pressure here would
 * only insult the work that came before it.
 */
export default function PackagesScene() {
  const { selected, phase } = usePackage();
  const reduced = useReducedMotion();
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    if (phase === "handoff") advanceScene();
  }, [phase]);

  const choose = (tier: PackageTier) => {
    selectPackage(tier.id, { reduceMotion: Boolean(reduced) });
  };

  const chosen = PACKAGES.find((tier) => tier.id === selected);

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={stage}
      aria-labelledby="packages-title"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink-900 px-[var(--edge)] pb-24 pt-28 md:pt-32"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_50%_-8%,rgba(212,168,83,0.10),transparent_70%)]"
      />
      <div
        aria-hidden
        className="grain absolute inset-0 -z-10 opacity-[0.035] mix-blend-overlay"
      />

      <p aria-live="polite" className="sr-only">
        {chosen && phase !== "idle"
          ? `تم اختيار باقة ${chosen.label}. جارٍ فتح الخطوة التالية.`
          : ""}
      </p>

      <div className="mx-auto flex w-full max-w-[78rem] flex-1 flex-col">
        <header className="flex flex-col items-center text-center">
          <motion.p
            variants={riseIn}
            className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-ink-800/55 px-4 py-1.5 font-body text-[0.78rem] font-light tracking-wide text-sand-200"
          >
            الخطوة السابعة · الباقات
          </motion.p>

          <motion.h2
            id="packages-title"
            variants={riseIn}
            className="mt-8 font-display text-3xl font-extrabold leading-[1.35] text-sand-100 md:text-4xl lg:text-[3.1rem]"
          >
            اختر الباقة المناسبة <span className="gold-text">لمشروعك</span>
          </motion.h2>

          <motion.p
            variants={riseIn}
            className="mt-6 max-w-[40rem] font-body text-[0.98rem] font-light leading-[2.1] text-sand-300"
          >
            جميع الباقات مبنية على نفس الجودة.
            <br />
            الفرق هو مستوى الخدمة وما يتم تسليمه.
          </motion.p>
        </header>

        <motion.div
          variants={stage}
          className="mt-16 grid grid-cols-1 items-stretch gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-7"
        >
          {PACKAGES.map((tier) => (
            <motion.div key={tier.id} variants={riseIn} className="h-full">
              <PackageCard
                tier={tier}
                onChoose={choose}
                committing={selected === tier.id && phase !== "idle"}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <button
            type="button"
            onClick={() => setComparing((open) => !open)}
            aria-expanded={comparing}
            aria-controls="package-compare"
            className="rounded-full border border-gold-500/[0.24] bg-ink-800/50 px-6 py-2.5 font-body text-sm font-light text-sand-300 transition-colors duration-500 hover:border-gold-300/[0.45] hover:text-sand-100"
          >
            {comparing ? "إخفاء المقارنة" : "قارن الباقات"}
          </button>

          <div id="package-compare" className="w-full">
            <CompareSheet open={comparing} />
          </div>
        </motion.div>

        <motion.p
          variants={fadeIn}
          className="mx-auto mt-14 max-w-[38rem] text-center font-body text-[0.78rem] font-light leading-7 text-sand-400"
        >
          الأسعار ثابتة، ولا توجد رسوم مخفية. تُدفع بعد الاتفاق على التفاصيل.
        </motion.p>

        <motion.div variants={fadeIn} className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => backScene()}
            className="inline-flex min-h-[2.75rem] items-center px-1 font-body text-xs font-light text-sand-400 underline-offset-4 transition-colors duration-500 hover:text-sand-200 hover:underline"
          >
            العودة لما ستحصل عليه
          </button>
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="mt-24 flex flex-col items-center gap-5"
        >
          <p className="font-body text-[0.72rem] font-light tracking-wide text-sand-400">
            كل ما سبق مبني على اختياراتك
          </p>
          <JourneyContext />
        </motion.div>
      </div>
    </motion.section>
  );
}
