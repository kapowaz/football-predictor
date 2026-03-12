import { useMemo, useEffect, useRef, useCallback } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { animate } from 'framer-motion';
import { useCompetitionData } from './hooks/useCompetitionData';
import { useImageCapture } from './hooks/useImageCapture';
import { useTheme } from './hooks/useTheme';
import { useCompetitionSession } from './state/useCompetitionSession';
import {
  selectAllScheduledPredicted,
  selectCaptureSignature,
  selectDeductionNotes,
  selectPredictedCount,
  selectStandingsViewModel,
  selectTeamsById,
} from './state/selectors';
import { CompetitionPanels } from './components/CompetitionPanels';
import { StandingsImageView } from './components/StandingsImageView';
import { SeasonSummaryModal } from './components/SeasonSummaryModal';
import { DeductionsModal } from './components/DeductionsModal';
import { competitionData } from './data';
import { getCompetition, allCompetitions, type CompetitionConfig } from './data/competitions';

const TABS = [
  { id: 'standings', label: 'Standings' },
  { id: 'fixtures', label: 'Fixtures' },
] as const;

const STANDINGS_CAPTURE_SCALE = 2;

interface CompetitionContentProps {
  slug: string;
  config: CompetitionConfig;
}

const CompetitionContent = ({ slug, config }: CompetitionContentProps) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { teams, matches, defaultDeductions, modelPredictions } = useCompetitionData(slug);
  const {
    predictions,
    deductions,
    deductionsCustomised,
    activeTab,
    navigateToMatchId,
    deductionsModalOpen,
    isSummaryOpen,
    setPrediction,
    removePrediction,
    resetAllPredictions,
    fillFromModel,
    updateDeduction,
    addDeduction,
    removeDeduction,
    resetDeductions,
    setActiveTab,
    setNavigateToMatchId,
    setDeductionsModalOpen,
    dismissSummary,
  } = useCompetitionSession({
    slug,
    matches,
    defaultDeductions,
    persistenceMode: 'full',
  });

  const teamsById = selectTeamsById(teams);
  const { standings, deductionMarkers } = selectStandingsViewModel(
    teams,
    matches,
    predictions,
    deductions,
  );
  const deductionNotes = selectDeductionNotes(deductions, teamsById);
  const predictedCount = selectPredictedCount(predictions);
  const allScheduledPredicted = selectAllScheduledPredicted(matches, predictions);

  const pageContentRef = useRef<HTMLDivElement>(null);
  const standingsCaptureRef = useRef<HTMLDivElement>(null);

  const prevSummaryOpen = useRef(false);
  useEffect(() => {
    if (isSummaryOpen && !prevSummaryOpen.current && pageContentRef.current) {
      animate(
        pageContentRef.current,
        {
          x: [0, -9, 8, -7, 9, -8, 6, -9, 7, -5, 6, -4, 3, -2, 1, 0],
          y: [0, 5, -8, 9, -4, 8, -9, 4, 7, -5, 3, -4, 2, -1, 1, 0],
        },
        { duration: 0.7, ease: 'easeOut' },
      );
    }
    prevSummaryOpen.current = isSummaryOpen;
  }, [isSummaryOpen]);

  const handlePredictionClick = useCallback((matchId: number) => {
    setActiveTab('fixtures');
    setNavigateToMatchId(matchId);
  }, [setActiveTab, setNavigateToMatchId]);

  const handleNavigationComplete = useCallback(() => {
    setNavigateToMatchId(null);
  }, [setNavigateToMatchId]);
  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTab(tabId === 'fixtures' ? 'fixtures' : 'standings');
    },
    [setActiveTab],
  );
  const competitions = allCompetitions();

  const standingsImageMetadata = useMemo(
    () => ({
      Title: `Football Predictor ${config.name} ${config.season}`,
      Source: window.location.href,
    }),
    [config.name, config.season],
  );
  const {
    imageFile: standingsImageFile,
    isRendering: isRenderingStandingsImage,
    renderImage: renderStandingsImage,
  } = useImageCapture({
    captureRef: standingsCaptureRef,
    fileName: `${slug}-standings.png`,
    metadata: standingsImageMetadata,
    scale: STANDINGS_CAPTURE_SCALE,
  });
  const captureSignature = selectCaptureSignature(standings, deductionMarkers, theme);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void renderStandingsImage();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [captureSignature, renderStandingsImage]);

  const handleDownloadStandingsImage = useCallback(() => {
    if (!standingsImageFile) {
      return;
    }

    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(standingsImageFile);
    link.download = standingsImageFile.name;
    link.href = objectUrl;
    link.click();
    // Revoke URL shortly after triggering download.
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }, [standingsImageFile]);

  return (
    <>
      <StandingsImageView
        standings={standings}
        deductionMarkers={deductionMarkers}
        zones={config.zones}
        captureRef={standingsCaptureRef}
      />

      <CompetitionPanels
        pageContentRef={pageContentRef}
        headerProps={{
          competitions,
          activeSlug: slug,
          onCompetitionChange: (s) => navigate(`/${s}/`),
          theme,
          onThemeToggle: toggleTheme,
        }}
        tabs={[...TABS]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        standings={standings}
        deductionMarkers={deductionMarkers}
        zones={config.zones}
        deductionNotes={deductionNotes}
        onPredictionClick={handlePredictionClick}
        onDownloadStandingsImage={handleDownloadStandingsImage}
        isRenderingStandingsImage={isRenderingStandingsImage}
        hasStandingsImage={Boolean(standingsImageFile)}
        onOpenDeductionsModal={() => setDeductionsModalOpen(true)}
        fixtureListProps={{
          matches,
          teamsById,
          predictions,
          onPredictionChange: setPrediction,
          onPredictionRemove: removePrediction,
          isVisible: activeTab === 'fixtures',
          navigateToMatchId,
          onNavigationComplete: handleNavigationComplete,
        }}
        predictedCount={predictedCount}
        allScheduledPredicted={allScheduledPredicted}
        hasModelPredictions={Object.keys(modelPredictions).length > 0}
        onFillFromModel={() => fillFromModel(modelPredictions)}
        onResetPredictions={resetAllPredictions}
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

      <SeasonSummaryModal
        standings={standings}
        isOpen={isSummaryOpen}
        onClose={dismissSummary}
        competition={config}
        standingsImageFile={standingsImageFile}
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
