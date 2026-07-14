import { memo } from 'react';
import { motion } from 'framer-motion';
import { breatheLoop } from '@/components/animations/motionConfig';
import { useReducedMotionSafe } from '@/components/animations/useReducedMotionSafe';
import { useNavigate } from 'react-router-dom';

/**
 * The official NYDL mark with a soft "breathing" glow behind it. Sits at the
 * center of the orbiting technology ring.
 */
function AnimatedLogoImpl() {
  const prefersReducedMotion = useReducedMotionSafe();
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate('/')} className="relative flex size-24 items-center justify-center">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-primary/40 blur-2xl"
        variants={breatheLoop}
        animate={prefersReducedMotion ? undefined : 'animate'}
      />
      <div className="relative flex size-20 items-center justify-center rounded-2xl bg-white shadow-xl ring-1 ring-white/40">
        <img src="/logo.png" alt="NYDL" className="size-14 w-auto object-contain" />
      </div>
    </div>
  );
}

export const AnimatedLogo = memo(AnimatedLogoImpl);
