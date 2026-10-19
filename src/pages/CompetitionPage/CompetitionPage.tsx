import { useEffect, useMemo, useRef } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
// import { useScreenShake } from '../../hooks/useScreenShake';
import { useColorMode } from '@kapowaz/components';

import { CompetitionPanels } from '../../components/CompetitionPanels';
import { DeductionsModal } from '../../components/DeductionsModal';
import { SeasonSummaryModal } from '../../components/SeasonSummaryModal';
import { StandingsImagePair } from '../../components/StandingsImagePair';
import { hasCompetitionData } from '../../data';
import {
  allCompetitions,
  type CompetitionConfig,
} from '../../data/competitions';
import { useCompetitionConfig } from '../../hooks/useCompetitionConfig';
import { useCompetitionData } from '../../hooks/useCompetitionData';
import { useGenuineToggle } from '../../hooks/useGenuineToggle';
import { useImageDownload } from '../../hooks/useImageDownload';
import { useImageLayoutKey } from '../../hooks/useImageLayoutKey';
import { useLiveScores } from '../../hooks/useLiveScores';
import { useZoneGuarantees } from '../../hooks/useZoneGuarantees';
import { useZoneThresholds } from '../../hooks/useZoneThresholds';
import {
  selectCaptureSignature,
  selectDeductionNotes,
  selectStandingsViewModel,
  selectTeamsById,
} from '../../state/selectors';
import { useCompetitionSession } from '../../state/useCompetitionSession';
import { getEffectivePredictions } from '../../utils/liveScores';
import { clearConfettiShown } from '../../utils/storage';

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
  const { colorMode } = useColorMode();
  const { teams, matches, allMatches, defaultDeductions } =
    useCompetitionData(slug);
  const genuineToggle = useGenuineToggle(slug);
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
    matches: allMatches,
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

  const zoneThresholds = useZoneThresholds(
    standings,
    matches,
    effectivePredictions,
    config.zones,
  );

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

  const [imageLayoutKey, onImageLayout] = useImageLayoutKey();
  const captureSignature = selectCaptureSignature(
    standings,
    deductionMarkers,
    colorMode,
  );

  const { imageFiles, isRenderingImage, onDownloadImage } = useImageDownload({
    captureRefs: [topStandingsCaptureRef, bottomStandingsCaptureRef],
    slug,
    competitionName: config.name,
    competitionSeason: config.season,
    captureSignature: `${captureSignature}|${imageLayoutKey}`,
  });
  const standingsImageFiles =
    imageFiles.top && imageFiles.bottom
      ? { top: imageFiles.top, bottom: imageFiles.bottom }
      : null;
  const hasStandingsImage = standingsImageFiles !== null;

  return (
    <>
      <StandingsImagePair
        standings={standings}
        competitionLogo={config.logo}
        competitionName={config.name}
        competitionSeason={config.season}
        deductionNotes={deductionNotes}
        deductionMarkers={deductionMarkers}
        zoneGuaranteedByTeamId={zoneGuaranteedByTeamId}
        zones={config.zones}
        captureRefs={[topStandingsCaptureRef, bottomStandingsCaptureRef]}
        onLayout={onImageLayout}
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
        {...genuineToggle}
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

  const config = useCompetitionConfig(slug);

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  if (!config) {
    return <Navigate to="/" replace />;
  }

  if (!hasCompetitionData(slug)) {
    return <Navigate to="/" replace />;
  }

  return <CompetitionContent key={slug} slug={slug} config={config} />;
};
