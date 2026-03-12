import { Navigate, useParams } from 'react-router-dom';
import { useRef } from 'react';
import { StandingsImageView } from './components/StandingsImageView';
import { getCompetition, type CompetitionConfig } from './data/competitions';
import { competitionData } from './data';
import { useCompetitionData } from './hooks/useCompetitionData';
import { useCompetitionSession } from './state/useCompetitionSession';
import { selectStandingsViewModel } from './state/selectors';

interface StandingsImageContentProps {
  slug: string;
  config: CompetitionConfig;
}

const StandingsImageContent = ({ slug, config }: StandingsImageContentProps) => {
  const captureRef = useRef<HTMLDivElement>(null);
  const { teams, matches, defaultDeductions } = useCompetitionData(slug);
  const { predictions, deductions } = useCompetitionSession({
    slug,
    matches,
    defaultDeductions,
    persistenceMode: 'storageOnly',
  });
  const { standings, deductionMarkers } = selectStandingsViewModel(
    teams,
    matches,
    predictions,
    deductions,
  );

  return (
    <StandingsImageView
      standings={standings}
      deductionMarkers={deductionMarkers}
      zones={config.zones}
      captureRef={captureRef}
      isHidden={false}
    />
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
