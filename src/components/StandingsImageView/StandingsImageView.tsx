import type { RefObject } from 'react';
import clsx from 'clsx';
import type { ZoneDefinition } from '../../data/competitions';
import type { DeductionNote } from '../../state/selectors';
import type { TeamStanding, VariantRulesMode } from '../../types';
import { StandingsTable } from '../StandingsTable/StandingsTable';
import { AppHeading } from '../AppHeading';
import { KBoltIcon } from '../icons';
import * as styles from './StandingsImageView.css';

interface StandingsImageViewProps {
  /** Pre-computed standings rows for image rendering. */
  standings: TeamStanding[];
  /** Competition logo shown in image heading. */
  competitionLogo: string;
  /** Competition name shown in image heading. */
  competitionName: string;
  /** Competition season shown in image heading. */
  competitionSeason: string;
  /** Pre-computed deduction note labels and reasons for heading display. */
  deductionNotes: DeductionNote[];
  /** Pre-computed deduction markers keyed by team id. */
  deductionMarkers: Map<number, string>;
  /** Teams guaranteed to hit their current zone outcome. */
  zoneGuaranteedByTeamId?: Map<number, boolean>;
  /** Competition zones from config (promotion/relegation bands). */
  zones: ZoneDefinition[];
  /** Optionally render only the top or bottom half of standings content. */
  partial?: 'top' | 'bottom';
  /** Ref attached to the rendered capture node for image export. */
  captureRef: RefObject<HTMLDivElement | null>;
  /** Whether the capture root should be visually hidden off-screen. */
  isHidden?: boolean;
  /** Enable variant rules mode: adds Bonus column and shows point values in form badges. */
  variantRules?: VariantRulesMode;
}

const SITE_URL = 'kapowaz.github.io/football-predictor/';

export const StandingsImageView = ({
  standings,
  competitionLogo,
  competitionName,
  competitionSeason,
  deductionNotes,
  deductionMarkers,
  zoneGuaranteedByTeamId,
  zones,
  partial,
  captureRef,
  isHidden = true,
  variantRules = false,
}: StandingsImageViewProps) => {
  const showHeading = partial !== 'bottom';
  const showFooter = partial !== 'top';
  const headingExtraContent = (
    <div className={styles.headingExtraContent}>
      <span className={styles.competitionLabel}>
        <img
          src={competitionLogo}
          alt={`${competitionName} logo`}
          className={styles.competitionLogo}
        />
        <span>{`${competitionName} ${competitionSeason}`}</span>
      </span>
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
            zoneGuaranteedByTeamId={zoneGuaranteedByTeamId}
            zones={zones}
            partial={partial}
            disableVerticalScroll
            isRenderView
            variantRules={variantRules}
          />
          {showFooter && (
            <footer className={styles.footerContainer}>
              <div className={styles.footer}>
                <div>
                  Football Predictor by <span className={styles.footerBold}>kapowaz</span>. Make
                  your own prediction at <span className={styles.footerBold}>{SITE_URL}</span>
                </div>
                <span className={styles.footerIconContainer}>
                  <KBoltIcon size={32} className={styles.footerIcon} />
                </span>
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};
