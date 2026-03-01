import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const dateGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const dateHeader = style({
  fontSize: '14px',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  paddingBottom: '8px',
  borderBottom: '1px solid #e5e7eb',
});

export const matchesList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const emptyState = style({
  textAlign: 'center',
  padding: '48px 24px',
  color: '#6b7280',
  fontSize: '14px',
});
