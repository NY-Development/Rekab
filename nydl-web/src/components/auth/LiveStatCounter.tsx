import { memo, useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';
import { useReducedMotionSafe } from '@/components/animations/useReducedMotionSafe';
import { useTabVisible } from '@/components/animations/useTabVisible';

interface LiveStatCounterProps {
  value: number;
  label: string;
  suffix?: string;
}

/**
 * A single "500+ Students" style stat that counts up from 0 once on mount.
 * Skips the animation entirely under prefers-reduced-motion and while the
 * tab is hidden (no point animating something nobody can see).
 */
function LiveStatCounterImpl({ value, label, suffix = '' }: LiveStatCounterProps) {
  const prefersReducedMotion = useReducedMotionSafe();
  const isTabVisible = useTabVisible();
  const [display, setDisplay] = useState(prefersReducedMotion ? value : 0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion || hasAnimated.current || !isTabVisible) return;
    hasAnimated.current = true;

    const lastValue = { current: -1 };
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        const rounded = Math.round(latest);
        if (rounded !== lastValue.current) {
          lastValue.current = rounded;
          setDisplay(rounded);
        }
      },
    });

    return () => controls.stop();
  }, [value, prefersReducedMotion, isTabVisible]);

  return (
    <div>
      <p className="text-2xl font-bold text-primary-foreground tabular-nums">
        {display}
        {suffix}
      </p>
      <p className="text-xs text-primary-foreground/70">{label}</p>
    </div>
  );
}

export const LiveStatCounter = memo(LiveStatCounterImpl);
