"use client";

import { motion } from "framer-motion";

type Props = {
  href: string;
  label: string;
};

/**
 * The quiet CTA — a hairline invitation next to the primary button, not a
 * second competing button. Text-weight only, no fill, no shadow, no motion —
 * only color and underline change on hover.
 */
export default function SecondaryCta({ href, label }: Props) {
  return (
    <motion.a
      href={href}
      className="group inline-flex items-center font-body text-sm font-light tracking-wide text-sand-300 transition-colors duration-300 hover:text-gold-300"
    >
      <span className="border-b border-sand-400/30 pb-0.5 transition-colors duration-300 group-hover:border-gold-300/50">
        {label}
      </span>
    </motion.a>
  );
}
