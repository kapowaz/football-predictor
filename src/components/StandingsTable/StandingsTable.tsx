import clsx from 'clsx';
import type { TeamStanding, FormResult, FormEntry } from '../../types';
import { getCrest } from '../../assets/crests';
import * as styles from './StandingsTable.css';

interface StandingsTableProps {
  standings: TeamStanding[];
  deductionMarkers?: Map<number, string>;
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

type Zone = 'promotion' | 'playoff' | 'default' | 'relegation';

const ZONE_BOUNDARY_POSITIONS = [2, 6, 21] as const;

const getZone = (position: number): Zone => {
  if (position <= ZONE_BOUNDARY_POSITIONS[0]) return 'promotion';
  if (position <= ZONE_BOUNDARY_POSITIONS[1]) return 'playoff';
  if (position > ZONE_BOUNDARY_POSITIONS[2]) return 'relegation';
  return 'default';
};

const zoneRowStyles: Record<Zone, [string, string]> = {
  promotion: [styles.zonePromotionEven, styles.zonePromotionOdd],
  playoff: [styles.zonePlayoffEven, styles.zonePlayoffOdd],
  relegation: [styles.zoneRelegationEven, styles.zoneRelegationOdd],
  default: [styles.rowEven, styles.rowOdd],
};

const zonePositionStyles: Record<Zone, string | undefined> = {
  promotion: styles.positionPromotion,
  playoff: styles.positionPlayoff,
  relegation: styles.positionRelegation,
  default: undefined,
};

export const StandingsTable = ({ standings, deductionMarkers }: StandingsTableProps) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}></th>
            <th className={styles.th}>Team</th>
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
            const zone = getZone(index + 1);
            const rowStyle = zoneRowStyles[zone][index % 2];
            return (
            <tr
              key={standing.team.id}
              className={clsx(styles.tr, rowStyle)}
            >
              <td className={clsx(styles.td, styles.position, zonePositionStyles[zone])}>{index + 1}</td>
              <td className={styles.td}>
                <div className={styles.teamCell}>
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
