import { useState, useMemo } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useCompetitionData } from './hooks/useCompetitionData';
import { usePredictions } from './hooks/usePredictions';
import { useDeductions } from './hooks/useDeductions';
import { useStandings } from './hooks/useStandings';
import { useSeasonSummary } from './hooks/useSeasonSummary';
import { useTheme } from './hooks/useTheme';
import { CompetitionHeader } from './components/CompetitionHeader';
import { TabBar } from './components/TabBar';
import { StandingsTable } from './components/StandingsTable/StandingsTable';
import { SeasonSummaryModal } from './components/SeasonSummaryModal';
import { DeductionsModal } from './components/DeductionsModal';
import { Button } from './components/Button';
import { FixtureList } from './components/FixtureList/FixtureList';
import { BrainIcon, TrendingDownIcon } from './components/icons';
import { competitionData } from './data';
import { getCompetition, allCompetitions, type CompetitionConfig } from './competitions';
import * as styles from './App.css';

const TABS = [
  { id: 'standings', label: 'Standings' },
  { id: 'fixtures', label: 'Fixtures' },
] as const;

interface CompetitionContentProps {
  slug: string;
  config: CompetitionConfig;
}

const CompetitionContent = ({ slug, config }: CompetitionContentProps) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { teams, matches, defaultDeductions, modelPredictions } = useCompetitionData(slug);

  const teamsById = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);

  const { predictions, setPrediction, removePrediction, resetAllPredictions, fillFromModel } =
    usePredictions(slug, matches);
  const {
    deductions,
    isCustomised: deductionsCustomised,
    updateDeduction,
    addDeduction,
    removeDeduction,
    resetDeductions,
  } = useDeductions(slug, defaultDeductions);
  const standings = useStandings(teams, matches, predictions, deductions);
  const { isSummaryOpen, dismissSummary } = useSeasonSummary(matches, predictions);

  const [deductionsModalOpen, setDeductionsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('standings');

  const deductionMarkers = useMemo(
    () => new Map(deductions.map((d, i) => [d.teamId, '*'.repeat(i + 1)])),
    [deductions],
  );

  const deductionNotes = useMemo(
    () =>
      deductions.map((d, i) => {
        const team = teamsById.get(d.teamId);
        const marker = '*'.repeat(i + 1);
        return {
          label: `${marker}${team?.shortName ?? `Team ${d.teamId}`} -${d.amount} pts`,
          reason: d.reason ?? '',
        };
      }),
    [deductions, teamsById],
  );

  const predictedCount = Object.keys(predictions.predictions).length;
  const competitions = allCompetitions();

  return (
    <>
      <CompetitionHeader
        competitions={competitions}
        activeSlug={slug}
        onCompetitionChange={(s) => navigate(`/${s}/`)}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      <TabBar tabs={[...TABS]} activeTab={activeTab} onTabChange={setActiveTab} />

      <main className={styles.main}>
        <div
          className={`${styles.panel} ${activeTab !== 'standings' ? styles.hiddenOnMobile : ''}`}
        >
          <div className={styles.panelHeaderWithNotes}>
            <h2 className={styles.panelTitle}>Standings</h2>
            <div className={styles.panelHeaderDeductions}>
              {deductionNotes.length > 0 && (
                <div className={styles.deductionNotes}>
                  {deductionNotes.map((note) => (
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
              <Button variant="danger" onClick={() => setDeductionsModalOpen(true)}>
                <TrendingDownIcon size={14} className={styles.deductionsButtonIcon} />
                Deductions
              </Button>
            </div>
          </div>
          <StandingsTable
            standings={standings}
            deductionMarkers={deductionMarkers}
            zones={config.zones}
          />
        </div>

        <div
          className={`${styles.panelGuttered} ${activeTab !== 'fixtures' ? styles.hiddenOnMobile : ''}`}
        >
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Fixtures</h2>
            <div className={styles.panelHeaderActions}>
              {Object.keys(modelPredictions).length > 0 && (
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
            matches={matches}
            teamsById={teamsById}
            predictions={predictions}
            onPredictionChange={setPrediction}
            onPredictionRemove={removePrediction}
          />
        </div>
      </main>

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

      <SeasonSummaryModal
        standings={standings}
        isOpen={isSummaryOpen}
        onClose={dismissSummary}
        competition={config}
      />
    </>
  );
};

export const CompetitionPage = () => {
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

  return <CompetitionContent key={slug} slug={slug} config={config} />;
};
