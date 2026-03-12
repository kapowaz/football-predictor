import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { animate } from 'framer-motion';

interface UseScreenShakeOptions {
  shouldShake: boolean;
  targetRef: RefObject<HTMLElement | null>;
  duration: number;
}

export const useScreenShake = ({
  shouldShake,
  targetRef,
  duration,
}: UseScreenShakeOptions): void => {
  const prevShouldShake = useRef(false);

  useEffect(() => {
    if (shouldShake && !prevShouldShake.current && targetRef.current) {
      animate(
        targetRef.current,
        {
          x: [0, -9, 8, -7, 9, -8, 6, -9, 7, -5, 6, -4, 3, -2, 1, 0],
          y: [0, 5, -8, 9, -4, 8, -9, 4, 7, -5, 3, -4, 2, -1, 1, 0],
        },
        { duration, ease: 'easeOut' },
      );
    }

    prevShouldShake.current = shouldShake;
  }, [duration, shouldShake, targetRef]);
};
