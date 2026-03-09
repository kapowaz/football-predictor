import { MoonIcon, SunIcon } from '../icons';
import * as styles from './ThemeToggle.css';

interface ThemeToggleProps {
  /** The current active theme */
  theme: 'light' | 'dark';
  /** Called when the user toggles the theme */
  onToggle: () => void;
}

export const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  const isLight = theme === 'light';
  const label = isLight ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <button
      className={styles.toggleButton}
      onClick={onToggle}
      aria-label={label}
      title={label}
    >
      {isLight ? <MoonIcon size={18} /> : <SunIcon size={18} />}
    </button>
  );
};
