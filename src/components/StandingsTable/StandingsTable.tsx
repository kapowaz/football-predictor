import clsx from 'clsx';
import type { TeamStanding, FormResult, FormEntry, VariantRulesMode } from '../../types';
import type { ZoneDefinition, ZoneType } from '../../data/competitions';
import { getCrest } from '../../assets/crests';
import { getBonusPointsForResult } from '../../utils/standings';
import { getZoneForPosition } from '../../utils/zones';
import { useScrollDirectionLock } from '../../hooks/useScrollDirectionLock';
import { StandingPosition } from '../StandingPosition';
import { shouldRenderGuaranteedPositionBadge } from './positionBadge';
import * as styles from './StandingsTable.css';

interface StandingsTableProps {
  standings: TeamStanding[];
  deductionMarkers?: Map<number, string>;
  zoneGuaranteedByTeamId?: Map<number, boolean>;
  zones: ZoneDefinition[];
  /** Optionally render only the top or bottom half of standings. */
  partial?: 'top' | 'bottom';
  /** Called when a form badge is clicked, with the match ID */
  onPredictionClick?: (matchId: number) => void;
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

export const StandingsTable = ({
  standings,
  deductionMarkers,
  zoneGuaranteedByTeamId,
  zones,
  partial,
  onPredictionClick,
  disableVerticalScroll = false,
  disableTableBorderRadius = false,
  isRenderView = false,
  hasGradient = false,
  variantRules = false as VariantRulesMode,
}: StandingsTableProps) => {
  const showBonusColumn = variantRules === 'new-rules';
  const containerRef = useScrollDirectionLock<HTMLDivElement>();
  const renderCellPaddingClass = isRenderView ? styles.cellRenderNoHorizontalPaddingStrong : undefined;
  const renderCellRightPaddingClass = isRenderView ? styles.cellRenderNoRightPaddingStrong : undefined;
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
              <th className={formHeaderClassName}>Form</th>
            </tr>
          </thead>
        )}
        <tbody>
          {displayedStandings.map((standing, sliceIndex) => {
            const tableIndex = sliceStart + sliceIndex;
            const zone = getZoneForPosition(tableIndex + 1, zones);
            const rowStyle = zoneRowStyles[zone][tableIndex % 2];
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
              <tr key={standing.team.id} className={clsx(styles.tr, rowStyle)}>
                <td
                  className={clsx(
                    styles.td,
                    styles.stickyCell,
                    isRenderView && styles.cellRenderNoRightPaddingStrong,
                  )}
                >
                  <div className={styles.teamCell}>
                    {shouldRenderGuaranteedPositionBadge(standing.team.id, zoneGuaranteedByTeamId) ? (
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
                    <span className={clsx(styles.teamName, isRenderView && styles.teamNameRender)}>
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
                <td className={styles.td}>
                  <div className={styles.formCell}>
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
                      return onPredictionClick && entry.isPrediction ? (
                        <button
                          key={i}
                          type="button"
                          className={clsx(styles.formBadgeButton, buttonStyle)}
                          title={formatFormTitle(entry)}
                          onClick={() => onPredictionClick(entry.matchId)}
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
