import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import type { Team, PredictionsStore } from '../../types';
import type { ZoneDefinition } from '../../data/competitions';
import { FixtureCard } from '../FixtureCard/FixtureCard';
import { cardHighlighted } from '../FixtureCard/FixtureCard.css';
import { FixtureGroup } from '../FixtureGroup';
import type { FixtureGroupData } from './types';
import * as styles from './FixtureList.css';

interface FixtureListProps {
  /** Pre-grouped fixture data to render. */
  groups: FixtureGroupData[];
  /** Lookup from team ID to Team object. */
  teamsById: ReadonlyMap<number, Team>;
  /** Current predictions store. */
  predictions: PredictionsStore;
  /** Match ID to scroll to, if any. */
  navigateToMatchId: number | null;
  /** Callback to set a prediction for a match. */
  setPrediction: (matchId: number, homeGoals: number, awayGoals: number) => void;
  /** Callback to remove a prediction for a match. */
  removePrediction: (matchId: number) => void;
  /** Callback to clear the navigate-to-match request. */
  setNavigateToMatchId: (matchId: number | null) => void;
  /** Lookup for current standings positions keyed by team id. */
  standingPositionsByTeamId: ReadonlyMap<number, number>;
  /** Zones used to style position badges in fixture cards. */
  zones: ZoneDefinition[];
  /** Whether to display the fixture date inside each FixtureCard. */
  showDate?: boolean;
  /** Whether the fixtures panel is currently visible to the user. */
  isVisible?: boolean;
}

export const FixtureList = ({
  groups,
  teamsById,
  predictions,
  navigateToMatchId,
  setPrediction,
  removePrediction,
  setNavigateToMatchId,
  standingPositionsByTeamId,
  zones,
  showDate = false,
  isVisible = true,
}: FixtureListProps) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const groupRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedKeyRef = useRef<string | null>(null);
  const pendingScrollMatchId = useRef<number | null>(null);
  const didAutoExpandInitialGroup = useRef(false);
  const wasVisibleRef = useRef(isVisible);

  useEffect(() => {
    if (didAutoExpandInitialGroup.current) return;
    if (navigateToMatchId != null) return;
    if (groups.length === 0) return;

    didAutoExpandInitialGroup.current = true;

    const firstUpcomingGroup = groups.find((group) =>
      group.matches.every((match) => match.status !== 'FINISHED'),
    );
    if (!firstUpcomingGroup) return;

    setExpandedKey(() => {
      expandedKeyRef.current = firstUpcomingGroup.key;
      return firstUpcomingGroup.key;
    });
  }, [groups, navigateToMatchId]);

  useEffect(() => {
    if (navigateToMatchId == null) return;

    const group = groups.find((g) => g.matches.some((m) => m.id === navigateToMatchId));
    if (!group) {
      setNavigateToMatchId(null);
      pendingScrollMatchId.current = null;
      return;
    }

    pendingScrollMatchId.current = navigateToMatchId;

    if (expandedKey === group.key) {
      requestAnimationFrame(() => {
        scrollToMatch(navigateToMatchId);
      });
    } else {
      setExpandedKey(() => {
        expandedKeyRef.current = group.key;
        return group.key;
      });
    }
  }, [groups, navigateToMatchId, setNavigateToMatchId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const becameVisible = isVisible && !wasVisibleRef.current;
    wasVisibleRef.current = isVisible;

    if (!becameVisible) return;
    if (navigateToMatchId != null) return;
    if (!containerRef.current) return;

    const key = expandedKeyRef.current;
    if (!key) return;

    const scrollToExpandedGroup = () => {
      const el = groupRefs.current.get(key);
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
    card.addEventListener('animationend', () => card.classList.remove(cardHighlighted), {
      once: true,
    });
    const firstInput = card.querySelector<HTMLInputElement>('input');
    firstInput?.focus();
  }, []);

  const scrollToMatch = useCallback(
    (matchId: number) => {
      if (!containerRef.current) return;

      const card = containerRef.current.querySelector(`[data-match-id="${matchId}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const initialTop = card.getBoundingClientRect().top;

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
      setNavigateToMatchId(null);
    },
    [highlightCard, setNavigateToMatchId],
  );

  const toggleGroup = useCallback((key: string) => {
    setExpandedKey((prev) => {
      const next = prev !== key ? key : null;
      expandedKeyRef.current = next;
      return next;
    });
  }, []);

  const handleTransitionEnd = useCallback(
    (key: string, e: React.TransitionEvent) => {
      if (e.propertyName !== 'grid-template-rows') return;
      if (expandedKeyRef.current !== key) return;

      requestAnimationFrame(() => {
        const pendingMatch = pendingScrollMatchId.current;
        if (pendingMatch != null) {
          scrollToMatch(pendingMatch);
          return;
        }

        const el = groupRefs.current.get(key);
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

  if (groups.length === 0) {
    return <div className={styles.emptyState}>No upcoming matches to predict.</div>;
  }

  return (
    <div className={styles.container} ref={containerRef}>
      {groups.map((group) => {
        const isExpanded = expandedKey === group.key;
        return (
          <div
            key={group.key}
            className={styles.dateGroup}
            ref={(el) => {
              if (el) {
                groupRefs.current.set(group.key, el);
              } else {
                groupRefs.current.delete(group.key);
              }
            }}
          >
            <FixtureGroup
              label={group.label}
              team={group.team}
              isExpanded={isExpanded}
              allPredicted={group.allPredicted}
              matches={group.matches}
              predictions={predictions}
              onClick={() => toggleGroup(group.key)}
            />
            <div
              className={clsx(styles.fixturesWrapper, isExpanded && styles.fixturesWrapperExpanded)}
              onTransitionEnd={(e) => handleTransitionEnd(group.key, e)}
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
                        homePosition={standingPositionsByTeamId.get(match.homeTeamId)!}
                        awayPosition={standingPositionsByTeamId.get(match.awayTeamId)!}
                        zones={zones}
                        result={{ homeGoals: match.homeGoals, awayGoals: match.awayGoals }}
                        showDate={showDate}
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
                      homePosition={standingPositionsByTeamId.get(match.homeTeamId)!}
                      awayPosition={standingPositionsByTeamId.get(match.awayTeamId)!}
                      zones={zones}
                      result={prediction}
                      onPredictionChange={setPrediction}
                      onPredictionRemove={removePrediction}
                      showDate={showDate}
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
