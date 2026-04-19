import { useMemo } from 'react';
import type { CompetitionConfig } from '../../data/competitions';
import { CompetitionSelect } from '@kapowaz/football';
import type { CompetitionOption } from '@kapowaz/football';
import type { Competition } from '@kapowaz/football-badges';
import { ToggleColorMode } from '@kapowaz/components';
import { AppHeading } from '../AppHeading';
import * as styles from './AppHeader.css';

interface AppHeaderProps {
  /** All available competitions to show in the select dropdown. */
  competitions: CompetitionConfig[];
  /** Currently active competition slug. */
  activeSlug: string;
  /** Called when the user selects a different competition. */
  onCompetitionChange: (slug: string) => void;
}

export const AppHeader = ({
  competitions,
  activeSlug,
  onCompetitionChange,
}: AppHeaderProps) => {
  const competitionOptions: CompetitionOption[] = useMemo(
    () =>
      competitions.map((c) => ({
        slug: c.slug as Competition,
        name: c.name,
      })),
    [competitions],
  );

  return (
    <header className={styles.header}>
      <AppHeading />
      <div className={styles.controls}>
        {competitions.length > 1 && (
          <div className={styles.competitionSelectWrapper}>
            <CompetitionSelect
              competitions={competitionOptions}
              value={activeSlug}
              onChange={onCompetitionChange}
            />
          </div>
        )}
        <ToggleColorMode />
      </div>
    </header>
  );
};
