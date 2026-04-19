const fs = require('fs');

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.error('Usage: node build-club-data.js <input.json> <output.json>');
  process.exit(1);
}

const input = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

const leagueRecord = { tier1: {}, tier2: {}, tier3: {}, tier4: {} };

for (const season of input.seasons) {
  const parts = season.split(':').map(Number);
  const [tier, year, w, d, l, gf, ga] = parts;
  leagueRecord[`tier${tier}`][year] = {
    won: w,
    drawn: d,
    lost: l,
    goalsFor: gf,
    goalsAgainst: ga,
  };
}

const emptyTieredHonours = { tier1: [], tier2: [], tier3: [], tier4: [] };

const output = {
  name: input.name,
  shortName: input.shortName,
  badge: input.badge,
  founded: input.founded,
  currentTier: input.currentTier,
  leagueRecord,
  honours: {
    leagueTitles: { ...emptyTieredHonours, ...input.honours?.leagueTitles },
    leagueRunnersUp: { ...emptyTieredHonours, ...input.honours?.leagueRunnersUp },
    playoffWinners: { ...emptyTieredHonours, ...input.honours?.playoffWinners },
    faCupWinners: input.honours?.faCupWinners || [],
    faCupRunnersUp: input.honours?.faCupRunnersUp || [],
    leagueCupWinners: input.honours?.leagueCupWinners || [],
    leagueCupRunnersUp: input.honours?.leagueCupRunnersUp || [],
  },
  europeanHonours: {
    championsLeagueWinners: input.europeanHonours?.championsLeagueWinners || [],
    championsLeagueRunnersUp: input.europeanHonours?.championsLeagueRunnersUp || [],
    europaLeagueWinners: input.europeanHonours?.europaLeagueWinners || [],
    europaLeagueRunnersUp: input.europeanHonours?.europaLeagueRunnersUp || [],
    conferenceLeagueWinners: input.europeanHonours?.conferenceLeagueWinners || [],
    conferenceLeagueRunnersUp: input.europeanHonours?.conferenceLeagueRunnersUp || [],
  },
  averageAttendance: input.averageAttendance,
};

fs.writeFileSync(outputFile, JSON.stringify(output, null, 2) + '\n');

const totalSeasons = Object.keys(output.leagueRecord.tier1).length +
  Object.keys(output.leagueRecord.tier2).length +
  Object.keys(output.leagueRecord.tier3).length +
  Object.keys(output.leagueRecord.tier4).length;
console.log(`Generated ${outputFile} (${totalSeasons} seasons)`);
