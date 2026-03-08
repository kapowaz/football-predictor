import { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import type { Match, Team, PredictionsStore } from '../../types';
import { useGroupedMatches } from '../../hooks/useGroupedMatches';
import { MatchCard } from '../MatchCard/MatchCard';
import { ChevronRightIcon } from '../icons';
import * as styles from './MatchList.css';

interface MatchListProps {
  matches: Match[];
  teamsById: Map<number, Team>;
  predictions: PredictionsStore;
  onPredictionChange: (matchId: number, homeGoals: number, awayGoals: number) => void;
  onPredictionRemove: (matchId: number) => void;
}

export const MatchList = ({
  matches,
  teamsById,
  predictions,
  onPredictionChange,
  onPredictionRemove,
}: MatchListProps) => {

  const groupedMatches = useGroupedMatches(matches, predictions);

  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const dateRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedDateRef = useRef<string | null>(null);

  const toggleDate = useCallback((date: string) => {
    setExpandedDate((prev) => {
      const next = prev !== date ? date : null;
      expandedDateRef.current = next;
      return next;
    });
  }, []);

  const handleTransitionEnd = useCallback(
    (date: string, e: React.TransitionEvent) => {
      if (e.propertyName !== 'grid-template-rows') return;
      if (expandedDateRef.current !== date) return;

      requestAnimationFrame(() => {
        const el = dateRefs.current.get(date);
        if (el && containerRef.current) {
          containerRef.current.scrollTo({
            top: el.offsetTop,
            behavior: 'smooth',
          });
        }
      });
    },
    [],
  );

  if (groupedMatches.length === 0) {
    return <div className={styles.emptyState}>No upcoming matches to predict.</div>;
  }

  return (
    <div className={styles.container} ref={containerRef}>
      {groupedMatches.map((group) => {
        const isExpanded = expandedDate === group.date;
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
              className={clsx(styles.dateHeader, group.allPredicted && styles.dateHeaderComplete)}
              onClick={() => toggleDate(group.date)}
              aria-expanded={isExpanded}
            >
              <ChevronRightIcon className={clsx(styles.chevron, isExpanded && styles.chevronExpanded)} />
              {group.dateLabel}
              <span className={styles.fixtureIndicators}>
                {group.matches.map((match) => {
                  const prediction = predictions.predictions[String(match.id)];
                  return (
                    <span
                      key={match.id}
                      className={clsx(styles.fixtureCircle, prediction != null && {
                        [styles.fixtureCircleHomeWin]: prediction.homeGoals > prediction.awayGoals,
                        [styles.fixtureCircleAwayWin]: prediction.homeGoals < prediction.awayGoals,
                        [styles.fixtureCircleDraw]: prediction.homeGoals === prediction.awayGoals,
                      })}
                    />
                  );
                })}
              </span>
            </button>
            <div
              className={clsx(
                styles.matchesWrapper,
                isExpanded && styles.matchesWrapperExpanded,
              )}
              onTransitionEnd={(e) => handleTransitionEnd(group.date, e)}
            >
              <div className={styles.matchesList}>
                {group.matches.map((match) => {
                  const homeTeam = teamsById.get(match.homeTeamId);
                  const awayTeam = teamsById.get(match.awayTeamId);

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
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
