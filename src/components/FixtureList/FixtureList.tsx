import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import type { ZoneDefinition } from '../../data/competitions';
import { useCompetitionData } from '../../hooks/useCompetitionData';
import { useGroupedMatches } from '../../hooks/useGroupedMatches';
import { selectTeamsById } from '../../state/selectors';
import { useCompetitionSessionSlice } from '../../state/useCompetitionSessionSlice';
import { FixtureCard } from '../FixtureCard/FixtureCard';
import { cardHighlighted } from '../FixtureCard/FixtureCard.css';
import { FixtureGroup } from '../FixtureGroup';
import * as styles from './FixtureList.css';

interface FixtureListProps {
  /** Competition slug used to read fixture/session state. */
  slug: string;
  /** Whether the fixtures panel is currently visible to the user */
  isVisible?: boolean;
  /** Whether completed fixtures should be included. */
  showFinished?: boolean;
  /** Optional list of team IDs to keep in the fixture list. */
  filterTeams?: number[];
  /** Optional lookup for current standings positions keyed by team id. */
  standingPositionsByTeamId?: ReadonlyMap<number, number>;
  /** Optional zones used to style position badges in fixture cards. */
  standingPositionZones?: ZoneDefinition[];
}

const EMPTY_FILTER_TEAMS: number[] = [];

export const FixtureList = ({
  slug,
  isVisible = true,
  showFinished = true,
  filterTeams = EMPTY_FILTER_TEAMS,
  standingPositionsByTeamId,
  standingPositionZones,
}: FixtureListProps) => {
  const { teams, matches } = useCompetitionData(slug);
  const { session, setPrediction, removePrediction, setNavigateToMatchId } = useCompetitionSessionSlice(slug);
  const predictions = session?.predictions ?? { predictions: {}, lastModified: '' };
  const navigateToMatchId = session?.navigateToMatchId ?? null;
  const teamsById = selectTeamsById(teams);
  const groupedMatches = useGroupedMatches(matches, predictions, { showFinished, filterTeams });

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

    const group = groupedMatches.find((g) => g.matches.some((m) => m.id === navigateToMatchId));
    if (!group) {
      setNavigateToMatchId(null);
      pendingScrollMatchId.current = null;
      return;
    }

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
  }, [groupedMatches, navigateToMatchId, setNavigateToMatchId]); // eslint-disable-line react-hooks/exhaustive-deps

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
      setNavigateToMatchId(null);
    },
    [highlightCard, setNavigateToMatchId],
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

  if (!session) {
    return null;
  }

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
              className={clsx(styles.fixturesWrapper, isExpanded && styles.fixturesWrapperExpanded)}
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
                        homePosition={standingPositionsByTeamId?.get(match.homeTeamId)}
                        awayPosition={standingPositionsByTeamId?.get(match.awayTeamId)}
                        zones={standingPositionZones}
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
                      homePosition={standingPositionsByTeamId?.get(match.homeTeamId)}
                      awayPosition={standingPositionsByTeamId?.get(match.awayTeamId)}
                      zones={standingPositionZones}
                      result={prediction}
                      onPredictionChange={setPrediction}
                      onPredictionRemove={removePrediction}
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
