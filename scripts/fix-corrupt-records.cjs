const fs = require('fs');
const path = require('path');

const seasonsDir = path.join(__dirname, '..', 'src', 'data', 'league-history', 'seasons');
const clubsDir = path.join(__dirname, '..', 'src', 'data', 'all-time-rank', 'clubs');

const allSeasons = [];
for (const file of fs.readdirSync(seasonsDir).filter(f => f.endsWith('.json'))) {
  const data = JSON.parse(fs.readFileSync(path.join(seasonsDir, file), 'utf8'));
  allSeasons.push(...data);
}
allSeasons.sort((a, b) => a.year - b.year);

const seasonsByYear = new Map();
for (const s of allSeasons) seasonsByYear.set(s.year, s);

function getTeamCount(slug, year) {
  const season = seasonsByYear.get(year);
  if (!season) return null;
  for (const div of season.divisions) {
    if (div.teams.includes(slug)) return div.teamCount;
  }
  return null;
}

function readClub(slug) {
  const p = path.join(clubsDir, `${slug}.json`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeClub(slug, data) {
  const p = path.join(clubsDir, `${slug}.json`);
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}

// ─── Bristol Rovers: column-shifted records ──────────────────────────────
// The parser read [D, L, F, A, Pts] as [W, D, L, GF, GA].
// Fix: correct_drawn=cur.won, correct_lost=cur.drawn, correct_GF=cur.lost,
//      correct_GA=cur.goalsFor, correct_won=(teamCount-1)*2 - cur.won - cur.drawn
{
  const club = readClub('bristol-rovers');
  const shiftedRecords = [];

  for (const tier of ['tier1', 'tier2', 'tier3', 'tier4']) {
    for (const [yearStr, rec] of Object.entries(club.leagueRecord[tier])) {
      const total = rec.won + rec.drawn + rec.lost;
      if (total > 50) {
        shiftedRecords.push({ tier, year: yearStr, rec });
      }
    }
  }

  for (const { tier, year, rec } of shiftedRecords) {
    const yearNum = Number(year);

    // 2015 tier1 is Conference Premier (tier 5), not Football League
    if (year === '2015' && tier === 'tier1') {
      delete club.leagueRecord[tier][year];
      console.log(`bristol-rovers: removed ${year} from ${tier} (Conference Premier, not FL)`);
      continue;
    }

    const tc = getTeamCount('bristol-rovers', yearNum);
    if (!tc) {
      console.warn(`bristol-rovers: no teamCount for ${year}, skipping`);
      continue;
    }
    const totalGames = (tc - 1) * 2;
    const newWon = totalGames - rec.won - rec.drawn;
    const newDrawn = rec.won;
    const newLost = rec.drawn;
    const newGF = rec.lost;
    const newGA = rec.goalsFor;

    if (newWon < 0) {
      console.warn(`bristol-rovers ${year}: calculated negative won=${newWon}, skipping`);
      continue;
    }

    club.leagueRecord[tier][year] = {
      won: newWon,
      drawn: newDrawn,
      lost: newLost,
      goalsFor: newGF,
      goalsAgainst: newGA,
    };
    console.log(
      `bristol-rovers ${year} ${tier}: fixed column shift → W${newWon} D${newDrawn} L${newLost} F${newGF} A${newGA}`
    );
  }

  writeClub('bristol-rovers', club);
}

// ─── Forest Green Rovers 2018: corrupt drawn=220 ────────────────────────
// Wikipedia: 2017-18 EFL League Two: W13 D8 L25 GF54 GA77
{
  const club = readClub('forest-green-rovers');
  club.leagueRecord.tier4['2018'] = {
    won: 13,
    drawn: 8,
    lost: 25,
    goalsFor: 54,
    goalsAgainst: 77,
  };
  writeClub('forest-green-rovers', club);
  console.log('forest-green-rovers 2018 tier4: fixed from Wikipedia (W13 D8 L25 F54 A77)');
}

// ─── Rochdale 1996: 73 games played (corrupt) ───────────────────────────
// Need to look up correct data. Rochdale 1995-96 was in Division 3 (tier 4 at the time, now tier3 after our fix)
// Per Wikipedia: Rochdale 1995-96 Third Division: Pos=17, W=15, D=11, L=20, GF=57, GA=70
// But our current data might have the column shift too. Let me check.
{
  const club = readClub('rochdale');
  const rec = club.leagueRecord.tier3?.['1996'] || club.leagueRecord.tier4?.['1996'];
  if (rec) {
    const total = rec.won + rec.drawn + rec.lost;
    if (total > 50) {
      // Column-shifted like Bristol Rovers
      const tc = getTeamCount('rochdale', 1996);
      if (tc) {
        const totalGames = (tc - 1) * 2;
        const tier = club.leagueRecord.tier3?.['1996'] ? 'tier3' : 'tier4';
        const newWon = totalGames - rec.won - rec.drawn;
        club.leagueRecord[tier]['1996'] = {
          won: newWon,
          drawn: rec.won,
          lost: rec.drawn,
          goalsFor: rec.lost,
          goalsAgainst: rec.goalsFor,
        };
        console.log(`rochdale 1996 ${tier}: fixed column shift → W${newWon} D${rec.won} L${rec.drawn} F${rec.lost} A${rec.goalsFor}`);
      }
    }
  }
  writeClub('rochdale', club);
}

console.log('\nDone fixing corrupt records');
