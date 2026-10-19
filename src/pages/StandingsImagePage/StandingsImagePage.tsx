import { useMemo, useRef } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { ToggleColorMode } from '@kapowaz/components';
import {
  getRelegationStartPosition,
  buildThresholdByZoneType,
} from '@kapowaz/football';

import { StandingsImagePair } from '../../components/StandingsImagePair';
import { hasCompetitionData } from '../../data';
import type { CompetitionConfig } from '../../data/competitions';
import { useCompetitionConfig } from '../../hooks/useCompetitionConfig';
import { useCompetitionData } from '../../hooks/useCompetitionData';
import { useLiveScores } from '../../hooks/useLiveScores';
import { usePositionGuarantees } from '../../hooks/usePositionGuarantees';
import { useZoneGuarantees } from '../../hooks/useZoneGuarantees';
import { useZoneThresholds } from '../../hooks/useZoneThresholds';
import {
  selectDeductionNotes,
  selectStandingsViewModel,
  selectTeamsById,
} from '../../state/selectors';
import { useCompetitionSession } from '../../state/useCompetitionSession';
import type { PredictionsStore, VariantRulesMode } from '../../types';
import { getEffectivePredictions } from '../../utils/liveScores';
import * as styles from './StandingsImagePage.css.ts';

const VALID_VARIANT_RULES = new Set<string>(['new-rules', 'bonus-points']);

const NO_PREDICTIONS: PredictionsStore = { predictions: {}, lastModified: '' };

const parseVariantRules = (value: string | null): VariantRulesMode => {
  if (value && VALID_VARIANT_RULES.has(value)) return value as VariantRulesMode;
  return false;
};

interface StandingsImageContentProps {
  slug: string;
  config: CompetitionConfig;
}

const StandingsImageContent = ({
  slug,
  config,
}: StandingsImageContentProps) => {
  const [searchParams] = useSearchParams();
  const variantRules = parseVariantRules(searchParams.get('variantRules'));
  // `?preview` renders the social preview images (scripts/render-og.ts):
  // finished results only, with no saved predictions or in-play scores, and
  // no toolbar.
  const isPreview = searchParams.has('preview');
  const topCaptureRef = useRef<HTMLDivElement>(null);
  const bottomCaptureRef = useRef<HTMLDivElement>(null);
  const { teams, matches, allMatches, defaultDeductions } =
    useCompetitionData(slug);
  const { liveScores } = useLiveScores(slug);
  const { predictions, deductions } = useCompetitionSession({
    slug,
    matches: allMatches,
    defaultDeductions,
    persistenceMode: 'storageOnly',
  });
  const effectivePredictions = useMemo(
    () =>
      isPreview
        ? NO_PREDICTIONS
        : getEffectivePredictions(predictions, liveScores),
    [isPreview, predictions, liveScores],
  );
  const { standings, deductionMarkers } = selectStandingsViewModel(
    teams,
    matches,
    effectivePredictions,
    deductions,
    config.zones,
    variantRules,
  );
  const zoneGuaranteedByTeamId = useZoneGuarantees(
    standings,
    matches,
    effectivePredictions,
    config.zones,
  );
  const positionGuaranteedByTeamId = usePositionGuarantees(
    standings,
    matches,
    effectivePredictions,
  );
  const teamsById = selectTeamsById(teams);
  const deductionNotes = selectDeductionNotes(deductions, teamsById);
  const zoneThresholds = useZoneThresholds(
    standings,
    matches,
    effectivePredictions,
    config.zones,
  );
  const relegationStartPosition = getRelegationStartPosition(config.zones);
  const thresholdByZoneType = buildThresholdByZoneType(zoneThresholds);

  return (
    <div className={styles.page}>
      {!isPreview && (
        <header className={styles.toolbar}>
          <ToggleColorMode />
        </header>
      )}
      <StandingsImagePair
        standings={standings}
        competitionLogo={config.logo}
        competitionName={config.name}
        competitionSeason={config.season}
        deductionNotes={deductionNotes}
        deductionMarkers={deductionMarkers}
        zoneGuaranteedByTeamId={zoneGuaranteedByTeamId}
        positionGuaranteedByTeamId={positionGuaranteedByTeamId}
        zones={config.zones}
        isHidden={false}
        variantRules={variantRules}
        isRunIn
        relegationStartPosition={relegationStartPosition}
        thresholdByZoneType={thresholdByZoneType}
        captureRefs={[topCaptureRef, bottomCaptureRef]}
      />
    </div>
  );
};

export const StandingsImagePage = () => {
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

  return <StandingsImageContent slug={slug} config={config} />;
};
