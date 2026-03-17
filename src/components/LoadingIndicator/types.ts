/**
 * These values have been chosen to align with IconSize, so if we update those
 * named values this should probably update too.
 */
export type LoadingIndicatorSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

export const LOADING_INDICATOR_SIZES: Record<LoadingIndicatorSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 36,
  xxxl: 48,
};

export const LOADING_INDICATOR_STROKE_WIDTHS: Record<LoadingIndicatorSize, number> = {
  xs: 2,
  sm: 2,
  md: 2,
  lg: 2,
  xl: 3,
  xxl: 4,
  xxxl: 4,
};

export interface LoadingIndicatorProps {
  /** Size of the indicator in pixels */
  size?: LoadingIndicatorSize;

  /** Duration of one full rotation in milliseconds */
  duration?: number;

  /** Use inverted colors suitable for colored backgrounds */
  isInverted?: boolean;

  /** Custom stroke color override (CSS color value or variable) */
  customColor?: string;
}
