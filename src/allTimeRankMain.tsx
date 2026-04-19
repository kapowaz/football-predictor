import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as appShell from './App.css';
import '@kapowaz/components/components.css';
import '@kapowaz/football/football.css';
import { AllTimeRankPage } from './AllTimeRankPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className={appShell.app}>
      <AllTimeRankPage />
    </div>
  </StrictMode>,
);
