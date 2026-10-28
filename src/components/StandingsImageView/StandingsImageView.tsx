import { assignInlineVars } from '@vanilla-extract/dynamic';
import clsx from 'clsx';
import type { Ref, RefObject } from 'react';
import { AbstractText } from '@kapowaz/components';
import { getStandingsSplit, StandingsTable } from '@kapowaz/football';
import { Icon, KapBoltSimple } from '@kapowaz/icons';

import type { ZoneDefinition } from '../../data/competitions';
import type { DeductionNote } from '../../state/selectors';
import type { TeamStanding, VariantRulesMode } from '../../types';
import type { StandingsImageSize } from '../../utils/imageLayout';
import { AppHeading } from '../AppHeading';

import * as styles from './StandingsImageView.css';

export interface StandingsImageViewProps {
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
  /** Teams whose exact final league position is locked. */
  positionGuaranteedByTeamId?: Map<number, boolean>;
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
  /**
   * Fixed size for the captured image. Omit to render at the natural 820px
   * width and content height (as `StandingsImagePair` does while measuring).
   */
  size?: StandingsImageSize;
  /** Ref to the unsized content, for measuring its natural height. */
  contentRef?: Ref<HTMLDivElement>;
}

const SITE_URL = 'futmeg.com';

/** Table positions shown in a half, e.g. "1-10", read by scripts/render-og.ts. */
const getPositionRange = (
  teamCount: number,
  partial: StandingsImageViewProps['partial'],
): string => {
  const { top } = getStandingsSplit(teamCount);
  if (partial === 'top') return `1-${top}`;
  if (partial === 'bottom') return `${top + 1}-${teamCount}`;
  return `1-${teamCount}`;
};

export const StandingsImageView = ({
  standings,
  competitionLogo,
  competitionName,
  competitionSeason,
  deductionNotes,
  deductionMarkers,
  zoneGuaranteedByTeamId,
  positionGuaranteedByTeamId,
  zones,
  partial,
  captureRef,
  isHidden = true,
  variantRules = false,
  isRunIn,
  relegationStartPosition,
  thresholdByZoneType,
  size,
  contentRef,
}: StandingsImageViewProps) => {
  const showHeading = partial !== 'bottom';
  const showFooter = partial !== 'top';
  const positions = getPositionRange(standings.length, partial);
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
      style={
        size
          ? assignInlineVars({
              [styles.imageWidth]: `${size.width}px`,
              [styles.imageHeight]: `${size.height}px`,
            })
          : undefined
      }
      aria-hidden="true"
      data-image-half={partial}
      data-positions={positions}
      data-layout-ready={size ? 'true' : undefined}
    >
      <div ref={captureRef} className={styles.captureSurface}>
        <div
          ref={contentRef}
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
            positionGuaranteedByTeamId={positionGuaranteedByTeamId}
            zones={zones}
            partial={partial}
            isVerticalScrollDisabled
            isRenderView
            variantRules={variantRules}
            isRunIn={isRunIn}
            relegationStartPosition={relegationStartPosition}
            thresholdByZoneType={thresholdByZoneType}
            customTokens={styles.standingsTableTokensOverride}
          />
          {showFooter && (
            <footer className={styles.footerContainer}>
              <AbstractText
                tagName="div"
                className={styles.footer}
                fontSize="md"
              >
                <div>
                  Futmeg by{' '}
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
                  <Icon
                    component={KapBoltSimple}
                    size="xxxl"
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
