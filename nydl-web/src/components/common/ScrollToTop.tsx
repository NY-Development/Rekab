import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll to the top on every route change. Handles both scroll models
 * in this app: the public layout scrolls the window, while the dashboard
 * layout scrolls an inner <main overflow-y-auto> container.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.querySelectorAll('main').forEach((el) => {
      el.scrollTop = 0;
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
