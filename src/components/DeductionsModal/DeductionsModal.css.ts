import { style } from '@vanilla-extract/css';
import {
  colorBgSurface,
  colorBgSurfaceHover,
  colorBorder,
  colorBorderInput,
  colorTextHeading,
  colorTextPrimary,
  colorTextSecondary,
  colorDanger,
  colorFocus,
  fontFamily,
  fontSizeXxl,
  fontSizeLg,
  fontSizeBase,
  fontSizeSm,
  space2,
  space3,
  space4,
  space6,
  space8,
  radiusSm,
  radiusMd,
  radiusLg,
  shadowSm,
} from '../../theme.css';


export const container = style({
  position: 'relative',
  zIndex: 1,
});

export const overlay = style({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `0 ${space6}`,
    },
    'screen and (max-width: 550px)': {
      padding: `0 ${space3}`,
    },
  },
});

export const modal = style({
  backgroundColor: colorBgSurface,
  borderRadius: radiusLg,
  boxShadow: `${shadowSm}, 0 20px 60px rgba(0, 0, 0, 0.3)`,
  padding: space8,
  maxWidth: '560px',
  width: '90vw',
  maxHeight: '85vh',
  overflowY: 'auto',
  position: 'relative',
  outline: 'none',
  '@media': {
    'screen and (max-width: 680px)': {
      width: '100%',
      maxWidth: 'none',
    },
    'screen and (max-width: 550px)': {
      padding: `${space4} ${space3}`,
    },
  },
});

export const title = style({
  fontSize: fontSizeXxl,
  fontWeight: 700,
  color: colorTextHeading,
  margin: 0,
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: space6,
});

export const closeButton = style({
  background: 'none',
  border: 'none',
  fontSize: fontSizeLg,
  color: colorTextSecondary,
  cursor: 'pointer',
  padding: space2,
  lineHeight: 1,
  borderRadius: radiusLg,
  transition: 'color 0.2s',
  ':hover': {
    color: colorTextHeading,
  },
});

export const sectionLabel = style({
  fontSize: fontSizeSm,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: colorTextSecondary,
  marginBottom: space3,
});

export const deductionList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space3,
});

export const deductionRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space2,
  padding: space3,
  backgroundColor: colorBgSurfaceHover,
  borderRadius: radiusMd,
});

export const deductionRowTop = style({
  display: 'flex',
  alignItems: 'center',
  gap: space3,
});

export const deductionActions = style({
  display: 'flex',
  alignItems: 'center',
});

export const crest = style({
  width: '24px',
  height: '24px',
  objectFit: 'contain',
  flexShrink: 0,
});

export const teamName = style({
  fontWeight: 500,
  fontSize: fontSizeBase,
  color: colorTextPrimary,
  flex: 1,
  minWidth: 0,
});

export const amountInput = style({
  width: '36px',
  height: '36px',
  padding: `${space2} ${space2}`,
  fontFamily: fontFamily,
  fontSize: fontSizeBase,
  fontWeight: 600,
  textAlign: 'center',
  color: colorDanger,
  backgroundColor: colorBgSurface,
  border: `1px solid ${colorBorderInput}`,
  borderRadius: radiusSm,
  outline: 'none',
  fontVariantNumeric: 'tabular-nums',
  ':focus': {
    borderColor: colorFocus,
    boxShadow: `0 0 0 2px rgba(59, 130, 246, 0.2)`,
  },
});

export const deductionReasonText = style({
  fontSize: fontSizeSm,
  color: colorTextSecondary,
  lineHeight: 1.4,
});

export const deleteButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  color: colorTextSecondary,
  cursor: 'pointer',
  padding: space2,
  lineHeight: 1,
  borderRadius: radiusMd,
  flexShrink: 0,
  transition: 'color 0.2s',
  ':hover': {
    color: colorDanger,
  },
});

export const divider = style({
  border: 'none',
  borderTop: `1px solid ${colorBorder}`,
  margin: `${space6} 0`,
});

export const addFormRow = style({
  display: 'flex',
  gap: space3,
  alignItems: 'center',
});

export const teamSelectWrapper = style({
  flex: 1,
  minWidth: 0,
});

export const footer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: space6,
});

export const emptyState = style({
  fontSize: fontSizeBase,
  color: colorTextSecondary,
  fontStyle: 'italic',
  padding: `${space3} 0`,
});
