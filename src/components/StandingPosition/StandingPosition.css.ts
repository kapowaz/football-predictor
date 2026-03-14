import { createVar, style } from '@vanilla-extract/css';
import {
  colorBgStandingPositionDefaultUpper,
  colorTextStandingPositionDefaultUpper,
  colorBgStandingPositionDefaultLower,
  colorTextStandingPositionDefaultLower,
  colorBgStandingPositionPromotion,
  colorTextStandingPositionPromotion,
  colorBgStandingPositionPlayoff,
  colorTextStandingPositionPlayoff,
  colorBgStandingPositionRelegation,
  colorTextStandingPositionRelegation,
  colorBgStandingPositionChampions,
  colorTextStandingPositionChampions,
  colorBgStandingPositionChampionsLeague,
  colorTextStandingPositionChampionsLeague,
  colorBgStandingPositionEuropaLeague,
  colorTextStandingPositionEuropaLeague,
  colorBgStandingPositionConferenceLeague,
  colorTextStandingPositionConferenceLeague,
  fontFamilyMono,
  fontSizeSm,
  radiusMd,
} from '../../theme.css';

export const defaultPositionWeight = createVar();

export const positionBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
  borderRadius: radiusMd,
  fontFamily: fontFamilyMono,
  fontSize: fontSizeSm,
  fontWeight: 600,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
  flexShrink: 0,
});

export const zoneDefault = style({
  vars: {
    [defaultPositionWeight]: '0%',
  },
  backgroundColor: `color-mix(in oklch, ${colorBgStandingPositionDefaultUpper}, ${colorBgStandingPositionDefaultLower} ${defaultPositionWeight})`,
  color: `color-mix(in oklch, ${colorTextStandingPositionDefaultUpper}, ${colorTextStandingPositionDefaultLower} ${defaultPositionWeight})`,
});

export const zonePromotion = style({
  backgroundColor: colorBgStandingPositionPromotion,
  color: colorTextStandingPositionPromotion,
});

export const zonePlayoff = style({
  backgroundColor: colorBgStandingPositionPlayoff,
  color: colorTextStandingPositionPlayoff,
});

export const zoneRelegation = style({
  backgroundColor: colorBgStandingPositionRelegation,
  color: colorTextStandingPositionRelegation,
});

export const zoneChampions = style({
  backgroundColor: colorBgStandingPositionChampions,
  color: colorTextStandingPositionChampions,
});

export const zoneChampionsLeague = style({
  backgroundColor: colorBgStandingPositionChampionsLeague,
  color: colorTextStandingPositionChampionsLeague,
});

export const zoneEuropaLeague = style({
  backgroundColor: colorBgStandingPositionEuropaLeague,
  color: colorTextStandingPositionEuropaLeague,
});

export const zoneConferenceLeague = style({
  backgroundColor: colorBgStandingPositionConferenceLeague,
  color: colorTextStandingPositionConferenceLeague,
});
