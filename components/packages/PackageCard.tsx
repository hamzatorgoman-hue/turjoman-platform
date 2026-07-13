"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getPackage, type PackageTier } from "@/lib/packages";

type Props = {
  tier: PackageTier;
  onChoose: (tier: PackageTier) => void;
  committing: boolean;
};

function Check() {
  return (
    <span
      aria-hidden
      className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-gold-500/45 text-gold-300"
    >
      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5">
        <path
          d="m5 12.6 4.4 4.4L19 7.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * One package. It inherits the one before it whole, so the card opens with what
 * the founder already has and then names only what is added. Nothing is crossed
 * out anywhere on this scene — there is nothing to lose by choosing.
 */
export default function PackageCard({ tier, onChoose, committing }: Props) {
  const reduced = useReducedMotion();
  const inherited = tier.inherits ? getPackage(tier.inherits) : null;

  return (
    <motion.article
      whileHover={reduced ? undefined : { y: -5 }}
      transition={{ type: "spring", stiffness: 220, damping: 28, mass: 0.8 }}
      className={[
        "relative flex h-full flex-col rounded-3xl border p-8 lg:p-9",
        "bg-[linear-gradient(180deg,rgba(20,15,10,0.72)_0%,rgba(9,6,4,0.9)_100%)]",
        "transition-colors duration-700 ease-out",
        tier.recommended
          ? "border-gold-300/45 shadow-[0_0_0_1px_rgba(212,168,83,0.18),0_50px_110px_-60px_rgba(212,168,83,0.35)]"
          : "border-gold-500/[0.16] shadow-panel hover:border-gold-300/[0.35]",
      ].join(" ")}
    >
      {tier.recommended ? (
        <span className="absolute -top-3 right-8 rounded-full border border-gold-300/50 bg-ink-900 px-3.5 py-1 font-body text-[0.68rem] font-light tracking-wide text-gold-200">
          الأكثر اختيارًا
        </span>
      ) : null}

      <header className="flex flex-col gap-2">
        <h3 className="font-display text-2xl font-bold text-sand-100">
          {tier.label}
        </h3>
        <p className="font-latin text-[0.72rem] uppercase tracking-[0.36em] text-gold-300">
          {tier.latin}
        </p>
      </header>

      <p className="mt-6 font-body text-[0.8rem] font-light leading-6 text-sand-400">
        مناسبة لـ <span className="text-sand-200">{tier.perfectFor}</span>
      </p>

      <p className="mt-8 flex items-baseline gap-2">
        <span className="font-display text-4xl font-extrabold text-sand-100">
          {tier.price}
        </span>
        <span className="font-body text-sm font-light text-sand-400">
          {tier.currency}
        </span>
      </p>

      <span
        aria-hidden
        className="mt-8 block h-px w-full bg-[linear-gradient(90deg,rgba(212,168,83,0.3),transparent)]"
      />

      <ul className="mt-7 flex flex-1 flex-col gap-4">
        {inherited ? (
          <li className="flex items-start gap-3">
            <Check />
            <span className="font-body text-sm font-light leading-6 text-sand-200">
              كل ما في باقة {inherited.label}
            </span>
          </li>
        ) : null}

        {tier.adds.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Check />
            <span className="font-body text-sm font-light leading-6 text-sand-300">
              {item}
            </span>
          </li>
        ))}

        {tier.reserved ? (
          <li className="mt-2">
            <span
              aria-hidden
              className="block rounded-xl border border-dashed border-gold-500/[0.28] bg-ink-800/30 px-4 py-5"
            >
              <span className="block h-1 w-8 rounded-full bg-gold-500/30" />
              <span className="mt-3 block h-1 w-16 rounded-full bg-gold-500/[0.18]" />
              <span className="mt-3 block h-1 w-12 rounded-full bg-gold-500/[0.12]" />
            </span>
            <span className="mt-3 block font-body text-[0.7rem] font-light text-sand-400">
              مساحة محجوزة ضمن هذه الباقة
            </span>
          </li>
        ) : null}
      </ul>

      <button
        type="button"
        onClick={() => onChoose(tier)}
        aria-busy={committing}
        className={[
          "mt-9 inline-flex h-[3.3rem] w-full items-center justify-center gap-3 rounded-full font-body text-[0.92rem] font-semibold transition-transform duration-500 ease-out hover:-translate-y-0.5",
          tier.recommended
            ? "bg-gold-bar text-ink-900 shadow-cta"
            : "border border-gold-500/40 bg-ink-800/60 text-sand-100 hover:border-gold-300/60",
        ].join(" ")}
      >
        ابدأ بهذه الباقة
      </button>
    </motion.article>
  );
}
