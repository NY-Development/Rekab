import { useEffect, useRef, type RefObject } from 'react';
import { useTabVisible } from './useTabVisible';
import { useReducedMotionSafe } from './useReducedMotionSafe';

type GsapInstance = typeof import('gsap').gsap;

interface PausableTimeline {
  pause: () => unknown;
  play: () => unknown;
}

/**
 * Lazy-loads GSAP (kept out of the main bundle since it's only needed for
 * the auth hero's continuous background/orbit animations) and runs `build`
 * inside a `gsap.context()` scoped to `scopeRef`.
 *
 * `build` should return the root timeline/tween it created; this hook pauses
 * that timeline whenever the tab is backgrounded or the user prefers reduced
 * motion, and reverts the whole context on unmount.
 */
export function useGsapTimeline(
  scopeRef: RefObject<HTMLElement | null>,
  build: (gsap: GsapInstance) => PausableTimeline | void,
  deps: React.DependencyList = []
): void {
  const isTabVisible = useTabVisible();
  const prefersReducedMotion = useReducedMotionSafe();
  const timelineRef = useRef<PausableTimeline | null>(null);

  useEffect(() => {
    let cancelled = false;
    let ctx: { revert: () => void } | null = null;

    if (prefersReducedMotion) return;

    import('gsap').then(({ gsap }) => {
      if (cancelled || !scopeRef.current) return;
      ctx = gsap.context(() => {
        const timeline = build(gsap);
        if (timeline) timelineRef.current = timeline;
      }, scopeRef);
    });

    return () => {
      cancelled = true;
      timelineRef.current = null;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (!timelineRef.current) return;
    if (isTabVisible && !prefersReducedMotion) {
      timelineRef.current.play();
    } else {
      timelineRef.current.pause();
    }
  }, [isTabVisible, prefersReducedMotion]);
}
