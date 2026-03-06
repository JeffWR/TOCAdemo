import { useEffect, useRef, useState } from 'react';

type ScrollDirection = 'up' | 'down';

// Ignore movements smaller than this to avoid micro-jitter toggling the header.
const JITTER_THRESHOLD_PX = 5;
// Always show the header when within this distance from the top of the page.
const TOP_ZONE_PX = 60;

export function useScrollDirection(): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>('up');
  const lastY = useRef(0);

  useEffect(() => {
    function handleScroll(): void {
      const currentY = window.scrollY;
      if (Math.abs(currentY - lastY.current) < JITTER_THRESHOLD_PX) return;
      if (currentY < TOP_ZONE_PX) {
        setDirection('up');
      } else {
        setDirection(currentY > lastY.current ? 'down' : 'up');
      }
      lastY.current = currentY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return direction;
}
