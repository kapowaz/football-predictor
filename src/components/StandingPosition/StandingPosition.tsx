import clsx from 'clsx';
import type { CSSProperties } from 'react';
import type { ZoneDefinition, ZoneType } from '../../data/competitions';
import { getZoneForPosition, getDefaultZoneWeight } from '../../utils/zones';
import * as styles from './StandingPosition.css';

interface StandingPositionProps {
  /** Table position to display in the badge. */
  position: number;
  /** Competition zones used to style the badge for the given position. */
  zones: ZoneDefinition[];
}

const zoneStyles: Record<ZoneType | 'default', string> = {
  champions: styles.zoneChampions,
  promotion: styles.zonePromotion,
  playoff: styles.zonePlayoff,
  championsLeague: styles.zoneChampionsLeague,
  europaLeague: styles.zoneEuropaLeague,
  conferenceLeague: styles.zoneConferenceLeague,
  relegation: styles.zoneRelegation,
  default: styles.zoneDefault,
};

/** Extract the raw `--custom-property` name from Vanilla Extract's `var(--…)` wrapper. */
const defaultPositionWeightProperty = styles.defaultPositionWeight.slice(4, -1);

export const StandingPosition = ({ position, zones }: StandingPositionProps) => {
  const zone = getZoneForPosition(position, zones);

  const inlineStyle: CSSProperties | undefined =
    zone === 'default'
      ? ({ [defaultPositionWeightProperty]: `${getDefaultZoneWeight(position, zones)}%` } as CSSProperties)
      : undefined;

  return (
    <div
      className={clsx(styles.positionBadge, zoneStyles[zone])}
      style={inlineStyle}
      aria-label={`Position ${position}`}
    >
      {position}
    </div>
  );
};
