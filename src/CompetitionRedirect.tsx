import { Navigate, useLocation, useParams } from 'react-router-dom';

/**
 * Redirects a disabled competition sub-page to that competition's standings,
 * keeping the query string so shared predictions/deductions survive.
 */
export const CompetitionRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  const { search } = useLocation();
  return (
    <Navigate to={{ pathname: slug ? `/${slug}/` : '/', search }} replace />
  );
};
