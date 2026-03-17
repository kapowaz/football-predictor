import { useMemo, useState } from 'react';
import type { ComponentProps, RefObject } from 'react';
import { useCompetitionData } from '../../hooks/useCompetitionData';
import {
  selectAllScheduledPredicted,
  selectDeductionNotes,
  selectPredictedCount,
  selectPositionHistory,
  selectStandingsViewModel,
  selectTeamsById,
} from '../../state/selectors';
import { useCompetitionSessionSlice } from '../../state/useCompetitionSessionSlice';
import type { CompetitionConfig } from '../../data/competitions';
import type { VariantRulesMode } from '../../types';
import { NavBar } from '../NavBar';
import { AppPanels } from '../AppPanels';
import { StandingsTable, type FormDisplayMode } from '../StandingsTable/StandingsTable';
import { Button } from '../Button';
import { FixturePanel } from '../FixturePanel';
import { ArrowDownFromDotIcon, SparklesIcon, ImageDownIcon } from '../icons';
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
}: CompetitionPanelsProps) => {
  const { teams, matches, modelPredictions } = useCompetitionData(slug);
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

  const panelModel = useMemo(() => {
    if (!session) {
      return null;
    }

    const { standings, deductionMarkers, zoneGuaranteedByTeamId } = selectStandingsViewModel(
      teams,
      matches,
      session.predictions,
      session.deductions,
      config.zones,
      variantRules,
    );
    const positionHistory = selectPositionHistory(
      teams,
      matches,
      session.predictions,
      session.deductions,
      variantRules,
    );
    const deductionNotes = selectDeductionNotes(session.deductions, teamsById);
    const predictedCount = selectPredictedCount(session.predictions);
    const allScheduledPredicted = selectAllScheduledPredicted(matches, session.predictions);

    return {
      standings,
      deductionMarkers,
      zoneGuaranteedByTeamId,
      positionHistory,
      deductionNotes,
      predictedCount,
      allScheduledPredicted,
    };
  }, [config.zones, matches, session, teams, teamsById, variantRules]);

  const hasModelPredictions = Object.keys(modelPredictions).length > 0;

  if (!session || !panelModel) {
    return null;
  }

  const handleResultClick = (matchId: number) => {
    setActiveTab('fixtures');
    setNavigateToMatchId(matchId);
  };

  const navBarActions = (
    <>
      {onDownloadImage != null && (
        <Button
          variant="success"
          iconOnly
          compact
          aria-label="Save Image"
          onClick={onDownloadImage}
          disabled={!hasStandingsImage || isRenderingImage}
        >
          <ImageDownIcon size={16} />
        </Button>
      )}
      <Button
        variant="danger"
        iconOnly
        compact
        aria-label="Deductions"
        onClick={() => setDeductionsModalOpen(true)}
      >
        <ArrowDownFromDotIcon size={16} />
      </Button>
      {hasModelPredictions && !panelModel.allScheduledPredicted && (
        <Button
          variant="success"
          iconOnly
          compact
          aria-label="AI Predictions"
          onClick={() => fillFromModel(modelPredictions)}
        >
          <SparklesIcon size={16} />
        </Button>
      )}
    </>
  );

  return (
    <AppPanels
      pageContentRef={pageContentRef}
      activeTab={session.activeTab}
      onTabChange={setActiveTab}
      standingsTabLabel="Standings"
      fixturesTabLabel="Fixtures"
      header={<NavBar {...headerProps} actions={navBarActions} />}
      standingsPanel={
        <>
          <div className={styles.panelHeaderWithNotes}>
            <h2 className={styles.panelTitle}>Standings</h2>
            {panelModel.deductionNotes.length > 0 && (
              <div className={styles.deductionNotes}>
                {panelModel.deductionNotes.map((note) => (
                  <span
                    key={note.label}
                    className={styles.deductionNote}
                    title={note.reason || undefined}
                  >
                    {note.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <StandingsTable
            standings={panelModel.standings}
            deductionMarkers={panelModel.deductionMarkers}
            zoneGuaranteedByTeamId={panelModel.zoneGuaranteedByTeamId}
            zones={config.zones}
            onResultClick={handleResultClick}
            variantRules={variantRules}
            formDisplay={formDisplay}
            positionHistory={panelModel.positionHistory}
            teamCount={teams.length}
            onFormDisplayToggle={() =>
              setFormDisplay((prev) => (prev === 'badges' ? 'sparkline' : 'badges'))
            }
          />
        </>
      }
      fixturesPanel={
        <>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Fixtures</h2>
            {panelModel.predictedCount > 0 && (
              <div className={styles.panelHeaderActions}>
                <Button variant="danger" onClick={resetAllPredictions}>
                  Reset Predictions
                </Button>
              </div>
            )}
          </div>
          <FixturePanel
            slug={slug}
            isVisible={session.activeTab === 'fixtures'}
            groupBy="date"
            zones={config.zones}
            variantRules={variantRules}
          />
        </>
      }
    />
  );
};
