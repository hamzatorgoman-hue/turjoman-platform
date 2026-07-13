"use client";

import { motion } from "framer-motion";
import JourneyContext from "@/components/identity/JourneyContext";
import { DELIVERABLE_COUNT, DELIVERABLE_GROUPS } from "@/lib/deliverables";
import { fadeIn, riseIn, stage } from "@/lib/motion";
import { advanceScene, backScene } from "@/lib/scene-store";
import DeliverableCard from "./DeliverableCard";

/**
 * Scene 06 — what is actually handed over.
 *
 * Not a pricing page and not a comparison table: a delivery presentation. The
 * restraint is the point. Every line is something the studio produces, narrowed
 * by a single honest sentence — a founder who opens the folder afterwards should
 * find exactly this, and nothing missing.
 */
export default function DeliverablesScene() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={stage}
      aria-labelledby="deliverables-title"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink-900 px-[var(--edge)] pb-24 pt-28 md:pt-32"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_-10%,rgba(212,168,83,0.10),transparent_70%)]"
      />
      <div
        aria-hidden
        className="grain absolute inset-0 -z-10 opacity-[0.035] mix-blend-overlay"
      />

      <div className="mx-auto flex w-full max-w-[76rem] flex-1 flex-col">
        {/* the ask, stated once, with room around it */}
        <header className="flex flex-col items-center text-center">
          <motion.p
            variants={riseIn}
            className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-ink-800/55 px-4 py-1.5 font-body text-[0.78rem] font-light tracking-wide text-sand-200"
          >
            الخطوة السادسة · التسليم
          </motion.p>

          <motion.h2
            id="deliverables-title"
            variants={riseIn}
            className="mt-8 font-display text-3xl font-extrabold leading-[1.35] text-sand-100 md:text-4xl lg:text-[3.1rem]"
          >
            ماذا ستحصل <span className="gold-text">عليه</span>؟
          </motion.h2>

          <motion.p
            variants={riseIn}
            className="mt-6 max-w-[38rem] font-body text-[0.98rem] font-light leading-[2.1] text-sand-300"
          >
            هذه ليست مجرد هوية...
            <br />
            بل حزمة متكاملة تساعد مشروعك على الانطلاق بثقة.
          </motion.p>

          <motion.p
            variants={fadeIn}
            className="mt-8 font-latin text-sm tracking-[0.4em] text-gold-300"
          >
            {DELIVERABLE_COUNT} DELIVERABLES
          </motion.p>
        </header>

        {/* the list, in the order a founder uses it */}
        <div className="mt-20 flex flex-col gap-20 lg:gap-24">
          {DELIVERABLE_GROUPS.map((group) => (
            <motion.section
              key={group.id}
              variants={stage}
              aria-labelledby={`group-${group.id}`}
            >
              <motion.div
                variants={riseIn}
                className="flex flex-col items-start gap-3"
              >
                <h3
                  id={`group-${group.id}`}
                  className="font-display text-xl font-bold text-sand-100 md:text-2xl"
                >
                  {group.title}
                </h3>
                <p className="font-body text-sm font-light leading-7 text-sand-400">
                  {group.lead}
                </p>
                <span
                  aria-hidden
                  className="mt-2 block h-px w-full bg-[linear-gradient(90deg,rgba(212,168,83,0.35),transparent)]"
                />
              </motion.div>

              <motion.ul
                variants={stage}
                className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {group.items.map((item) => (
                  <motion.li key={item.id} variants={riseIn} className="h-full">
                    <DeliverableCard deliverable={item} />
                  </motion.li>
                ))}
              </motion.ul>
            </motion.section>
          ))}
        </div>

        {/* what this is not — said plainly, before anyone asks */}
        <motion.p
          variants={fadeIn}
          className="mx-auto mt-20 max-w-[40rem] text-center font-body text-[0.8rem] font-light leading-7 text-sand-400"
        >
          كل ما سبق يُسلَّم فعليًا ضمن الخدمة. ما لا نعد به: تسليم فوري بلا
          مراجعة، أو تصاميم لا نستطيع طباعتها.
        </motion.p>

        {/* next step */}
        <motion.div
          variants={fadeIn}
          className="mt-14 flex flex-col items-center gap-5"
        >
          <button
            type="button"
            onClick={() => advanceScene()}
            className="group inline-flex h-[3.5rem] items-center justify-center gap-3 rounded-full bg-gold-bar px-10 font-body text-[0.98rem] font-semibold text-ink-900 shadow-cta transition-transform duration-500 ease-out hover:-translate-y-0.5"
          >
            استعرض الباقات
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

          <button
            type="button"
            onClick={() => backScene()}
            className="rounded-full border border-gold-500/[0.24] bg-ink-800/50 px-6 py-2.5 font-body text-sm font-light text-sand-300 transition-colors duration-500 hover:border-gold-300/[0.45] hover:text-sand-100"
          >
            العودة للمعاينات
          </button>
        </motion.div>

        {/* the journey, kept quietly at the foot of the page */}
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
