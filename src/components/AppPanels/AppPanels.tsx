import type { ReactNode, RefObject } from 'react';
import clsx from 'clsx';
import { LoadingIndicator, TabBar } from '@kapowaz/components';
import type { CompetitionTabId } from '../../state/competitionSessionStore';
import { useNavigationLoading } from '../../hooks/useNavigationLoading';
import * as styles from './AppPanels.css';

interface AppPanelsProps {
  /** Optional header element rendered above the tab bar. */
  header?: ReactNode;
  /** Page wrapper ref used for page-level animations. */
  pageContentRef: RefObject<HTMLDivElement | null>;
  /** Currently active panel tab. */
  activeTab: CompetitionTabId;
  /** Called when the user switches tabs on mobile. */
  onTabChange: (tabId: CompetitionTabId) => void;
  /** Label for the standings tab. */
  standingsTabLabel: string;
  /** Label for the fixtures tab. */
  fixturesTabLabel: string;
  /** Standings panel content. */
  standingsPanel: ReactNode;
  /** Fixtures panel content. */
  fixturesPanel: ReactNode;
}

export const AppPanels = ({
  header,
  pageContentRef,
  activeTab,
  onTabChange,
  standingsTabLabel,
  fixturesTabLabel,
  standingsPanel,
  fixturesPanel,
}: AppPanelsProps) => {
  const { isNavigating } = useNavigationLoading();

  return (
    <div ref={pageContentRef} className={styles.pageContent}>
      {header}
      {isNavigating ? (
        <div className={styles.loadingArea}>
          <LoadingIndicator size="xl" />
        </div>
      ) : (
        <>
          <TabBar
            tabs={[
              { id: 'standings', label: standingsTabLabel },
              { id: 'fixtures', label: fixturesTabLabel },
            ]}
            selectedId={activeTab}
            onTabClick={(tabId) => onTabChange(tabId === 'fixtures' ? 'fixtures' : 'standings')}
            hasEqualWidth
            className={styles.mobileTabBar}
          />
          <main className={styles.main}>
            <div className={clsx(styles.panel, activeTab !== 'standings' && styles.hiddenOnMobile)}>
              {standingsPanel}
            </div>
            <div
              className={clsx(styles.panelGuttered, activeTab !== 'fixtures' && styles.hiddenOnMobile)}
            >
              {fixturesPanel}
            </div>
          </main>
        </>
      )}
    </div>
  );
};
