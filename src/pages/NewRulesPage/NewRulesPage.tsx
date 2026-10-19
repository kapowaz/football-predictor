import { useMemo, useRef } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useColorMode } from '@kapowaz/components';

import { CompetitionPanels } from '../../components/CompetitionPanels';
import { DeductionsModal } from '../../components/DeductionsModal';
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
import {
  selectCaptureSignature,
  selectDeductionNotes,
  selectStandingsViewModel,
  selectTeamsById,
} from '../../state/selectors';
import { useCompetitionSession } from '../../state/useCompetitionSession';
import { getEffectivePredictions } from '../../utils/liveScores';

interface NewRulesContentProps {
  slug: string;
  config: CompetitionConfig;
}

const NewRulesContent = ({ slug, config }: NewRulesContentProps) => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { teams, matches, allMatches, defaultDeductions } =
    useCompetitionData(slug);
  const { liveScores } = useLiveScores(slug);
  const genuineToggle = useGenuineToggle(slug);
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
    'new-rules',
  );
  const zoneGuaranteedByTeamId = useZoneGuarantees(
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
        variantRules="new-rules"
        captureRefs={[topStandingsCaptureRef, bottomStandingsCaptureRef]}
        onLayout={onImageLayout}
      />

      <CompetitionPanels
        slug={slug}
        config={config}
        pageContentRef={pageContentRef}
        headerProps={{
          competitions,
          activeSlug: slug,
          onCompetitionChange: (s) => navigate(`/new-rules/${s}/`),
        }}
        onDownloadImage={onDownloadImage}
        isRenderingImage={isRenderingImage}
        hasStandingsImage={hasStandingsImage}
        variantRules="new-rules"
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
        {...genuineToggle}
      />
    </>
  );
};

export const NewRulesPage = () => {
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

  return <NewRulesContent key={slug} slug={slug} config={config} />;
};
