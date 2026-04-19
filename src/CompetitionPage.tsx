import { useEffect, useMemo, useRef } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useCompetitionData } from './hooks/useCompetitionData';
import { useImageDownload } from './hooks/useImageDownload';
import { useLiveScores } from './hooks/useLiveScores';
// import { useScreenShake } from './hooks/useScreenShake';
import { useColorMode } from './hooks/useColorMode';
import { useCompetitionSession } from './state/useCompetitionSession';
import {
  selectCaptureSignature,
  selectDeductionNotes,
  selectStandingsViewModel,
  selectTeamsById,
} from './state/selectors';
import { getEffectivePredictions } from './utils/liveScores';
import { useZoneGuarantees } from './hooks/useZoneGuarantees';
import { useZoneThresholds } from './hooks/useZoneThresholds';
import { CompetitionPanels } from './components/CompetitionPanels';
import { StandingsImageView } from './components/StandingsImageView';
import { SeasonSummaryModal } from './components/SeasonSummaryModal';
import { DeductionsModal } from './components/DeductionsModal';
import { hasCompetitionData } from './data';
import { getCompetition, allCompetitions, type CompetitionConfig } from './data/competitions';
import { clearConfettiShown } from './utils/storage';

interface CompetitionContentProps {
  slug: string;
  config: CompetitionConfig;
}

const CompetitionContent = ({ slug, config }: CompetitionContentProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('resetConfetti') === 'true') {
      clearConfettiShown(slug);
      params.delete('resetConfetti');
      const search = params.toString();
      const newUrl = `${window.location.pathname}${search ? `?${search}` : ''}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, [slug]);
  const { colorMode, toggleColorMode } = useColorMode();
  const { teams, matches, defaultDeductions } = useCompetitionData(slug);
  const { liveScores } = useLiveScores(slug);
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
  );
  const zoneGuaranteedByTeamId = useZoneGuarantees(
    standings,
    matches,
    effectivePredictions,
    config.zones,
  );

  const zoneThresholds = useZoneThresholds(standings, matches, effectivePredictions, config.zones);

  const teamsById = selectTeamsById(teams);
  const deductionNotes = selectDeductionNotes(deductions, teamsById);

  const pageContentRef = useRef<HTMLDivElement>(null);
  const topStandingsCaptureRef = useRef<HTMLDivElement>(null);
  const bottomStandingsCaptureRef = useRef<HTMLDivElement>(null);

  // disabled for now
  // useScreenShake({
  //   shouldShake: isSummaryOpen,
  //   targetRef: pageContentRef,
  //   duration: 0.7,
  //   delay: 0.15,
  // });

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
      />

      <CompetitionPanels
        slug={slug}
        config={config}
        pageContentRef={pageContentRef}
        isRunIn
        zoneThresholds={zoneThresholds}
        standings={standings}
        deductionMarkers={deductionMarkers}
        headerProps={{
          competitions,
          activeSlug: slug,
          onCompetitionChange: (s) => navigate(`/${s}/`),
          colorMode: colorMode,
          onColorModeToggle: toggleColorMode,
        }}
        onDownloadImage={onDownloadImage}
        isRenderingImage={isRenderingImage}
        hasStandingsImage={hasStandingsImage}
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
        standingsImageFiles={standingsImageFiles}
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

  if (!hasCompetitionData(slug)) {
    return <Navigate to="/" replace />;
  }

  return <CompetitionContent key={slug} slug={slug} config={config} />;
};
