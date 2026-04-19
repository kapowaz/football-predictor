import { useTransition, type ReactNode } from 'react';

import { NavigationLoadingContext } from './useNavigationLoading';

export const NavigationLoadingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isPending, startTransition] = useTransition();

  const startNavigating = (fn: () => void) => {
    startTransition(fn);
  };

  return (
    <NavigationLoadingContext.Provider
      value={{ isNavigating: isPending, startNavigating }}
    >
      {children}
    </NavigationLoadingContext.Provider>
  );
};
