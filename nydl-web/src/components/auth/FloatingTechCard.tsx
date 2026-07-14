import { memo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { DURATION, EASE_IN_OUT } from '@/components/animations/motionConfig';
import { useReducedMotionSafe } from '@/components/animations/useReducedMotionSafe';
import { cn } from '@/lib/utils';

interface FloatingTechCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  className?: string;
  delay?: number;
}

/**
 * A small glass-morphism card ("HTML5 · Semantic markup" style) that floats
 * gently up and down. Positioned absolutely by the parent via `className`.
 */
function FloatingTechCardImpl({ icon, title, subtitle, className, delay = 0 }: FloatingTechCardProps) {
  const prefersReducedMotion = useReducedMotionSafe();

  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        'flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 shadow-lg backdrop-blur-md',
        className
      )}
      animate={prefersReducedMotion ? undefined : { y: [0, -10, 0] }}
      transition={{
        duration: DURATION.float,
        repeat: Infinity,
        ease: EASE_IN_OUT,
        delay,
      }}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-primary-foreground">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-primary-foreground">{title}</p>
        <p className="truncate text-xs text-primary-foreground/70">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export const FloatingTechCard = memo(FloatingTechCardImpl);
