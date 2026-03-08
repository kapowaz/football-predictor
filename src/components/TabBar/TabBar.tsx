import * as styles from './TabBar.css';

interface Tab {
  id: string;
  label: string;
}

interface TabBarProps {
  /** Tab definitions with id and label */
  tabs: Tab[];
  /** Currently active tab id */
  activeTab: string;
  /** Called when a tab is selected */
  onTabChange: (tabId: string) => void;
}

export const TabBar = ({ tabs, activeTab, onTabChange }: TabBarProps) => {
  return (
    <nav className={styles.tabBar}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};
