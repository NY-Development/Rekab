import { memo } from 'react';
import type { ParallaxOffset } from '@/components/animations/useParallax';

interface EngineeringGridProps {
  parallax?: ParallaxOffset;
}

/**
 * A faint blueprint-style grid overlay. Pure CSS background-image (no DOM
 * nodes per line), so it's effectively free to render and only needs a
 * transform for its parallax layer.
 */
function EngineeringGridImpl({ parallax = { x: 0, y: 0 } }: EngineeringGridProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
      style={{
        backgroundImage:
          'linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        transform: `translate3d(${parallax.x * 4}px, ${parallax.y * 4}px, 0)`,
        transition: 'transform 0.3s ease-out',
      }}
    />
  );
}

export const EngineeringGrid = memo(EngineeringGridImpl);
