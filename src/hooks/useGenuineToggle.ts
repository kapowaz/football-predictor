import { isGenuineCompetition } from '../data/genuine';
import { useGenuineStore } from '../state/genuineStore';
import { useGenuine } from './useGenuine';

/**
 * Props for the "genuine" switch in `DeductionsModal`. `onGenuineChange` is
 * undefined (no switch) for competitions the mode does not affect.
 */
export const useGenuineToggle = (slug: string) => {
  const isGenuine = useGenuine(slug);
  const setGenuine = useGenuineStore((state) => state.setGenuine);
  return {
    isGenuine,
    onGenuineChange: isGenuineCompetition(slug) ? setGenuine : undefined,
  };
};
