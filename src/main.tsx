import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './fonts.css';
import App from './App';
import { CompetitionPage } from './CompetitionPage';
import { IndexRedirect } from './IndexRedirect';
import { RelegationPage } from './RelegationPage';
import { RunInPage } from './RunInPage';
import { NewRulesPage } from './NewRulesPage';
import { BonusPointsPage } from './BonusPointsPage';
import { StandingsImagePage } from './StandingsImagePage';
import { AllTimeRankPage } from './AllTimeRankPage';
import { ColorPalettePage } from './ColorPalettePage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/football-predictor">
      <Routes>
        <Route element={<App />}>
          <Route index element={<IndexRedirect />} />
          <Route path="all-time-rank" element={<AllTimeRankPage />} />
          <Route path="colors" element={<ColorPalettePage />} />
          <Route path="relegation/:slug/" element={<RelegationPage />} />
          <Route path="run-in/:slug/" element={<RunInPage />} />
          <Route path="new-rules/:slug/" element={<NewRulesPage />} />
          <Route path="bonus-points/:slug/" element={<BonusPointsPage />} />
          <Route path="standings-image/:slug/" element={<StandingsImagePage />} />
          <Route path=":slug/*" element={<CompetitionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
