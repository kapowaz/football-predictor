import { useState, useCallback, useEffect, useRef } from 'react';
import type { PointDeduction } from '../types';
import { loadDeductions, saveDeductions, clearDeductions } from '../utils/storage';
import { encodeDeductions, decodeDeductions } from '../utils/serialization';

const buildUrl = (params: URLSearchParams): string => {
  const search = params.toString();
  return window.location.pathname + (search ? `?${search}` : '');
};

const loadInitialDeductions = (
  slug: string,
  defaults: PointDeduction[],
): {
  deductions: PointDeduction[];
  isCustomised: boolean;
} => {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('deductions');

  if (encoded !== null) {
    try {
      return { deductions: decodeDeductions(encoded, defaults), isCustomised: true };
    } catch (e) {
      console.error('Failed to decode deductions from URL:', e);
    }
  }

  const stored = loadDeductions(slug);
  if (stored !== null) {
    return { deductions: stored, isCustomised: true };
  }

  return { deductions: defaults, isCustomised: false };
};

export const useDeductions = (slug: string, defaults: PointDeduction[]) => {
  const [initial] = useState(() => loadInitialDeductions(slug, defaults));
  const [deductions, setDeductions] = useState<PointDeduction[]>(initial.deductions);
  const [isCustomised, setIsCustomised] = useState(initial.isCustomised);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isCustomised) {
      saveDeductions(slug, deductions);
    }

    const params = new URLSearchParams(window.location.search);

    if (isCustomised) {
      params.set('deductions', encodeDeductions(deductions));
    } else {
      params.delete('deductions');
    }

    const url = buildUrl(params);
    if (isInitialRender.current) {
      window.history.replaceState(null, '', url);
      isInitialRender.current = false;
    } else {
      window.history.pushState(null, '', url);
    }
  }, [deductions, isCustomised, slug]);

  const updateDeduction = useCallback((teamId: number, amount: number) => {
    setIsCustomised(true);
    setDeductions((prev) =>
      prev.map((d) => (d.teamId === teamId ? { ...d, amount } : d)),
    );
  }, []);

  const addDeduction = useCallback((teamId: number, amount: number) => {
    setIsCustomised(true);
    setDeductions((prev) => [...prev, { teamId, amount }]);
  }, []);

  const removeDeduction = useCallback((teamId: number) => {
    setIsCustomised(true);
    setDeductions((prev) => prev.filter((d) => d.teamId !== teamId));
  }, []);

  const resetDeductions = useCallback(() => {
    clearDeductions(slug);
    setIsCustomised(false);
    setDeductions(defaults);
  }, [defaults, slug]);

  return {
    deductions,
    isCustomised,
    updateDeduction,
    addDeduction,
    removeDeduction,
    resetDeductions,
  };
};
