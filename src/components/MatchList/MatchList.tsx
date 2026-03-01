import { useMemo } from 'react'
import type { Match, Team, PredictionsStore } from '../../types'
import { MatchCard } from '../MatchCard/MatchCard'
import * as styles from './MatchList.css'

interface MatchListProps {
  matches: Match[]
  teams: Team[]
  predictions: PredictionsStore
  onPredictionChange: (matchId: number, homeGoals: number, awayGoals: number) => void
  onPredictionRemove: (matchId: number) => void
}

interface GroupedMatches {
  date: string
  dateLabel: string
  matches: Match[]
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function getDateKey(utcDate: string): string {
  return new Date(utcDate).toISOString().split('T')[0]
}

export function MatchList({
  matches,
  teams,
  predictions,
  onPredictionChange,
  onPredictionRemove,
}: MatchListProps) {
  const teamMap = useMemo(() => {
    return new Map(teams.map((team) => [team.id, team]))
  }, [teams])

  const scheduledMatches = useMemo(() => {
    return matches
      .filter((match) => match.status === 'SCHEDULED')
      .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
  }, [matches])

  const groupedMatches = useMemo(() => {
    const groups = new Map<string, Match[]>()

    for (const match of scheduledMatches) {
      const dateKey = getDateKey(match.utcDate)
      const existing = groups.get(dateKey) || []
      groups.set(dateKey, [...existing, match])
    }

    const result: GroupedMatches[] = []
    for (const [date, dateMatches] of groups.entries()) {
      result.push({
        date,
        dateLabel: formatDateLabel(date),
        matches: dateMatches,
      })
    }

    return result.sort((a, b) => a.date.localeCompare(b.date))
  }, [scheduledMatches])

  if (scheduledMatches.length === 0) {
    return <div className={styles.emptyState}>No upcoming matches to predict.</div>
  }

  return (
    <div className={styles.container}>
      {groupedMatches.map((group) => (
        <div key={group.date} className={styles.dateGroup}>
          <div className={styles.dateHeader}>{group.dateLabel}</div>
          <div className={styles.matchesList}>
            {group.matches.map((match) => {
              const homeTeam = teamMap.get(match.homeTeamId)
              const awayTeam = teamMap.get(match.awayTeamId)

              if (!homeTeam || !awayTeam) return null

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
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
