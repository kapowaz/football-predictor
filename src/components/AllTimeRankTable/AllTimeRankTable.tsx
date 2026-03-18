import clsx from 'clsx';
import { getCrest } from '../../assets/crests';
import {
  PremierLeagueLogo,
  FaCupLogo,
  EflCupLogo,
  UefaChampionsLeagueLogo,
  UefaEuropaLeagueLogo,
  UefaConferenceLeagueLogo,
} from '../honours';
import type { AllTimeRankTableProps } from './types';
import * as styles from './AllTimeRankTable.css';

const formatScore = (score: number): string => score.toFixed(1);

const formatAttendance = (attendance: number): string => {
  if (attendance >= 1000) {
    return `${(attendance / 1000).toFixed(1)}k`;
  }
  return String(attendance);
};

export const AllTimeRankTable = ({ rankedClubs }: AllTimeRankTableProps) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <colgroup>
          <col />
          <col className={styles.colScore} />
          <col className={styles.colScore} />
          <col className={styles.colStat} />
          <col className={styles.colStat} />
          <col className={styles.colStat} />
          <col className={styles.colStat} />
          <col className={styles.colStat} />
          <col className={styles.colStat} />
          <col className={styles.colAttendance} />
        </colgroup>
        <thead className={styles.thead}>
          <tr>
            <th className={clsx(styles.th, styles.stickyCellTh)}>Team</th>
            <th className={clsx(styles.th, styles.thCenter)}>Score</th>
            <th className={clsx(styles.th, styles.thCenter)}>League</th>
            <th className={clsx(styles.th, styles.thCenter)} title="Top-flight league titles">
              <span className={styles.thIcon}>
                <PremierLeagueLogo size={20} foregroundColor={styles.colorPremierLeagueFg} backgroundColor={styles.colorPremierLeagueBg} />
              </span>
            </th>
            <th className={clsx(styles.th, styles.thCenter)} title="FA Cup wins">
              <span className={styles.thIcon}><FaCupLogo size={20} /></span>
            </th>
            <th className={clsx(styles.th, styles.thCenter)} title="League Cup wins">
              <span className={styles.thIcon}><EflCupLogo size={20} /></span>
            </th>
            <th className={clsx(styles.th, styles.thCenter)} title="UEFA Champions League / European Cup wins">
              <span className={styles.thIcon}><UefaChampionsLeagueLogo size={20} /></span>
            </th>
            <th className={clsx(styles.th, styles.thCenter)} title="UEFA Europa League / UEFA Cup wins">
              <span className={styles.thIcon}><UefaEuropaLeagueLogo size={20} /></span>
            </th>
            <th className={clsx(styles.th, styles.thCenter)} title="UEFA Europa Conference League wins">
              <span className={styles.thIcon}><UefaConferenceLeagueLogo size={20} /></span>
            </th>
            <th className={clsx(styles.th, styles.thCenter)} title="Historical average home attendance">Att</th>
          </tr>
        </thead>
        <tbody>
          {rankedClubs.map((entry, index) => {
            const { club, rank, totalScore, leagueScore } = entry;
            const crestUrl = getCrest(club.crest);

            const t1Titles = club.honours.leagueTitles.tier1.length;
            const faCups = club.honours.faCupWinners.length;
            const leagueCups = club.honours.leagueCupWinners.length;
            const uclWins = club.europeanHonours.championsLeagueWinners.length;
            const uelWins = club.europeanHonours.europaLeagueWinners.length;
            const ueclWins = club.europeanHonours.conferenceLeagueWinners.length;

            return (
              <tr
                key={club.name}
                className={clsx(
                  styles.tr,
                  index % 2 === 0 ? styles.rowEven : styles.rowOdd,
                )}
              >
                <td className={clsx(styles.td, styles.stickyCell)}>
                  <div className={styles.teamCell}>
                    <span
                      className={clsx(styles.position, styles.positionNumber)}
                    >
                      {rank}
                    </span>
                    {crestUrl && (
                      <img
                        className={styles.crest}
                        src={crestUrl}
                        alt=""
                        loading="lazy"
                      />
                    )}
                    <span className={styles.teamName}>{club.name}</span>
                  </div>
                </td>
                <td className={clsx(styles.td, styles.tdCenter)}>
                  <span className={styles.scoreValue}>{formatScore(totalScore)}</span>
                </td>
                <td className={clsx(styles.td, styles.tdCenter)}>
                  <span className={styles.leagueScore}>{formatScore(leagueScore)}</span>
                </td>
                <td className={clsx(styles.td, styles.tdCenter)}>
                  <StatCell value={t1Titles} />
                </td>
                <td className={clsx(styles.td, styles.tdCenter)}>
                  <StatCell value={faCups} />
                </td>
                <td className={clsx(styles.td, styles.tdCenter)}>
                  <StatCell value={leagueCups} />
                </td>
                <td className={clsx(styles.td, styles.tdCenter)}>
                  <StatCell value={uclWins} />
                </td>
                <td className={clsx(styles.td, styles.tdCenter)}>
                  <StatCell value={uelWins} />
                </td>
                <td className={clsx(styles.td, styles.tdCenter)}>
                  <StatCell value={ueclWins} />
                </td>
                <td className={clsx(styles.td, styles.tdCenter)}>
                  <span className={styles.attendanceValue}>
                    {formatAttendance(club.averageAttendance)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

interface StatCellProps {
  value: number;
}

const StatCell = ({ value }: StatCellProps) => (
  <span className={clsx(styles.statValue, value === 0 && styles.statZero)}>
    {value === 0 ? '-' : value}
  </span>
);
