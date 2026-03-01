import { useMemo, useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Match, Team, PredictionsStore } from '../../types';
import { MatchCard } from '../MatchCard/MatchCard';
import * as styles from './MatchList.css';

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`${styles.chevron} ${expanded ? styles.chevronExpanded : ''}`}
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M6 3l5 5-5 5V3z" />
    </svg>
  );
}

interface MatchListProps {
  matches: Match[];
  teams: Team[];
  predictions: PredictionsStore;
  onPredictionChange: (matchId: number, homeGoals: number, awayGoals: number) => void;
  onPredictionRemove: (matchId: number) => void;
}

interface GroupedMatches {
  date: string;
  dateLabel: string;
  matches: Match[];
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function getDateKey(utcDate: string): string {
  return new Date(utcDate).toISOString().split('T')[0];
}

export function MatchList({
  matches,
  teams,
  predictions,
  onPredictionChange,
  onPredictionRemove,
}: MatchListProps) {
  const teamMap = useMemo(() => {
    return new Map(teams.map((team) => [team.id, team]));
  }, [teams]);

  const scheduledMatches = useMemo(() => {
    return matches
      .filter((match) => match.status === 'SCHEDULED')
      .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
  }, [matches]);

  const groupedMatches = useMemo(() => {
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
      });
    }

    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [scheduledMatches]);

  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const dateRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const expandingDateRef = useRef<string | null>(null);
  const pendingAnimationsRef = useRef(0);

  const toggleDate = useCallback((date: string) => {
    setExpandedDate((prev) => {
      const isExpanding = prev !== date;
      expandingDateRef.current = isExpanding ? date : null;
      pendingAnimationsRef.current = isExpanding ? (prev !== null ? 2 : 1) : 0;
      return isExpanding ? date : null;
    });
  }, []);

  const handleAnimationComplete = useCallback(() => {
    pendingAnimationsRef.current = Math.max(0, pendingAnimationsRef.current - 1);
    if (pendingAnimationsRef.current > 0 || !expandingDateRef.current) return;

    const date = expandingDateRef.current;
    expandingDateRef.current = null;

    requestAnimationFrame(() => {
      const el = dateRefs.current.get(date);
      if (el && containerRef.current) {
        containerRef.current.scrollTo({
          top: el.offsetTop,
          behavior: 'smooth',
        });
      }
    });
  }, []);

  if (scheduledMatches.length === 0) {
    return <div className={styles.emptyState}>No upcoming matches to predict.</div>;
  }

  return (
    <div className={styles.container} ref={containerRef}>
      {groupedMatches.map((group) => {
        const isExpanded = expandedDate === group.date;
        const allPredicted = group.matches.every(
          (match) => predictions.predictions[String(match.id)] != null,
        );
        return (
          <div
            key={group.date}
            className={styles.dateGroup}
            ref={(el) => {
              if (el) {
                dateRefs.current.set(group.date, el);
              } else {
                dateRefs.current.delete(group.date);
              }
            }}
          >
            <button
              className={`${styles.dateHeader}${allPredicted ? ` ${styles.dateHeaderComplete}` : ''}`}
              onClick={() => toggleDate(group.date)}
              aria-expanded={isExpanded}
            >
              <Chevron expanded={isExpanded} />
              {group.dateLabel}
            </button>
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  className={styles.matchesList}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                  onAnimationComplete={handleAnimationComplete}
                >
                  {group.matches.map((match) => {
                    const homeTeam = teamMap.get(match.homeTeamId);
                    const awayTeam = teamMap.get(match.awayTeamId);

                    if (!homeTeam || !awayTeam) return null;

                    return (
                      <MatchCard
                        key={match.id}
                        match={match}
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        prediction={predictions.predictions[String(match.id)] ?? null}
                        onPredictionChange={onPredictionChange}
                        onPredictionRemove={onPredictionRemove}
                      />
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
