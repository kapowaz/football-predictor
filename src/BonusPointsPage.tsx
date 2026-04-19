import { useMemo, useRef } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useCompetitionData } from './hooks/useCompetitionData';
import { useImageDownload } from './hooks/useImageDownload';
import { useLiveScores } from './hooks/useLiveScores';
import { useColorMode } from '@kapowaz/components';
import { useCompetitionSession } from './state/useCompetitionSession';
import {
  selectCaptureSignature,
  selectDeductionNotes,
  selectStandingsViewModel,
  selectTeamsById,
} from './state/selectors';
import { getEffectivePredictions } from './utils/liveScores';
import { useZoneGuarantees } from './hooks/useZoneGuarantees';
import { CompetitionPanels } from './components/CompetitionPanels';
import { StandingsImageView } from './components/StandingsImageView';
import { DeductionsModal } from './components/DeductionsModal';
import { hasCompetitionData } from './data';
import { getCompetition, allCompetitions, type CompetitionConfig } from './data/competitions';

interface BonusPointsContentProps {
  slug: string;
  config: CompetitionConfig;
}

const BonusPointsContent = ({ slug, config }: BonusPointsContentProps) => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { teams, matches, defaultDeductions } = useCompetitionData(slug);
  const { liveScores } = useLiveScores(slug);
  const {
    predictions,
    deductions,
    deductionsCustomised,
    deductionsModalOpen,
    updateDeduction,
    addDeduction,
    removeDeduction,
    resetDeductions,
    setDeductionsModalOpen,
  } = useCompetitionSession({
    slug,
    matches,
    defaultDeductions,
    persistenceMode: 'full',
  });

  const effectivePredictions = useMemo(
    () => getEffectivePredictions(predictions, liveScores),
    [predictions, liveScores],
  );

  const { standings, deductionMarkers } = selectStandingsViewModel(
    teams,
    matches,
    effectivePredictions,
    deductions,
    config.zones,
    'bonus-points',
  );
  const zoneGuaranteedByTeamId = useZoneGuarantees(standings, matches, effectivePredictions, config.zones);
  const teamsById = selectTeamsById(teams);
  const deductionNotes = selectDeductionNotes(deductions, teamsById);

  const pageContentRef = useRef<HTMLDivElement>(null);
  const topStandingsCaptureRef = useRef<HTMLDivElement>(null);
  const bottomStandingsCaptureRef = useRef<HTMLDivElement>(null);

  const competitions = allCompetitions();

  const captureSignature = selectCaptureSignature(standings, deductionMarkers, colorMode);

  const { imageFiles, isRenderingImage, onDownloadImage } = useImageDownload({
    captureRefs: [topStandingsCaptureRef, bottomStandingsCaptureRef],
    slug,
    competitionName: config.name,
    competitionSeason: config.season,
    captureSignature,
  });
  const standingsImageFiles =
    imageFiles.top && imageFiles.bottom ? { top: imageFiles.top, bottom: imageFiles.bottom } : null;
  const hasStandingsImage = standingsImageFiles !== null;

  return (
    <>
      <StandingsImageView
        standings={standings}
        competitionLogo={config.logo}
        competitionName={config.name}
        competitionSeason={config.season}
        deductionNotes={deductionNotes}
        deductionMarkers={deductionMarkers}
        zoneGuaranteedByTeamId={zoneGuaranteedByTeamId}
        zones={config.zones}
        partial="top"
        captureRef={topStandingsCaptureRef}
        variantRules="bonus-points"
      />
      <StandingsImageView
        standings={standings}
        competitionLogo={config.logo}
        competitionName={config.name}
        competitionSeason={config.season}
        deductionNotes={deductionNotes}
        deductionMarkers={deductionMarkers}
        zoneGuaranteedByTeamId={zoneGuaranteedByTeamId}
        zones={config.zones}
        partial="bottom"
        captureRef={bottomStandingsCaptureRef}
        variantRules="bonus-points"
      />

      <CompetitionPanels
        slug={slug}
        config={config}
        pageContentRef={pageContentRef}
        headerProps={{
          competitions,
          activeSlug: slug,
          onCompetitionChange: (s) => navigate(`/bonus-points/${s}/`),
        }}
        onDownloadImage={onDownloadImage}
        isRenderingImage={isRenderingImage}
        hasStandingsImage={hasStandingsImage}
        variantRules="bonus-points"
        standings={standings}
        deductionMarkers={deductionMarkers}
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
    </>
  );
};

export const BonusPointsPage = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const config = getCompetition(slug);
  if (!config) {
    return <Navigate to="/" replace />;
  }

  if (!hasCompetitionData(slug)) {
    return <Navigate to="/" replace />;
  }

  return <BonusPointsContent key={slug} slug={slug} config={config} />;
};
