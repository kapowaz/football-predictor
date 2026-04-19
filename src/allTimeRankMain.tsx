import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ColorModeProvider } from '@kapowaz/components';
import * as appShell from './App.css';
import '@kapowaz/components/components.css';
import '@kapowaz/football/football.css';
import { AllTimeRankPage } from './pages/AllTimeRankPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeProvider>
      <div className={appShell.app}>
        <AllTimeRankPage />
      </div>
    </ColorModeProvider>
  </StrictMode>,
);
