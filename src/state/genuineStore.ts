import { create } from 'zustand';

import { features } from '../data/features';

const PARAM = 'genuine';

/** Initial state: `?genuine=true|false` if present, else the feature default. */
export const readGenuineFromUrl = (): boolean => {
  if (typeof window === 'undefined') return features.genuine;
  const value = new URLSearchParams(window.location.search).get(PARAM);
  if (value === 'true') return true;
  if (value === 'false') return false;
  return features.genuine;
};

/**
 * Writes `?genuine=<bool>` when the state differs from the feature default,
 * and removes it otherwise. Other query params are left as they are.
 * Called from `App` on every toggle and navigation.
 */
export const syncGenuineParam = (genuine: boolean): void => {
  const params = new URLSearchParams(window.location.search);
  const desired = genuine === features.genuine ? null : String(genuine);
  if (params.get(PARAM) === desired) return;

  if (desired === null) {
    params.delete(PARAM);
  } else {
    params.set(PARAM, desired);
  }
  const search = params.toString();
  const newUrl = `${window.location.pathname}${search ? `?${search}` : ''}`;
  window.history.replaceState(window.history.state, '', newUrl);
};

interface GenuineStoreState {
  genuine: boolean;
  setGenuine: (genuine: boolean) => void;
}

export const useGenuineStore = create<GenuineStoreState>((set) => ({
  genuine: readGenuineFromUrl(),
  setGenuine: (genuine) => set({ genuine }),
}));
