interface TrendingDownIconProps {
  size?: number;
  className?: string;
}

export const TrendingDownIcon = ({ size = 16, className }: TrendingDownIconProps) => (
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
    <path d="M16 17h6v-6" />
    <path d="m22 17-8.5-8.5-5 5L2 7" />
  </svg>
);
