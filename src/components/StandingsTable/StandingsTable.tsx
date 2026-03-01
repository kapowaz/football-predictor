import type { TeamStanding } from '../../types'
import { getCrest } from '../../assets/crests'
import * as styles from './StandingsTable.css'

interface StandingsTableProps {
  standings: TeamStanding[]
}

function formatGD(gd: number): string {
  if (gd > 0) return `+${gd}`
  return String(gd)
}

export function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>#</th>
            <th className={styles.th}>Team</th>
            <th className={styles.thCenter}>P</th>
            <th className={styles.thCenter}>W</th>
            <th className={styles.thCenter}>D</th>
            <th className={styles.thCenter}>L</th>
            <th className={styles.thCenter}>GF</th>
            <th className={styles.thCenter}>GA</th>
            <th className={styles.thCenter}>GD</th>
            <th className={styles.thRight}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => (
            <tr key={standing.team.id} className={styles.tr}>
              <td className={`${styles.td} ${styles.position}`}>{index + 1}</td>
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
                className={`${styles.tdCenter} ${styles.goalDiff} ${
                  standing.goalDifference > 0
                    ? styles.positive
                    : standing.goalDifference < 0
                      ? styles.negative
                      : ''
                }`}
              >
                {formatGD(standing.goalDifference)}
              </td>
              <td className={`${styles.tdRight} ${styles.points}`}>{standing.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
