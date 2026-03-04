import clsx from 'clsx';
import type { TeamStanding, FormResult, FormEntry } from '../../types';
import type { ZoneDefinition, ZoneType } from '../../competitions';
import { getCrest } from '../../assets/crests';
import * as styles from './StandingsTable.css';

interface StandingsTableProps {
  standings: TeamStanding[];
  deductionMarkers?: Map<number, string>;
  zones: ZoneDefinition[];
}

const formatGD = (gd: number): string => {
  if (gd > 0) return `+${gd}`;
  return String(gd);
};

const formatFormTitle = (entry: FormEntry): string => {
  return `${entry.homeTeamName} ${entry.homeGoals}-${entry.awayGoals} ${entry.awayTeamName}`;
};

const formStyles: Record<FormResult, string> = {
  W: styles.formWin,
  D: styles.formDraw,
  L: styles.formLoss,
};

const getZoneForPosition = (position: number, zones: ZoneDefinition[]): ZoneType | 'default' => {
  for (const zone of zones) {
    if (position >= zone.startPosition && position <= zone.endPosition) {
      return zone.type;
    }
  }
  return 'default';
};

const zoneRowStyles: Record<ZoneType | 'default', [string, string]> = {
  champions: [styles.zoneChampionsEven, styles.zoneChampionsOdd],
  promotion: [styles.zonePromotionEven, styles.zonePromotionOdd],
  playoff: [styles.zonePlayoffEven, styles.zonePlayoffOdd],
  championsLeague: [styles.zoneChampionsLeagueEven, styles.zoneChampionsLeagueOdd],
  europaLeague: [styles.zoneEuropaLeagueEven, styles.zoneEuropaLeagueOdd],
  conferenceLeague: [styles.zoneConferenceLeagueEven, styles.zoneConferenceLeagueOdd],
  relegation: [styles.zoneRelegationEven, styles.zoneRelegationOdd],
  default: [styles.rowEven, styles.rowOdd],
};

const zonePositionStyles: Record<ZoneType | 'default', string | undefined> = {
  champions: styles.positionChampions,
  promotion: styles.positionPromotion,
  playoff: styles.positionPlayoff,
  championsLeague: styles.positionChampionsLeague,
  europaLeague: styles.positionEuropaLeague,
  conferenceLeague: styles.positionConferenceLeague,
  relegation: styles.positionRelegation,
  default: undefined,
};

export const StandingsTable = ({ standings, deductionMarkers, zones }: StandingsTableProps) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={clsx(styles.th, styles.stickyCellTh)}>Team</th>
            <th className={styles.thCenter}>P</th>
            <th className={styles.thCenter}>W</th>
            <th className={styles.thCenter}>D</th>
            <th className={styles.thCenter}>L</th>
            <th className={styles.thCenter}>GF</th>
            <th className={styles.thCenter}>GA</th>
            <th className={styles.thCenter}>GD</th>
            <th className={styles.thCenter}>Pts</th>
            <th className={styles.thCenter}>Form</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => {
            const zone = getZoneForPosition(index + 1, zones);
            const rowStyle = zoneRowStyles[zone][index % 2];
            return (
              <tr key={standing.team.id} className={clsx(styles.tr, rowStyle)}>
                <td className={clsx(styles.td, styles.stickyCell)}>
                  <div className={styles.teamCell}>
                    <span
                      className={clsx(
                        styles.position,
                        styles.positionNumber,
                        zonePositionStyles[zone],
                      )}
                    >
                      {index + 1}
                    </span>
                    <img
                      src={getCrest(standing.team.crest)}
                      alt={standing.team.name}
                      className={styles.crest}
                    />
                    <span className={styles.teamName}>
                      {standing.team.shortName}
                      {deductionMarkers?.get(standing.team.id)}
                    </span>
                  </div>
                </td>
                <td className={styles.tdCenter}>{standing.played}</td>
                <td className={styles.tdCenter}>{standing.won}</td>
                <td className={styles.tdCenter}>{standing.drawn}</td>
                <td className={styles.tdCenter}>{standing.lost}</td>
                <td className={styles.tdCenter}>{standing.goalsFor}</td>
                <td className={styles.tdCenter}>{standing.goalsAgainst}</td>
                <td
                  className={clsx(styles.tdCenter, styles.goalDiff, {
                    [styles.positive]: standing.goalDifference > 0,
                    [styles.negative]: standing.goalDifference < 0,
                  })}
                >
                  {formatGD(standing.goalDifference)}
                </td>
                <td className={clsx(styles.tdCenter, styles.points)}>{standing.points}</td>
                <td className={styles.td}>
                  <div className={styles.formCell}>
                    {standing.form.map((entry, i) => (
                      <span
                        key={i}
                        className={clsx(styles.formBadge, formStyles[entry.result])}
                        title={formatFormTitle(entry)}
                      >
                        {entry.result}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
