import { style, globalStyle } from '@vanilla-extract/css';

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});

globalStyle('body', {
  margin: 0,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  backgroundColor: '#f3f4f6',
  color: '#1f2937',
  lineHeight: 1.5,
});

export const app = style({
  minHeight: '100vh',
  padding: '24px',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  maxWidth: '1400px',
  margin: '0 auto 32px',
});

export const logo = style({
  height: '36px',
  width: 'auto',
});

export const title = style({
  fontSize: '28px',
  fontWeight: 700,
  color: '#111827',
  margin: 0,
});

export const main = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '32px',
  maxWidth: '1400px',
  margin: '0 auto',
  '@media': {
    'screen and (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const panelHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const panelTitle = style({
  fontSize: '18px',
  fontWeight: 600,
  color: '#111827',
  margin: 0,
});

export const resetButton = style({
  padding: '8px 16px',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  color: '#dc2626',
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '3px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#fee2e2',
  },
});
