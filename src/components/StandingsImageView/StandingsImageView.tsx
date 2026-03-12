import type { RefObject } from 'react';
import clsx from 'clsx';
import type { ZoneDefinition } from '../../data/competitions';
import type { DeductionNote } from '../../state/selectors';
import type { TeamStanding } from '../../types';
import { StandingsTable } from '../StandingsTable/StandingsTable';
import { AppHeading } from '../AppHeading';
import { KBoltIcon } from '../icons';
import * as styles from './StandingsImageView.css';

interface StandingsImageViewProps {
  /** Pre-computed standings rows for image rendering. */
  standings: TeamStanding[];
  /** Competition name shown in image heading. */
  competitionName: string;
  /** Competition season shown in image heading. */
  competitionSeason: string;
  /** Pre-computed deduction note labels and reasons for heading display. */
  deductionNotes: DeductionNote[];
  /** Pre-computed deduction markers keyed by team id. */
  deductionMarkers: Map<number, string>;
  /** Competition zones from config (promotion/relegation bands). */
  zones: ZoneDefinition[];
  /** Optionally render only the top or bottom half of standings content. */
  partial?: 'top' | 'bottom';
  /** Ref attached to the rendered capture node for image export. */
  captureRef: RefObject<HTMLDivElement | null>;
  /** Whether the capture root should be visually hidden off-screen. */
  isHidden?: boolean;
}

const SITE_URL = 'kapowaz.github.io/football-predictor/';

export const StandingsImageView = ({
  standings,
  competitionName,
  competitionSeason,
  deductionNotes,
  deductionMarkers,
  zones,
  partial,
  captureRef,
  isHidden = true,
}: StandingsImageViewProps) => {
  const showHeading = partial !== 'bottom';
  const showFooter = partial !== 'top';
  const headingExtraContent = (
    <div className={styles.headingExtraContent}>
      <span className={styles.competitionLabel}>{`${competitionName} ${competitionSeason}`}</span>
      {deductionNotes.length > 0 && (
        <div className={styles.deductionNotes}>
          {deductionNotes.map((note) => (
            <span
              key={note.label}
              className={styles.deductionNote}
              title={note.reason || undefined}
            >
              {note.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={clsx(styles.outerWrapper, isHidden ? styles.hiddenCaptureRoot : undefined)}
      aria-hidden="true"
    >
      <div ref={captureRef} className={styles.captureSurface}>
        <div
          className={clsx(
            styles.innerWrapper,
            partial === 'top' && styles.innerWrapperTop,
            partial === 'bottom' && styles.innerWrapperBottom,
          )}
        >
          {showHeading && <AppHeading shouldFullRender extraContent={headingExtraContent} />}
          <StandingsTable
            standings={standings}
            deductionMarkers={deductionMarkers}
            zones={zones}
            partial={partial}
            disableVerticalScroll
            isRenderView
          />
          {showFooter && (
            <footer className={styles.footerContainer}>
              <div className={styles.footer}>
                <KBoltIcon size={16} className={styles.footerIcon} />
                <span>
                  Football Predictor by <span className={styles.footerBold}>kapowaz</span>. Make your
                  own prediction at <span className={styles.footerBold}>{SITE_URL}</span>
                </span>
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};
