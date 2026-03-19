import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './fonts.css';
import App from './App';
import { IndexRedirect } from './IndexRedirect';

const CompetitionPage = lazy(() =>
  import('./CompetitionPage').then((m) => ({ default: m.CompetitionPage })),
);
const RelegationPage = lazy(() =>
  import('./RelegationPage').then((m) => ({ default: m.RelegationPage })),
);
const RunInPage = lazy(() => import('./RunInPage').then((m) => ({ default: m.RunInPage })));
const NewRulesPage = lazy(() =>
  import('./NewRulesPage').then((m) => ({ default: m.NewRulesPage })),
);
const BonusPointsPage = lazy(() =>
  import('./BonusPointsPage').then((m) => ({ default: m.BonusPointsPage })),
);
const StandingsImagePage = lazy(() =>
  import('./StandingsImagePage').then((m) => ({ default: m.StandingsImagePage })),
);
const AllTimeRankPage = lazy(() =>
  import('./AllTimeRankPage').then((m) => ({ default: m.AllTimeRankPage })),
);
const ColorPalettePage = lazy(() =>
  import('./ColorPalettePage').then((m) => ({ default: m.ColorPalettePage })),
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/football-predictor">
      <Suspense>
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
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
