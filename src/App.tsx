import { useState, useMemo } from 'react';
import teamsData from './data/teams.json';
import matchesData from './data/matches.json';
import overridesData from './data/overrides.json';
import deductionsData from './data/deductions.json';
import apiStandingsData from './data/standings.json';
import type { TeamsData, MatchesData, PointDeduction, Match, ApiStandingsData } from './types';
import { usePredictions } from './hooks/usePredictions';
import { useDeductions } from './hooks/useDeductions';
import { useStandings } from './hooks/useStandings';
import { calculateStandings } from './utils/standings';
import { validateStandings } from './utils/validateStandings';
import { StandingsTable } from './components/StandingsTable/StandingsTable';
import { SeasonSummaryModal } from './components/SeasonSummaryModal';
import { DeductionsModal } from './components/DeductionsModal';
import { Button } from './components/Button';
import { MatchList } from './components/MatchList/MatchList';
import eflLogo from './assets/efl-championship-logo.svg';
import * as styles from './App.css';

const teams = (teamsData as TeamsData).teams;

const applyOverrides = (base: Match[], overrides: Match[]): Match[] => {
  const overrideMap = new Map(overrides.map((m) => [m.id, m]));
  return base.map((match) => overrideMap.get(match.id) ?? match);
};

const matches = applyOverrides(
  (matchesData as MatchesData).matches,
  (overridesData as unknown as MatchesData).matches,
);
const defaultDeductions = deductionsData as PointDeduction[];
const apiStandings = apiStandingsData as ApiStandingsData;

const emptyPredictions = { predictions: {}, lastModified: '' };
const calculatedFromResults = calculateStandings(teams, matches, emptyPredictions, defaultDeductions);
validateStandings(calculatedFromResults, apiStandings);

const teamsById = new Map(teams.map((t) => [t.id, t]));

const App = () => {
  const { predictions, setPrediction, removePrediction, resetAllPredictions } = usePredictions();
  const {
    deductions,
    isCustomised: deductionsCustomised,
    updateDeduction,
    addDeduction,
    removeDeduction,
    resetDeductions,
  } = useDeductions(defaultDeductions);
  const standings = useStandings(teams, matches, predictions, deductions);

  const allFixturesResolved = useMemo(() => {
    return matches.every((m) => m.status === 'FINISHED' || String(m.id) in predictions.predictions);
  }, [predictions]);

  const [summaryDismissed, setSummaryDismissed] = useState(false);
  const [prevAllResolved, setPrevAllResolved] = useState(allFixturesResolved);
  if (prevAllResolved !== allFixturesResolved) {
    setPrevAllResolved(allFixturesResolved);
    if (prevAllResolved && !allFixturesResolved) {
      setSummaryDismissed(false);
    }
  }

  const [deductionsModalOpen, setDeductionsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'standings' | 'fixtures'>('standings');

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
          reason: d.reason,
        };
      }),
    [deductions],
  );

  const predictedCount = Object.keys(predictions.predictions).length;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <img src={eflLogo} alt="EFL Championship" className={styles.logo} />
        <h1 className={styles.title}>EFL Championship Predictor</h1>
      </header>

      <nav className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === 'standings' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('standings')}
        >
          Standings
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'fixtures' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('fixtures')}
        >
          Fixtures
        </button>
      </nav>

      <main className={styles.main}>
        <div className={`${styles.panel} ${activeTab !== 'standings' ? styles.hiddenOnMobile : ''}`}>
          <div className={styles.panelHeaderWithNotes}>
            <h2 className={styles.panelTitle}>Standings</h2>
            <div className={styles.panelHeaderRight}>
              {deductionNotes.length > 0 && (
                <div className={styles.deductionNotes}>
                  {deductionNotes.map((note) => (
                    <span key={note.label} className={styles.deductionNote} title={note.reason}>
                      {note.label}
                    </span>
                  ))}
                </div>
              )}
              <Button
                variant="danger"
                onClick={() => setDeductionsModalOpen(true)}
              >
                <svg
                  className={styles.deductionsButtonIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z" />
                  <path d="M8 12h8" />
                </svg>
                Deductions
              </Button>
            </div>
          </div>
          <StandingsTable standings={standings} deductionMarkers={deductionMarkers} />
        </div>

        <div className={`${styles.panelGuttered} ${activeTab !== 'fixtures' ? styles.hiddenOnMobile : ''}`}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Fixtures</h2>
            {predictedCount > 0 && (
              <Button variant="danger" onClick={resetAllPredictions}>
                Reset Predictions
              </Button>
            )}
          </div>
          <MatchList
            matches={matches}
            teams={teams}
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
        isOpen={allFixturesResolved && !summaryDismissed}
        onClose={() => setSummaryDismissed(true)}
      />
    </div>
  );
};

export default App;
