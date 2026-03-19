const fs = require('fs');
const path = require('path');

const SEASONS_DIR = path.join(__dirname, '../src/data/league-history/seasons');
const CLUBS_DIR = path.join(__dirname, '../src/data/all-time-rank/clubs');

const clubFiles = fs.readdirSync(CLUBS_DIR).filter(f => f.endsWith('.json'));

const allClubs = clubFiles.map(f => {
  const data = JSON.parse(fs.readFileSync(path.join(CLUBS_DIR, f), 'utf-8'));
  const slug = f.replace('.json', '');
  return { slug, data };
});

const POINTS_PER_WIN_CHANGE_YEAR = 1982;

function computePoints(record, year) {
  const ppw = year >= POINTS_PER_WIN_CHANGE_YEAR ? 3 : 2;
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
    const points = computePoints(record, year);
    const gd = (record.goalsFor || 0) - (record.goalsAgainst || 0);
    const gf = record.goalsFor || 0;

    entries.push({
      slug: club.slug,
      points,
      gd,
      gf,
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

const eraFile = process.argv[2];
if (!eraFile) {
  console.error('Usage: node build-teams-from-clubs.cjs <era-file>');
  console.error('  Example: node build-teams-from-clubs.cjs present.json');
  process.exit(1);
}

const filePath = path.join(SEASONS_DIR, eraFile);
const seasons = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
let updated = 0;

for (const season of seasons) {
  for (const div of season.divisions) {
    if (div.teams && div.teams.length > 0) continue;

    const teams = buildTeamsForYear(season.year, div.tier);
    if (teams.length === 0) {
      console.warn(`  ${season.season} ${div.name}: no club data found`);
      continue;
    }

    if (teams.length !== div.teamCount) {
      console.warn(`  ${season.season} ${div.name}: found ${teams.length} teams, expected ${div.teamCount}`);
    }

    div.teams = teams;
    div.teamCount = teams.length;
    updated++;
    console.log(`  ${season.season} ${div.name}: ${teams.length} teams`);
  }
}

fs.writeFileSync(filePath, JSON.stringify(seasons, null, 2) + '\n');
console.log(`\nUpdated ${updated} divisions in ${eraFile}`);
