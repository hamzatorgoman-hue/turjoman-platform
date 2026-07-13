"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { HERO_PLATE, HERO_PLATE_LQIP } from "@/lib/hero-plate";

const SPRING = { stiffness: 55, damping: 24, mass: 0.7 };

/**
 * The environment layer: the approved photographic plate, art-directed per
 * breakpoint, plus the minimum grading needed to keep the interface legible.
 * No text, no logo, no interface is ever baked in here.
 */
export default function HeroPlate() {
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);

  // The plate is over-scaled, so it can drift without exposing an edge.
  const plateX = useTransform(sx, (v) => v * -10);
  const plateY = useTransform(sy, (v) => v * -6);
  const bloomX = useTransform(sx, (v) => v * -20);
  const bloomY = useTransform(sy, (v) => v * -12);

  useEffect(() => {
    if (reduced) return undefined;
    const onMove = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduced]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-ink-900">
      {/* colour field before the plate decodes */}
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
        style={{ backgroundImage: `url("${HERO_PLATE_LQIP}")` }}
      />

      {/* the environment */}
      <motion.div
        style={{ x: plateX, y: plateY }}
        className="absolute inset-[-2.5%] will-change-transform"
      >
        <picture>
          <source
            media="(min-width: 1024px)"
            type="image/avif"
            srcSet={HERO_PLATE.desktop.avif}
          />
          <source
            media="(min-width: 1024px)"
            type="image/webp"
            srcSet={HERO_PLATE.desktop.webp}
          />
          <source media="(min-width: 640px)" type="image/avif" srcSet={HERO_PLATE.tablet.avif} />
          <source media="(min-width: 640px)" type="image/webp" srcSet={HERO_PLATE.tablet.webp} />
          <source type="image/avif" srcSet={HERO_PLATE.mobile.avif} />
          <img
            src={HERO_PLATE.mobile.webp}
            alt=""
            width={HERO_PLATE.mobile.width}
            height={HERO_PLATE.mobile.height}
            fetchPriority="high"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-[900ms] ease-out ${
              loaded ? "opacity-100" : "opacity-0"
            } ${reduced ? "" : "animate-plate-breathe"}`}
            style={{ objectPosition: "var(--plate-pos)" }}
          />
        </picture>
      </motion.div>

      {/* ---- grading: on the plate, under the interface ---- */}

      {/* warm bloom, tracked to the brass lamp in frame */}
      <motion.div
        style={{ x: bloomX, y: bloomY }}
        className="absolute right-[-4%] top-[2%] h-[54vw] w-[54vw] rounded-full bg-[radial-gradient(circle,rgba(244,188,104,0.20)_0%,rgba(180,122,48,0.09)_38%,transparent_68%)] mix-blend-screen animate-ambient-drift lg:h-[40vw] lg:w-[40vw]"
      />

      {/* copy scrim, sm and up: the column sits over the glass, so the weight runs left→right */}
      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(5,4,3,0.84)_0%,rgba(5,4,3,0.68)_26%,rgba(5,4,3,0.34)_46%,rgba(5,4,3,0.08)_64%,transparent_80%)] sm:block" />

      {/* copy scrim, mobile: content stacks, so the weight runs top→bottom and the skyline survives */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,3,0.58)_0%,rgba(5,4,3,0.24)_26%,rgba(5,4,3,0.46)_62%,rgba(4,3,2,0.70)_100%)] sm:hidden" />

      {/* top and bottom gradient — nav headroom, trust-bar legibility */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,3,0.40)_0%,rgba(5,4,3,0.04)_22%,rgba(5,4,3,0.04)_55%,rgba(4,3,2,0.40)_100%)] sm:bg-[linear-gradient(180deg,rgba(5,4,3,0.70)_0%,rgba(5,4,3,0.10)_24%,rgba(5,4,3,0.04)_48%,rgba(4,3,2,0.78)_100%)]" />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(124%_104%_at_54%_46%,transparent_44%,rgba(3,2,1,0.55)_100%)]" />

      {/* film grain */}
      <div className="grain absolute inset-0 opacity-[0.045] mix-blend-overlay" />
    </div>
  );
}
