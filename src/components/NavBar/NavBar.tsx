import { useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import { AbstractText, Button, IconTextButton, TabBar, ToggleColorMode } from '@kapowaz/components';
import type { Tab } from '@kapowaz/components';
import { CompetitionSelect } from '@kapowaz/football';
import type { CompetitionOption } from '@kapowaz/football';
import { ArrowDownToDot, ImageDown, MenuSquare, Sparkles, Trash2, X } from '@kapowaz/icons';
import type { Competition } from '@kapowaz/football-badges';
import type { CompetitionConfig } from '../../data/competitions';
import { useNavigationLoading } from '../../hooks/useNavigationLoading';
import { AppHeading } from '../AppHeading';
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
  /** Resets all user predictions. Only rendered when provided. */
  onResetPredictionsClick?: () => void;
  /** Downloads the generated standings image. Only rendered when provided. */
  onSaveImageClick?: () => void;
  /** Whether the save image button should be disabled (e.g. image not ready). */
  isSaveImageDisabled?: boolean;
}

export const NavBar = ({
  competitions,
  activeSlug,
  onCompetitionChange,
  colorMode,
  onColorModeToggle,
  onDeductionsClick,
  onAIPredictionsClick,
  onResetPredictionsClick,
  onSaveImageClick,
  isSaveImageDisabled,
}: NavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [optimisticTabId, setOptimisticTabId] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState<string | null>(null);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { startNavigating } = useNavigationLoading();

  const competitionOptions: CompetitionOption[] = useMemo(
    () =>
      competitions.map((c) => ({
        slug: c.slug as Competition,
        name: c.name,
      })),
    [competitions],
  );

  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    if (prevPathname !== null) {
      setOptimisticTabId(null);
    }
  }

  const navItems = [
    { id: 'competition', label: 'Standings', href: `/${activeSlug}/` },
    { id: 'run-in', label: 'Run In', href: `/run-in/${activeSlug}/` },
    { id: 'relegation', label: 'Relegation', href: `/relegation/${activeSlug}/` },
  ];

  const tabs: Tab[] = navItems.map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
  }));

  const handleTabClick = (tabId: string) => {
    setOptimisticTabId(tabId);
  };

  const handleNavigate = (href: string) => {
    startNavigating(() => navigate(href));
  };

  const getActiveItemId = () => {
    const { pathname } = location;
    if (pathname.startsWith(`/run-in/${activeSlug}`)) return 'run-in';
    if (pathname.startsWith(`/relegation/${activeSlug}`)) return 'relegation';
    return 'competition';
  };

  const activeItemId = optimisticTabId ?? getActiveItemId();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.navBarWrapper}>
      <div className={styles.navBar}>
        <div className={styles.navBarHeader}>
          <AppHeading />
          <div className={styles.controls}>
            {competitions.length > 1 && (
              <div className={styles.competitionSelectWrapper}>
                <CompetitionSelect
                  competitions={competitionOptions}
                  value={activeSlug}
                  onChange={onCompetitionChange}
                />
              </div>
            )}
            <button
              className={styles.menuButton}
              aria-label="Open navigation menu"
              title="Navigation menu"
              onClick={() => setIsMenuOpen(true)}
            >
              <MenuSquare width={18} height={18} />
            </button>
            <div className={styles.desktopColorModeToggle}>
              <ToggleColorMode
                isDarkMode={colorMode === 'dark'}
                onChange={(dark) => onColorModeToggle(dark ? 'dark' : 'light')}
              />
            </div>
          </div>
        </div>
        <TabBar
          tabs={tabs}
          selectedId={activeItemId}
          onTabClick={handleTabClick}
          onNavigate={handleNavigate}
          className={styles.desktopTabBar}
          rightContent={
            onSaveImageClick ||
            onDeductionsClick ||
            onAIPredictionsClick ||
            onResetPredictionsClick ? (
              <div className={styles.desktopActions}>
                {onSaveImageClick && (
                  <IconTextButton
                    label="Download image"
                    onClick={onSaveImageClick}
                    isDisabled={isSaveImageDisabled}
                    icon={ImageDown}
                  >
                    Download
                  </IconTextButton>
                )}
                {onDeductionsClick && (
                  <IconTextButton
                    label="Edit points deductions"
                    onClick={onDeductionsClick}
                    icon={ArrowDownToDot}
                  >
                    Deductions
                  </IconTextButton>
                )}
                {onAIPredictionsClick && (
                  <IconTextButton
                    label="Generate AI Predictions"
                    onClick={onAIPredictionsClick}
                    icon={Sparkles}
                  >
                    Predictions
                  </IconTextButton>
                )}
                {onResetPredictionsClick && (
                  <IconTextButton
                    label="Reset Predictions"
                    onClick={onResetPredictionsClick}
                    variant="danger"
                    icon={Trash2}
                  >
                    Reset
                  </IconTextButton>
                )}
              </div>
            ) : undefined
          }
        />
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
                  <ToggleColorMode
                    isDarkMode={colorMode === 'dark'}
                    onChange={(dark) => onColorModeToggle(dark ? 'dark' : 'light')}
                  />
                  <button
                    className={styles.overlayCloseButton}
                    onClick={closeMenu}
                    aria-label="Close navigation menu"
                  >
                    <X width={18} height={18} />
                  </button>
                </div>
                <nav className={styles.overlayNavItems}>
                  {navItems.map((item) => (
                    <Link
                      to={item.href}
                      key={item.id}
                      onClick={closeMenu}
                      className={clsx(
                        styles.overlayNavItem,
                        activeItemId === item.id && styles.overlayNavItemActive,
                      )}
                    >
                      <AbstractText fontSize="lg" fontWeight="semibold">
                        {item.label}
                      </AbstractText>
                    </Link>
                  ))}
                </nav>
                {(onSaveImageClick ||
                  onDeductionsClick ||
                  onAIPredictionsClick ||
                  onResetPredictionsClick) && (
                  <div className={styles.overlayActions}>
                    {onSaveImageClick && (
                      <Button
                        type="primary"
                        onClick={() => {
                          pendingActionRef.current = onSaveImageClick;
                          closeMenu();
                        }}
                        isDisabled={isSaveImageDisabled}
                        icon={ImageDown}
                      >
                        Save Image
                      </Button>
                    )}
                    {onDeductionsClick && (
                      <Button
                        type="danger"
                        onClick={() => {
                          pendingActionRef.current = onDeductionsClick;
                          closeMenu();
                        }}
                        icon={ArrowDownToDot}
                      >
                        Deductions
                      </Button>
                    )}
                    {onAIPredictionsClick && (
                      <Button
                        type="primary"
                        onClick={() => {
                          pendingActionRef.current = onAIPredictionsClick;
                          closeMenu();
                        }}
                        icon={Sparkles}
                      >
                        AI Predictions
                      </Button>
                    )}
                    {onResetPredictionsClick && (
                      <Button
                        type="danger"
                        onClick={() => {
                          pendingActionRef.current = onResetPredictionsClick;
                          closeMenu();
                        }}
                        icon={Trash2}
                      >
                        Reset Predictions
                      </Button>
                    )}
                  </div>
                )}
                {competitions.length > 1 && (
                  <div className={styles.overlayCompetitionSelect}>
                    <CompetitionSelect
                      competitions={competitionOptions}
                      value={activeSlug}
                      menuPlacement="top"
                      onChange={(slug: string) => {
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
