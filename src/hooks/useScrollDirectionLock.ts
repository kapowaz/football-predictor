import { useEffect, useRef, type RefObject } from 'react';

const DIRECTION_THRESHOLD = 5;

/**
 * Locks touch-based scrolling to either vertical or horizontal axis on
 * elements that overflow in both directions. The dominant direction is
 * determined from the initial gesture and held until the touch ends.
 */
export function useScrollDirectionLock<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let lockedAxis: 'x' | 'y' | null = null;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      lockedAxis = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (lockedAxis) return;

      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - startX);
      const dy = Math.abs(touch.clientY - startY);

      if (dx < DIRECTION_THRESHOLD && dy < DIRECTION_THRESHOLD) return;

      if (dx > dy) {
        lockedAxis = 'x';
        el.style.overflowY = 'hidden';
      } else {
        lockedAxis = 'y';
        el.style.overflowX = 'hidden';
      }
    };

    const onTouchEnd = () => {
      el.style.overflowX = '';
      el.style.overflowY = '';
      lockedAxis = null;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return ref;
}
