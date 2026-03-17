interface SparklineIconProps {
  size?: number;
  className?: string;
}

export const SparklineIcon = ({ size = 16, className }: SparklineIconProps) => (
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
    <path d="M2 14L7 13L12 16L17 9L22 10" />
  </svg>
);
