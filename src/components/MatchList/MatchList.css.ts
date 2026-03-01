import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  overflow: 'auto',
  maxHeight: 'calc(100vh - 140px)',
});

export const dateGroup = style({
  display: 'flex',
  flexDirection: 'column',
});

export const dateHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: 'inherit',
  fontSize: '12px',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  cursor: 'pointer',
  userSelect: 'none',
  background: 'none',
  border: 'none',
  borderBottomStyle: 'solid',
  borderBottomWidth: '1px',
  borderBottomColor: '#e5e7eb',
  padding: '0 0 8px 0',
  width: '100%',
  textAlign: 'left',
});

export const chevron = style({
  width: '16px',
  height: '16px',
  flexShrink: 0,
  transition: 'transform 0.2s ease',
});

export const chevronExpanded = style({
  transform: 'rotate(90deg)',
});

export const matchesList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  paddingTop: '12px',
});

export const emptyState = style({
  textAlign: 'center',
  padding: '48px 24px',
  color: '#6b7280',
  fontSize: '14px',
});
