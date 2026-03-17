import type { ButtonHTMLAttributes, ReactNode } from 'react';
import * as styles from './Button.css';

type ButtonVariant = 'danger' | 'success';

interface ButtonBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant: ButtonVariant;
  compact?: boolean;
}

interface ButtonWithLabelProps extends ButtonBaseProps {
  iconOnly?: false;
  children: ReactNode;
}

interface ButtonIconOnlyProps extends ButtonBaseProps {
  iconOnly: true;
  'aria-label': string;
  children: ReactNode;
}

type ButtonProps = ButtonWithLabelProps | ButtonIconOnlyProps;

export const Button = ({ children, variant, compact: isCompact, iconOnly: isIconOnly, className, ...rest }: ButtonProps) => {
  const classNames = [
    styles.variant[variant],
    isIconOnly && !isCompact ? styles.iconOnly : null,
    isCompact ? styles.compact : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} {...rest}>
      {children}
    </button>
  );
};
