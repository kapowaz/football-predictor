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
import { Popover, PopoverGroup } from '../Popover';
import { findOldestYear, computeHonourRecency } from '../../utils/allTimeRank';
import type { AllTimeRankTableProps } from './types';
import * as styles from './AllTimeRankTable.css';

const formatScore = (score: number): string =>
  score.toLocaleString('en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

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

const getRowZoneClass = (rank: number, index: number): string => {
  const isEven = index % 2 === 0;
  if (rank <= 10) return isEven ? styles.zoneChampionsEven : styles.zoneChampionsOdd;
  if (rank <= 20) return isEven ? styles.zoneChampionsLeagueEven : styles.zoneChampionsLeagueOdd;
  if (rank <= 40) return isEven ? styles.zoneEuropaLeagueEven : styles.zoneEuropaLeagueOdd;
  if (rank <= 80) return isEven ? styles.zoneConferenceLeagueEven : styles.zoneConferenceLeagueOdd;
  return isEven ? styles.rowEven : styles.rowOdd;
};

const getPositionZoneClass = (rank: number): string | undefined => {
  if (rank <= 10) return styles.positionChampions;
  if (rank <= 20) return styles.positionChampionsLeague;
  if (rank <= 40) return styles.positionEuropaLeague;
  if (rank <= 80) return styles.positionConferenceLeague;
  return undefined;
};

export const AllTimeRankTable = ({ rankedClubs, weights }: AllTimeRankTableProps) => {
  const { currentYear, oldestYear, latestYears } = useMemo(() => {
    const clubs = rankedClubs.map((r) => r.club);

    const maxYear = (arrays: number[][]) => {
      let max = -Infinity;
      for (const arr of arrays) {
        for (const y of arr) {
          if (y > max) max = y;
        }
      }
      return max === -Infinity ? undefined : max;
    };

    return {
      currentYear: new Date().getFullYear(),
      oldestYear: findOldestYear(clubs),
      latestYears: {
        t1Titles: maxYear(clubs.map((c) => c.honours.leagueTitles.tier1)),
        faCup: maxYear(clubs.map((c) => c.honours.faCupWinners)),
        leagueCup: maxYear(clubs.map((c) => c.honours.leagueCupWinners)),
        ucl: maxYear(clubs.map((c) => c.europeanHonours.championsLeagueWinners)),
        uel: maxYear(clubs.map((c) => c.europeanHonours.europaLeagueWinners)),
        uecl: maxYear(clubs.map((c) => c.europeanHonours.conferenceLeagueWinners)),
      },
    };
  }, [rankedClubs]);

  const recency = (years: number[], latestYear?: number) =>
    computeHonourRecency(years, currentYear, oldestYear, weights.decayFloor, latestYear);

  return (
    <PopoverGroup>
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
              <th className={clsx(styles.th, styles.thCenter)}>
                <Popover
                  content={<div className={styles.popoverContent}>Top-flight league titles</div>}
                  placement="top"
                >
                  <span className={styles.thIcon}>
                    <PremierLeagueLogo
                      size={20}
                      foregroundColor={styles.colorPremierLeagueFg}
                      backgroundColor={styles.colorPremierLeagueBg}
                    />
                  </span>
                </Popover>
              </th>
              <th className={clsx(styles.th, styles.thCenter)}>
                <Popover
                  content={<div className={styles.popoverContent}>FA Cup</div>}
                  placement="top"
                >
                  <span className={styles.thIcon}>
                    <FaCupLogo size={20} />
                  </span>
                </Popover>
              </th>
              <th className={clsx(styles.th, styles.thCenter)}>
                <Popover
                  content={<div className={styles.popoverContent}>League Cup</div>}
                  placement="top"
                >
                  <span className={styles.thIcon}>
                    <EflCupLogo size={20} />
                  </span>
                </Popover>
              </th>
              <th className={clsx(styles.th, styles.thCenter)}>
                <Popover
                  content={
                    <div className={styles.popoverContent}>
                      UEFA&nbsp;Champions&nbsp;League / European&nbsp;Cup
                    </div>
                  }
                  placement="top"
                  hideDelay={50000}
                >
                  <span className={styles.thIcon}>
                    <UefaChampionsLeagueLogo size={20} />
                  </span>
                </Popover>
              </th>
              <th className={clsx(styles.th, styles.thCenter)}>
                <Popover
                  content={
                    <div className={styles.popoverContent}>
                      UEFA&nbsp;Europa&nbsp;League / UEFA&nbsp;Cup
                    </div>
                  }
                  placement="top"
                >
                  <span className={styles.thIcon}>
                    <UefaEuropaLeagueLogo size={20} />
                  </span>
                </Popover>
              </th>
              <th className={clsx(styles.th, styles.thCenter)}>
                <Popover
                  content={
                    <div className={styles.popoverContent}>
                      UEFA&nbsp;Europa&nbsp;Conference&nbsp;League
                    </div>
                  }
                  placement="top"
                >
                  <span className={styles.thIcon}>
                    <UefaConferenceLeagueLogo size={20} />
                  </span>
                </Popover>
              </th>
              <th className={clsx(styles.th, styles.thCenter)}>
                <Popover
                  content={
                    <div className={styles.popoverContent}>Historical average home attendance</div>
                  }
                  placement="top"
                >
                  <span>Att</span>
                </Popover>
              </th>
            </tr>
          </thead>
          <tbody>
            {rankedClubs.map((entry, index) => {
              const {
                club,
                rank,
                totalScore,
                leagueScore,
                domesticScore,
                europeanScore,
                attendanceScore,
              } = entry;
              const crestUrl = getCrest(club.crest);

              const t1TitleYears = club.honours.leagueTitles.tier1;
              const faCupYears = club.honours.faCupWinners;
              const leagueCupYears = club.honours.leagueCupWinners;
              const uclYears = club.europeanHonours.championsLeagueWinners;
              const uelYears = club.europeanHonours.europaLeagueWinners;
              const ueclYears = club.europeanHonours.conferenceLeagueWinners;

              return (
                <tr key={club.name} className={clsx(styles.tr, getRowZoneClass(rank, index))}>
                  <td className={clsx(styles.td, styles.stickyCell)}>
                    <div className={styles.teamCell}>
                      <span
                        className={clsx(
                          styles.position,
                          styles.positionNumber,
                          getPositionZoneClass(rank),
                        )}
                      >
                        {rank}
                      </span>
                      {crestUrl && (
                        <img className={styles.crest} src={crestUrl} alt="" loading="lazy" />
                      )}
                      <span className={styles.teamName}>{club.name}</span>
                    </div>
                  </td>
                  <td className={clsx(styles.td, styles.tdCenter)}>
                    <Popover
                      placement="top"
                      content={
                        <div className={styles.popoverContent}>
                          <table className={styles.scoreBreakdownTable}>
                            <tbody>
                              <tr>
                                <td className={styles.scoreBreakdownLabel}>League</td>
                                <td className={styles.scoreBreakdownValue}>
                                  {formatScore(leagueScore)}
                                </td>
                              </tr>
                              <tr>
                                <td className={styles.scoreBreakdownLabel}>Domestic</td>
                                <td className={styles.scoreBreakdownValue}>
                                  {formatScore(domesticScore)}
                                </td>
                              </tr>
                              <tr>
                                <td className={styles.scoreBreakdownLabel}>Europe</td>
                                <td className={styles.scoreBreakdownValue}>
                                  {formatScore(europeanScore)}
                                </td>
                              </tr>
                              <tr>
                                <td className={styles.scoreBreakdownLabel}>Attendance</td>
                                <td className={styles.scoreBreakdownValue}>
                                  {formatScore(attendanceScore)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      }
                    >
                      <span className={styles.scoreValue}>{formatScore(totalScore)}</span>
                    </Popover>
                  </td>
                  <td className={clsx(styles.td, styles.tdCenter)}>
                    <span className={styles.leagueScore}>{formatScore(leagueScore)}</span>
                  </td>
                  <td className={clsx(styles.td, styles.tdCenter)}>
                    <StatCell
                      value={t1TitleYears.length}
                      label={'League\u00A0Titles'}
                      title={formatYearsList(t1TitleYears, true)}
                      recency={recency(t1TitleYears, latestYears.t1Titles)}
                    />
                  </td>
                  <td className={clsx(styles.td, styles.tdCenter)}>
                    <StatCell
                      value={faCupYears.length}
                      label={'FA\u00A0Cup winners'}
                      title={formatYearsList(faCupYears)}
                      recency={recency(faCupYears, latestYears.faCup)}
                    />
                  </td>
                  <td className={clsx(styles.td, styles.tdCenter)}>
                    <StatCell
                      value={leagueCupYears.length}
                      label={'League\u00A0Cup winners'}
                      title={formatYearsList(leagueCupYears)}
                      recency={recency(leagueCupYears, latestYears.leagueCup)}
                    />
                  </td>
                  <td className={clsx(styles.td, styles.tdCenter)}>
                    <StatCell
                      value={uclYears.length}
                      label={'Champions\u00A0League winners'}
                      title={formatYearsList(uclYears)}
                      recency={recency(uclYears, latestYears.ucl)}
                    />
                  </td>
                  <td className={clsx(styles.td, styles.tdCenter)}>
                    <StatCell
                      value={uelYears.length}
                      label={'Europa\u00A0League winners'}
                      title={formatYearsList(uelYears)}
                      recency={recency(uelYears, latestYears.uel)}
                    />
                  </td>
                  <td className={clsx(styles.td, styles.tdCenter)}>
                    <StatCell
                      value={ueclYears.length}
                      label={'Conference\u00A0League winners'}
                      title={formatYearsList(ueclYears)}
                      recency={recency(ueclYears, latestYears.uecl)}
                    />
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
    </PopoverGroup>
  );
};

interface StatCellProps {
  value: number;
  /** Competition name shown as a label in the popover */
  label: string;
  /** Tooltip listing the years of each win */
  title?: string;
  /** Normalised recency percentage (0–100) driving the color-mix weighting */
  recency: number;
}

const StatCell = ({ value, label, title, recency }: StatCellProps) => {
  const content = (
    <span
      className={clsx(styles.statValue, value === 0 && styles.statZero)}
      style={assignInlineVars({ [styles.honourRecency]: `${recency}%` })}
    >
      {value === 0 ? '-' : value}
    </span>
  );

  if (title) {
    return (
      <Popover
        content={
          <div className={styles.popoverContent}>
            <span className={styles.popoverLabel}>{label}</span>
            <span className={styles.popoverYears}>{title}</span>
          </div>
        }
        placement="top"
      >
        {content}
      </Popover>
    );
  }

  return content;
};
