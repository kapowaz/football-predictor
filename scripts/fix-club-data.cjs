const fs = require('fs');
const path = require('path');

const clubsDir = path.join(__dirname, '../src/data/all-time-rank/clubs');

function readClub(slug) {
  return JSON.parse(fs.readFileSync(path.join(clubsDir, `${slug}.json`), 'utf8'));
}

function writeClub(slug, data) {
  fs.writeFileSync(path.join(clubsDir, `${slug}.json`), JSON.stringify(data, null, 2) + '\n');
}

function removeSeasonsBefore(data, firstYear) {
  let removed = 0;
  for (const tier of ['tier1', 'tier2', 'tier3', 'tier4']) {
    for (const year of Object.keys(data.leagueRecord[tier])) {
      if (parseInt(year) < firstYear) {
        delete data.leagueRecord[tier][year];
        removed++;
      }
    }
  }
  return removed;
}

function addSeason(data, tier, year, w, d, l, gf, ga) {
  data.leagueRecord[`tier${tier}`][String(year)] = {
    won: w, drawn: d, lost: l, goalsFor: gf, goalsAgainst: ga,
  };
}

const flAdmission = {
  'barnet': 1992,
  'cheltenham-town': 2000,
  'wrexham': 1922,
  'yeovil-town': 2004,
  'aldershot-town': 1933,
  'gateshead': 1931,
  'gillingham': 1921,
  'swindon-town': 1921,
  'newport-county': 1921,
  'leyton-orient': 1906,
  'exeter-city': 1921,
  'brentford': 1921,
  'crystal-palace': 1921,
  'brighton-and-hove-albion': 1921,
  'southampton': 1921,
  'portsmouth': 1921,
  'cardiff-city': 1921,
  'plymouth-argyle': 1921,
};

for (const [slug, firstYear] of Object.entries(flAdmission)) {
  const data = readClub(slug);
  const removed = removeSeasonsBefore(data, firstYear);
  if (removed > 0) {
    writeClub(slug, data);
    console.log(`${slug}: removed ${removed} pre-FL seasons (before ${firstYear})`);
  }
}

const missingSeasons = {
  'blackburn-rovers': [
    { tier: 1, year: 2007, w: 15, d: 7, l: 16, gf: 52, ga: 54 },
  ],
  'colchester-united': [
    { tier: 4, year: 1962, w: 13, d: 8, l: 23, gf: 69, ga: 92 },
  ],
  'exeter-city': [
    { tier: 4, year: 1995, w: 8, d: 13, l: 25, gf: 48, ga: 83 },
  ],
  'watford': [
    { tier: 3, year: 1963, w: 9, d: 13, l: 24, gf: 52, ga: 80 },
  ],
  'portsmouth': [
    { tier: 2, year: 1971, w: 11, d: 8, l: 23, gf: 46, ga: 69 },
    { tier: 2, year: 1972, w: 12, d: 14, l: 16, gf: 58, ga: 68 },
    { tier: 2, year: 1978, w: 11, d: 12, l: 19, gf: 47, ga: 58 },
    { tier: 3, year: 1988, w: 14, d: 13, l: 19, gf: 55, ga: 59 },
    { tier: 2, year: 1998, w: 13, d: 10, l: 23, gf: 44, ga: 66 },
  ],
  'leyton-orient': [
    { tier: 2, year: 1909, w: 7, d: 9, l: 22, gf: 37, ga: 74 },
  ],
};

for (const [slug, seasons] of Object.entries(missingSeasons)) {
  const data = readClub(slug);
  for (const s of seasons) {
    addSeason(data, s.tier, s.year, s.w, s.d, s.l, s.gf, s.ga);
  }
  writeClub(slug, data);
  console.log(`${slug}: added ${seasons.length} missing season(s)`);
}

console.log('\nDone.');
