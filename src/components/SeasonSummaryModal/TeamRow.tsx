import type { TeamStanding } from '../../types';
import { getCrest } from '../../assets/crests';
import * as styles from './SeasonSummaryModal.css';

interface TeamRowProps {
  standing: TeamStanding;
}

export const TeamRow = ({ standing }: TeamRowProps) => {
  return (
    <div className={styles.teamRow}>
      <img src={getCrest(standing.team.crest)} alt={standing.team.name} className={styles.crest} />
      <span className={styles.teamName}>{standing.team.name}</span>
    </div>
  );
};
