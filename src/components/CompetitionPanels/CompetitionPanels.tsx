import { useMemo, useState } from 'react';
import type { ComponentProps, RefObject } from 'react';
import { AbstractText } from '@kapowaz/components';
import type { TeamStanding } from '../../types';
import { useCompetitionData } from '../../hooks/useCompetitionData';
import { useLiveScores } from '../../hooks/useLiveScores';
import {
  selectAllScheduledPredicted,
  selectDeductionNotes,
  selectPredictedCount,
  selectStandingsViewModel,
  selectTeamsById,
} from '../../state/selectors';
import { usePositionHistory } from '../../hooks/usePositionHistory';
import { useCompetitionSessionSlice } from '../../state/useCompetitionSessionSlice';
import { getEffectivePredictions } from '../../utils/liveScores';
import { useZoneGuarantees } from '../../hooks/useZoneGuarantees';
import type { CompetitionConfig } from '../../data/competitions';
import type { VariantRulesMode } from '../../types';
import type { ZoneThreshold } from '../../utils/zoneThresholds';
import { NavBar } from '../NavBar';
import { AppPanels } from '../AppPanels';
import {
  StandingsTable,
  type FormDisplayMode,
  getRelegationStartPosition,
  buildThresholdByZoneType,
  calculateSparklineScale,
} from '@kapowaz/football';
import { FixturePanel } from '../FixturePanel';
import { PanelHeader } from '../PanelHeader';
import * as styles from './CompetitionPanels.css.ts';

type NavBarProps = ComponentProps<typeof NavBar>;

interface CompetitionPanelsProps {
  /** Competition slug used to source state for panels. */
  slug: string;
  /** Competition config for table zone rendering. */
  config: CompetitionConfig;
  /** Page wrapper ref used for page-level animations. */
  pageContentRef: RefObject<HTMLDivElement | null>;
  /** Props passed through to the page header. */
  headerProps: NavBarProps;
  /** Downloads the generated standings image. Omit along with `isRenderingImage` and `hasStandingsImage` to hide the button entirely. */
  onDownloadImage?: () => void;
  /** True while standings image generation is in progress. */
  isRenderingImage?: boolean;
  /** Whether a standings image file currently exists. */
  hasStandingsImage?: boolean;
  /** Enable variant rules mode for standings and fixture indicators. */
  variantRules?: VariantRulesMode;
  /** Enables dashed zone boundaries on the standings table. */
  isRunIn?: boolean;
  /** Zone thresholds to display inside run-in boundary popovers. */
  zoneThresholds?: ZoneThreshold[];
  /** Pre-computed standings from the parent to avoid cache thrashing in selectStandingsViewModel. */
  standings?: TeamStanding[];
  /** Pre-computed deduction markers from the parent. */
  deductionMarkers?: Map<number, string>;
}

export const CompetitionPanels = ({
  slug,
  config,
  pageContentRef,
  headerProps,
  onDownloadImage,
  isRenderingImage,
  hasStandingsImage,
  variantRules = false as VariantRulesMode,
  isRunIn = false,
  zoneThresholds,
  standings: standingsProp,
  deductionMarkers: deductionMarkersProp,
}: CompetitionPanelsProps) => {
  const { teams, matches, modelPredictions } = useCompetitionData(slug);
  const { liveScores } = useLiveScores(slug);
  const {
    session,
    setActiveTab,
    setNavigateToMatchId,
    setDeductionsModalOpen,
    fillFromModel,
    resetAllPredictions,
  } = useCompetitionSessionSlice(slug);

  const teamsById = selectTeamsById(teams);
  const [formDisplay, setFormDisplay] = useState<FormDisplayMode>('badges');

  const effectivePredictions = useMemo(
    () => (session ? getEffectivePredictions(session.predictions, liveScores) : null),
    [session, liveScores],
  );

  const emptyPredictions = useMemo(() => ({ predictions: {}, lastModified: '' }), []);
  const positionHistory = usePositionHistory(
    teams,
    matches,
    effectivePredictions ?? emptyPredictions,
    session?.deductions ?? [],
    variantRules,
  );

  const ownViewModel =
    !standingsProp && session && effectivePredictions
      ? selectStandingsViewModel(
          teams,
          matches,
          effectivePredictions,
          session.deductions,
          config.zones,
          variantRules,
        )
      : null;

  const panelModel = useMemo(() => {
    if (!session || !effectivePredictions) {
      return null;
    }

    const standings = standingsProp ?? ownViewModel?.standings ?? [];
    const deductionMarkers = deductionMarkersProp ?? ownViewModel?.deductionMarkers ?? new Map();
    const deductionNotes = selectDeductionNotes(session.deductions, teamsById);
    const predictedCount = selectPredictedCount(session.predictions);
    const allScheduledPredicted = selectAllScheduledPredicted(matches, session.predictions);

    return {
      standings,
      deductionMarkers,
      deductionNotes,
      predictedCount,
      allScheduledPredicted,
    };
  }, [
    standingsProp,
    deductionMarkersProp,
    ownViewModel,
    effectivePredictions,
    matches,
    session,
    teamsById,
  ]);

  const zoneGuaranteedByTeamId = useZoneGuarantees(
    panelModel?.standings ?? [],
    matches,
    effectivePredictions ?? { predictions: {}, lastModified: '' },
    config.zones,
  );

  const hasModelPredictions = Object.keys(modelPredictions).length > 0;

  if (!session || !panelModel) {
    return null;
  }

  const handleResultClick = (matchId: number) => {
    setActiveTab('fixtures');
    setNavigateToMatchId(matchId);
  };

  return (
    <AppPanels
      pageContentRef={pageContentRef}
      activeTab={session.activeTab}
      onTabChange={setActiveTab}
      standingsTabLabel="Standings"
      fixturesTabLabel="Fixtures"
      header={
        <NavBar
          {...headerProps}
          onSaveImageClick={onDownloadImage}
          isSaveImageDisabled={!hasStandingsImage || isRenderingImage}
          onDeductionsClick={() => setDeductionsModalOpen(true)}
          onAIPredictionsClick={
            hasModelPredictions && !panelModel.allScheduledPredicted
              ? () => fillFromModel(modelPredictions)
              : undefined
          }
          onResetPredictionsClick={panelModel.predictedCount > 0 ? resetAllPredictions : undefined}
        />
      }
      standingsPanel={
        <>
          <PanelHeader title="Standings" />
          <StandingsTable
            standings={panelModel.standings}
            deductionMarkers={panelModel.deductionMarkers}
            zoneGuaranteedByTeamId={zoneGuaranteedByTeamId}
            zones={config.zones}
            isRunIn={isRunIn}
            relegationStartPosition={getRelegationStartPosition(config.zones)}
            thresholdByZoneType={
              zoneThresholds ? buildThresholdByZoneType(zoneThresholds) : undefined
            }
            sparklineScale={
              formDisplay === 'sparkline'
                ? calculateSparklineScale(panelModel.standings, positionHistory, 16)
                : undefined
            }
            onResultClick={handleResultClick}
            variantRules={variantRules}
            formDisplay={formDisplay}
            positionHistory={positionHistory}
            onFormDisplayToggle={() =>
              setFormDisplay((prev) => (prev === 'badges' ? 'sparkline' : 'badges'))
            }
          />
          {panelModel.deductionNotes.length > 0 && (
            <div className={styles.deductionNotes}>
              {panelModel.deductionNotes.map((note) => (
                <AbstractText
                  tagName="span"
                  key={note.label}
                  className={styles.deductionNote}
                  title={note.reason || undefined}
                  fontSize="sm"
                >
                  {note.label}
                </AbstractText>
              ))}
            </div>
          )}
        </>
      }
      fixturesPanel={
        <>
          <PanelHeader title="Fixtures" />
          <FixturePanel
            slug={slug}
            isVisible={session.activeTab === 'fixtures'}
            groupBy="date"
            zones={config.zones}
            variantRules={variantRules}
            standings={panelModel?.standings}
          />
        </>
      }
    />
  );
};
