import { useMemo } from 'react';
import type { Match, PredictionsStore } from '../types';

export interface GroupedMatches {
  date: string;
  dateLabel: string;
  matches: Match[];
  allPredicted: boolean;
}

const formatDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

const getDateKey = (utcDate: string): string => {
  return new Date(utcDate).toISOString().split('T')[0];
};

export const useGroupedMatches = (
  matches: Match[],
  predictions: PredictionsStore,
): GroupedMatches[] => {
  const scheduledMatches = useMemo(() => {
    return matches
      .filter((match) => match.status === 'SCHEDULED')
      .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
  }, [matches]);

  return useMemo(() => {
    const groups = new Map<string, Match[]>();

    for (const match of scheduledMatches) {
      const dateKey = getDateKey(match.utcDate);
      const existing = groups.get(dateKey) || [];
      groups.set(dateKey, [...existing, match]);
    }

    const result: GroupedMatches[] = [];
    for (const [date, dateMatches] of groups.entries()) {
      result.push({
        date,
        dateLabel: formatDateLabel(date),
        matches: dateMatches,
        allPredicted: dateMatches.every(
          (match) => predictions.predictions[String(match.id)] != null,
        ),
      });
    }

    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [scheduledMatches, predictions]);
};
