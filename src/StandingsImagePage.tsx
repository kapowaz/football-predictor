import { Navigate, useParams } from 'react-router-dom';
import { useRef } from 'react';
import { StandingsImageView } from './components/StandingsImageView';
import { getCompetition } from './competitions';
import { competitionData } from './data';

export const StandingsImagePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const captureRef = useRef<HTMLDivElement>(null);

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

  return (
    <StandingsImageView slug={slug} zones={config.zones} captureRef={captureRef} isHidden={false} />
  );
};
