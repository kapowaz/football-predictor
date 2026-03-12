import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import type { Match, Team, PredictionsStore } from '../../types';
import { useGroupedMatches } from '../../hooks/useGroupedMatches';
import { FixtureCard } from '../FixtureCard/FixtureCard';
import { cardHighlighted } from '../FixtureCard/FixtureCard.css';
import { FixtureGroup } from '../FixtureGroup';
import * as styles from './FixtureList.css';

interface FixtureListProps {
  matches: Match[];
  teamsById: Map<number, Team>;
  predictions: PredictionsStore;
  onPredictionChange: (matchId: number, homeGoals: number, awayGoals: number) => void;
  onPredictionRemove: (matchId: number) => void;
  /** Whether the fixtures panel is currently visible to the user */
  isVisible?: boolean;
  /** When set, expands the date group containing this match and scrolls to its card */
  navigateToMatchId?: number | null;
  /** Called after navigation scroll completes so the parent can clear the target */
  onNavigationComplete?: () => void;
}

export const FixtureList = ({
  matches,
  teamsById,
  predictions,
  onPredictionChange,
  onPredictionRemove,
  isVisible = true,
  navigateToMatchId,
  onNavigationComplete,
}: FixtureListProps) => {

  const groupedMatches = useGroupedMatches(matches, predictions);

  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const dateRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedDateRef = useRef<string | null>(null);
  const pendingScrollMatchId = useRef<number | null>(null);
  const didAutoExpandInitialGroup = useRef(false);
  const wasVisibleRef = useRef(isVisible);

  useEffect(() => {
    if (didAutoExpandInitialGroup.current) return;
    if (navigateToMatchId != null) return;
    if (groupedMatches.length === 0) return;

    didAutoExpandInitialGroup.current = true;

    const firstUpcomingGroup = groupedMatches.find((group) =>
      group.matches.every((match) => match.status !== 'FINISHED'),
    );
    if (!firstUpcomingGroup) return;

    setExpandedDate(() => {
      expandedDateRef.current = firstUpcomingGroup.date;
      return firstUpcomingGroup.date;
    });
  }, [groupedMatches, navigateToMatchId]);

  useEffect(() => {
    if (navigateToMatchId == null) return;

    const group = groupedMatches.find((g) =>
      g.matches.some((m) => m.id === navigateToMatchId),
    );
    if (!group) return;

    pendingScrollMatchId.current = navigateToMatchId;

    if (expandedDate === group.date) {
      // Already expanded — scroll immediately
      requestAnimationFrame(() => {
        scrollToMatch(navigateToMatchId);
      });
    } else {
      setExpandedDate(() => {
        expandedDateRef.current = group.date;
        return group.date;
      });
    }
  }, [navigateToMatchId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const becameVisible = isVisible && !wasVisibleRef.current;
    wasVisibleRef.current = isVisible;

    if (!becameVisible) return;
    if (navigateToMatchId != null) return;
    if (!containerRef.current) return;

    const date = expandedDateRef.current;
    if (!date) return;

    const scrollToExpandedGroup = () => {
      const el = dateRefs.current.get(date);
      if (!el || !containerRef.current) return;
      containerRef.current.scrollTo({
        top: el.offsetTop,
        behavior: 'smooth',
      });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToExpandedGroup);
    });
  }, [isVisible, navigateToMatchId]);

  const highlightCard = useCallback((card: Element) => {
    card.classList.add(cardHighlighted);
    card.addEventListener(
      'animationend',
      () => card.classList.remove(cardHighlighted),
      { once: true },
    );
    const firstInput = card.querySelector<HTMLInputElement>('input');
    firstInput?.focus();
  }, []);

  const scrollToMatch = useCallback(
    (matchId: number) => {
      if (!containerRef.current) return;

      const card = containerRef.current.querySelector(
        `[data-match-id="${matchId}"]`,
      );
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const initialTop = card.getBoundingClientRect().top;

        // Wait two frames for the smooth scroll to potentially begin,
        // then either highlight immediately (no scroll needed) or poll
        // until the card's position stabilises (scroll finished).
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (Math.abs(card.getBoundingClientRect().top - initialTop) < 0.5) {
              highlightCard(card);
              return;
            }

            let lastTop = card.getBoundingClientRect().top;
            let stableFrames = 0;

            const waitForScrollEnd = () => {
              const top = card.getBoundingClientRect().top;
              if (Math.abs(top - lastTop) < 0.5) {
                stableFrames++;
                if (stableFrames >= 3) {
                  highlightCard(card);
                  return;
                }
              } else {
                stableFrames = 0;
              }
              lastTop = top;
              requestAnimationFrame(waitForScrollEnd);
            };

            requestAnimationFrame(waitForScrollEnd);
          });
        });
      }
      pendingScrollMatchId.current = null;
      onNavigationComplete?.();
    },
    [onNavigationComplete, highlightCard],
  );

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
        const pendingMatch = pendingScrollMatchId.current;
        if (pendingMatch != null) {
          scrollToMatch(pendingMatch);
          return;
        }

        const el = dateRefs.current.get(date);
        if (el && containerRef.current) {
          containerRef.current.scrollTo({
            top: el.offsetTop,
            behavior: 'smooth',
          });
        }
      });
    },
    [scrollToMatch],
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
            <FixtureGroup
              dateLabel={group.dateLabel}
              isExpanded={isExpanded}
              allPredicted={group.allPredicted}
              matches={group.matches}
              predictions={predictions}
              onClick={() => toggleDate(group.date)}
            />
            <div
              className={clsx(
                styles.fixturesWrapper,
                isExpanded && styles.fixturesWrapperExpanded,
              )}
              onTransitionEnd={(e) => handleTransitionEnd(group.date, e)}
            >
              <div className={styles.fixturesList}>
                {group.matches.map((match) => {
                  const homeTeam = teamsById.get(match.homeTeamId);
                  const awayTeam = teamsById.get(match.awayTeamId);

                  if (!homeTeam || !awayTeam) return null;

                  const prediction = predictions.predictions[String(match.id)] ?? null;

                  if (match.status === 'FINISHED') {
                    return (
                      <FixtureCard
                        key={match.id}
                        match={match}
                        status={match.status}
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        result={{ homeGoals: match.homeGoals, awayGoals: match.awayGoals }}
                      />
                    );
                  }

                  return (
                    <FixtureCard
                      key={match.id}
                      match={match}
                      status={match.status}
                      homeTeam={homeTeam}
                      awayTeam={awayTeam}
                      result={prediction}
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
