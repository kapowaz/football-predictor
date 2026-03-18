import type { ReactNode } from 'react';
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { CompetitionConfig } from '../../data/competitions';
import { AppHeading } from '../AppHeading';
import { Button } from '../Button';
import { CompetitionSelect } from '../CompetitionSelect';
import { ColorModeToggle } from '../ColorModeToggle';
import { ArrowDownFromDotIcon, MenuSquareIcon, SparklesIcon, XIcon } from '../icons';
import * as styles from './NavBar.css';

interface NavBarProps {
  /** All available competitions to show in the select dropdown. */
  competitions: CompetitionConfig[];
  /** Currently active competition slug. */
  activeSlug: string;
  /** Called when the user selects a different competition. */
  onCompetitionChange: (slug: string) => void;
  /** The current active color mode. */
  colorMode: 'light' | 'dark';
  /** Called with the next color mode when the user toggles it. */
  onColorModeToggle: (colorMode: 'light' | 'dark') => void;
  /** Opens the deductions modal. */
  onDeductionsClick?: () => void;
  /** Fills all remaining fixtures with AI model predictions. Only rendered when provided. */
  onAIPredictionsClick?: () => void;
  /** Additional action buttons rendered alongside the built-in actions. */
  actions?: ReactNode;
}

export const NavBar = ({
  competitions,
  activeSlug,
  onCompetitionChange,
  colorMode,
  onColorModeToggle,
  onDeductionsClick,
  onAIPredictionsClick,
  actions,
}: NavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const location = useLocation();

  const navItems = [
    { id: 'competition', label: 'Standings', href: `/${activeSlug}/` },
    { id: 'run-in', label: 'Run In', href: `/run-in/${activeSlug}/` },
    { id: 'relegation', label: 'Relegation', href: `/relegation/${activeSlug}/` },
  ];

  const getActiveItemId = () => {
    const { pathname } = location;
    if (pathname.startsWith(`/run-in/${activeSlug}`)) return 'run-in';
    if (pathname.startsWith(`/relegation/${activeSlug}`)) return 'relegation';
    return 'competition';
  };

  const activeItemId = getActiveItemId();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.navBar}>
      <AppHeading />
      <nav className={styles.navTabs}>
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className={`${styles.navTab} ${activeItemId === item.id ? styles.navTabActive : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className={styles.controls}>
        {competitions.length > 1 && (
          <div className={styles.competitionSelectWrapper}>
            <CompetitionSelect
              competitions={competitions}
              value={activeSlug}
              onChange={onCompetitionChange}
            />
          </div>
        )}
        {(actions || onDeductionsClick || onAIPredictionsClick) && (
          <div className={styles.desktopActions}>
            {actions}
            {onDeductionsClick && (
              <Button
                variant="danger"
                iconOnly
                compact
                aria-label="Deductions"
                onClick={onDeductionsClick}
              >
                <ArrowDownFromDotIcon size={16} />
              </Button>
            )}
            {onAIPredictionsClick && (
              <Button
                variant="success"
                iconOnly
                compact
                aria-label="AI Predictions"
                onClick={onAIPredictionsClick}
              >
                <SparklesIcon size={16} />
              </Button>
            )}
          </div>
        )}
        <button
          className={styles.menuButton}
          aria-label="Open navigation menu"
          title="Navigation menu"
          onClick={() => setIsMenuOpen(true)}
        >
          <MenuSquareIcon size={18} />
        </button>
        <div className={styles.desktopColorModeToggle}>
          <ColorModeToggle colorMode={colorMode} onColorModeToggle={onColorModeToggle} />
        </div>
      </div>
      {createPortal(
        <AnimatePresence
          onExitComplete={() => {
            if (pendingActionRef.current) {
              pendingActionRef.current();
              pendingActionRef.current = null;
            }
          }}
        >
          {isMenuOpen && (
            <>
              <motion.div
                className={styles.overlayBackdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeMenu}
              />
              <motion.div
                className={styles.overlayPanel}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                <div className={styles.overlayHeader}>
                  {actions}
                  {onDeductionsClick && (
                    <Button
                      variant="danger"
                      iconOnly
                      compact
                      aria-label="Deductions"
                      onClick={() => {
                        pendingActionRef.current = onDeductionsClick;
                        closeMenu();
                      }}
                    >
                      <ArrowDownFromDotIcon size={16} />
                    </Button>
                  )}
                  {onAIPredictionsClick && (
                    <Button
                      variant="success"
                      iconOnly
                      compact
                      aria-label="AI Predictions"
                      onClick={() => {
                        pendingActionRef.current = onAIPredictionsClick;
                        closeMenu();
                      }}
                    >
                      <SparklesIcon size={16} />
                    </Button>
                  )}
                  <ColorModeToggle colorMode={colorMode} onColorModeToggle={onColorModeToggle} />
                  <button
                    className={styles.overlayCloseButton}
                    onClick={closeMenu}
                    aria-label="Close navigation menu"
                  >
                    <XIcon size={18} />
                  </button>
                </div>
                <nav className={styles.overlayNavItems}>
                  {navItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.href}
                      className={`${styles.overlayNavItem} ${activeItemId === item.id ? styles.overlayNavItemActive : ''}`}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                {competitions.length > 1 && (
                  <div className={styles.overlayCompetitionSelect}>
                    <CompetitionSelect
                      competitions={competitions}
                      value={activeSlug}
                      menuPlacement="top"
                      onChange={(slug) => {
                        onCompetitionChange(slug);
                        closeMenu();
                      }}
                    />
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </header>
  );
};
