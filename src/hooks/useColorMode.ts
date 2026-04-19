import { useState, useEffect, useCallback } from 'react';

type ColorMode = 'light' | 'dark';

const STORAGE_KEY = 'theme';

const getSystemColorMode = (): ColorMode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getStoredColorMode = (): ColorMode | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : null;
};

const applyColorMode = (colorMode: ColorMode) => {
  document.documentElement.setAttribute('data-color-mode', colorMode);
};

export const useColorMode = () => {
  const [colorMode, setColorMode] = useState<ColorMode>(() => getStoredColorMode() ?? getSystemColorMode());

  useEffect(() => {
    applyColorMode(colorMode);
  }, [colorMode]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (!getStoredColorMode()) {
        const next = getSystemColorMode();
        setColorMode(next);
      }
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const toggleColorMode = useCallback((nextColorMode?: ColorMode) => {
    if (nextColorMode) {
      localStorage.setItem(STORAGE_KEY, nextColorMode);
      setColorMode(nextColorMode);
      return;
    }

    setColorMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { colorMode, toggleColorMode } as const;
};
