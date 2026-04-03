import clsx from 'clsx';
import { Fragment } from 'react';
import type { TeamStanding, FormResult, FormEntry, VariantRulesMode } from '../../types';
import type { ZoneDefinition, ZoneType } from '../../data/competitions';
import type { ZoneThreshold } from '../../utils/zoneThresholds';
import { getCrest } from '../../assets/crests';
import { getBonusPointsForResult } from '../../utils/standings';
import { getPositionTrend } from '../../utils/positionHistory';
import { getZoneForPosition } from '../../utils/zones';
import { useScrollDirectionLock } from '../../hooks/useScrollDirectionLock';
import { StandingPosition } from '../StandingPosition';
import { Sparkline } from '../Sparkline';
import { SparklineIcon, RoundedSquareBadgesIcon } from '../icons';
import { ZoneThresholdLabel, zoneLabels } from '../ZoneThresholdLabel';
import { shouldRenderGuaranteedPositionBadge } from './positionBadge';
import * as styles from './StandingsTable.css';

type NonRelegationZoneType = Exclude<ZoneType, 'relegation'>;

export type FormDisplayMode = 'badges' | 'sparkline';

const SPARKLINE_HISTORY_LENGTH = 16;

interface StandingsTableProps {
  standings: TeamStanding[];
  deductionMarkers?: Map<number, string>;
  zoneGuaranteedByTeamId?: Map<number, boolean>;
  zones: ZoneDefinition[];
  /** Optionally render only the top or bottom half of standings. */
  partial?: 'top' | 'bottom';
  /** Called when a form badge is clicked, with the match ID. */
  onResultClick?: (matchId: number) => void;
  /** When provided, only form badges whose match ID is in this set render as buttons. When omitted, all form badges are clickable if `onResultClick` is set. */
  clickableMatchIds?: ReadonlySet<number>;
  /** Disable internal vertical scrolling on the table container. */
  disableVerticalScroll?: boolean;
  /** Disable rounded corners on the <table> element. */
  disableTableBorderRadius?: boolean;
  /** Increase table text size when rendered for image/export views. */
  isRenderView?: boolean;
  /** Apply a gradient fade mask to the edge opposite the visible partial. Only valid when `partial` is set. */
  hasGradient?: boolean;
  /** Enable variant rules mode: adds Bonus column and shows point values in form badges. */
  variantRules?: VariantRulesMode;
  /** Which form column view to display. Defaults to `'badges'`. */
  formDisplay?: FormDisplayMode;
  /** Position history per team (team ID -> array of positions). Required when formDisplay is `'sparkline'`. */
  positionHistory?: Map<number, number[]>;
  /** Total number of teams in the competition (used for sparkline Y-axis domain). */
  teamCount?: number;
  /** Called when the form display toggle button is clicked. */
  onFormDisplayToggle?: () => void;
  /**
   * When true, draws a dashed zone separator on the bottom edge of the last row of each
   * non-relegation zone and on the top edge of the first relegation row (no layout shift).
   */
  isRunIn?: boolean;
  /** Zone thresholds to display inside run-in boundary popovers. */
  zoneThresholds?: ZoneThreshold[];
}

const formatGD = (gd: number): string => {
  if (gd > 0) return `+${gd}`;
  return String(gd);
};

const formatFormTitle = (entry: FormEntry): string => {
  return `${entry.homeTeamName} ${entry.homeGoals}-${entry.awayGoals} ${entry.awayTeamName}`;
};

const formStyles: Record<FormResult, string> = {
  B: styles.formBonus,
  W: styles.formWin,
  D: styles.formDraw,
  L: styles.formLoss,
};

const formButtonStyles: Record<FormResult, string> = {
  B: styles.formBonusButton,
  W: styles.formWinButton,
  D: styles.formDrawButton,
  L: styles.formLossButton,
};

const newRulesFormLabel: Record<FormResult, string> = {
  B: '3',
  W: '2',
  D: 'D',
  L: 'L',
};

const getBonusPointsFormLabel = (entry: FormEntry): string => {
  return String(getBonusPointsForResult(entry.goalsScored, entry.goalsConceded));
};

const getBonusPointsFormStyle = (entry: FormEntry): string => {
  const pts = getBonusPointsForResult(entry.goalsScored, entry.goalsConceded);
  if (pts >= 4) return styles.formWin;
  if (pts >= 2) return styles.formDraw;
  return styles.formLoss;
};

const getBonusPointsFormButtonStyle = (entry: FormEntry): string => {
  const pts = getBonusPointsForResult(entry.goalsScored, entry.goalsConceded);
  if (pts >= 4) return styles.formWinButton;
  if (pts >= 2) return styles.formDrawButton;
  return styles.formLossButton;
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

const trRunInDashBottomByZone: Record<NonRelegationZoneType, string> = {
  champions: styles.trRunInDashBottomChampions,
  promotion: styles.trRunInDashBottomPromotion,
  playoff: styles.trRunInDashBottomPlayoff,
  championsLeague: styles.trRunInDashBottomChampionsLeague,
  europaLeague: styles.trRunInDashBottomEuropaLeague,
  conferenceLeague: styles.trRunInDashBottomConferenceLeague,
};

export const StandingsTable = ({
  standings,
  deductionMarkers,
  zoneGuaranteedByTeamId,
  zones,
  partial,
  onResultClick,
  clickableMatchIds,
  disableVerticalScroll = false,
  disableTableBorderRadius = false,
  isRenderView = false,
  hasGradient = false,
  variantRules = false as VariantRulesMode,
  formDisplay = 'badges' as FormDisplayMode,
  positionHistory,
  teamCount,
  onFormDisplayToggle,
  isRunIn = false,
  zoneThresholds,
}: StandingsTableProps) => {
  const showBonusColumn = variantRules === 'new-rules';
  const containerRef = useScrollDirectionLock<HTMLDivElement>();
  const renderCellPaddingClass = isRenderView
    ? styles.cellRenderNoHorizontalPaddingStrong
    : undefined;
  const renderCellRightPaddingClass = isRenderView
    ? styles.cellRenderNoRightPaddingStrong
    : undefined;
  const headerBaseClassName = clsx(renderCellPaddingClass, isRenderView && styles.thLarge);
  const teamHeaderClassName = clsx(
    styles.th,
    styles.stickyCellTh,
    renderCellRightPaddingClass,
    isRenderView && styles.thLarge,
  );
  const statsHeaderClassName = clsx(styles.thCenter, styles.thStats, headerBaseClassName);
  const formHeaderClassName = clsx(styles.thCenter, headerBaseClassName);
  const centeredBodyCellClassName = clsx(styles.tdCenter, renderCellPaddingClass);
  const midpoint = Math.floor(standings.length / 2);
  const sliceStart = partial === 'bottom' ? midpoint : 0;
  const sliceEnd = partial === 'top' ? midpoint : standings.length;
  const displayedStandings = standings.slice(sliceStart, sliceEnd);
  const shouldRenderHeader = partial !== 'bottom';
  const containerPartialClass =
    partial === 'top'
      ? styles.containerTopPartial
      : partial === 'bottom'
        ? styles.containerBottomPartial
        : undefined;
  const tablePartialClass =
    partial === 'top'
      ? styles.tableTopPartial
      : partial === 'bottom'
        ? styles.tableBottomPartial
        : undefined;
  const tableGradientClass =
    hasGradient && partial === 'top'
      ? styles.tableGradientBottom
      : hasGradient && partial === 'bottom'
        ? styles.tableGradientTop
        : undefined;

  const relegationStartPosition = zones.find((z) => z.type === 'relegation')?.startPosition;

  const thresholdByZoneType = new Map<string, number>();
  if (zoneThresholds) {
    for (const t of zoneThresholds) {
      thresholdByZoneType.set(t.zone.type, t.threshold);
    }
  }

  return (
    <div
      ref={containerRef}
      className={clsx(
        styles.container,
        disableVerticalScroll && styles.containerNoVerticalScroll,
        !disableTableBorderRadius && containerPartialClass,
        disableTableBorderRadius && styles.containerNoBorderRadius,
      )}
    >
      <table
        className={clsx(
          styles.table,
          isRenderView && styles.tableLarge,
          isRenderView && styles.tableRenderLayoutFixed,
          !disableTableBorderRadius && tablePartialClass,
          disableTableBorderRadius && styles.tableNoBorderRadius,
          tableGradientClass,
        )}
      >
        {isRenderView && (
          <colgroup>
            <col />
            <col className={styles.colStat} />
            {showBonusColumn && <col className={styles.colStat} />}
            <col className={styles.colStat} />
            <col className={styles.colStat} />
            <col className={styles.colStat} />
            <col className={styles.colStat} />
            <col className={styles.colStat} />
            <col className={styles.colStat} />
            <col className={styles.colStat} />
            <col className={styles.colForm} />
          </colgroup>
        )}
        {shouldRenderHeader && (
          <thead className={styles.thead}>
            <tr>
              <th className={teamHeaderClassName}>Team</th>
              <th className={statsHeaderClassName}>P</th>
              {!isRenderView && <th className={statsHeaderClassName}>GD</th>}
              {!isRenderView && <th className={statsHeaderClassName}>Pts</th>}
              {showBonusColumn && <th className={statsHeaderClassName}>B</th>}
              <th className={statsHeaderClassName}>W</th>
              <th className={statsHeaderClassName}>D</th>
              <th className={statsHeaderClassName}>L</th>
              <th className={statsHeaderClassName}>GF</th>
              <th className={statsHeaderClassName}>GA</th>
              {isRenderView && <th className={statsHeaderClassName}>GD</th>}
              {isRenderView && <th className={statsHeaderClassName}>Pts</th>}
              <th className={formHeaderClassName}>
                <div className={styles.formHeaderContent}>
                  Form
                  {onFormDisplayToggle && (
                    <button
                      type="button"
                      className={styles.formToggleButton}
                      onClick={onFormDisplayToggle}
                      aria-label={
                        formDisplay === 'badges'
                          ? 'Switch to sparkline view'
                          : 'Switch to form badges view'
                      }
                      title={
                        formDisplay === 'badges'
                          ? 'Show table position over last 12 games'
                          : 'Show last 6 results'
                      }
                    >
                      {formDisplay === 'badges' ? (
                        <SparklineIcon size={16} />
                      ) : (
                        <RoundedSquareBadgesIcon size={16} />
                      )}
                    </button>
                  )}
                </div>
              </th>
            </tr>
          </thead>
        )}
        <tbody>
          {displayedStandings.map((standing, sliceIndex) => {
            const tableIndex = sliceStart + sliceIndex;
            const leaguePosition = tableIndex + 1;
            const zone = getZoneForPosition(leaguePosition, zones);
            const rowStyle = zoneRowStyles[zone][tableIndex % 2];
            const zoneEndingHere = zones.find(
              (z): z is ZoneDefinition & { type: NonRelegationZoneType } =>
                z.type !== 'relegation' && z.endPosition === leaguePosition,
            );
            const runInTrClass =
              isRunIn && zoneEndingHere && trRunInDashBottomByZone[zoneEndingHere.type];
            const runInFormTdTopRelegationClass =
              isRunIn &&
              relegationStartPosition === leaguePosition &&
              styles.tdFormRunInDashTopRelegation;
            const zoneEndedPreviously = zones.find(
              (z): z is ZoneDefinition & { type: NonRelegationZoneType } =>
                z.type !== 'relegation' && z.endPosition === leaguePosition - 1,
            );
            const isFirstRelegationRow = relegationStartPosition === leaguePosition;
            const gdAndPtsCells = (
              <>
                <td
                  className={clsx(centeredBodyCellClassName, styles.goalDiff, {
                    [styles.positive]: standing.goalDifference > 0,
                    [styles.negative]: standing.goalDifference < 0,
                  })}
                >
                  {formatGD(standing.goalDifference)}
                </td>
                <td
                  className={clsx(
                    centeredBodyCellClassName,
                    styles.points,
                    isRenderView && styles.pointsLarge,
                  )}
                >
                  {standing.points}
                </td>
              </>
            );
            return (
              <Fragment key={standing.team.id}>
                <tr className={clsx(styles.tr, rowStyle, runInTrClass)}>
                  <td
                    className={clsx(
                      styles.td,
                      styles.stickyCell,
                      isRenderView && styles.cellRenderNoRightPaddingStrong,
                    )}
                  >
                    <div className={styles.teamCell}>
                      {shouldRenderGuaranteedPositionBadge(
                        standing.team.id,
                        zoneGuaranteedByTeamId,
                      ) ? (
                        <StandingPosition position={tableIndex + 1} zones={zones} />
                      ) : (
                        <span
                          className={clsx(
                            styles.position,
                            styles.positionNumber,
                            zonePositionStyles[zone],
                          )}
                        >
                          {tableIndex + 1}
                        </span>
                      )}
                      <img
                        src={getCrest(standing.team.crest)}
                        alt={standing.team.name}
                        className={styles.crest}
                      />
                      <span
                        className={clsx(styles.teamName, isRenderView && styles.teamNameRender)}
                      >
                        <span className={styles.teamShortName}>{standing.team.shortName}</span>
                        <span className={styles.teamTla}>{standing.team.tla}</span>
                        {deductionMarkers?.get(standing.team.id)}
                      </span>
                    </div>
                  </td>
                  <td className={centeredBodyCellClassName}>{standing.played}</td>
                  {!isRenderView && gdAndPtsCells}
                  {showBonusColumn && (
                    <td className={centeredBodyCellClassName}>{standing.bonus}</td>
                  )}
                  <td className={centeredBodyCellClassName}>
                    {showBonusColumn ? standing.won - standing.bonus : standing.won}
                  </td>
                  <td className={centeredBodyCellClassName}>{standing.drawn}</td>
                  <td className={centeredBodyCellClassName}>{standing.lost}</td>
                  <td className={centeredBodyCellClassName}>{standing.goalsFor}</td>
                  <td className={centeredBodyCellClassName}>{standing.goalsAgainst}</td>
                  {isRenderView && gdAndPtsCells}
                  <td
                    className={clsx(
                      styles.td,
                      formDisplay === 'sparkline' && styles.formTdSparkline,
                      runInFormTdTopRelegationClass,
                    )}
                  >
                    <div
                      className={clsx(
                        styles.formCell,
                        formDisplay !== 'badges' && styles.formDisplayHidden,
                      )}
                    >
                      {standing.form.map((entry, i) => {
                        const isBonusPoints = variantRules === 'bonus-points';
                        const label = isBonusPoints
                          ? getBonusPointsFormLabel(entry)
                          : variantRules === 'new-rules'
                            ? newRulesFormLabel[entry.result]
                            : entry.result;
                        const badgeStyle = isBonusPoints
                          ? getBonusPointsFormStyle(entry)
                          : formStyles[entry.result];
                        const buttonStyle = isBonusPoints
                          ? getBonusPointsFormButtonStyle(entry)
                          : formButtonStyles[entry.result];
                        const isClickable =
                          onResultClick &&
                          (!clickableMatchIds || clickableMatchIds.has(entry.matchId));
                        return isClickable ? (
                          <button
                            key={i}
                            type="button"
                            className={clsx(styles.formBadgeButton, buttonStyle)}
                            title={formatFormTitle(entry)}
                            onClick={() => onResultClick(entry.matchId)}
                          >
                            {label}
                          </button>
                        ) : (
                          <span
                            key={i}
                            className={clsx(styles.formBadge, badgeStyle)}
                            title={formatFormTitle(entry)}
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                    <div
                      className={clsx(
                        styles.sparklineWrapper,
                        formDisplay !== 'sparkline' && styles.formDisplayHidden,
                      )}
                    >
                      {positionHistory &&
                        teamCount &&
                        (() => {
                          const fullHistory = positionHistory.get(standing.team.id) ?? [];
                          const positions = fullHistory.slice(-SPARKLINE_HISTORY_LENGTH);
                          const trend = getPositionTrend(positions);
                          return <Sparkline data={positions} teamCount={teamCount} trend={trend} />;
                        })()}
                    </div>
                  </td>
                </tr>
                {isRunIn &&
                  zoneEndedPreviously &&
                  thresholdByZoneType.has(zoneEndedPreviously.type) && (
                    <tr className={styles.trZoneBoundary}>
                      <td className={styles.tdZoneBoundary} colSpan={99}>
                        <div className={styles.zoneLabelPosition}>
                          <ZoneThresholdLabel
                            zone={zoneEndedPreviously.type}
                            label={zoneLabels[zoneEndedPreviously.type]}
                            threshold={thresholdByZoneType.get(zoneEndedPreviously.type)!}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                {isRunIn && isFirstRelegationRow && thresholdByZoneType.has('relegation') && (
                  <tr className={styles.trZoneBoundary}>
                    <td className={styles.tdZoneBoundary} colSpan={99}>
                      <div
                        className={clsx(
                          styles.zoneLabelPosition,
                          styles.zoneLabelPositionRelegation,
                        )}
                      >
                        <ZoneThresholdLabel
                          zone="relegation"
                          label={zoneLabels.relegation}
                          threshold={thresholdByZoneType.get('relegation')!}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
