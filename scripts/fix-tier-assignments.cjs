const fs = require('fs');
const path = require('path');

const seasonsDir = path.join(__dirname, '..', 'src', 'data', 'league-history', 'seasons');
const clubsDir = path.join(__dirname, '..', 'src', 'data', 'all-time-rank', 'clubs');

// Load all seasons from JSON files
const allSeasons = [];
for (const file of fs.readdirSync(seasonsDir).filter(f => f.endsWith('.json'))) {
  const data = JSON.parse(fs.readFileSync(path.join(seasonsDir, file), 'utf8'));
  allSeasons.push(...data);
}
allSeasons.sort((a, b) => a.year - b.year);

// Build lookup: slug -> year -> correctTier
const correctTierMap = new Map();
for (const season of allSeasons) {
  for (const div of season.divisions) {
    if (div.teams.length === 0) continue;
    for (const slug of div.teams) {
      if (!correctTierMap.has(slug)) {
        correctTierMap.set(slug, new Map());
      }
      correctTierMap.get(slug).set(season.year, div.tier);
    }
  }
}

let totalMoves = 0;
let totalClubsFixed = 0;

// Process each club file
for (const file of fs.readdirSync(clubsDir).filter(f => f.endsWith('.json'))) {
  const filePath = path.join(clubsDir, file);
  const club = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const slug = club.badge;
  const clubTierMap = correctTierMap.get(slug);

  if (!clubTierMap) continue;

  let clubMoves = 0;
  const moves = [];

  // Find all records that need to be moved
  for (const tier of ['tier1', 'tier2', 'tier3', 'tier4']) {
    const tierNum = parseInt(tier.slice(-1));
    const years = Object.keys(club.leagueRecord[tier]);

    for (const yearStr of years) {
      const year = Number(yearStr);
      const correctTier = clubTierMap.get(year);

      if (correctTier !== undefined && correctTier !== tierNum) {
        moves.push({
          year: yearStr,
          fromTier: tier,
          toTier: `tier${correctTier}`,
          record: club.leagueRecord[tier][yearStr],
        });
      }
    }
  }

  if (moves.length === 0) continue;

  // Apply moves
  for (const move of moves) {
    // Remove from old tier
    delete club.leagueRecord[move.fromTier][move.year];

    // Add to correct tier
    club.leagueRecord[move.toTier][move.year] = move.record;

    console.log(`${slug}: ${move.year} moved from ${move.fromTier} to ${move.toTier}`);
    clubMoves++;
  }

  // Sort the year keys within each tier
  for (const tier of ['tier1', 'tier2', 'tier3', 'tier4']) {
    const sorted = {};
    const years = Object.keys(club.leagueRecord[tier]).sort((a, b) => Number(a) - Number(b));
    for (const y of years) {
      sorted[y] = club.leagueRecord[tier][y];
    }
    club.leagueRecord[tier] = sorted;
  }

  // Write updated file
  fs.writeFileSync(filePath, JSON.stringify(club, null, 2) + '\n');
  totalMoves += clubMoves;
  totalClubsFixed++;
  console.log(`  → ${clubMoves} records moved for ${slug}`);
}

console.log(`\nDone: ${totalMoves} records moved across ${totalClubsFixed} clubs`);
