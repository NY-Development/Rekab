import { useRef } from 'react';
import { motion } from 'framer-motion';
import { MeshGradientBackground } from './MeshGradientBackground';
import { EngineeringGrid } from './EngineeringGrid';
import { NetworkConnections } from './NetworkConnections';
import { AnimatedLogo } from './AnimatedLogo';
import { OrbitingTechIcons } from './OrbitingTechIcons';
import { FloatingTechCard } from './FloatingTechCard';
import { LiveStatCounter } from './LiveStatCounter';
import { MiniTerminal } from './MiniTerminal';
import { RotatingHeadline } from './RotatingHeadline';
import { RegistrationBadge } from './RegistrationBadge';
import { StudentAvatars } from './StudentAvatars';
import { useParallax } from '@/components/animations/useParallax';
import { useReducedMotionSafe } from '@/components/animations/useReducedMotionSafe';
import { staggerContainer } from '@/components/animations/motionConfig';
import { Code2, Braces, Sparkles } from 'lucide-react';

/**
 * The animated left-panel hero shared by every auth page (login, register,
 * and — once they exist — forgot/verify/reset password). Purely decorative:
 * the whole subtree is aria-hidden so screen readers and keyboard nav skip
 * straight to the real form on the right.
 */
export function AuthHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotionSafe();
  const parallax = useParallax(containerRef, prefersReducedMotion);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative isolate flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-primary via-primary to-chart-4/70"
    >
      {/* ── Background layers ── */}
      <MeshGradientBackground parallax={parallax} />
      <EngineeringGrid parallax={parallax} />
      <NetworkConnections animate={!prefersReducedMotion} className="hidden lg:block text-primary-foreground" />

      {/* ── Foreground content ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14"
      >
        {/* Top: registration badge */}
        <div>
          <RegistrationBadge />
        </div>

        {/* Middle: logo + orbiting stack (desktop) / static logo (tablet) */}
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="relative hidden items-center justify-center lg:flex">
            <OrbitingTechIcons />
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatedLogo />
            </div>

            <FloatingTechCard
              icon={<Code2 className="size-4" />}
              title="Live Sessions"
              subtitle="Twice a week"
              className="absolute -left-20 top-6 hidden xl:flex"
              delay={0.2}
            />
            <FloatingTechCard
              icon={<Braces className="size-4" />}
              title="Real Projects"
              subtitle="Ship to production"
              className="absolute -right-24 top-16 hidden xl:flex"
              delay={0.6}
            />
            <FloatingTechCard
              icon={<Sparkles className="size-4" />}
              title="Mentorship"
              subtitle="1:1 career support"
              className="absolute -bottom-4 left-0 hidden xl:flex"
              delay={1}
            />
          </div>

          <div className="flex items-center justify-center lg:hidden">
            <AnimatedLogo />
          </div>
        </div>

        {/* Bottom: headline, avatars, stats */}
        <div className="space-y-6">
          <RotatingHeadline />
          <StudentAvatars />
          <div className="hidden grid-cols-3 gap-6 border-t border-white/10 pt-6 lg:grid">
            <LiveStatCounter value={500} suffix="+" label="Students Enrolled" />
            <LiveStatCounter value={50} suffix="+" label="Courses & Tracks" />
            <LiveStatCounter value={95} suffix="%" label="Completion Rate" />
          </div>
        </div>
      </motion.div>

      {/* Floating terminal, desktop only */}
      <div className="absolute bottom-20 right-6 z-10 hidden xl:block">
        <MiniTerminal />
      </div>
    </div>
  );
}

export default AuthHero;
