import { useEffect, useRef, useState, type RefObject } from 'react';

export interface ParallaxOffset {
  x: number;
  y: number;
}

/**
 * Tracks pointer position relative to the center of `containerRef`,
 * returning a normalized -1..1 offset on each axis. Used to give background
 * layers of the auth hero a subtle depth-of-field feel as the cursor moves.
 *
 * No-ops on coarse (touch) pointers and when `disabled` is true (e.g. the
 * caller should pass in prefers-reduced-motion here).
 */
export function useParallax(
  containerRef: RefObject<HTMLElement | null>,
  disabled = false
): ParallaxOffset {
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (disabled) return;
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const node = containerRef.current;
    if (!node) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        setOffset({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
      });
    };

    const handlePointerLeave = () => setOffset({ x: 0, y: 0 });

    node.addEventListener('pointermove', handlePointerMove);
    node.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerleave', handlePointerLeave);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [containerRef, disabled]);

  return offset;
}
