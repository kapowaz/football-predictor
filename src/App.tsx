import { useState, useMemo } from 'react';
import teamsData from './data/teams.json';
import matchesData from './data/matches.json';
import overridesData from './data/overrides.json';
import deductionsData from './data/deductions.json';
import apiStandingsData from './data/standings.json';
import type { TeamsData, MatchesData, PointDeduction, Match, ApiStandingsData } from './types';
import { usePredictions } from './hooks/usePredictions';
import { useStandings } from './hooks/useStandings';
import { calculateStandings } from './utils/standings';
import { validateStandings } from './utils/validateStandings';
import { StandingsTable } from './components/StandingsTable/StandingsTable';
import { SeasonSummaryModal } from './components/SeasonSummaryModal';
import { MatchList } from './components/MatchList/MatchList';
import eflLogo from './assets/efl-championship-logo.svg';
import * as styles from './App.css';

const teams = (teamsData as TeamsData).teams;

function applyOverrides(base: Match[], overrides: Match[]): Match[] {
  const overrideMap = new Map(overrides.map((m) => [m.id, m]));
  return base.map((match) => overrideMap.get(match.id) ?? match);
}

const matches = applyOverrides(
  (matchesData as MatchesData).matches,
  (overridesData as unknown as MatchesData).matches,
);
const deductions = deductionsData as PointDeduction[];
const apiStandings = apiStandingsData as ApiStandingsData;

const emptyPredictions = { predictions: {}, lastModified: '' };
const calculatedFromResults = calculateStandings(teams, matches, emptyPredictions, deductions);
validateStandings(calculatedFromResults, apiStandings);

const teamsById = new Map(teams.map((t) => [t.id, t]));
const deductionMarkers = new Map(
  deductions.map((d, i) => [d.teamId, '*'.repeat(i + 1)]),
);
const deductionNotes = deductions.map((d, i) => {
  const team = teamsById.get(d.teamId);
  const marker = '*'.repeat(i + 1);
  return `${marker}${team?.shortName ?? `Team ${d.teamId}`} -${d.amount} pts`;
});

function App() {
  const { predictions, setPrediction, removePrediction, resetAllPredictions } = usePredictions();
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

  const predictedCount = Object.keys(predictions.predictions).length;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <img src={eflLogo} alt="EFL Championship" className={styles.logo} />
        <h1 className={styles.title}>EFL Championship Predictor</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.panel}>
          <div className={styles.panelHeaderWithNotes}>
            <h2 className={styles.panelTitle}>Standings</h2>
            {deductionNotes.length > 0 && (
              <div className={styles.deductionNotes}>
                {deductionNotes.map((note) => (
                  <span key={note}>{note}</span>
                ))}
              </div>
            )}
          </div>
          <StandingsTable standings={standings} deductionMarkers={deductionMarkers} />
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Fixtures</h2>
            {predictedCount > 0 && (
              <button className={styles.resetButton} onClick={resetAllPredictions}>
                Reset Predictions
              </button>
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

      <SeasonSummaryModal
        standings={standings}
        isOpen={allFixturesResolved && !summaryDismissed}
        onClose={() => setSummaryDismissed(true)}
      />
    </div>
  );
}

export default App;
