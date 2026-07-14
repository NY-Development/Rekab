import { memo } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { fadeInUp } from '@/components/animations/motionConfig';
import { useReducedMotionSafe } from '@/components/animations/useReducedMotionSafe';

/**
 * Small pill announcing the current cohort's registration window, with a
 * subtle pulsing "live" dot.
 */
function RegistrationBadgeImpl() {
  const prefersReducedMotion = useReducedMotionSafe();

  return (
    <motion.div
      variants={fadeInUp}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur-md"
    >
      <span className="relative flex size-2">
        {!prefersReducedMotion && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
      </span>
      <GraduationCap className="size-3.5" />
      Summer Cohort 2026 — Registration Open
    </motion.div>
  );
}

export const RegistrationBadge = memo(RegistrationBadgeImpl);
