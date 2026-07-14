import type { Transition, Variants } from 'framer-motion';

/**
 * Single source of truth for the auth hero's motion language. Every
 * component under components/auth/ should pull its easing/duration/stagger
 * values from here instead of hand-rolling new ones, so the whole hero
 * reads as one consistent system.
 */

export const EASE_OUT: Transition['ease'] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: Transition['ease'] = [0.65, 0, 0.35, 1];

export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.8,
  breath: 4,
  float: 6,
  orbit: 40,
} as const;

export const STAGGER = {
  tight: 0.05,
  base: 0.08,
  loose: 0.15,
} as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.base,
      delayChildren: 0.15,
    },
  },
};

export const floatLoop: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: DURATION.float,
      repeat: Infinity,
      ease: EASE_IN_OUT,
    },
  },
};

export const breatheLoop: Variants = {
  animate: {
    opacity: [0.6, 1, 0.6],
    scale: [1, 1.05, 1],
    transition: {
      duration: DURATION.breath,
      repeat: Infinity,
      ease: EASE_IN_OUT,
    },
  },
};
