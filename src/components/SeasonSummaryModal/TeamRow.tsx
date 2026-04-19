import { AbstractText } from '@kapowaz/components';
import { getClubBadge } from '@kapowaz/football-badges';

import type { TeamStanding } from '../../types';

import * as styles from './SeasonSummaryModal.css';

interface TeamRowProps {
  /** The team standing data to display. */
  standing: TeamStanding;
}

export const TeamRow = ({ standing }: TeamRowProps) => {
  return (
    <div className={styles.teamRow}>
      <img
        src={getClubBadge(standing.team.badge)}
        alt={standing.team.name}
        className={styles.badge}
      />
      <AbstractText
        tagName="span"
        className={styles.teamName}
        fontSize="md"
        fontWeight="medium"
      >
        {standing.team.name}
      </AbstractText>
    </div>
  );
};
