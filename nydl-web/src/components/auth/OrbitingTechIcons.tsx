import { memo, useRef } from 'react';
import { Atom, Container, Leaf, Rocket, ShieldCheck, Hexagon, type LucideIcon } from 'lucide-react';
import { FaGithub } from "react-icons/fa";
import {type IconType} from 'react-icons'
import { useGsapTimeline } from '@/components/animations/useGsapTimeline';
import { DURATION } from '@/components/animations/motionConfig';

interface OrbitTech {
  label: string;
  icon: LucideIcon | IconType;
}

const ORBIT_TECHNOLOGIES: OrbitTech[] = [
  { label: 'React', icon: Atom },
  { label: 'Node.js', icon: Hexagon },
  { label: 'GitHub', icon: FaGithub },
  { label: 'Docker', icon: Container },
  { label: 'MongoDB', icon: Leaf },
  { label: 'Expo', icon: Rocket },
  { label: 'Security', icon: ShieldCheck },
];

const RADIUS = 150;

/**
 * Technology icons circling the logo. The outer ring rotates continuously
 * via GSAP while each icon counter-rotates in lockstep so the glyphs
 * themselves always stay upright.
 */
function OrbitingTechIconsImpl() {
  const ringRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGsapTimeline(
    ringRef,
    (gsap) => {
      const timeline = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } });
      timeline.to(ringRef.current, { rotate: 360, duration: DURATION.orbit }, 0);
      iconRefs.current.forEach((icon) => {
        if (!icon) return;
        timeline.to(icon, { rotate: -360, duration: DURATION.orbit }, 0);
      });
      return timeline;
    },
    []
  );

  return (
    <div className="relative size-85" aria-hidden="true">
      <div ref={ringRef} className="absolute inset-0 will-change-transform">
        {ORBIT_TECHNOLOGIES.map(({ label, icon: Icon }, index) => {
          const angle = (index / ORBIT_TECHNOLOGIES.length) * Math.PI * 2;
          const x = Math.cos(angle) * RADIUS;
          const y = Math.sin(angle) * RADIUS;
          return (
            <div
              key={label}
              className="absolute left-1/2 top-1/2 flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-primary-foreground shadow-lg backdrop-blur-md will-change-transform"
              style={{ transform: `translate(${x - 22}px, ${y - 22}px)` }}
              ref={(el) => { iconRefs.current[index] = el; }}
            >
              <Icon className="size-5" strokeWidth={1.75} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const OrbitingTechIcons = memo(OrbitingTechIconsImpl);
