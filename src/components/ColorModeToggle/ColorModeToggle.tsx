import { MoonIcon, SunIcon } from '../icons';
import * as styles from './ColorModeToggle.css';

interface ColorModeToggleProps {
  /** The current active color mode */
  colorMode: 'light' | 'dark';
  /** Called with the next color mode whenever the toggle is activated */
  onColorModeToggle: (colorMode: 'light' | 'dark') => void;
}

export const ColorModeToggle = ({ colorMode, onColorModeToggle }: ColorModeToggleProps) => {
  const isLight = colorMode === 'light';
  const label = isLight ? 'Switch to dark mode' : 'Switch to light mode';
  const nextColorMode = isLight ? 'dark' : 'light';

  const handleColorModeToggle = () => {
    onColorModeToggle(nextColorMode);
  };

  return (
    <button
      className={styles.toggleButton}
      onClick={handleColorModeToggle}
      aria-label={label}
      title={label}
    >
      {isLight ? <MoonIcon size={18} /> : <SunIcon size={18} />}
    </button>
  );
};
