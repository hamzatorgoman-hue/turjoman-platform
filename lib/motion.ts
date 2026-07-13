import type { Transition, Variants } from "framer-motion";

export const EASE_LUX: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const baseTransition: Transition = {
  duration: 0.9,
  ease: EASE_LUX,
};

export const stage: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: baseTransition,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.4, ease: EASE_LUX } },
};

export const lockupIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.6, ease: EASE_LUX, delay: 0.1 },
  },
};
