const fs = require('fs');
const path = require('path');

const clubsDir = path.join(__dirname, '../src/data/all-time-rank/clubs');
const files = fs.readdirSync(clubsDir).filter(f => f.endsWith('.json'));

const PL_GAMES = {
  1993: 42, 1994: 42, 1995: 42,
  1996: 38, 1997: 38, 1998: 38, 1999: 38, 2000: 38,
  2001: 38, 2002: 38, 2003: 38, 2004: 38,
};

let totalChanges = 0;

for (const file of files) {
  const filePath = path.join(clubsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changes = 0;

  for (let year = 1993; year <= 2004; year++) {
    const yearStr = String(year);

    const inT1 = data.leagueRecord.tier1[yearStr];
    const inT2 = data.leagueRecord.tier2[yearStr];
    const inT3 = data.leagueRecord.tier3[yearStr];
    const inT4 = data.leagueRecord.tier4[yearStr];

    if (inT1) {
      const gamesPlayed = inT1.won + inT1.drawn + inT1.lost;
      const expectedPLGames = PL_GAMES[year];
      if (gamesPlayed !== expectedPLGames) {
        delete data.leagueRecord.tier1[yearStr];
        data.leagueRecord.tier2[yearStr] = inT1;
        changes++;
      }
    }

    if (inT2) {
      delete data.leagueRecord.tier2[yearStr];
      data.leagueRecord.tier3[yearStr] = inT2;
      changes++;
    }

    if (inT3) {
      delete data.leagueRecord.tier3[yearStr];
      data.leagueRecord.tier4[yearStr] = inT3;
      changes++;
    }
  }

  if (changes > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`${file}: ${changes} tier changes`);
    totalChanges += changes;
  }
}

console.log(`\nTotal changes: ${totalChanges}`);
