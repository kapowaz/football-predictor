import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { migrateStorage } from './utils/storage';
import { LoadingIndicator } from '@kapowaz/components';
import { NavigationLoadingProvider } from './hooks/NavigationLoadingProvider';
import * as styles from './App.css';

const App = () => {
  useEffect(() => {
    migrateStorage();
  }, []);

  return (
    <NavigationLoadingProvider>
      <div className={styles.app}>
        <Suspense
          fallback={
            <div className={styles.routeFallback}>
              <LoadingIndicator size="xl" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </NavigationLoadingProvider>
  );
};

export default App;
