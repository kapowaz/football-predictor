import { useState, useMemo } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import type {
  TeamsData,
  MatchesData,
  PointDeduction,
  Match,
  ApiStandingsData,
  ModelPredictionsData,
} from './types';
import { usePredictions } from './hooks/usePredictions';
import { useDeductions } from './hooks/useDeductions';
import { useStandings } from './hooks/useStandings';
import { calculateStandings } from './utils/standings';
import { validateStandings } from './utils/validateStandings';
import { StandingsTable } from './components/StandingsTable/StandingsTable';
import { SeasonSummaryModal } from './components/SeasonSummaryModal';
import { DeductionsModal } from './components/DeductionsModal';
import { Button } from './components/Button';
import { CompetitionSelect } from './components/CompetitionSelect';
import { MatchList } from './components/MatchList/MatchList';
import { BrainIcon, TrendingDownIcon } from './components/icons';
import { competitionData } from './data';
import { getCompetition, allCompetitions, type CompetitionConfig } from './competitions';
import footballPredictorLogo from './assets/football-predictor.svg';
import * as styles from './App.css';

const applyOverrides = (base: Match[], overrides: Match[]): Match[] => {
  const overrideMap = new Map(overrides.map((m) => [m.id, m]));
  return base.map((match) => overrideMap.get(match.id) ?? match);
};

interface CompetitionContentProps {
  slug: string;
  config: CompetitionConfig;
}

const CompetitionContent = ({ slug, config }: CompetitionContentProps) => {
  const navigate = useNavigate();
  const data = competitionData[slug];

  const teams = (data.teamsData as TeamsData).teams;
  const matches = applyOverrides(
    (data.matchesData as MatchesData).matches,
    (data.overridesData as unknown as MatchesData).matches,
  );
  const defaultDeductions = data.deductionsData as PointDeduction[];
  const apiStandings = data.standingsData as ApiStandingsData;
  const modelPredictions = (data.modelPredictionsData as ModelPredictionsData).predictions;

  const emptyPredictions = { predictions: {}, lastModified: '' };
  const calculatedFromResults = calculateStandings(
    teams,
    matches,
    emptyPredictions,
    defaultDeductions,
  );
  if (apiStandings.standings.length > 0) {
    validateStandings(calculatedFromResults, apiStandings);
  }

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

  const allFixturesResolved = useMemo(() => {
    return matches.every(
      (m) => m.status === 'FINISHED' || String(m.id) in predictions.predictions,
    );
  }, [predictions, matches]);

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
          reason: d.reason ?? '',
        };
      }),
    [deductions, teamsById],
  );

  const predictedCount = Object.keys(predictions.predictions).length;
  const competitions = allCompetitions();

  return (
    <>
      <header className={styles.header}>
        <img src={footballPredictorLogo} alt="Football Predictor" className={styles.logo} />
        <h1 className={styles.title}>Football Predictor</h1>
        {competitions.length > 1 && (
          <div className={styles.competitionSelectWrapper}>
            <CompetitionSelect
              competitions={competitions}
              value={slug}
              onChange={(s) => navigate(`/${s}/`)}
            />
          </div>
        )}
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
