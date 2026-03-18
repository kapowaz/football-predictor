import { style } from '@vanilla-extract/css';
import {
  colorTextHeading,
  colorTextMuted,
  colorTextSecondary,
  fontFamilyDisplay,
  fontSizeSm,
  fontSizeXs,
  fontSizeXl,
  fontSizeXxl,
  maxWidthContent,
  space1,
  space2,
  space3,
  space4,
  space6,
} from './theme.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxWidth: maxWidthContent,
  width: '100%',
  margin: '0 auto',
  gap: space4,
  overflow: 'hidden',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  gap: space3,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `${space3} ${space4}`,
    },
  },
});

export const headerLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: space3,
});

export const title = style({
  fontFamily: fontFamilyDisplay,
  fontSize: fontSizeXl,
  fontWeight: 700,
  color: colorTextHeading,
  margin: 0,
  '@media': {
    'screen and (min-width: 680px)': {
      fontSize: fontSizeXxl,
    },
  },
});

export const descriptionBlock = style({
  flexShrink: 0,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `0 ${space4}`,
    },
  },
});

export const description = style({
  color: colorTextSecondary,
  fontSize: fontSizeSm,
  lineHeight: 1.6,
  margin: 0,
});

export const componentList = style({
  color: colorTextSecondary,
  fontSize: fontSizeSm,
  lineHeight: 1.6,
  margin: `${space2} 0 0`,
  paddingLeft: space4,
  display: 'flex',
  flexDirection: 'column',
  gap: space1,
});

export const formula = style({
  display: 'block',
  fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace',
  fontSize: fontSizeXs,
  color: colorTextMuted,
  marginTop: space1,
});

export const tableWrapper = style({
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `0 ${space4} ${space6}`,
    },
  },
});
