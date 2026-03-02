import { style, keyframes } from '@vanilla-extract/css';
import {
  colorBgSurface,
  colorTextHeading,
  colorTextPrimary,
  colorTextSecondary,
  colorSuccess,
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
});

export const modal = style({
  backgroundColor: colorBgSurface,
  borderRadius: radiusLg,
  boxShadow: `${shadowSm}, 0 20px 60px rgba(0, 0, 0, 0.3)`,
  padding: space8,
  maxWidth: '520px',
  width: '90vw',
  position: 'relative',
  outline: 'none',
  overflow: 'hidden',
});

export const backgroundCrest = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '80%',
  height: 'auto',
  transform: 'translate(-50%, -50%) rotate(-15deg)',
  opacity: 0.06,
  pointerEvents: 'none',
  userSelect: 'none',
  objectFit: 'contain',
});

export const championHeading = style({
  fontSize: fontSizeXxl,
  fontWeight: 700,
  color: colorTextHeading,
  textAlign: 'center',
  margin: `0 0 ${space6}`,
  lineHeight: 1.3,
});

export const championSubheading = style({
  fontSize: fontSizeLg,
  fontWeight: 700,
  color: colorTextHeading,
  textAlign: 'center',
  margin: `0 0 ${space6}`,
  lineHeight: 1.3,
});

const shimmer = keyframes({
  '0%': { backgroundPosition: '200% center' },
  '100%': { backgroundPosition: '-200% center' },
});

export const championName = style({
  background: 'linear-gradient(90deg, #d4af37, #f5d76e, #d4af37, #f5d76e, #d4af37)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${shimmer} 4s linear infinite`,
});

export const section = style({
  marginBottom: space4,
  selectors: {
    '&:last-child': {
      marginBottom: 0,
    },
  },
});

export const sectionLabel = style({
  fontSize: fontSizeSm,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: space2,
});

export const promotedLabel = style([sectionLabel, { color: colorSuccess }]);

export const playoffsLabel = style([sectionLabel, { color: colorFocus }]);

export const relegatedLabel = style([sectionLabel, { color: colorDanger }]);

export const teamList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space2,
});

export const teamRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: space3,
  fontFamily: fontFamily,
  fontSize: fontSizeBase,
  color: colorTextPrimary,
});

export const crest = style({
  width: '24px',
  height: '24px',
  objectFit: 'contain',
  flexShrink: 0,
});

export const teamName = style({
  fontWeight: 500,
});

export const closeButton = style({
  position: 'absolute',
  top: space4,
  right: space4,
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

export const divider = style({
  border: 'none',
  borderTop: `1px solid #e5e7eb`,
  margin: `${space4} 0`,
});
