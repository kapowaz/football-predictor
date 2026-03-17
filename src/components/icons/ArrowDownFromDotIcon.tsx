import type { IconProps } from './types';

export const ArrowDownFromDotIcon = ({ size = 16, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M19 15L12 22M12 22L5 15M12 22L12 8M11 3C11 2.44771 11.4477 2 12 2C12.5523 2 13 2.44771 13 3C13 3.55228 12.5523 4 12 4C11.4477 4 11 3.55228 11 3Z" />
  </svg>
);
