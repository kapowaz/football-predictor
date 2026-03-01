import clsx from 'clsx';
import type { TeamStanding, FormResult } from '../../types';
import { getCrest } from '../../assets/crests';
import * as styles from './StandingsTable.css';

interface StandingsTableProps {
  standings: TeamStanding[];
}

function formatGD(gd: number): string {
  if (gd > 0) return `+${gd}`;
  return String(gd);
}

const formStyles: Record<FormResult, string> = {
  W: styles.formWin,
  D: styles.formDraw,
  L: styles.formLoss,
};

const ZONE_BOUNDARY_POSITIONS = new Set([2, 6, 21]);

export function StandingsTable({ standings }: StandingsTableProps) {
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
          {standings.map((standing, index) => (
            <tr
              key={standing.team.id}
              className={clsx(styles.tr, ZONE_BOUNDARY_POSITIONS.has(index + 1) && styles.zoneBoundary)}
            >
              <td className={clsx(styles.td, styles.position)}>{index + 1}</td>
              <td className={styles.td}>
                <div className={styles.teamCell}>
                  <img
                    src={getCrest(standing.team.crest)}
                    alt={standing.team.name}
                    className={styles.crest}
                  />
                  <span className={styles.teamName}>{standing.team.shortName}</span>
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
                  {standing.form.map((result, i) => (
                    <span key={i} className={clsx(styles.formBadge, formStyles[result])}>
                      {result}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
