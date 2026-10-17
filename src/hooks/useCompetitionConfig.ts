import { useMemo } from 'react';

import { getCompetition } from '../data/competitions';
import type { CompetitionConfig } from '../data/competitions';
import { applyGenuineToConfig } from '../data/genuine';
import { useGenuine } from './useGenuine';

/** `getCompetition(slug)`, with zones adjusted for "genuine" mode. */
export const useCompetitionConfig = (
  slug: string | undefined,
): CompetitionConfig | undefined => {
  const genuine = useGenuine(slug ?? '');
  return useMemo(() => {
    const config = slug ? getCompetition(slug) : undefined;
    return config && genuine ? applyGenuineToConfig(config) : config;
  }, [slug, genuine]);
};
