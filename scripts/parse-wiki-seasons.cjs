const fs = require('fs');
const path = require('path');

const wikiFile = process.argv[2];
const clubCrest = process.argv[3];

if (!wikiFile || !clubCrest) {
  console.error('Usage: node parse-wiki-seasons.cjs <wiki-markdown-file> <club-crest>');
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

const seasons = [];

for (const line of lines) {
  const seasonMatch = line.match(/\|\s*\[(\d{4})[–\-](\d{2,4})\]/);
  if (!seasonMatch) continue;

  if (/[&é]\s*\|/.test(line)) continue;

  const startYear = parseInt(seasonMatch[1]);
  let endYear = parseInt(seasonMatch[2]);
  if (endYear < 100) endYear += Math.floor(startYear / 100) * 100;
  if (endYear <= startYear) endYear += 100;

  const cells = line.split('|').map(c => c.trim()).filter(c => c);
  if (cells.length < 8) continue;

  const divCell = cells[1] || '';
  let tier;
  if (/Division\s*1\b|^PL\b|Premier\s*League/i.test(divCell)) tier = 1;
  else if (/Division\s*2\b|Championship/i.test(divCell)) tier = 2;
  else if (/Division\s*3|League\s*One|Third|3\s*\(?[NS]/i.test(divCell)) tier = 3;
  else if (/Division\s*4|League\s*Two|Fourth/i.test(divCell)) tier = 4;
  else continue;

  const w = parseInt(cells[3]);
  const d = parseInt(cells[4]);
  const l = parseInt(cells[5]);
  const gf = parseInt(cells[6]);
  const ga = parseInt(cells[7]);

  if (isNaN(w) || isNaN(d) || isNaN(l) || isNaN(gf) || isNaN(ga)) continue;

  seasons.push(`${tier}:${endYear}:${w}:${d}:${l}:${gf}:${ga}`);
}

seasons.sort((a, b) => {
  const ya = parseInt(a.split(':')[1]);
  const yb = parseInt(b.split(':')[1]);
  return ya - yb;
});

const output = {
  name: club.name,
  shortName: club.shortName,
  crest: club.crest,
  founded: club.founded,
  currentTier: club.currentTier,
  seasons,
  honours: club.honours,
  europeanHonours: club.europeanHonours,
  averageAttendance: club.averageAttendance,
};

const outDir = path.join(__dirname, 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outFile = path.join(outDir, `${clubCrest}.json`);
fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + '\n');

console.log(`Parsed ${seasons.length} seasons for ${club.name}`);
console.log(`Written to ${outFile}`);

const WAR_YEARS = new Set([1916,1917,1918,1919,1940,1941,1942,1943,1944,1945,1946]);
const allYears = seasons.map(s => parseInt(s.split(':')[1])).sort((a,b) => a-b);
if (allYears.length > 0) {
  const tierMap = new Map();
  for (const s of seasons) {
    const [t, y] = s.split(':');
    tierMap.set(parseInt(y), `tier${t}`);
  }
  const missing = [];
  for (let y = allYears[0]; y <= allYears[allYears.length - 1]; y++) {
    if (WAR_YEARS.has(y)) continue;
    if (tierMap.has(y)) continue;
    const prev = allYears.filter(py => py < y);
    const prevTier = prev.length ? tierMap.get(prev[prev.length - 1]) : undefined;
    if (prevTier === 'tier4') continue;
    missing.push(y);
  }
  if (missing.length > 0) {
    console.log(`WARNING: Missing seasons: ${missing.join(', ')}`);
  } else {
    console.log('Continuity check: PASS');
  }
}
