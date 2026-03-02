import type { ButtonHTMLAttributes, ReactNode } from 'react';
import * as styles from './Button.css';

type ButtonVariant = 'danger' | 'success';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: ReactNode;
  variant: ButtonVariant;
}

export function Button({ children, variant, className, ...rest }: ButtonProps) {
  return (
    <button
      className={`${styles.variant[variant]}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {children}
    </button>
  );
}
