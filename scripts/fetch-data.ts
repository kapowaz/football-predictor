import * as fs from 'node:fs'
import * as path from 'node:path'
import { config } from 'dotenv'

config()

const API_BASE = 'https://api.football-data.org/v4'
const COMPETITION_CODE = 'ELC'
const API_KEY = process.env.FOOTBALL_DATA_API_KEY

if (!API_KEY) {
  console.error('Error: FOOTBALL_DATA_API_KEY not found in environment')
  console.error('Please create a .env file with your API key (see .env.example)')
  process.exit(1)
}

interface ApiTeam {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
}

interface ApiTeamsResponse {
  competition: {
    name: string
  }
  season: {
    startDate: string
    endDate: string
  }
  teams: ApiTeam[]
}

interface ApiMatch {
  id: number
  utcDate: string
  status: string
  homeTeam: { id: number }
  awayTeam: { id: number }
  score: {
    fullTime: {
      home: number | null
      away: number | null
    }
  }
}

interface ApiMatchesResponse {
  matches: ApiMatch[]
}

interface ApiStandingEntry {
  position: number
  team: {
    id: number
    name: string
    shortName: string
    tla: string
  }
  playedGames: number
  form: string
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

interface ApiStandingsGroup {
  stage: string
  type: string
  group: string | null
  table: ApiStandingEntry[]
}

interface ApiStandingsResponse {
  standings: ApiStandingsGroup[]
}

const fetchFromApi = async <T>(endpoint: string): Promise<T> => {
  const url = new URL(endpoint, API_BASE)
  const response = await fetch(url.toString(), {
    headers: {
      'X-Auth-Token': API_KEY!,
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

const formatSeason = (startDate: string, endDate: string): string => {
  const startYear = new Date(startDate).getFullYear()
  const endYear = new Date(endDate).getFullYear()
  return `${startYear}-${String(endYear).slice(2)}`
}

const teamNameToCrestKey = (name: string): string => {
  return name
    .replace(/\s*(FC|AFC)\s*$/i, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

const fetchTeams = async (): Promise<void> => {
  console.log('Fetching teams...')
  const data = await fetchFromApi<ApiTeamsResponse>(`/v4/competitions/${COMPETITION_CODE}/teams`)

  const teamsData = {
    competition: data.competition.name,
    season: formatSeason(data.season.startDate, data.season.endDate),
    teams: data.teams.map((team) => ({
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      tla: team.tla,
      crest: teamNameToCrestKey(team.name),
    })),
  }

  const outputPath = path.join(import.meta.dirname, '../src/data/teams.json')
  fs.writeFileSync(outputPath, JSON.stringify(teamsData, null, 2))
  console.log(`✓ Wrote ${teamsData.teams.length} teams to src/data/teams.json`)
}

const fetchMatches = async (): Promise<void> => {
  console.log('Fetching matches...')
  const data = await fetchFromApi<ApiMatchesResponse>(
    `/v4/competitions/${COMPETITION_CODE}/matches`
  )

  const matchesData = {
    lastUpdated: new Date().toISOString(),
    matches: data.matches.map((match) => ({
      id: match.id,
      homeTeamId: match.homeTeam.id,
      awayTeamId: match.awayTeam.id,
      utcDate: match.utcDate,
      status: match.status === 'FINISHED' ? 'FINISHED' : 'SCHEDULED',
      homeGoals: match.score.fullTime.home,
      awayGoals: match.score.fullTime.away,
    })),
  }

  const outputPath = path.join(import.meta.dirname, '../src/data/matches.json')
  fs.writeFileSync(outputPath, JSON.stringify(matchesData, null, 2))
  console.log(`✓ Wrote ${matchesData.matches.length} matches to src/data/matches.json`)
}

const fetchStandings = async (): Promise<void> => {
  console.log('Fetching standings...')
  const data = await fetchFromApi<ApiStandingsResponse>(
    `/v4/competitions/${COMPETITION_CODE}/standings`
  )

  const totalStandings = data.standings.find((s) => s.type === 'TOTAL')
  if (!totalStandings) {
    throw new Error('No TOTAL standings found in API response')
  }

  const standingsData = {
    lastUpdated: new Date().toISOString(),
    standings: totalStandings.table.map((entry) => ({
      position: entry.position,
      teamId: entry.team.id,
      teamName: entry.team.name,
      playedGames: entry.playedGames,
      won: entry.won,
      drawn: entry.draw,
      lost: entry.lost,
      points: entry.points,
      goalsFor: entry.goalsFor,
      goalsAgainst: entry.goalsAgainst,
      goalDifference: entry.goalDifference,
    })),
  }

  const outputPath = path.join(import.meta.dirname, '../src/data/standings.json')
  fs.writeFileSync(outputPath, JSON.stringify(standingsData, null, 2))
  console.log(`✓ Wrote ${standingsData.standings.length} standings to src/data/standings.json`)
}

const main = async (): Promise<void> => {
  console.log('Fetching data from football-data.org...\n')

  try {
    await fetchTeams()
    await fetchMatches()
    await fetchStandings()
    console.log('\n✓ Data fetch complete!')
  } catch (error) {
    console.error('Error fetching data:', error)
    process.exit(1)
  }
}

main()
