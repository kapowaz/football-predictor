import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ColorModeProvider, LoadingIndicator } from '@kapowaz/components';

import { NavigationLoadingProvider } from './hooks/NavigationLoadingProvider';
import { syncGenuineParam, useGenuineStore } from './state/genuineStore';

import * as styles from './App.css';

const App = () => {
  // Writes `?genuine=` on toggle, and restores it after each navigation
  // (in-app links drop the query string, even to the same path).
  const { key: locationKey } = useLocation();
  const genuine = useGenuineStore((state) => state.genuine);
  useEffect(() => {
    syncGenuineParam(genuine);
  }, [locationKey, genuine]);

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
