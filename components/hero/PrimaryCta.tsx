"use client";

import { motion } from "framer-motion";
import { EASE_LUX } from "@/lib/motion";

type Props = {
  href: string;
  label: string;
};

export default function PrimaryCta({ href, label }: Props) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.985 }}
      transition={{ duration: 0.3, ease: EASE_LUX }}
      className="group relative inline-flex h-[3.55rem] w-full max-w-[17rem] items-center justify-center gap-3 overflow-hidden rounded-full bg-gold-bar px-8 font-body text-base font-semibold text-ink-900 shadow-cta"
    >
      <span className="relative z-10">{label}</span>
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="relative z-10 h-4 w-4 transition-transform duration-500 ease-out group-hover:-translate-x-1"
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
      <span className="pointer-events-none absolute inset-y-0 -left-1/3 z-0 w-1/3 skew-x-12 bg-white/35 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-100 group-hover:animate-sheen" />
    </motion.a>
  );
}
