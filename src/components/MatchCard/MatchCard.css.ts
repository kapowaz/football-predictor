import { style } from '@vanilla-extract/css';

export const card = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: '16px',
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  gap: '16px',
});

export const team = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flex: 1,
});

export const homeTeam = style([
  team,
  {
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
]);

export const awayTeam = style([
  team,
  {
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
]);

export const crest = style({
  width: '32px',
  height: '32px',
  objectFit: 'contain',
});

export const teamName = style({
  fontSize: '14px',
  fontWeight: 500,
  color: '#1f2937',
});

export const kickoff = style({
  fontSize: '12px',
  color: '#6b7280',
  marginTop: '2px',
});

export const scoreSection = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: '120px',
});
