const fs = require('fs');
const path = require('path');

const wikiFile = process.argv[2];
const clubCrest = process.argv[3];

if (!wikiFile || !clubCrest) {
  console.error('Usage: node process-club.cjs <wiki-markdown-file> <club-crest>');
  process.exit(1);
}

const clubsData = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../src/data/all-time-rank/clubs.json'), 'utf8'
));

const club = clubsData.find(c => c.crest === clubCrest);
if (!club) {
  console.error(`Club not found: ${clubCrest}`);
  process.exit(1);
}

const markdown = fs.readFileSync(wikiFile, 'utf8');
const lines = markdown.split('\n');

function normaliseText(s) {
  if (s == null) return '';
  return String(s).replace(/[\u2212\u2013\u2014\u00AD]/g, '-').replace(/\s+/g, ' ').trim();
}

function safeParse(s) {
  if (s == null) return NaN;
  return parseInt(normaliseText(s));
}

function detectTier(text) {
  const t = normaliseText(text);
  if (!t) return null;
  if (/Northern|Southern\s+League|Isthmian|Combined|Conference|National\s+League|^SL\b|^NL\b|^Conf/i.test(t)) return null;
  const isPL = /Premier\s*League/i.test(t);
  if (isPL || /Div(?:ision)?\s*1\b|^PL\b|\bPrem\b|First.Division(?!.*Champ)/i.test(t)) return 1;
  if (/Div(?:ision)?\s*2\b|Champ|Chmp|Second.Division|New\s*Div(?:ision)?\s*1|^Ch\b/i.test(t)) return 2;
  if (/Div(?:ision)?\s*3|League.?One|League\s+1\b|Lge?\s*1|^L1\b|\bOne\b.*\(3\)|Third|3\s*\(?[NS]|New\s*Div(?:ision)?\s*2/i.test(t)) return 3;
  if (/Div(?:ision)?\s*4|League.?Two|League\s+2\b|Lge?\s*2|^L2\b|\bTwo\b.*\(4\)|Fourth|New\s*Div(?:ision)?\s*3/i.test(t)) return 4;
  return null;
}

const seasons = [];
let lastTier = null;

for (const line of lines) {
  const seasonMatch = line.match(/\|\s*\[?(\d{4})[–\-](\d{2,4})\]?/);
  if (!seasonMatch) continue;

  if (/[&é]\s*\|/.test(line)) continue;

  const startYear = parseInt(seasonMatch[1]);
  let endYear = parseInt(seasonMatch[2]);
  if (endYear < 100) endYear += Math.floor(startYear / 100) * 100;
  if (endYear <= startYear) endYear += 100;

  const rawCells = line.split('|').map(c => c.trim()).filter(c => c);
  if (rawCells.length < 6) continue;

  let tier = null;

  for (let ci = 1; ci < Math.min(5, rawCells.length); ci++) {
    tier = detectTier(rawCells[ci]);
    if (tier !== null) break;
  }

  if (tier === null) {
    for (let ci = 1; ci < Math.min(4, rawCells.length); ci++) {
      const tierNum = safeParse(rawCells[ci]);
      if (tierNum >= 1 && tierNum <= 4) {
        tier = tierNum;
        break;
      }
    }
  }

  if (tier === null && lastTier) {
    tier = lastTier;
  }
  if (tier === null) continue;

  let w, d, l, gf = 0, ga = 0;
  let foundStats = false;

  for (let startCol = 1; startCol < rawCells.length - 3; startCol++) {
    const pld = safeParse(rawCells[startCol]);
    const cw = safeParse(rawCells[startCol + 1]);
    const cd = safeParse(rawCells[startCol + 2]);
    const cl = safeParse(rawCells[startCol + 3]);

    if (isNaN(pld) || isNaN(cw) || isNaN(cd) || isNaN(cl)) continue;
    if (pld < 10 || pld > 60) continue;
    if (cw + cd + cl !== pld) continue;

    w = cw;
    d = cd;
    l = cl;

    const cgf = safeParse(rawCells[startCol + 4]);
    const cga = safeParse(rawCells[startCol + 5]);

    if (!isNaN(cgf) && !isNaN(cga) && cgf >= 0 && cga >= 0) {
      gf = cgf;
      ga = cga;
    }
    foundStats = true;
    break;
  }

  if (!foundStats) continue;

  lastTier = tier;
  seasons.push(`${tier}:${endYear}:${w}:${d}:${l}:${gf}:${ga}`);
}

seasons.sort((a, b) => {
  const ya = parseInt(a.split(':')[1]);
  const yb = parseInt(b.split(':')[1]);
  return ya - yb;
});

const leagueRecord = { tier1: {}, tier2: {}, tier3: {}, tier4: {} };
for (const season of seasons) {
  const parts = season.split(':').map(Number);
  const [tier, year, w, d, l, gf, ga] = parts;
  leagueRecord[`tier${tier}`][year] = {
    won: w, drawn: d, lost: l, goalsFor: gf, goalsAgainst: ga,
  };
}

const emptyTiered = { tier1: [], tier2: [], tier3: [], tier4: [] };

const output = {
  name: club.name,
  shortName: club.shortName,
  crest: club.crest,
  founded: club.founded,
  currentTier: club.currentTier,
  leagueRecord,
  honours: {
    leagueTitles: { ...emptyTiered, ...club.honours.leagueTitles },
    leagueRunnersUp: { ...emptyTiered, ...club.honours.leagueRunnersUp },
    playoffWinners: { ...emptyTiered, ...club.honours.playoffWinners },
    faCupWinners: club.honours.faCupWinners || [],
    faCupRunnersUp: club.honours.faCupRunnersUp || [],
    leagueCupWinners: club.honours.leagueCupWinners || [],
    leagueCupRunnersUp: club.honours.leagueCupRunnersUp || [],
  },
  europeanHonours: {
    championsLeagueWinners: club.europeanHonours.championsLeagueWinners || [],
    championsLeagueRunnersUp: club.europeanHonours.championsLeagueRunnersUp || [],
    europaLeagueWinners: club.europeanHonours.europaLeagueWinners || [],
    europaLeagueRunnersUp: club.europeanHonours.europaLeagueRunnersUp || [],
    conferenceLeagueWinners: club.europeanHonours.conferenceLeagueWinners || [],
    conferenceLeagueRunnersUp: club.europeanHonours.conferenceLeagueRunnersUp || [],
  },
  averageAttendance: club.averageAttendance,
};

const outFile = path.join(__dirname, '../src/data/all-time-rank/clubs', `${clubCrest}.json`);
fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + '\n');

const totalSeasons = Object.keys(output.leagueRecord.tier1).length +
  Object.keys(output.leagueRecord.tier2).length +
  Object.keys(output.leagueRecord.tier3).length +
  Object.keys(output.leagueRecord.tier4).length;

const WAR_YEARS = new Set([1916,1917,1918,1919,1940,1941,1942,1943,1944,1945,1946]);
const allYears = seasons.map(s => parseInt(s.split(':')[1])).sort((a,b) => a-b);
let missingYears = [];
if (allYears.length > 0) {
  const tierMap = new Map();
  for (const s of seasons) {
    const [t, y] = s.split(':');
    tierMap.set(parseInt(y), `tier${t}`);
  }
  for (let y = allYears[0]; y <= allYears[allYears.length - 1]; y++) {
    if (WAR_YEARS.has(y)) continue;
    if (tierMap.has(y)) continue;
    const prev = allYears.filter(py => py < y);
    const prevTier = prev.length ? tierMap.get(prev[prev.length - 1]) : undefined;
    if (prevTier === 'tier4') continue;
    missingYears.push(y);
  }
}

if (missingYears.length > 0) {
  console.log(`WARN|${clubCrest}|${totalSeasons} seasons|MISSING: ${missingYears.join(',')}`);
  process.exit(1);
} else {
  console.log(`OK|${clubCrest}|${totalSeasons} seasons`);
}
