import type { CompetitionConfig } from '../../data/competitions';
import { CompetitionSelect } from '../CompetitionSelect';
import { ColorModeToggle } from '../ColorModeToggle';
import { AppHeading } from '../AppHeading';
import * as styles from './CompetitionHeader.css';

interface CompetitionHeaderProps {
  /** All available competitions to show in the select dropdown */
  competitions: CompetitionConfig[];
  /** Currently active competition slug */
  activeSlug: string;
  /** Called when the user selects a different competition */
  onCompetitionChange: (slug: string) => void;
  /** The current active color mode */
  colorMode: 'light' | 'dark';
  /** Called with the next color mode when the user toggles it */
  onColorModeToggle: (colorMode: 'light' | 'dark') => void;
}

export const CompetitionHeader = ({
  competitions,
  activeSlug,
  onCompetitionChange,
  colorMode,
  onColorModeToggle,
}: CompetitionHeaderProps) => {
  return (
    <header className={styles.header}>
      <AppHeading />
      <div className={styles.controls}>
        {competitions.length > 1 && (
          <div className={styles.competitionSelectWrapper}>
            <CompetitionSelect
              competitions={competitions}
              value={activeSlug}
              onChange={onCompetitionChange}
            />
          </div>
        )}
        <ColorModeToggle colorMode={colorMode} onColorModeToggle={onColorModeToggle} />
      </div>
    </header>
  );
};
