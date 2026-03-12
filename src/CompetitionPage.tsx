import { useRef } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useCompetitionData } from './hooks/useCompetitionData';
import { useImageDownload } from './hooks/useImageDownload';
import { useScreenShake } from './hooks/useScreenShake';
import { useTheme } from './hooks/useTheme';
import { useCompetitionSession } from './state/useCompetitionSession';
import {
  selectCaptureSignature,
  selectDeductionNotes,
  selectStandingsViewModel,
  selectTeamsById,
} from './state/selectors';
import { CompetitionPanels } from './components/CompetitionPanels';
import { StandingsImageView } from './components/StandingsImageView';
import { SeasonSummaryModal } from './components/SeasonSummaryModal';
import { DeductionsModal } from './components/DeductionsModal';
import { competitionData } from './data';
import { getCompetition, allCompetitions, type CompetitionConfig } from './data/competitions';

interface CompetitionContentProps {
  slug: string;
  config: CompetitionConfig;
}

const CompetitionContent = ({ slug, config }: CompetitionContentProps) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { teams, matches, defaultDeductions } = useCompetitionData(slug);
  const {
    predictions,
    deductions,
    deductionsCustomised,
    deductionsModalOpen,
    isSummaryOpen,
    updateDeduction,
    addDeduction,
    removeDeduction,
    resetDeductions,
    setDeductionsModalOpen,
    dismissSummary,
  } = useCompetitionSession({
    slug,
    matches,
    defaultDeductions,
    persistenceMode: 'full',
  });

  const { standings, deductionMarkers } = selectStandingsViewModel(
    teams,
    matches,
    predictions,
    deductions,
  );
  const teamsById = selectTeamsById(teams);
  const deductionNotes = selectDeductionNotes(deductions, teamsById);

  const pageContentRef = useRef<HTMLDivElement>(null);
  const standingsCaptureRef = useRef<HTMLDivElement>(null);

  useScreenShake({
    shouldShake: isSummaryOpen,
    targetRef: pageContentRef,
    duration: 0.7,
  });

  const competitions = allCompetitions();

  const captureSignature = selectCaptureSignature(standings, deductionMarkers, theme);

  const { imageFile, isRenderingImage, onDownloadImage } = useImageDownload({
    captureRef: standingsCaptureRef,
    slug,
    competitionName: config.name,
    competitionSeason: config.season,
    captureSignature,
  });

  return (
    <>
      <StandingsImageView
        standings={standings}
        competitionName={config.name}
        competitionSeason={config.season}
        deductionNotes={deductionNotes}
        deductionMarkers={deductionMarkers}
        zones={config.zones}
        captureRef={standingsCaptureRef}
      />

      <CompetitionPanels
        slug={slug}
        config={config}
        pageContentRef={pageContentRef}
        headerProps={{
          competitions,
          activeSlug: slug,
          onCompetitionChange: (s) => navigate(`/${s}/`),
          colorMode: theme,
          onColorModeToggle: toggleTheme,
        }}
        onDownloadImage={onDownloadImage}
        isRenderingImage={isRenderingImage}
        hasStandingsImage={Boolean(imageFile)}
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
        standingsImageFile={imageFile}
        isRenderingStandingsImage={isRenderingImage}
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
