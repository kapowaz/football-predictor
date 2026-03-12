import { useMemo } from 'react';
import type { RefObject } from 'react';
import type { ZoneDefinition } from '../../competitions';
import { useCompetitionData } from '../../hooks/useCompetitionData';
import { useDeductions } from '../../hooks/useDeductions';
import { usePredictions } from '../../hooks/usePredictions';
import { useStandings } from '../../hooks/useStandings';
import { StandingsTable } from '../StandingsTable/StandingsTable';
import * as styles from './StandingsImageView.css';

export const DEFAULT_STANDINGS_IMAGE_WIDTH = 688;

interface StandingsImageViewProps {
  /** Competition slug used to source standings-related data. */
  slug: string;
  /** Competition zones from config (promotion/relegation bands). */
  zones: ZoneDefinition[];
  /** Ref attached to the rendered capture node for image export. */
  captureRef: RefObject<HTMLDivElement | null>;
  /** Fixed CSS width (px) used for deterministic image layout. */
  captureWidth?: number;
}

export const StandingsImageView = ({
  slug,
  zones,
  captureRef,
  captureWidth = DEFAULT_STANDINGS_IMAGE_WIDTH,
}: StandingsImageViewProps) => {
  const { teams, matches, defaultDeductions } = useCompetitionData(slug);
  const { predictions } = usePredictions(slug, matches);
  const { deductions } = useDeductions(slug, defaultDeductions);
  const standings = useStandings(teams, matches, predictions, deductions);
  const deductionMarkers = useMemo(
    () => new Map(deductions.map((deduction, index) => [deduction.teamId, '*'.repeat(index + 1)])),
    [deductions],
  );

  return (
    <div className={styles.hiddenCaptureRoot} style={{ width: `${captureWidth}px` }} aria-hidden="true">
      <div ref={captureRef} className={styles.captureSurface}>
        <StandingsTable
          standings={standings}
          deductionMarkers={deductionMarkers}
          zones={zones}
          disableVerticalScroll
          disableTableBorderRadius
        />
      </div>
    </div>
  );
};
