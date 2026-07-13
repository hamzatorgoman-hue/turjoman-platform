"use client";

import { motion } from "framer-motion";
import { riseIn, stage } from "@/lib/motion";

const PILLARS = [
  { id: "market", label: "دراسات السوق" },
  { id: "identity", label: "الهوية البصرية" },
  { id: "launch", label: "إطلاق النشاط" },
];

/** The launch path, pinned to the room's edge — reads as signage, not navigation. */
export default function HeroRail() {
  return (
    <motion.ul
      variants={stage}
      aria-label="مسار الإطلاق"
      className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2.5 xl:flex"
    >
      {PILLARS.map((pillar) => (
        <motion.li key={pillar.id} variants={riseIn}>
          <span className="flex items-center justify-end gap-3 rounded-e-full border border-s-0 border-gold-500/[0.22] bg-ink-800/50 py-2.5 pe-4 ps-5 backdrop-blur-sm">
            <span className="whitespace-nowrap font-body text-sm font-light text-sand-200">
              {pillar.label}
            </span>
            <span className="grid h-6 w-6 place-items-center rounded-full border border-gold-500/35 text-gold-300">
              <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden>
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
              </svg>
            </span>
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
