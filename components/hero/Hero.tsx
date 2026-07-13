"use client";

import { motion } from "framer-motion";
import { fadeIn, riseIn, stage } from "@/lib/motion";
import HeroPlate from "./HeroPlate";
import HeroLockup from "./HeroLockup";
import HeroRail from "./HeroRail";
import PrimaryCta from "./PrimaryCta";
import SectorStrip from "./SectorStrip";
import TrustBar from "./TrustBar";

export default function Hero() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={stage}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[var(--hero-min-h)] w-full flex-col overflow-hidden bg-ink-900 pb-7 pt-28 md:pt-32"
    >
      <HeroPlate />
      <HeroRail />

      <div className="relative z-10 mx-auto flex w-full max-w-[85rem] flex-1 flex-col px-[var(--edge)]">
        <div className="grid flex-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-8">
          {/* Copy — sits on the visual left, text set right-to-left */}
          <div className="order-2 flex flex-col items-start text-start lg:order-none lg:col-start-1">
            <motion.p
              variants={riseIn}
              className="inline-flex items-center gap-2.5 rounded-full border border-gold-500/30 bg-ink-800/55 py-1.5 pe-4 ps-1.5 backdrop-blur-sm"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-bar text-ink-900">
                <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5">
                  <path d="M12 2.5l1.9 5.9h6.2l-5 3.7 1.9 5.9-5-3.6-5 3.6 1.9-5.9-5-3.7h6.2L12 2.5Z" fill="currentColor" />
                </svg>
              </span>
              <span className="font-body text-[0.82rem] font-light tracking-wide text-sand-200">
                هوية احترافية متكاملة لمشروعك
              </span>
            </motion.p>

            <motion.h1
              id="hero-title"
              variants={riseIn}
              className="mt-7 font-display text-hero-sm font-extrabold text-sand-100 [text-shadow:0_6px_34px_rgba(0,0,0,0.65)] md:text-hero-md lg:text-hero-lg"
            >
              <span className="block">مشروعك يستحق</span>
              <span className="mt-1 block">
                <span className="gold-text">بداية تليق بطموحك</span>
                <span className="text-gold-300">.</span>
              </span>
            </motion.h1>

            <motion.p
              variants={riseIn}
              className="mt-6 max-w-[33rem] font-body text-base font-light leading-[2] text-sand-300 md:text-[1.06rem]"
            >
              نحوّل فكرتك إلى هوية احترافية متكاملة، ونساعدك في إطلاق مشروعك بثقة واحتراف.
            </motion.p>

            <motion.div variants={riseIn} className="mt-9 w-full">
              <PrimaryCta href="#sectors" label="ابدأ مشروعك الآن" />
            </motion.div>

            <motion.p variants={riseIn} className="mt-5 font-body text-sm font-light text-sand-400">
              اختر نشاطك… والباقي علينا.
            </motion.p>
          </div>

          {/* Lockup — sits on the visual right, over the lit wall */}
          <motion.div
            variants={fadeIn}
            className="order-1 flex justify-center lg:order-none lg:col-start-2 lg:-translate-y-6"
          >
            <HeroLockup />
          </motion.div>
        </div>

        <motion.div id="sectors" variants={fadeIn} className="mt-10 lg:mt-6">
          <SectorStrip />
        </motion.div>

        <motion.div variants={fadeIn} className="mt-8 lg:mt-7">
          <TrustBar />
        </motion.div>
      </div>
    </motion.section>
  );
}
