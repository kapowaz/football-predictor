import { animate } from 'motion/react';
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface UseScreenShakeOptions {
  shouldShake: boolean;
  targetRef: RefObject<HTMLElement | null>;
  duration: number;
  /** Delay in seconds before the shake animation starts. */
  delay?: number;
}

export const useScreenShake = ({
  shouldShake,
  targetRef,
  duration,
  delay = 0,
}: UseScreenShakeOptions): void => {
  const prevShouldShake = useRef(false);

  useEffect(() => {
    const wasShaking = prevShouldShake.current;
    prevShouldShake.current = shouldShake;

    if (!shouldShake || wasShaking || !targetRef.current) return;

    const el = targetRef.current;
    el.style.willChange = 'transform';

    const run = () => {
      animate(
        el,
        {
          x: [0, -9, 8, -7, 9, -8, 6, -9, 7, -5, 6, -4, 3, -2, 1, 0],
          y: [0, 5, -8, 9, -4, 8, -9, 4, 7, -5, 3, -4, 2, -1, 1, 0],
        },
        { duration, ease: 'easeOut' },
      ).then(() => {
        el.style.willChange = '';
      });
    };

    if (delay > 0) {
      const id = window.setTimeout(run, delay * 1000);
      return () => {
        window.clearTimeout(id);
        el.style.willChange = '';
      };
    }

    run();
  }, [delay, duration, shouldShake, targetRef]);
};
