import { style, styleVariants } from '@vanilla-extract/css';
import {
  fontFamily,
  fontSizeXs,
  colorBgZoneLabelChampions,
  colorTextZoneLabelChampions,
  colorBgZoneLabelPromotion,
  colorTextZoneLabelPromotion,
  colorBgZoneLabelPlayoff,
  colorTextZoneLabelPlayoff,
  colorBgZoneLabelChampionsLeague,
  colorTextZoneLabelChampionsLeague,
  colorBgZoneLabelEuropaLeague,
  colorTextZoneLabelEuropaLeague,
  colorBgZoneLabelConferenceLeague,
  colorTextZoneLabelConferenceLeague,
  colorBgZoneLabelRelegation,
  colorTextZoneLabelRelegation,
} from '../../theme.css';
import type { ZoneType } from '../../data/competitions';

export const base = style({
  display: 'inline-block',
  fontFamily,
  fontSize: fontSizeXs,
  fontWeight: 400,
  lineHeight: '12px',
  textTransform: 'uppercase',
  padding: `2px 6px`,
  borderRadius: '999px',
  whiteSpace: 'nowrap',
});

export const label = style({
  fontWeight: 300,
});

export const threshold = style({
  fontWeight: 700,
});

const zoneColors: Record<ZoneType, { backgroundColor: string; color: string }> = {
  champions: { backgroundColor: colorBgZoneLabelChampions, color: colorTextZoneLabelChampions },
  promotion: { backgroundColor: colorBgZoneLabelPromotion, color: colorTextZoneLabelPromotion },
  playoff: { backgroundColor: colorBgZoneLabelPlayoff, color: colorTextZoneLabelPlayoff },
  championsLeague: {
    backgroundColor: colorBgZoneLabelChampionsLeague,
    color: colorTextZoneLabelChampionsLeague,
  },
  europaLeague: {
    backgroundColor: colorBgZoneLabelEuropaLeague,
    color: colorTextZoneLabelEuropaLeague,
  },
  conferenceLeague: {
    backgroundColor: colorBgZoneLabelConferenceLeague,
    color: colorTextZoneLabelConferenceLeague,
  },
  relegation: { backgroundColor: colorBgZoneLabelRelegation, color: colorTextZoneLabelRelegation },
};

export const variant = styleVariants(zoneColors);
