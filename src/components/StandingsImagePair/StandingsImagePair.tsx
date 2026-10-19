import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

import {
  getStandingsImageSize,
  type StandingsImageSize,
} from '../../utils/imageLayout';
import { StandingsImageView } from '../StandingsImageView';
import type { StandingsImageViewProps } from '../StandingsImageView';

export interface StandingsImagePairProps extends Omit<
  StandingsImageViewProps,
  'partial' | 'captureRef' | 'size' | 'contentRef'
> {
  /** Refs for the top and bottom capture nodes, in that order. */
  captureRefs: [
    RefObject<HTMLDivElement | null>,
    RefObject<HTMLDivElement | null>,
  ];
  /** Called with the shared size once it is measured, and when it changes. */
  onLayout?: (size: StandingsImageSize) => void;
}

/**
 * Renders the top and bottom halves of a standings image at the same size: the
 * taller half's height, at a 1.91:1 aspect ratio. Re-measures when the content
 * changes size (for example once web fonts load).
 */
export const StandingsImagePair = ({
  captureRefs,
  onLayout,
  ...viewProps
}: StandingsImagePairProps) => {
  const topContentRef = useRef<HTMLDivElement>(null);
  const bottomContentRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<StandingsImageSize | null>(null);

  useLayoutEffect(() => {
    const nodes = [topContentRef.current, bottomContentRef.current].filter(
      (node): node is HTMLDivElement => node !== null,
    );
    if (nodes.length !== 2) return;

    const measure = () => {
      const next = getStandingsImageSize(
        nodes.map((node) => node.getBoundingClientRect().height),
      );
      if (!next) return;
      setSize((previous) =>
        previous?.width === next.width && previous.height === next.height
          ? previous
          : next,
      );
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (size) onLayout?.(size);
  }, [size, onLayout]);

  return (
    <>
      <StandingsImageView
        {...viewProps}
        partial="top"
        captureRef={captureRefs[0]}
        contentRef={topContentRef}
        size={size ?? undefined}
      />
      <StandingsImageView
        {...viewProps}
        partial="bottom"
        captureRef={captureRefs[1]}
        contentRef={bottomContentRef}
        size={size ?? undefined}
      />
    </>
  );
};
