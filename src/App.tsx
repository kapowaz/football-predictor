import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { migrateStorage } from './utils/storage';
import * as styles from './App.css';

const App = () => {
  useEffect(() => {
    migrateStorage();
  }, []);

  return (
    <div className={styles.app}>
      <Outlet />
    </div>
  );
};

export default App;
