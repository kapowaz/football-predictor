import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { domToPng as modernScreenshotToPng } from 'modern-screenshot';
import { TabBar } from './components/TabBar';
import { StandingsTable } from './components/StandingsTable/StandingsTable';
import { ColorModeToggle } from './components/ColorModeToggle';
import { useCompetitionData } from './hooks/useCompetitionData';
import { useStandings } from './hooks/useStandings';
import { useTheme } from './hooks/useTheme';
import { COMPETITIONS } from './data/competitions';
import { loadPredictions } from './utils/storage';
import type { PredictionsStore } from './types';
import * as styles from './StandingsRenderComparisonPage.css';

const CHAMPIONSHIP_SLUG = 'efl-championship';

const TABS = [
  { id: 'dom', label: 'Actual DOM' },
  { id: 'modern-screenshot', label: 'modern-screenshot' },
] as const;

const CAPTURE_SCALE = 2;

type TabId = (typeof TABS)[number]['id'];

interface CaptureResult {
  dataUrl: string | null;
  durationMs: number | null;
  error: string | null;
}

type CaptureMap = Record<'modern-screenshot', CaptureResult>;

const waitForImages = async (container: HTMLElement): Promise<void> => {
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    images.map(async (image) => {
      if (image.complete && image.naturalWidth > 0) {
        return;
      }
      if (typeof image.decode === 'function') {
        try {
          await image.decode();
          return;
        } catch {
          // Fall through to the load/error listener fallback.
        }
      }
      await new Promise<void>((resolve) => {
        const done = () => resolve();
        image.addEventListener('load', done, { once: true });
        image.addEventListener('error', done, { once: true });
      });
    }),
  );
};

const initialCaptureMap: CaptureMap = {
  'modern-screenshot': { dataUrl: null, durationMs: null, error: null },
};

export const StandingsRenderComparisonPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>('dom');
  const [isRendering, setIsRendering] = useState(false);
  const [captures, setCaptures] = useState<CaptureMap>(initialCaptureMap);
  const captureRootRef = useRef<HTMLDivElement>(null);

  const { teams, matches, defaultDeductions } = useCompetitionData(CHAMPIONSHIP_SLUG);
  const [predictions] = useState<PredictionsStore>(() => loadPredictions(CHAMPIONSHIP_SLUG));
  const standings = useStandings(teams, matches, predictions, defaultDeductions);
  const zones = COMPETITIONS[CHAMPIONSHIP_SLUG].zones;

  const deductionMarkers = useMemo(
    () => new Map(defaultDeductions.map((deduction, index) => [deduction.teamId, '*'.repeat(index + 1)])),
    [defaultDeductions],
  );

  const renderAll = useCallback(async () => {
    const node = captureRootRef.current;
    if (!node) {
      return;
    }

    setIsRendering(true);
    setCaptures(initialCaptureMap);

    if ('fonts' in document) {
      await document.fonts.ready;
    }
    await waitForImages(node);

    const next: CaptureMap = { ...initialCaptureMap };

    try {
      const started = performance.now();
      const dataUrl = await modernScreenshotToPng(node, {
        scale: CAPTURE_SCALE,
      });
      next['modern-screenshot'] = {
        dataUrl,
        durationMs: Math.round(performance.now() - started),
        error: null,
      };
    } catch (error) {
      next['modern-screenshot'] = {
        dataUrl: null,
        durationMs: null,
        error: error instanceof Error ? error.message : 'Unknown modern-screenshot error',
      };
    }

    setCaptures(next);
    setIsRendering(false);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void renderAll();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [renderAll]);

  const handleColorModeToggle = useCallback(
    (colorMode: 'light' | 'dark') => {
      toggleTheme(colorMode);

      // Wait two frames so CSS variables from the new color mode are applied before capture.
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          void renderAll();
        });
      });
    },
    [renderAll, toggleTheme],
  );

  const renderTabContent = () => {
    if (activeTab === 'dom') {
      return (
        <div className={styles.captureSurface}>
          <StandingsTable
            standings={standings}
            deductionMarkers={deductionMarkers}
            zones={zones}
            disableVerticalScroll
            disableTableBorderRadius
          />
        </div>
      );
    }

    const capture = captures[activeTab];
    if (!capture.dataUrl) {
      return (
        <p className={styles.placeholder}>
          {capture.error
            ? `${activeTab} failed: ${capture.error}`
            : isRendering
              ? `Rendering ${activeTab}...`
              : `${activeTab} has no output yet.`}
        </p>
      );
    }

    return <img src={capture.dataUrl} alt={`${activeTab} output`} className={styles.previewImage} />;
  };

  return (
    <div className={styles.page}>
      <div className={styles.hiddenCaptureRoot} aria-hidden="true">
        <div ref={captureRootRef} className={styles.captureSurface}>
          <StandingsTable
            standings={standings}
            deductionMarkers={deductionMarkers}
            zones={zones}
            disableVerticalScroll
            disableTableBorderRadius
          />
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.headerTopRow}>
          <h1 className={styles.title}>Standings Render Comparison</h1>
          <ColorModeToggle colorMode={theme} onColorModeToggle={handleColorModeToggle} />
        </div>
        <p className={styles.subtitle}>
          EFL Championship table rendered from localStorage predictions (if present), with full table
          capture and side-by-side output comparison.
        </p>
        <div className={styles.statusRow}>
          <span className={styles.statusOk}>
            localStorage predictions: {Object.keys(predictions.predictions).length}
          </span>
          <span className={styles.statusOk}>{isRendering ? 'rendering...' : 'render complete'}</span>
          {captures['modern-screenshot'].durationMs !== null && (
            <span className={styles.statusOk}>
              modern-screenshot: {captures['modern-screenshot'].durationMs}ms
            </span>
          )}
          {Object.values(captures).some((capture) => capture.error) && (
            <span className={styles.statusError}>one or more renders failed</span>
          )}
        </div>
      </header>

      <div className={styles.panel}>
        <TabBar
          tabs={[...TABS]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as TabId)}
          alwaysVisible
        />
        <div className={styles.viewport}>{renderTabContent()}</div>
      </div>
    </div>
  );
};
