import clsx from 'clsx';
import type { Match, Team } from '../../types';
import type { ZoneDefinition } from '../../data/competitions';
import { getCrest } from '../../assets/crests';
import { StandingPosition } from '../StandingPosition';
import { ScoreInput } from '../ScoreInput/ScoreInput';
import * as styles from './FixtureCard.css';

interface FixtureCardBaseProps {
  match: Match;
  status: Match['status'];
  homeTeam: Team;
  awayTeam: Team;
  /** Home-team standing position to render next to team name. */
  homePosition: number;
  /** Away-team standing position to render next to team name. */
  awayPosition: number;
  /** Competition zones used for standing position badge colours. */
  zones: ZoneDefinition[];
  /** Whether to display the fixture date (DD/MM) alongside the kickoff time. */
  showDate?: boolean;
}

interface ScheduledFixtureCardProps extends FixtureCardBaseProps {
  status: 'SCHEDULED';
  result: { homeGoals: number; awayGoals: number } | null;
  /** Whether the current result originates from live score data rather than a user prediction. */
  isLiveScore?: boolean;
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

const formatDate = (utcDate: string): string => {
  const date = new Date(utcDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

export const FixtureCard = (props: FixtureCardProps) => {
  const { match, status, homeTeam, awayTeam, result, homePosition, awayPosition, zones, showDate = false } = props;

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

  const separator = showDate ? (
    <>{formatDate(match.utcDate)}<br />{formatKickoff(match.utcDate)}</>
  ) : (
    formatKickoff(match.utcDate)
  );

  return (
    <div className={styles.card} data-match-id={match.id}>
      <div className={styles.fixtureRow}>
        {status === 'SCHEDULED' ? (
          <label
            htmlFor={homeInputId}
            className={clsx(styles.homeTeam, styles.teamWithPosition, styles.teamInteractive)}
          >
            <StandingPosition position={homePosition} zones={zones} />
            <span className={styles.homeTeamMain}>
              <span className={styles.teamIdentity}>
                <span>
                  <span className={styles.teamName}>{homeTeam.shortName}</span>
                  <span className={styles.teamTla}>{homeTeam.tla}</span>
                </span>
              </span>
              <img src={getCrest(homeTeam.crest)} alt={homeTeam.name} className={styles.crest} />
            </span>
          </label>
        ) : (
          <div className={clsx(styles.homeTeam, styles.teamWithPosition)}>
            <StandingPosition position={homePosition} zones={zones} />
            <span className={styles.homeTeamMain}>
              <span className={styles.teamIdentity}>
                <span>
                  <span className={styles.teamName}>{homeTeam.shortName}</span>
                  <span className={styles.teamTla}>{homeTeam.tla}</span>
                </span>
              </span>
              <img src={getCrest(homeTeam.crest)} alt={homeTeam.name} className={styles.crest} />
            </span>
          </div>
        )}

        {status === 'SCHEDULED' ? (
          <ScoreInput
            homeInputId={homeInputId}
            awayInputId={awayInputId}
            homeGoals={result?.homeGoals ?? null}
            awayGoals={result?.awayGoals ?? null}
            separatorText={separator}
            isLiveScore={props.isLiveScore}
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
            className={clsx(styles.awayTeam, styles.teamWithPosition, styles.teamInteractive)}
          >
            <span className={styles.awayTeamMain}>
              <img src={getCrest(awayTeam.crest)} alt={awayTeam.name} className={styles.crest} />
              <span className={styles.teamIdentity}>
                <span>
                  <span className={styles.teamName}>{awayTeam.shortName}</span>
                  <span className={styles.teamTla}>{awayTeam.tla}</span>
                </span>
              </span>
            </span>
            <StandingPosition position={awayPosition} zones={zones} />
          </label>
        ) : (
          <div className={clsx(styles.awayTeam, styles.teamWithPosition)}>
            <span className={styles.awayTeamMain}>
              <img src={getCrest(awayTeam.crest)} alt={awayTeam.name} className={styles.crest} />
              <span className={styles.teamIdentity}>
                <span>
                  <span className={styles.teamName}>{awayTeam.shortName}</span>
                  <span className={styles.teamTla}>{awayTeam.tla}</span>
                </span>
              </span>
            </span>
            <StandingPosition position={awayPosition} zones={zones} />
          </div>
        )}
      </div>

    </div>
  );
};
