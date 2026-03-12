import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './fonts.css';
import App from './App';
import { CompetitionPage } from './CompetitionPage';
import { IndexRedirect } from './IndexRedirect';
import { StandingsRenderComparisonPage } from './StandingsRenderComparisonPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/football-predictor">
      <Routes>
        <Route element={<App />}>
          <Route index element={<IndexRedirect />} />
          <Route path="compare/standings" element={<StandingsRenderComparisonPage />} />
          <Route path=":slug/*" element={<CompetitionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
