"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Deliverable } from "@/lib/deliverables";
import DeliverableIcon from "./DeliverableIcon";

type Props = {
  deliverable: Deliverable;
};

/**
 * One thing the founder receives. The card does nothing clever: it names the
 * item, narrows the promise in a single line, and gets out of the way.
 */
export default function DeliverableCard({ deliverable }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 28, mass: 0.8 }}
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-gold-500/[0.16] bg-[linear-gradient(180deg,rgba(20,15,10,0.72)_0%,rgba(9,6,4,0.88)_100%)] p-6 transition-colors duration-700 ease-out hover:border-gold-300/[0.38]"
    >
      {/* light arriving from above and to the side, as it does in the room */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_82%_0%,rgba(212,168,83,0.10),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      />

      <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-gold-500/[0.24] bg-ink-800/70 text-gold-300 transition-colors duration-700 group-hover:border-gold-300/45 group-hover:text-gold-200">
        <DeliverableIcon id={deliverable.id} className="h-5 w-5" />
      </span>

      <span className="relative flex flex-col gap-2">
        <h3 className="font-body text-[0.95rem] font-medium leading-6 text-sand-100">
          {deliverable.label}
        </h3>
        <p className="font-body text-[0.78rem] font-light leading-6 text-sand-400">
          {deliverable.note}
        </p>
      </span>
    </motion.article>
  );
}
