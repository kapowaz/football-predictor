import clsx from 'clsx';
import type { ZoneDefinition, ZoneType } from '../../data/competitions';
import { getZoneForPosition } from '../../utils/zones';
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

export const StandingPosition = ({ position, zones }: StandingPositionProps) => {
  const zone = getZoneForPosition(position, zones);

  return (
    <div className={clsx(styles.positionBadge, zoneStyles[zone])} aria-label={`Position ${position}`}>
      {position}
    </div>
  );
};
