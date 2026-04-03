import type { ZoneType } from '../../data/competitions';

export interface ZoneThresholdLabelProps {
  /** Zone type controlling the label's color scheme */
  zone: ZoneType;
  /** Descriptive label for the zone boundary (e.g. "Promotion", "Relegation") */
  label: string;
  /** Minimum points needed to finish inside (or safe from) the zone */
  threshold: number;
}

export const zoneLabels: Record<ZoneType, string> = {
  champions: 'Champions',
  promotion: 'Promotion',
  playoff: 'Playoffs',
  championsLeague: 'Champions League',
  europaLeague: 'Europa League',
  conferenceLeague: 'Conference League',
  relegation: 'Safety',
};
