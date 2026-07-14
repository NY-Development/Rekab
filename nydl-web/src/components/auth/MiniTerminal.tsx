import { memo } from 'react';
import { motion } from 'framer-motion';
import { useTypewriter } from '@/components/animations/useTypewriter';
import { floatLoop } from '@/components/animations/motionConfig';
import { useReducedMotionSafe } from '@/components/animations/useReducedMotionSafe';
import { cn } from '@/lib/utils';

const COMMANDS = [
  '$ npm install',
  '$ npm run dev',
  '✓ compiled successfully',
  '$ git commit -m "feat: cohort dashboard"',
  '$ docker build -t nydl-api .',
  '$ git push origin main',
];

interface MiniTerminalProps {
  className?: string;
}

/**
 * A floating "terminal window" glass card that types out realistic dev
 * commands — a small nod to the engineering audience this platform serves.
 */
function MiniTerminalImpl({ className }: MiniTerminalProps) {
  const line = useTypewriter(COMMANDS);
  const prefersReducedMotion = useReducedMotionSafe();

  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        'w-64 overflow-hidden rounded-xl border border-white/15 bg-black/40 shadow-xl backdrop-blur-md',
        className
      )}
      variants={floatLoop}
      animate={prefersReducedMotion ? undefined : 'animate'}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="size-2.5 rounded-full bg-red-400/80" />
        <span className="size-2.5 rounded-full bg-amber-400/80" />
        <span className="size-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-[10px] font-medium text-white/50">nydl — zsh</span>
      </div>
      <div className="px-3 py-3 font-mono text-[11px] leading-relaxed text-emerald-300/90">
        {line}
        <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-emerald-300/70 align-middle" />
      </div>
    </motion.div>
  );
}

export const MiniTerminal = memo(MiniTerminalImpl);
