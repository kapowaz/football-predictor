import { useMemo, useRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import { AppPanels } from './components/AppPanels';
import { Button } from './components/Button';
import { FixtureList } from './components/FixtureList/FixtureList';
import { StandingsTable } from './components/StandingsTable/StandingsTable';
import { BrainIcon } from './components/icons';
import { competitionData } from './data';
import { allCompetitions, getCompetition, type CompetitionConfig } from './data/competitions';
import { useCompetitionData } from './hooks/useCompetitionData';
import { useTheme } from './hooks/useTheme';
import { useCompetitionSession } from './state/useCompetitionSession';
import {
  selectAllScheduledPredicted,
  selectPredictedCount,
  selectStandingsViewModel,
} from './state/selectors';
import * as styles from './RunInPage.css';

interface RunInContentProps {
  slug: string;
  config: CompetitionConfig;
}

const RunInContent = ({ slug, config }: RunInContentProps) => {
  const navigate = useNavigate();
  const competitions = allCompetitions();
  const pageContentRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { teams, matches, defaultDeductions, modelPredictions } = useCompetitionData(slug);
  const {
    predictions,
    deductions,
    activeTab,
    setActiveTab,
    setNavigateToMatchId,
    fillFromModel,
    resetAllPredictions,
  } = useCompetitionSession({
    slug,
    matches,
    defaultDeductions,
    persistenceMode: 'full',
  });
  const { standings, deductionMarkers, zoneGuaranteedByTeamId } = selectStandingsViewModel(
    teams,
    matches,
    predictions,
    deductions,
    config.zones,
  );
  const midpoint = Math.floor(standings.length / 2);
  const topHalfTeamIds = useMemo(
    () => standings.slice(0, midpoint).map((entry) => entry.team.id),
    [midpoint, standings],
  );
  const standingPositionsByTeamId = useMemo(
    () =>
      new Map(
        standings.map((entry, index) => {
          return [entry.team.id, index + 1] as const;
        }),
      ),
    [standings],
  );
  const hasModelPredictions = Object.keys(modelPredictions).length > 0;
  const predictedCount = selectPredictedCount(predictions);
  const allScheduledPredicted = selectAllScheduledPredicted(matches, predictions);

  return (
    <AppPanels
      pageContentRef={pageContentRef}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      standingsTabLabel="Standings"
      fixturesTabLabel="Fixtures"
      header={
        <AppHeader
          competitions={competitions}
          activeSlug={slug}
          onCompetitionChange={(nextSlug) => navigate(`/run-in/${nextSlug}/`)}
          colorMode={theme}
          onColorModeToggle={toggleTheme}
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
            partial="top"
            hasGradient
            onPredictionClick={(matchId) => {
              setActiveTab('fixtures');
              setNavigateToMatchId(matchId);
            }}
          />
        </>
      }
      fixturesPanel={
        <>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Fixtures</h2>
            <div className={styles.panelHeaderActions}>
              {hasModelPredictions && !allScheduledPredicted && (
                <Button variant="success" onClick={() => fillFromModel(modelPredictions)}>
                  <BrainIcon />
                  AI Predictions
                </Button>
              )}
              {predictedCount > 0 && (
                <Button variant="danger" onClick={resetAllPredictions}>
                  Reset Predictions
                </Button>
              )}
            </div>
          </div>
          <FixtureList
            slug={slug}
            isVisible={activeTab === 'fixtures'}
            showFinished={false}
            filterTeams={topHalfTeamIds}
            standingPositionsByTeamId={standingPositionsByTeamId}
            standingPositionZones={config.zones}
          />
        </>
      }
    />
  );
};

export const RunInPage = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const config = getCompetition(slug);
  if (!config) {
    return <Navigate to="/" replace />;
  }

  const data = competitionData[slug];
  if (!data) {
    return <Navigate to="/" replace />;
  }

  return <RunInContent key={slug} slug={slug} config={config} />;
};
