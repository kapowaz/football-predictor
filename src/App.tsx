import teamsData from './data/teams.json';
import matchesData from './data/matches.json';
import type { TeamsData, MatchesData } from './types';
import { usePredictions } from './hooks/usePredictions';
import { useStandings } from './hooks/useStandings';
import { StandingsTable } from './components/StandingsTable/StandingsTable';
import { MatchList } from './components/MatchList/MatchList';
import * as styles from './App.css';

const teams = (teamsData as TeamsData).teams;
const matches = (matchesData as MatchesData).matches;
const deductions = (teamsData as TeamsData).deductions ?? [];

function App() {
  const { predictions, setPrediction, removePrediction, resetAllPredictions } = usePredictions();
  const standings = useStandings(teams, matches, predictions, deductions);

  const predictedCount = Object.keys(predictions.predictions).length;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>EFL Championship Predictor</h1>
        <p className={styles.subtitle}>
          Enter your predicted scores for upcoming matches to see how the table could look
        </p>
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
