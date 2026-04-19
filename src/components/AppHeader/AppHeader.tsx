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
  /** The current active color mode. */
  colorMode: 'light' | 'dark';
  /** Called with the next color mode when the user toggles it. */
  onColorModeToggle: (colorMode: 'light' | 'dark') => void;
}

export const AppHeader = ({
  competitions,
  activeSlug,
  onCompetitionChange,
  colorMode,
  onColorModeToggle,
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
        <ToggleColorMode
          isDarkMode={colorMode === 'dark'}
          onChange={(dark) => onColorModeToggle(dark ? 'dark' : 'light')}
        />
      </div>
    </header>
  );
};
