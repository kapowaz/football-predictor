import { afterEach, describe, expect, it } from 'vitest';

import { features } from '../data/features';
import { readGenuineFromUrl, syncGenuineParam } from './genuineStore';

const setUrl = (url: string) => window.history.replaceState(null, '', url);

describe('genuineStore', () => {
  afterEach(() => setUrl('/'));

  describe('readGenuineFromUrl', () => {
    it('reads ?genuine=false and ?genuine=true', () => {
      setUrl('/premier-league/?genuine=false');
      expect(readGenuineFromUrl()).toBe(false);
      setUrl('/premier-league/?genuine=true');
      expect(readGenuineFromUrl()).toBe(true);
    });

    it('falls back to the feature default when absent or invalid', () => {
      setUrl('/premier-league/');
      expect(readGenuineFromUrl()).toBe(features.genuine);
      setUrl('/premier-league/?genuine=nope');
      expect(readGenuineFromUrl()).toBe(features.genuine);
    });
  });

  describe('syncGenuineParam', () => {
    it('writes the non-default state and keeps other params', () => {
      setUrl('/premier-league/?predictions=abc');
      syncGenuineParam(!features.genuine);
      const params = new URLSearchParams(window.location.search);
      expect(params.get('genuine')).toBe(String(!features.genuine));
      expect(params.get('predictions')).toBe('abc');
    });

    it('removes the param for the default state', () => {
      setUrl(`/premier-league/?genuine=${!features.genuine}&deductions=1`);
      syncGenuineParam(features.genuine);
      expect(window.location.search).toBe('?deductions=1');
    });

    it('keeps history.state for the router', () => {
      window.history.replaceState({ key: 'abc' }, '', '/premier-league/');
      syncGenuineParam(!features.genuine);
      expect(window.history.state).toEqual({ key: 'abc' });
    });
  });
});
