import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { PointDeduction } from '../types';
import { loadDeductions, saveDeductions, clearDeductions } from '../utils/storage';
import { encodeDeductions, decodeDeductions } from '../utils/serialization';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [initial] = useState(() => loadInitialDeductions(slug, defaults));
  const [deductions, setDeductions] = useState<PointDeduction[]>(initial.deductions);
  const [isCustomised, setIsCustomised] = useState(initial.isCustomised);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isCustomised) {
      saveDeductions(slug, deductions);
    }

    const encodedDeductions = isCustomised ? encodeDeductions(deductions) : null;
    const currentEncodedDeductions = searchParams.get('deductions');
    const shouldUpdateUrl = currentEncodedDeductions !== encodedDeductions;

    if (shouldUpdateUrl) {
      const shouldReplace = isInitialRender.current;
      setSearchParams(
        (previous) => {
          const params = new URLSearchParams(previous);
          if (encodedDeductions) {
            params.set('deductions', encodedDeductions);
          } else {
            params.delete('deductions');
          }
          return params;
        },
        { replace: shouldReplace },
      );
    }

    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, [deductions, isCustomised, searchParams, setSearchParams, slug]);

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
