import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AbstractText } from '@kapowaz/components';
import { FixtureCard, FixtureGroup } from '@kapowaz/football';
import type {
  FixtureIndicator,
  FixtureIndicatorStatus,
} from '@kapowaz/football';

import type { ZoneDefinition } from '../../data/competitions';
import type {
  Match,
  Team,
  PredictionsStore,
  VariantRulesMode,
} from '../../types';
import type { FixtureGroupData } from './types';

import * as styles from './FixtureList.css';

const EMPTY_LIVE_SCORE_MATCH_IDS: ReadonlySet<string> = new Set();

interface FixtureListProps {
  /** Pre-grouped fixture data to render. */
  groups: FixtureGroupData[];
  /** Lookup from team ID to Team object. */
  teamsById: ReadonlyMap<number, Team>;
  /** Current predictions store (with live scores merged in). */
  predictions: PredictionsStore;
  /** Set of match ID strings whose displayed score originates from live data. */
  liveScoreMatchIds?: ReadonlySet<string>;
  /** Match ID to scroll to, if any. */
  navigateToMatchId: number | null;
  /** Callback to set a prediction for a match. */
  setPrediction: (
    matchId: number,
    homeGoals: number,
    awayGoals: number,
  ) => void;
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
  /** Enable variant rules mode for indicator dots. */
  variantRules?: VariantRulesMode;
}

const formatKickoff = (utcDate: string): string => {
  const date = new Date(utcDate);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDate = (utcDate: string): string => {
  const date = new Date(utcDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

const getIndicatorStatus = (
  match: Match,
  result: { homeGoals: number; awayGoals: number },
  team?: Team,
  variantRules: VariantRulesMode = false,
): FixtureIndicatorStatus => {
  const useNewRulesIndicators = variantRules === 'new-rules';
  if (team) {
    const isHome = match.homeTeamId === team.id;
    const teamGoals = isHome ? result.homeGoals : result.awayGoals;
    const opponentGoals = isHome ? result.awayGoals : result.homeGoals;

    if (teamGoals > opponentGoals) {
      if (useNewRulesIndicators && teamGoals - opponentGoals >= 2)
        return 'bonus';
      return 'win';
    }
    if (teamGoals < opponentGoals) {
      if (useNewRulesIndicators && opponentGoals - teamGoals >= 2)
        return 'bonusAway';
      return 'loss';
    }
    return 'draw';
  }

  const margin = Math.abs(result.homeGoals - result.awayGoals);
  if (result.homeGoals > result.awayGoals) {
    if (useNewRulesIndicators && margin >= 2) return 'bonus';
    return 'win';
  }
  if (result.homeGoals < result.awayGoals) {
    if (useNewRulesIndicators && margin >= 2) return 'bonusAway';
    return 'loss';
  }
  return 'draw';
};

const buildIndicators = (
  matches: Match[],
  predictions: PredictionsStore,
  team?: Team,
  variantRules: VariantRulesMode = false,
): FixtureIndicator[] =>
  matches.map((match) => {
    const result =
      match.status === 'FINISHED'
        ? { homeGoals: match.homeGoals, awayGoals: match.awayGoals }
        : predictions.predictions[String(match.id)];

    return {
      id: match.id,
      status:
        result != null
          ? getIndicatorStatus(match, result, team, variantRules)
          : 'none',
    };
  });

export const FixtureList = ({
  groups,
  teamsById,
  predictions,
  liveScoreMatchIds = EMPTY_LIVE_SCORE_MATCH_IDS,
  navigateToMatchId,
  setPrediction,
  removePrediction,
  setNavigateToMatchId,
  standingPositionsByTeamId,
  zones,
  showDate = false,
  isVisible = true,
  variantRules = false as VariantRulesMode,
}: FixtureListProps) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [highlightedMatchId, setHighlightedMatchId] = useState<number | null>(
    null,
  );
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
      group.matches.some((match) => match.status !== 'FINISHED'),
    );
    if (!firstUpcomingGroup) return;

    setExpandedKey(() => {
      expandedKeyRef.current = firstUpcomingGroup.key;
      return firstUpcomingGroup.key;
    });
  }, [groups, navigateToMatchId]);

  const highlightCard = useCallback((matchId: number) => {
    setHighlightedMatchId(matchId);

    const card = containerRef.current?.querySelector(
      `[data-match-id="${matchId}"]`,
    );
    const firstInput = card?.querySelector<HTMLInputElement>('input');
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

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (Math.abs(card.getBoundingClientRect().top - initialTop) < 0.5) {
              highlightCard(matchId);
              return;
            }

            let lastTop = card.getBoundingClientRect().top;
            let stableFrames = 0;

            const waitForScrollEnd = () => {
              const top = card.getBoundingClientRect().top;
              if (Math.abs(top - lastTop) < 0.5) {
                stableFrames++;
                if (stableFrames >= 3) {
                  highlightCard(matchId);
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

  useEffect(() => {
    if (navigateToMatchId == null) return;

    const group = groups.find((g) =>
      g.matches.some((m) => m.id === navigateToMatchId),
    );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, navigateToMatchId, setNavigateToMatchId, scrollToMatch]);

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
    return (
      <AbstractText className={styles.emptyState} fontSize="md">
        No upcoming matches to predict.
      </AbstractText>
    );
  }

  return (
    <div className={styles.container} ref={containerRef}>
      {groups.map((group) => {
        const isExpanded = expandedKey === group.key;
        const indicators = buildIndicators(
          group.matches,
          predictions,
          group.team,
          variantRules,
        );
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
              isAllPredicted={group.isAllPredicted}
              indicators={indicators}
              onClick={() => toggleGroup(group.key)}
            />
            <div
              className={clsx(
                styles.fixturesWrapper,
                isExpanded && styles.fixturesWrapperExpanded,
              )}
              onTransitionEnd={(e) => handleTransitionEnd(group.key, e)}
            >
              <div className={styles.fixturesList}>
                {group.matches.map((match) => {
                  const homeTeam = teamsById.get(match.homeTeamId);
                  const awayTeam = teamsById.get(match.awayTeamId);

                  if (!homeTeam || !awayTeam) return null;

                  const prediction =
                    predictions.predictions[String(match.id)] ?? null;
                  const isHighlighted = highlightedMatchId === match.id;

                  const separator = showDate ? (
                    <>
                      {formatDate(match.utcDate)}
                      <br />
                      {formatKickoff(match.utcDate)}
                    </>
                  ) : (
                    formatKickoff(match.utcDate)
                  );

                  if (match.status === 'FINISHED') {
                    return (
                      <div key={match.id} data-match-id={match.id}>
                        <FixtureCard
                          matchId={match.id}
                          status={match.status}
                          homeTeam={homeTeam}
                          awayTeam={awayTeam}
                          homePosition={
                            standingPositionsByTeamId.get(match.homeTeamId)!
                          }
                          awayPosition={
                            standingPositionsByTeamId.get(match.awayTeamId)!
                          }
                          zones={zones}
                          result={{
                            homeGoals: match.homeGoals,
                            awayGoals: match.awayGoals,
                          }}
                          separator={separator}
                          isHighlighted={isHighlighted}
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={match.id} data-match-id={match.id}>
                      <FixtureCard
                        matchId={match.id}
                        status={match.status}
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        homePosition={
                          standingPositionsByTeamId.get(match.homeTeamId)!
                        }
                        awayPosition={
                          standingPositionsByTeamId.get(match.awayTeamId)!
                        }
                        zones={zones}
                        result={prediction}
                        isLiveScore={liveScoreMatchIds.has(String(match.id))}
                        onPredictionChange={setPrediction}
                        onPredictionRemove={removePrediction}
                        separator={separator}
                        isHighlighted={isHighlighted}
                      />
                    </div>
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
