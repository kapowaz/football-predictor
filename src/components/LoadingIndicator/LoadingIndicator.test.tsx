import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingIndicator } from './LoadingIndicator';
import { LOADING_INDICATOR_SIZES, LOADING_INDICATOR_STROKE_WIDTHS } from './types';

describe('LoadingIndicator', () => {
  it('renders an SVG element', () => {
    const { container } = render(<LoadingIndicator />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders two circle elements', () => {
    const { container } = render(<LoadingIndicator />);
    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(2);
  });

  it('applies named size', () => {
    const { container } = render(<LoadingIndicator size="xxl" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '36');
    expect(svg).toHaveAttribute('height', '36');
  });

  it('sets strokeDasharray for 270-degree arc on background circle', () => {
    const sizeKey = 'md';
    const size = LOADING_INDICATOR_SIZES[sizeKey];
    const strokeWidth = LOADING_INDICATOR_STROKE_WIDTHS[sizeKey];
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const backgroundArcLength = (circumference * 3) / 4;

    const { container } = render(<LoadingIndicator size={sizeKey} />);
    const circles = container.querySelectorAll('circle');
    const backgroundCircle = circles[0];

    expect(backgroundCircle).toHaveAttribute('stroke-dasharray', `${backgroundArcLength} ${circumference}`);
  });

  it('sets strokeDasharray for 90-degree arc on progress circle', () => {
    const sizeKey = 'md';
    const size = LOADING_INDICATOR_SIZES[sizeKey];
    const strokeWidth = LOADING_INDICATOR_STROKE_WIDTHS[sizeKey];
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progressArcLength = circumference / 4;

    const { container } = render(<LoadingIndicator size={sizeKey} />);
    const circles = container.querySelectorAll('circle');
    const progressCircle = circles[1];

    expect(progressCircle).toHaveAttribute('stroke-dasharray', `${progressArcLength} ${circumference}`);
  });

  it('applies 270-degree rotation transform to progress circle', () => {
    const sizeKey = 'md';
    const size = LOADING_INDICATOR_SIZES[sizeKey];
    const { container } = render(<LoadingIndicator size={sizeKey} />);
    const circles = container.querySelectorAll('circle');
    const progressCircle = circles[1];

    expect(progressCircle).toHaveAttribute('transform', `rotate(270 ${size / 2} ${size / 2})`);
  });
});
