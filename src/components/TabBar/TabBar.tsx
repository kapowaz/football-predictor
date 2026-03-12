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
  /** Force tab bar to be visible at all breakpoints. */
  alwaysVisible?: boolean;
}

export const TabBar = ({ tabs, activeTab, onTabChange, alwaysVisible = false }: TabBarProps) => {
  const tabBarClassName = alwaysVisible
    ? `${styles.tabBar} ${styles.tabBarAlwaysVisible}`
    : styles.tabBar;

  return (
    <nav className={tabBarClassName}>
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
