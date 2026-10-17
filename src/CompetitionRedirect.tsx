import { Navigate, useParams } from 'react-router-dom';

/** Redirects a disabled competition sub-page to that competition's standings. */
export const CompetitionRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={slug ? `/${slug}/` : '/'} replace />;
};
