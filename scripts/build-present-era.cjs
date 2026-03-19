const fs = require('fs');
const path = require('path');

const SEASONS_DIR = path.join(__dirname, '../src/data/league-history/seasons');
const CLUBS_DIR = path.join(__dirname, '../src/data/all-time-rank/clubs');

const clubFiles = fs.readdirSync(CLUBS_DIR).filter(f => f.endsWith('.json'));
const allClubs = clubFiles.map(f => {
  const data = JSON.parse(fs.readFileSync(path.join(CLUBS_DIR, f), 'utf-8'));
  return { slug: f.replace('.json', ''), data };
});

function computePoints(record, year) {
  const ppw = 3;
  return (record.won * ppw) + record.drawn;
}

function buildTeamsForYear(year, tier) {
  const tierKey = `tier${tier}`;
  const yearKey = String(year);
  const entries = [];

  for (const club of allClubs) {
    const tierData = club.data.leagueRecord?.[tierKey];
    if (!tierData || !tierData[yearKey]) continue;
    const record = tierData[yearKey];
    entries.push({
      slug: club.slug,
      points: computePoints(record, year),
      gd: (record.goalsFor || 0) - (record.goalsAgainst || 0),
      gf: record.goalsFor || 0,
      won: record.won || 0,
    });
  }

  entries.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.slug.localeCompare(b.slug);
  });

  return entries.map(e => e.slug);
}

function getSeasonLabel(year) {
  const start = year - 1;
  const endStr = (year % 100 === 0) ? String(year) : String(year).slice(-2);
  return `${start}-${endStr}`;
}

function getDivisionConfig(year, tier) {
  const isEFL = year >= 2017;

  switch (tier) {
    case 1: return {
      tier: 1,
      name: 'Premier League',
      teamCount: 20,
      zones: year >= 2025 ? [
        { type: 'champions', label: 'Champions', startPosition: 1, endPosition: 1 },
        { type: 'championsLeague', label: 'Champions League', startPosition: 2, endPosition: 5 },
        { type: 'europaLeague', label: 'Europa League', startPosition: 6, endPosition: 6 },
        { type: 'conferenceLeague', label: 'Conference League', startPosition: 7, endPosition: 7 },
        { type: 'relegation', label: 'Relegated', startPosition: 18, endPosition: 20 }
      ] : year >= 2022 ? [
        { type: 'champions', label: 'Champions', startPosition: 1, endPosition: 1 },
        { type: 'championsLeague', label: 'Champions League', startPosition: 2, endPosition: 4 },
        { type: 'europaLeague', label: 'Europa League', startPosition: 5, endPosition: 5 },
        { type: 'conferenceLeague', label: 'Conference League', startPosition: 6, endPosition: 6 },
        { type: 'relegation', label: 'Relegated', startPosition: 18, endPosition: 20 }
      ] : [
        { type: 'champions', label: 'Champions', startPosition: 1, endPosition: 1 },
        { type: 'championsLeague', label: 'Champions League', startPosition: 2, endPosition: 4 },
        { type: 'europaLeague', label: year >= 2010 ? 'Europa League' : 'UEFA Cup', startPosition: 5, endPosition: 6 },
        { type: 'relegation', label: 'Relegated', startPosition: 18, endPosition: 20 }
      ]
    };
    case 2: return {
      tier: 2,
      name: isEFL ? 'EFL Championship' : 'Championship',
      teamCount: 24,
      zones: [
        { type: 'promotion', label: 'Promoted', startPosition: 1, endPosition: 2 },
        { type: 'playoff', label: 'Playoffs', startPosition: 3, endPosition: 6 },
        { type: 'relegation', label: 'Relegated', startPosition: 22, endPosition: 24 }
      ]
    };
    case 3: return {
      tier: 3,
      name: isEFL ? 'EFL League One' : 'League One',
      teamCount: 24,
      zones: [
        { type: 'promotion', label: 'Promoted', startPosition: 1, endPosition: 2 },
        { type: 'playoff', label: 'Playoffs', startPosition: 3, endPosition: 6 },
        { type: 'relegation', label: 'Relegated', startPosition: 21, endPosition: 24 }
      ]
    };
    case 4: return {
      tier: 4,
      name: isEFL ? 'EFL League Two' : 'League Two',
      teamCount: 24,
      zones: [
        { type: 'promotion', label: 'Promoted', startPosition: 1, endPosition: 3 },
        { type: 'playoff', label: 'Playoffs', startPosition: 4, endPosition: 7 },
        { type: 'relegation', label: 'Relegated', startPosition: 23, endPosition: 24 }
      ]
    };
    default: throw new Error(`Unknown tier ${tier}`);
  }
}

const seasons = [];

for (let year = 2005; year <= 2026; year++) {
  const divisions = [];

  for (let tier = 1; tier <= 4; tier++) {
    const config = getDivisionConfig(year, tier);
    divisions.push({ ...config, teams: [] });
  }

  seasons.push({
    year,
    season: getSeasonLabel(year),
    nextYear: year + 1,
    divisions
  });

  console.log(`  ${getSeasonLabel(year)}: structure created`);
}

const outPath = path.join(SEASONS_DIR, 'present.json');
fs.writeFileSync(outPath, JSON.stringify(seasons, null, 2) + '\n');
console.log(`\nWritten ${seasons.length} seasons to present.json`);
