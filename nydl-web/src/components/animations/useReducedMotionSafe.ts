import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Thin wrapper around framer-motion's prefers-reduced-motion hook so every
 * component in the auth hero reads motion preference from one place. Prefer
 * this over importing useReducedMotion directly from framer-motion.
 */
export function useReducedMotionSafe(): boolean {
  return useFramerReducedMotion() ?? false;
}
