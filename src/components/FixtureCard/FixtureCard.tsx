import { useCallback } from 'react';
import type { Match, Team } from '../../types';
import { getCrest } from '../../assets/crests';
import { ScoreInput } from '../ScoreInput/ScoreInput';
import * as styles from './FixtureCard.css';

interface FixtureCardProps {
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

export const FixtureCard = ({
  match,
  homeTeam,
  awayTeam,
  prediction,
  onPredictionChange,
  onPredictionRemove,
}: FixtureCardProps) => {
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

  const homeInputId = `match-${match.id}-home`;
  const awayInputId = `match-${match.id}-away`;

  return (
    <div className={styles.card} data-match-id={match.id}>
      <div className={styles.fixtureRow}>
        <label htmlFor={homeInputId} className={styles.homeTeam}>
          <span>
            <span className={styles.teamName}>{homeTeam.shortName}</span>
            <span className={styles.teamTla}>{homeTeam.tla}</span>
          </span>
          <img src={getCrest(homeTeam.crest)} alt={homeTeam.name} className={styles.crest} />
        </label>

        <ScoreInput
          homeInputId={homeInputId}
          awayInputId={awayInputId}
          homeGoals={prediction?.homeGoals ?? null}
          awayGoals={prediction?.awayGoals ?? null}
          onChange={handleScoreChange}
        />

        <label htmlFor={awayInputId} className={styles.awayTeam}>
          <img src={getCrest(awayTeam.crest)} alt={awayTeam.name} className={styles.crest} />
          <span>
            <span className={styles.teamName}>{awayTeam.shortName}</span>
            <span className={styles.teamTla}>{awayTeam.tla}</span>
          </span>
        </label>
      </div>

      <div className={styles.kickoff}>{formatKickoff(match.utcDate)}</div>
    </div>
  );
};
