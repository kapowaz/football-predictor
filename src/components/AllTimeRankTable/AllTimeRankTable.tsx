import { useMemo } from 'react';
import clsx from 'clsx';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { getCrest } from '../../assets/crests';
import {
  PremierLeagueLogo,
  FaCupLogo,
  EflCupLogo,
  UefaChampionsLeagueLogo,
  UefaEuropaLeagueLogo,
  UefaConferenceLeagueLogo,
} from '../honours';
import { findOldestYear, computeHonourRecency } from '../../utils/allTimeRank';
import type { AllTimeRankTableProps } from './types';
import * as styles from './AllTimeRankTable.css';

const formatScore = (score: number): string => score.toFixed(1);

const formatAttendance = (attendance: number): string => {
  if (attendance >= 1000) {
    return `${(attendance / 1000).toFixed(1)}k`;
  }
  return String(attendance);
};

const formatSeasonYear = (year: number): string => {
  const startYear = year - 1;
  const endYearShort = String(year).slice(-2);
  return `${startYear}/${endYearShort}`;
};

const formatYearsList = (years: number[], asSeason = false): string | undefined => {
  if (years.length === 0) return undefined;
  return years.map((y) => (asSeason ? formatSeasonYear(y) : String(y))).join(', ');
};

export const AllTimeRankTable = ({ rankedClubs, weights }: AllTimeRankTableProps) => {
  const { currentYear, oldestYear } = useMemo(() => {
    const clubs = rankedClubs.map((r) => r.club);
    return {
      currentYear: new Date().getFullYear(),
      oldestYear: findOldestYear(clubs),
    };
  }, [rankedClubs]);

  const recency = (years: number[]) =>
    computeHonourRecency(years, currentYear, oldestYear, weights.decayFloor);

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

            const t1TitleYears = club.honours.leagueTitles.tier1;
            const faCupYears = club.honours.faCupWinners;
            const leagueCupYears = club.honours.leagueCupWinners;
            const uclYears = club.europeanHonours.championsLeagueWinners;
            const uelYears = club.europeanHonours.europaLeagueWinners;
            const ueclYears = club.europeanHonours.conferenceLeagueWinners;

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
                  <StatCell value={t1TitleYears.length} title={formatYearsList(t1TitleYears, true)} recency={recency(t1TitleYears)} />
                </td>
                <td className={clsx(styles.td, styles.tdCenter)}>
                  <StatCell value={faCupYears.length} title={formatYearsList(faCupYears)} recency={recency(faCupYears)} />
                </td>
                <td className={clsx(styles.td, styles.tdCenter)}>
                  <StatCell value={leagueCupYears.length} title={formatYearsList(leagueCupYears)} recency={recency(leagueCupYears)} />
                </td>
                <td className={clsx(styles.td, styles.tdCenter)}>
                  <StatCell value={uclYears.length} title={formatYearsList(uclYears)} recency={recency(uclYears)} />
                </td>
                <td className={clsx(styles.td, styles.tdCenter)}>
                  <StatCell value={uelYears.length} title={formatYearsList(uelYears)} recency={recency(uelYears)} />
                </td>
                <td className={clsx(styles.td, styles.tdCenter)}>
                  <StatCell value={ueclYears.length} title={formatYearsList(ueclYears)} recency={recency(ueclYears)} />
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
  /** Tooltip listing the years of each win */
  title?: string;
  /** Normalised recency percentage (0–100) driving the color-mix weighting */
  recency: number;
}

const StatCell = ({ value, title, recency }: StatCellProps) => (
  <span
    className={clsx(styles.statValue, value === 0 && styles.statZero)}
    title={title}
    style={assignInlineVars({ [styles.honourRecency]: `${recency}%` })}
  >
    {value === 0 ? '-' : value}
  </span>
);
