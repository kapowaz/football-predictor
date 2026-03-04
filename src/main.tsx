import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import App from './App';
import { CompetitionPage } from './CompetitionPage';
import { DEFAULT_COMPETITION, LEGACY_COMPETITION } from './competitions';

const IndexRedirect = () => {
  const [searchParams] = useSearchParams();
  const hasPredictions = searchParams.has('predictions');

  if (hasPredictions) {
    return <Navigate to={`/${LEGACY_COMPETITION}/?${searchParams.toString()}`} replace />;
  }

  return <Navigate to={`/${DEFAULT_COMPETITION}/`} replace />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/football-predictor">
      <Routes>
        <Route element={<App />}>
          <Route index element={<IndexRedirect />} />
          <Route path=":slug/*" element={<CompetitionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
