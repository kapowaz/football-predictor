import clsx from 'clsx';
import type { Match, Team } from '../../types';
import { getCrest } from '../../assets/crests';
import { ScoreInput } from '../ScoreInput/ScoreInput';
import * as styles from './FixtureCard.css';

interface FixtureCardBaseProps {
  match: Match;
  status: Match['status'];
  homeTeam: Team;
  awayTeam: Team;
}

interface ScheduledFixtureCardProps extends FixtureCardBaseProps {
  status: 'SCHEDULED';
  result: { homeGoals: number; awayGoals: number } | null;
  onPredictionChange: (matchId: number, homeGoals: number, awayGoals: number) => void;
  onPredictionRemove: (matchId: number) => void;
}

interface FinishedFixtureCardProps extends FixtureCardBaseProps {
  status: 'FINISHED';
  result: { homeGoals: number; awayGoals: number };
}

type FixtureCardProps = ScheduledFixtureCardProps | FinishedFixtureCardProps;

const formatKickoff = (utcDate: string): string => {
  const date = new Date(utcDate);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

export const FixtureCard = (props: FixtureCardProps) => {
  const { match, status, homeTeam, awayTeam, result } = props;

  const handleScoreChange = (homeGoals: number | null, awayGoals: number | null) => {
    if (status !== 'SCHEDULED') return;
    if (homeGoals !== null && awayGoals !== null) {
      props.onPredictionChange(match.id, homeGoals, awayGoals);
    } else if (homeGoals === null && awayGoals === null) {
      props.onPredictionRemove(match.id);
    }
  };

  const homeInputId = `match-${match.id}-home`;
  const awayInputId = `match-${match.id}-away`;

  return (
    <div className={styles.card} data-match-id={match.id}>
      <div className={styles.fixtureRow}>
        {status === 'SCHEDULED' ? (
          <label
            htmlFor={homeInputId}
            className={clsx(styles.homeTeam, styles.teamInteractive)}
          >
            <span>
              <span className={styles.teamName}>{homeTeam.shortName}</span>
              <span className={styles.teamTla}>{homeTeam.tla}</span>
            </span>
            <img src={getCrest(homeTeam.crest)} alt={homeTeam.name} className={styles.crest} />
          </label>
        ) : (
          <div className={styles.homeTeam}>
            <span>
              <span className={styles.teamName}>{homeTeam.shortName}</span>
              <span className={styles.teamTla}>{homeTeam.tla}</span>
            </span>
            <img src={getCrest(homeTeam.crest)} alt={homeTeam.name} className={styles.crest} />
          </div>
        )}

        {status === 'SCHEDULED' ? (
          <ScoreInput
            homeInputId={homeInputId}
            awayInputId={awayInputId}
            homeGoals={result?.homeGoals ?? null}
            awayGoals={result?.awayGoals ?? null}
            separatorText={formatKickoff(match.utcDate)}
            onChange={handleScoreChange}
          />
        ) : (
          <div className={styles.finalScore}>
            {result.homeGoals} - {result.awayGoals}
          </div>
        )}

        {status === 'SCHEDULED' ? (
          <label
            htmlFor={awayInputId}
            className={clsx(styles.awayTeam, styles.teamInteractive)}
          >
            <img src={getCrest(awayTeam.crest)} alt={awayTeam.name} className={styles.crest} />
            <span>
              <span className={styles.teamName}>{awayTeam.shortName}</span>
              <span className={styles.teamTla}>{awayTeam.tla}</span>
            </span>
          </label>
        ) : (
          <div className={styles.awayTeam}>
            <img src={getCrest(awayTeam.crest)} alt={awayTeam.name} className={styles.crest} />
            <span>
              <span className={styles.teamName}>{awayTeam.shortName}</span>
              <span className={styles.teamTla}>{awayTeam.tla}</span>
            </span>
          </div>
        )}
      </div>

    </div>
  );
};
