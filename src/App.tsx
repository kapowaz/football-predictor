import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ColorModeProvider, LoadingIndicator } from '@kapowaz/components';

import { NavigationLoadingProvider } from './hooks/NavigationLoadingProvider';
import { syncGenuineParam, useGenuineStore } from './state/genuineStore';
import { migrateStorage } from './utils/storage';

import * as styles from './App.css';

const App = () => {
  useEffect(() => {
    migrateStorage();
  }, []);

  // In-app links drop the query string; restore `?genuine=` after each navigation.
  const { pathname } = useLocation();
  const genuine = useGenuineStore((state) => state.genuine);
  useEffect(() => {
    syncGenuineParam(genuine);
  }, [pathname, genuine]);

  return (
    <ColorModeProvider>
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
    </ColorModeProvider>
  );
};

export default App;
