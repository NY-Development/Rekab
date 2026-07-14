import { memo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTabVisible } from '@/components/animations/useTabVisible';
import { useReducedMotionSafe } from '@/components/animations/useReducedMotionSafe';
import { DURATION, EASE_OUT } from '@/components/animations/motionConfig';

const HEADLINES = [
  'Build real products, not just tutorials.',
  'Learn from engineers who ship in production.',
  'From your first commit to your first offer.',
  'A cohort that pushes you to level up.',
];

const ROTATE_INTERVAL_MS = 4500;

/**
 * Cross-fades between a short list of motivational headlines. Freezes on
 * the first headline when reduced motion is requested, and pauses the
 * rotation timer while the tab is hidden.
 */
function RotatingHeadlineImpl() {
  const [index, setIndex] = useState(0);
  const isTabVisible = useTabVisible();
  const prefersReducedMotion = useReducedMotionSafe();

  useEffect(() => {
    if (prefersReducedMotion || !isTabVisible) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % HEADLINES.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isTabVisible, prefersReducedMotion]);

  return (
    <div className="h-14 sm:h-10">
      <AnimatePresence mode="wait">
        <motion.p
          key={prefersReducedMotion ? 0 : index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
          className="text-lg font-medium text-primary-foreground/90"
        >
          {HEADLINES[prefersReducedMotion ? 0 : index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export const RotatingHeadline = memo(RotatingHeadlineImpl);
