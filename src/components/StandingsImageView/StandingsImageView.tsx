import type { RefObject } from 'react';
import clsx from 'clsx';
import type { ZoneDefinition } from '../../data/competitions';
import type { TeamStanding } from '../../types';
import { StandingsTable } from '../StandingsTable/StandingsTable';
import * as styles from './StandingsImageView.css';

export const DEFAULT_STANDINGS_IMAGE_WIDTH = 688;

interface StandingsImageViewProps {
  /** Pre-computed standings rows for image rendering. */
  standings: TeamStanding[];
  /** Pre-computed deduction markers keyed by team id. */
  deductionMarkers: Map<number, string>;
  /** Competition zones from config (promotion/relegation bands). */
  zones: ZoneDefinition[];
  /** Ref attached to the rendered capture node for image export. */
  captureRef: RefObject<HTMLDivElement | null>;
  /** Whether the capture root should be visually hidden off-screen. */
  isHidden?: boolean;
}

export const StandingsImageView = ({
  standings,
  deductionMarkers,
  zones,
  captureRef,
  isHidden = true,
}: StandingsImageViewProps) => {
  return (
    <div
      className={clsx(styles.outerWrapper, isHidden ? styles.hiddenCaptureRoot : undefined)}
      aria-hidden="true"
    >
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
