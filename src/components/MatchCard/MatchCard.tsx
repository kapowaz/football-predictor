import { useCallback } from 'react';
import type { Match, Team } from '../../types';
import { getCrest } from '../../assets/crests';
import { ScoreInput } from '../ScoreInput/ScoreInput';
import * as styles from './MatchCard.css';

interface MatchCardProps {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  prediction: { homeGoals: number; awayGoals: number } | null;
  onPredictionChange: (matchId: number, homeGoals: number, awayGoals: number) => void;
  onPredictionRemove: (matchId: number) => void;
}

const formatKickoff = (utcDate: string): string => {
  const date = new Date(utcDate);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

export const MatchCard = ({
  match,
  homeTeam,
  awayTeam,
  prediction,
  onPredictionChange,
  onPredictionRemove,
}: MatchCardProps) => {
  const handleScoreChange = useCallback(
    (homeGoals: number | null, awayGoals: number | null) => {
      if (homeGoals !== null && awayGoals !== null) {
        onPredictionChange(match.id, homeGoals, awayGoals);
      } else if (homeGoals === null && awayGoals === null) {
        onPredictionRemove(match.id);
      }
    },
    [match.id, onPredictionChange, onPredictionRemove],
  );

  return (
    <div className={styles.card} data-match-id={match.id}>
      <div className={styles.homeTeam}>
        <div>
          <div className={styles.teamName}>{homeTeam.shortName}</div>
          <div className={styles.teamTla}>{homeTeam.tla}</div>
        </div>
        <img src={getCrest(homeTeam.crest)} alt={homeTeam.name} className={styles.crest} />
      </div>

      <div className={styles.scoreSection}>
        <ScoreInput
          homeGoals={prediction?.homeGoals ?? null}
          awayGoals={prediction?.awayGoals ?? null}
          onChange={handleScoreChange}
        />
        <div className={styles.kickoff}>{formatKickoff(match.utcDate)}</div>
      </div>

      <div className={styles.awayTeam}>
        <img src={getCrest(awayTeam.crest)} alt={awayTeam.name} className={styles.crest} />
        <div>
          <div className={styles.teamName}>{awayTeam.shortName}</div>
          <div className={styles.teamTla}>{awayTeam.tla}</div>
        </div>
      </div>
    </div>
  );
};
