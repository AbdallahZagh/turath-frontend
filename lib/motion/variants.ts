import type { Transition, Variants } from "framer-motion";

/** Pass to every `whileInView` section so reveals only ever play once. */
export const viewportOnce = { once: true, margin: "-80px" } as const;

const EASE_OUT: Transition["ease"] = [0.16, 1, 0.3, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export const toastMotion: Variants = {
  hidden: { opacity: 0, y: -34, scale: 0.9, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 360, damping: 25, mass: 0.75 },
  },
  exit: {
    opacity: 0,
    y: -24,
    scale: 0.94,
    filter: "blur(7px)",
    transition: { duration: 0.22, ease: EASE_OUT },
  },
};

export const toastReducedMotion: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};
