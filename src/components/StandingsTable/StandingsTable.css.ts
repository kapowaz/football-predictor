import { style } from '@vanilla-extract/css'

export const container = style({
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
})

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
})

export const thead = style({
  backgroundColor: '#f9fafb',
})

export const th = style({
  padding: '12px 8px',
  textAlign: 'left',
  fontWeight: 600,
  color: '#6b7280',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid #e5e7eb',
})

export const thCenter = style([
  th,
  {
    textAlign: 'center',
  },
])

export const thRight = style([
  th,
  {
    textAlign: 'right',
  },
])

export const tr = style({
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#f9fafb',
  },
})

export const td = style({
  padding: '12px 8px',
  borderBottom: '1px solid #f3f4f6',
  color: '#1f2937',
})

export const tdCenter = style([
  td,
  {
    textAlign: 'center',
  },
])

export const tdRight = style([
  td,
  {
    textAlign: 'right',
  },
])

export const position = style({
  fontWeight: 600,
  color: '#6b7280',
  width: '32px',
})

export const teamCell = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
})

export const crest = style({
  width: '24px',
  height: '24px',
  objectFit: 'contain',
})

export const teamName = style({
  fontWeight: 500,
})

export const points = style({
  fontWeight: 700,
  fontSize: '15px',
})

export const goalDiff = style({
  fontWeight: 500,
})

export const positive = style({
  color: '#16a34a',
})

export const negative = style({
  color: '#dc2626',
})
