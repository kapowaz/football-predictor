import type { IconProps } from './types';

export const RoundedSquareBadgesIcon = ({ size = 16, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <path d="M7 11C7 10.4477 7.44772 10 8 10H10C10.5523 10 11 10.4477 11 11V13C11 13.5523 10.5523 14 10 14H8C7.44772 14 7 13.5523 7 13V11Z" />
    <path d="M1 11C1 10.4477 1.44772 10 2 10H4C4.55228 10 5 10.4477 5 11V13C5 13.5523 4.55228 14 4 14H2C1.44772 14 1 13.5523 1 13V11Z" />
    <path d="M13 11C13 10.4477 13.4477 10 14 10H16C16.5523 10 17 10.4477 17 11V13C17 13.5523 16.5523 14 16 14H14C13.4477 14 13 13.5523 13 13V11Z" />
    <path d="M19 11C19 10.4477 19.4477 10 20 10H22C22.5523 10 23 10.4477 23 11V13C23 13.5523 22.5523 14 22 14H20C19.4477 14 19 13.5523 19 13V11Z" />
  </svg>
);
