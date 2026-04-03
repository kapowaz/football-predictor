import { useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { AppPanels } from './components/AppPanels';
import { FixturePanel } from './components/FixturePanel';
import { StandingsTable, type FormDisplayMode } from './components/StandingsTable/StandingsTable';
import { DeductionsModal } from './components/DeductionsModal';
import { hasCompetitionData } from './data';
import { allCompetitions, getCompetition, type CompetitionConfig } from './data/competitions';
import { useCompetitionData } from './hooks/useCompetitionData';
import { useLiveScores } from './hooks/useLiveScores';
import { useTheme } from './hooks/useTheme';
import { useCompetitionSession } from './state/useCompetitionSession';
import {
  selectAllScheduledPredicted,
  selectPredictedCount,
  selectPositionHistory,
  selectStandingsViewModel,
} from './state/selectors';
import { getEffectivePredictions } from './utils/liveScores';
import { useZoneGuarantees } from './hooks/useZoneGuarantees';
import { useZoneThresholds } from './hooks/useZoneThresholds';
import * as styles from './RelegationPage.css';

const RELEGATION_POINTS_MARGIN = 6;

interface RelegationContentProps {
  slug: string;
  config: CompetitionConfig;
}

const RelegationContent = ({ slug, config }: RelegationContentProps) => {
  const navigate = useNavigate();
  const competitions = allCompetitions();
  const pageContentRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { teams, matches, defaultDeductions, modelPredictions } = useCompetitionData(slug);
  const { liveScores } = useLiveScores(slug);
  const {
    predictions,
    deductions,
    deductionsCustomised,
    deductionsModalOpen,
    activeTab,
    setActiveTab,
    setNavigateToMatchId,
    fillFromModel,
    resetAllPredictions,
    updateDeduction,
    addDeduction,
    removeDeduction,
    resetDeductions,
    setDeductionsModalOpen,
  } = useCompetitionSession({
    slug,
    matches,
    defaultDeductions,
    persistenceMode: 'full',
  });
  const effectivePredictions = useMemo(
    () => getEffectivePredictions(predictions, liveScores),
    [predictions, liveScores],
  );
  const { standings, deductionMarkers } = selectStandingsViewModel(
    teams,
    matches,
    effectivePredictions,
    deductions,
    config.zones,
  );
  const zoneGuaranteedByTeamId = useZoneGuarantees(standings, matches, effectivePredictions, config.zones);
  const zoneThresholds = useZoneThresholds(standings, matches, effectivePredictions, config.zones);
  const positionHistory = selectPositionHistory(teams, matches, effectivePredictions, deductions);
  const [formDisplay, setFormDisplay] = useState<FormDisplayMode>('badges');
  const relegationZone = useMemo(
    () => config.zones.find((z) => z.type === 'relegation'),
    [config.zones],
  );
  const relegationTeamIds = useMemo(() => {
    if (!relegationZone || relegationZone.startPosition > standings.length) {
      return standings.map((entry) => entry.team.id);
    }
    const boundaryPoints = standings[relegationZone.startPosition - 1].points;
    const threshold = boundaryPoints + RELEGATION_POINTS_MARGIN;
    return standings.filter((entry) => entry.points <= threshold).map((entry) => entry.team.id);
  }, [standings, relegationZone]);
  const fixtureMatchIds = useMemo(() => {
    const relegationTeamSet = new Set(relegationTeamIds);
    const ids = new Set<number>();
    for (const match of matches) {
      if (match.status !== 'SCHEDULED') continue;
      if (relegationTeamSet.has(match.homeTeamId) || relegationTeamSet.has(match.awayTeamId)) {
        ids.add(match.id);
      }
    }
    return ids;
  }, [matches, relegationTeamIds]);
  const hasModelPredictions = Object.keys(modelPredictions).length > 0;
  const predictedCount = selectPredictedCount(predictions);
  const allScheduledPredicted = selectAllScheduledPredicted(matches, predictions);

  return (
    <>
      <AppPanels
        pageContentRef={pageContentRef}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        standingsTabLabel="Standings"
        fixturesTabLabel="Fixtures"
        header={
          <NavBar
            competitions={competitions}
            activeSlug={slug}
            onCompetitionChange={(nextSlug) => navigate(`/relegation/${nextSlug}/`)}
            colorMode={theme}
            onColorModeToggle={toggleTheme}
            onDeductionsClick={() => setDeductionsModalOpen(true)}
            onAIPredictionsClick={
              hasModelPredictions && !allScheduledPredicted
                ? () => fillFromModel(modelPredictions)
                : undefined
            }
            onResetPredictionsClick={
              predictedCount > 0 ? resetAllPredictions : undefined
            }
          />
        }
        standingsPanel={
          <>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Standings</h2>
            </div>
            <StandingsTable
              standings={standings}
              deductionMarkers={deductionMarkers}
              zoneGuaranteedByTeamId={zoneGuaranteedByTeamId}
              zones={config.zones}
              isRunIn
              zoneThresholds={zoneThresholds}
              partial="bottom"
              hasGradient
              onResultClick={(matchId) => {
                setActiveTab('fixtures');
                setNavigateToMatchId(matchId);
              }}
              clickableMatchIds={fixtureMatchIds}
              formDisplay={formDisplay}
              positionHistory={positionHistory}
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
            </div>
            <FixturePanel
              slug={slug}
              isVisible={activeTab === 'fixtures'}
              showFinished={false}
              filterTeams={relegationTeamIds}
              groupBy="team"
              showDate
              zones={config.zones}
            />
          </>
        }
      />

      <DeductionsModal
        isOpen={deductionsModalOpen}
        onClose={() => setDeductionsModalOpen(false)}
        deductions={deductions}
        teams={teams}
        isCustomised={deductionsCustomised}
        onUpdate={updateDeduction}
        onAdd={addDeduction}
        onRemove={removeDeduction}
        onReset={resetDeductions}
      />
    </>
  );
};

export const RelegationPage = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const config = getCompetition(slug);
  if (!config) {
    return <Navigate to="/" replace />;
  }

  if (!hasCompetitionData(slug)) {
    return <Navigate to="/" replace />;
  }

  return <RelegationContent key={slug} slug={slug} config={config} />;
};
