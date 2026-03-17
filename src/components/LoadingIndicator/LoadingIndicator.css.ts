import { style, keyframes, styleVariants, createVar } from '@vanilla-extract/css';
import {
  colorLoadingBg,
  colorLoadingProgress,
  colorLoadingInvertedBg,
  colorLoadingInvertedProgress,
} from '../../theme.css';

export const animationDuration = createVar();

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

export const container = style({
  display: 'inline-block',
});

export const svg = style({
  display: 'block',
  animation: `${spin} ${animationDuration} linear infinite`,
});

const backgroundCircleBase = style({
  fill: 'none',
});

export const backgroundCircle = styleVariants({
  default: [backgroundCircleBase, { stroke: colorLoadingBg }],
  inverted: [backgroundCircleBase, { opacity: 0.2, stroke: colorLoadingInvertedBg }],
});

const progressCircleBase = style({
  fill: 'none',
  strokeLinecap: 'round',
});

export const progressCircle = styleVariants({
  default: [progressCircleBase, { stroke: colorLoadingProgress }],
  inverted: [progressCircleBase, { stroke: colorLoadingInvertedProgress }],
});
