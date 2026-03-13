import type { ReactNode, RefObject } from 'react';
import type { CompetitionTabId } from '../../state/competitionSessionStore';
import { TabBar } from '../TabBar';
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
  return (
    <div ref={pageContentRef} className={styles.pageContent}>
      {header}
      <TabBar
        tabs={[
          { id: 'standings', label: standingsTabLabel },
          { id: 'fixtures', label: fixturesTabLabel },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) => onTabChange(tabId === 'fixtures' ? 'fixtures' : 'standings')}
      />
      <main className={styles.main}>
        <div className={`${styles.panel} ${activeTab !== 'standings' ? styles.hiddenOnMobile : ''}`}>
          {standingsPanel}
        </div>
        <div
          className={`${styles.panelGuttered} ${activeTab !== 'fixtures' ? styles.hiddenOnMobile : ''}`}
        >
          {fixturesPanel}
        </div>
      </main>
    </div>
  );
};
