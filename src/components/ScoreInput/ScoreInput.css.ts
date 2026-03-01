import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

export const input = style({
  width: '48px',
  height: '40px',
  textAlign: 'center',
  fontSize: '18px',
  fontWeight: 600,
  border: '2px solid #e0e0e0',
  borderRadius: '8px',
  backgroundColor: '#fff',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  ':focus': {
    outline: 'none',
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
  },
  '::-webkit-inner-spin-button': {
    appearance: 'none',
  },
  '::-webkit-outer-spin-button': {
    appearance: 'none',
  },
})

export const separator = style({
  fontSize: '20px',
  fontWeight: 600,
  color: '#666',
})
