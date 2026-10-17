import { isGenuineCompetition } from '../data/genuine';
import { useGenuineStore } from '../state/genuineStore';

/** Whether "genuine" mode is on and changes this competition. */
export const useGenuine = (slug: string): boolean => {
  const genuine = useGenuineStore((state) => state.genuine);
  return genuine && isGenuineCompetition(slug);
};
