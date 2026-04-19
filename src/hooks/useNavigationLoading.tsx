import { createContext, useContext } from 'react';

export interface NavigationLoadingContextValue {
  isNavigating: boolean;
  startNavigating: (fn: () => void) => void;
}

export const NavigationLoadingContext = createContext<NavigationLoadingContextValue>({
  isNavigating: false,
  startNavigating: (fn) => fn(),
});

export const useNavigationLoading = () => useContext(NavigationLoadingContext);
