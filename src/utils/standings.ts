import type { Team, Match, TeamStanding, FormResult, PredictionsStore } from '../types'

const FORM_LENGTH = 6

interface MatchResult {
  homeTeamId: number
  awayTeamId: number
  homeGoals: number
  awayGoals: number
}

function getFormResult(goalsFor: number, goalsAgainst: number): FormResult {
  if (goalsFor > goalsAgainst) return 'W'
  if (goalsFor === goalsAgainst) return 'D'
  return 'L'
}

function createEmptyStanding(team: Team): TeamStanding {
  return {
    team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    form: [],
  }
}

function applyResult(standing: TeamStanding, goalsFor: number, goalsAgainst: number): void {
  standing.played += 1
  standing.goalsFor += goalsFor
  standing.goalsAgainst += goalsAgainst
  standing.goalDifference = standing.goalsFor - standing.goalsAgainst

  const result = getFormResult(goalsFor, goalsAgainst)
  standing.form.push(result)
  if (standing.form.length > FORM_LENGTH) {
    standing.form = standing.form.slice(-FORM_LENGTH)
  }

  if (goalsFor > goalsAgainst) {
    standing.won += 1
    standing.points += 3
  } else if (goalsFor === goalsAgainst) {
    standing.drawn += 1
    standing.points += 1
  } else {
    standing.lost += 1
  }
}

export function calculateStandings(
  teams: Team[],
  matches: Match[],
  predictions: PredictionsStore
): TeamStanding[] {
  const standingsMap = new Map<number, TeamStanding>()

  for (const team of teams) {
    standingsMap.set(team.id, createEmptyStanding(team))
  }

  const results: MatchResult[] = []

  for (const match of matches) {
    if (match.status === 'FINISHED' && match.homeGoals !== null && match.awayGoals !== null) {
      results.push({
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        homeGoals: match.homeGoals,
        awayGoals: match.awayGoals,
      })
    } else if (match.status === 'SCHEDULED') {
      const prediction = predictions.predictions[String(match.id)]
      if (prediction) {
        results.push({
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
          homeGoals: prediction.homeGoals,
          awayGoals: prediction.awayGoals,
        })
      }
    }
  }

  for (const result of results) {
    const homeStanding = standingsMap.get(result.homeTeamId)
    const awayStanding = standingsMap.get(result.awayTeamId)

    if (homeStanding) {
      applyResult(homeStanding, result.homeGoals, result.awayGoals)
    }
    if (awayStanding) {
      applyResult(awayStanding, result.awayGoals, result.homeGoals)
    }
  }

  const standings = Array.from(standingsMap.values())

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
    return b.goalsFor - a.goalsFor
  })

  return standings
}
