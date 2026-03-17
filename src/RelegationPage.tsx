import { useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import { AppPanels } from './components/AppPanels';
import { Button } from './components/Button';
import { FixturePanel } from './components/FixturePanel';
import { StandingsTable, type FormDisplayMode } from './components/StandingsTable/StandingsTable';
import { SparklesIcon } from './components/icons';
import { competitionData } from './data';
import { allCompetitions, getCompetition, type CompetitionConfig } from './data/competitions';
import { useCompetitionData } from './hooks/useCompetitionData';
import { useTheme } from './hooks/useTheme';
import { useCompetitionSession } from './state/useCompetitionSession';
import {
  selectAllScheduledPredicted,
  selectPredictedCount,
  selectPositionHistory,
  selectStandingsViewModel,
} from './state/selectors';
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
  const positionHistory = selectPositionHistory(teams, matches, predictions, deductions);
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
          onCompetitionChange={(nextSlug) => navigate(`/relegation/${nextSlug}/`)}
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
            <div className={styles.panelHeaderActions}>
              {hasModelPredictions && !allScheduledPredicted && (
                <Button variant="success" onClick={() => fillFromModel(modelPredictions)}>
                  <SparklesIcon />
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

  const data = competitionData[slug];
  if (!data) {
    return <Navigate to="/" replace />;
  }

  return <RelegationContent key={slug} slug={slug} config={config} />;
};
