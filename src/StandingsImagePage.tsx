import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useCallback, useMemo, useRef } from 'react';
import type { VariantRulesMode } from './types';
import { StandingsImageView } from './components/StandingsImageView';
import { ColorModeToggle } from './components/ColorModeToggle';
import { getCompetition, type CompetitionConfig } from './data/competitions';
import { competitionData } from './data';
import { useCompetitionData } from './hooks/useCompetitionData';
import { useLiveScores } from './hooks/useLiveScores';
import { useTheme } from './hooks/useTheme';
import { useCompetitionSession } from './state/useCompetitionSession';
import { selectDeductionNotes, selectStandingsViewModel, selectTeamsById } from './state/selectors';
import { getEffectivePredictions } from './utils/liveScores';
import * as styles from './StandingsImagePage.css.ts';

const VALID_VARIANT_RULES = new Set<string>(['new-rules', 'bonus-points']);

const parseVariantRules = (value: string | null): VariantRulesMode => {
  if (value && VALID_VARIANT_RULES.has(value)) return value as VariantRulesMode;
  return false;
};

interface StandingsImageContentProps {
  slug: string;
  config: CompetitionConfig;
}

const StandingsImageContent = ({ slug, config }: StandingsImageContentProps) => {
  const [searchParams] = useSearchParams();
  const variantRules = parseVariantRules(searchParams.get('variantRules'));
  const topCaptureRef = useRef<HTMLDivElement>(null);
  const bottomCaptureRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { teams, matches, defaultDeductions } = useCompetitionData(slug);
  const { liveScores } = useLiveScores(slug);
  const { predictions, deductions } = useCompetitionSession({
    slug,
    matches,
    defaultDeductions,
    persistenceMode: 'storageOnly',
  });
  const effectivePredictions = useMemo(
    () => getEffectivePredictions(predictions, liveScores),
    [predictions, liveScores],
  );
  const { standings, deductionMarkers, zoneGuaranteedByTeamId } = selectStandingsViewModel(
    teams,
    matches,
    effectivePredictions,
    deductions,
    config.zones,
    variantRules,
  );
  const teamsById = selectTeamsById(teams);
  const deductionNotes = selectDeductionNotes(deductions, teamsById);

  const handleColorModeToggle = useCallback(
    (colorMode: 'light' | 'dark') => {
      toggleTheme(colorMode);
    },
    [toggleTheme],
  );

  return (
    <div className={styles.page}>
      <header className={styles.toolbar}>
        <ColorModeToggle colorMode={theme} onColorModeToggle={handleColorModeToggle} />
      </header>
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
        captureRef={topCaptureRef}
        isHidden={false}
        variantRules={variantRules}
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
        captureRef={bottomCaptureRef}
        isHidden={false}
        variantRules={variantRules}
      />
    </div>
  );
};

export const StandingsImagePage = () => {
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

  return <StandingsImageContent slug={slug} config={config} />;
};
