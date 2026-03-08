interface ChevronRightIconProps {
  size?: number;
  className?: string;
}

export const ChevronRightIcon = ({
  size = 16,
  className,
}: ChevronRightIconProps) => (
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
    <path d="m9 18 6-6-6-6" />
  </svg>
);
