import { useCallback, useState } from 'react';

import type { StandingsImageSize } from '../utils/imageLayout';

/**
 * Tracks the size StandingsImagePair settles on, as a string to append to an
 * image capture signature, so downloads are re-captured after the halves are
 * resized.
 */
export const useImageLayoutKey = (): [
  string,
  (size: StandingsImageSize) => void,
] => {
  const [layoutKey, setLayoutKey] = useState('');
  const onLayout = useCallback((size: StandingsImageSize) => {
    setLayoutKey(`${size.width}x${size.height}`);
  }, []);
  return [layoutKey, onLayout];
};
