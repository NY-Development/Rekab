import { useEffect, useState } from 'react';

/**
 * Tracks the Page Visibility API so continuous/looping animations (GSAP
 * timelines, typewriters, counters) can pause while the tab is in the
 * background instead of burning CPU/GPU off-screen.
 */
export function useTabVisible(): boolean {
  const [isVisible, setIsVisible] = useState(() =>
    typeof document === 'undefined' ? true : document.visibilityState === 'visible'
  );

  useEffect(() => {
    const handleChange = () => setIsVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handleChange);
    return () => document.removeEventListener('visibilitychange', handleChange);
  }, []);

  return isVisible;
}
