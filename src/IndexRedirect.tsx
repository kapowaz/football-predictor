import { Navigate, useSearchParams } from 'react-router-dom';

import { DEFAULT_COMPETITION, LEGACY_COMPETITION } from './data/competitions';

export const IndexRedirect = () => {
  const [searchParams] = useSearchParams();
  const hasPredictions = searchParams.has('predictions');

  if (hasPredictions) {
    return (
      <Navigate
        to={`/${LEGACY_COMPETITION}/?${searchParams.toString()}`}
        replace
      />
    );
  }

  return <Navigate to={`/${DEFAULT_COMPETITION}/`} replace />;
};
