"use client";

import { motion } from "framer-motion";
import { lockupIn } from "@/lib/motion";
import TurjomanMark from "./TurjomanMark";

export default function HeroLockup() {
  return (
    <motion.div
      variants={lockupIn}
      className="relative flex flex-col items-center text-center select-none"
    >
      {/* seats the lockup on the wall: ink veil first, then the warm halo */}
      <div className="absolute inset-[-18%] -z-20 rounded-full bg-[radial-gradient(circle,rgba(6,4,3,0.62)_0%,rgba(6,4,3,0.28)_45%,transparent_70%)] blur-2xl" />
      <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.16)_0%,transparent_62%)] blur-2xl" />

      <TurjomanMark
        id="hero-mark"
        className="h-24 w-auto drop-shadow-[0_22px_44px_rgba(0,0,0,0.75)] md:h-28 lg:h-[7.2rem]"
      />

      <p className="mt-4 font-display text-5xl font-extrabold leading-none gold-text md:text-6xl lg:text-[4.6rem]">
        ترجمان
      </p>

      <p className="mt-3 font-body text-base font-light tracking-wide text-sand-300 md:text-[1.18rem]">
        بداية تليق بطموحك
      </p>

      <div className="mt-5 h-px w-32 bg-[linear-gradient(90deg,transparent,rgba(212,168,83,0.5),transparent)]" />

      <p className="mt-4 font-latin text-base uppercase tracking-[0.44em] text-gold-300 md:text-lg">
        Turjoman
      </p>
      <p className="mt-2 font-latin text-[0.62rem] uppercase tracking-[0.3em] text-sand-400 md:text-xs">
        Brand Identity Studio
      </p>
    </motion.div>
  );
}
