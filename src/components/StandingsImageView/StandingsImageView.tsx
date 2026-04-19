import clsx from 'clsx';
import type { RefObject } from 'react';
import { AbstractText } from '@kapowaz/components';
import { StandingsTable } from '@kapowaz/football';
import { KapBoltSimple } from '@kapowaz/icons';

import type { ZoneDefinition } from '../../data/competitions';
import type { DeductionNote } from '../../state/selectors';
import type { TeamStanding, VariantRulesMode } from '../../types';
import { AppHeading } from '../AppHeading';

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
  /** Draw dashed zone separators for the run-in phase. */
  isRunIn?: boolean;
  /** First league position in the relegation zone. */
  relegationStartPosition?: number;
  /** Lookup of zone type to threshold points for boundary labels. */
  thresholdByZoneType?: Map<string, number>;
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
  isRunIn,
  relegationStartPosition,
  thresholdByZoneType,
}: StandingsImageViewProps) => {
  const showHeading = partial !== 'bottom';
  const showFooter = partial !== 'top';
  const headingExtraContent = (
    <div className={styles.headingExtraContent}>
      <AbstractText
        tagName="span"
        className={styles.competitionLabel}
        fontSize="lg"
        fontWeight="semibold"
      >
        <img
          src={competitionLogo}
          alt={`${competitionName} logo`}
          className={styles.competitionLogo}
        />
        <span>{`${competitionName} ${competitionSeason}`}</span>
      </AbstractText>
      {deductionNotes.length > 0 && (
        <AbstractText
          tagName="div"
          className={styles.deductionNotes}
          fontSize="sm"
        >
          {deductionNotes.map((note) => (
            <span
              key={note.label}
              className={styles.deductionNote}
              title={note.reason || undefined}
            >
              {note.label}
            </span>
          ))}
        </AbstractText>
      )}
    </div>
  );

  return (
    <div
      className={clsx(
        styles.outerWrapper,
        isHidden ? styles.hiddenCaptureRoot : undefined,
      )}
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
          {showHeading && (
            <AppHeading isFullRender extraContent={headingExtraContent} />
          )}
          <StandingsTable
            standings={standings}
            deductionMarkers={deductionMarkers}
            zoneGuaranteedByTeamId={zoneGuaranteedByTeamId}
            zones={zones}
            partial={partial}
            isVerticalScrollDisabled
            isRenderView
            variantRules={variantRules}
            isRunIn={isRunIn}
            relegationStartPosition={relegationStartPosition}
            thresholdByZoneType={thresholdByZoneType}
          />
          {showFooter && (
            <footer className={styles.footerContainer}>
              <AbstractText
                tagName="div"
                className={styles.footer}
                fontSize="md"
              >
                <div>
                  Football Predictor by{' '}
                  <AbstractText
                    tagName="span"
                    className={styles.footerBold}
                    fontSize="md"
                    fontWeight="medium"
                  >
                    kapowaz
                  </AbstractText>
                  . Make your own prediction at{' '}
                  <AbstractText
                    tagName="span"
                    className={styles.footerBold}
                    fontSize="md"
                    fontWeight="medium"
                  >
                    {SITE_URL}
                  </AbstractText>
                </div>
                <span className={styles.footerIconContainer}>
                  <KapBoltSimple
                    width={32}
                    height={32}
                    className={styles.footerIcon}
                  />
                </span>
              </AbstractText>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};
