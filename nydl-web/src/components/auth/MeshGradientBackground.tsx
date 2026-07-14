import { memo, useRef } from 'react';
import { useGsapTimeline } from '@/components/animations/useGsapTimeline';
import type { ParallaxOffset } from '@/components/animations/useParallax';

interface MeshGradientBackgroundProps {
  parallax?: ParallaxOffset;
}

/**
 * Layered, blurred color blobs drifting slowly behind the hero content —
 * built from the app's own design tokens (primary + chart colors), never a
 * new palette. GSAP drives the continuous drift so it survives long past a
 * single mount without re-triggering React renders.
 */
function MeshGradientBackgroundImpl({ parallax = { x: 0, y: 0 } }: MeshGradientBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGsapTimeline(
    containerRef,
    (gsap) => {
      const timeline = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
      blobRefs.current.forEach((blob, index) => {
        if (!blob) return;
        timeline.to(
          blob,
          {
            x: index % 2 === 0 ? 60 : -50,
            y: index % 3 === 0 ? -40 : 50,
            duration: 14 + index * 3,
          },
          0
        );
      });
      return timeline;
    },
    []
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={{
        transform: `translate3d(${parallax.x * 8}px, ${parallax.y * 8}px, 0)`,
        transition: 'transform 0.3s ease-out',
      }}
    >
      <div
        ref={(el) => { blobRefs.current[0] = el; }}
        className="absolute -left-24 -top-24 size-[28rem] rounded-full bg-primary/30 blur-3xl will-change-transform"
      />
      <div
        ref={(el) => { blobRefs.current[1] = el; }}
        className="absolute right-[-6rem] top-1/4 size-[24rem] rounded-full bg-chart-2/25 blur-3xl will-change-transform"
      />
      <div
        ref={(el) => { blobRefs.current[2] = el; }}
        className="absolute bottom-[-8rem] left-1/4 size-[26rem] rounded-full bg-chart-4/20 blur-3xl will-change-transform"
      />
      <div
        ref={(el) => { blobRefs.current[3] = el; }}
        className="absolute bottom-0 right-0 size-[20rem] rounded-full bg-chart-3/15 blur-3xl will-change-transform"
      />
      {/* Soft vignette so foreground content stays legible over the mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/40" />
    </div>
  );
}

export const MeshGradientBackground = memo(MeshGradientBackgroundImpl);
