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

function App() {
  const { predictions, setPrediction, removePrediction, resetAllPredictions } = usePredictions();
  const standings = useStandings(teams, matches, predictions, deductions);

  const predictedCount = Object.keys(predictions.predictions).length;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <img src={eflLogo} alt="EFL Championship" className={styles.logo} />
        <h1 className={styles.title}>EFL Championship Predictor</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Standings</h2>
          </div>
          <StandingsTable standings={standings} />
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Remaining Fixtures</h2>
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
    </div>
  );
}

export default App;
