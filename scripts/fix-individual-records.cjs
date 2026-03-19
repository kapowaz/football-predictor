const fs = require('fs');
const path = require('path');

const clubsDir = path.join(__dirname, '..', 'src', 'data', 'all-time-rank', 'clubs');

function readClub(slug) {
  return JSON.parse(fs.readFileSync(path.join(clubsDir, `${slug}.json`), 'utf8'));
}

function writeClub(slug, data) {
  fs.writeFileSync(path.join(clubsDir, `${slug}.json`), JSON.stringify(data, null, 2) + '\n');
}

function fixRecord(slug, tier, year, correct) {
  const club = readClub(slug);
  const old = club.leagueRecord[tier][String(year)];
  if (!old) {
    console.warn(`  WARNING: ${slug} has no ${tier} record for ${year}`);
    return;
  }
  club.leagueRecord[tier][String(year)] = correct;
  writeClub(slug, club);
  const total = correct.won + correct.drawn + correct.lost;
  console.log(
    `  ${slug} ${year} ${tier}: ` +
    `W${old.won}→${correct.won} D${old.drawn}→${correct.drawn} L${old.lost}→${correct.lost} ` +
    `GF${old.goalsFor}→${correct.goalsFor} GA${old.goalsAgainst}→${correct.goalsAgainst} (total=${total})`
  );
}

console.log('=== Arsenal early years (correct Football League data) ===');
fixRecord('arsenal', 'tier2', 1897, { won: 13, drawn: 4, lost: 13, goalsFor: 68, goalsAgainst: 70 });
fixRecord('arsenal', 'tier2', 1900, { won: 16, drawn: 4, lost: 14, goalsFor: 61, goalsAgainst: 43 });
fixRecord('arsenal', 'tier2', 1902, { won: 18, drawn: 6, lost: 10, goalsFor: 50, goalsAgainst: 26 });
fixRecord('arsenal', 'tier2', 1903, { won: 20, drawn: 8, lost: 6, goalsFor: 66, goalsAgainst: 30 });
fixRecord('arsenal', 'tier2', 1904, { won: 21, drawn: 7, lost: 6, goalsFor: 91, goalsAgainst: 22 });

console.log('\n=== Lincoln City early years ===');
fixRecord('lincoln-city', 'tier2', 1901, { won: 13, drawn: 7, lost: 14, goalsFor: 43, goalsAgainst: 39 });
fixRecord('lincoln-city', 'tier2', 1903, { won: 12, drawn: 6, lost: 16, goalsFor: 46, goalsAgainst: 53 });
fixRecord('lincoln-city', 'tier2', 1904, { won: 11, drawn: 8, lost: 15, goalsFor: 41, goalsAgainst: 58 });
fixRecord('lincoln-city', 'tier2', 1905, { won: 12, drawn: 7, lost: 15, goalsFor: 42, goalsAgainst: 40 });
fixRecord('lincoln-city', 'tier2', 1906, { won: 12, drawn: 6, lost: 20, goalsFor: 69, goalsAgainst: 72 });
fixRecord('lincoln-city', 'tier2', 1907, { won: 12, drawn: 4, lost: 22, goalsFor: 46, goalsAgainst: 73 });

console.log('\n=== Norwich City 1930 ===');
fixRecord('norwich-city', 'tier3', 1930, { won: 18, drawn: 10, lost: 14, goalsFor: 88, goalsAgainst: 77 });

console.log('\n=== Doncaster Rovers 1938 ===');
fixRecord('doncaster-rovers', 'tier3', 1938, { won: 21, drawn: 12, lost: 9, goalsFor: 74, goalsAgainst: 49 });

console.log('\n=== Swansea City 1935 ===');
fixRecord('swansea-city', 'tier2', 1935, { won: 14, drawn: 8, lost: 20, goalsFor: 56, goalsAgainst: 67 });

console.log('\n=== Leicester City 1954 ===');
fixRecord('leicester-city', 'tier2', 1954, { won: 23, drawn: 10, lost: 9, goalsFor: 97, goalsAgainst: 60 });

console.log('\n=== Bolton Wanderers 1963 ===');
fixRecord('bolton-wanderers', 'tier1', 1963, { won: 15, drawn: 5, lost: 22, goalsFor: 55, goalsAgainst: 75 });

console.log('\n=== Port Vale ===');
fixRecord('port-vale', 'tier3', 1963, { won: 23, drawn: 8, lost: 15, goalsFor: 72, goalsAgainst: 58 });
fixRecord('port-vale', 'tier2', 1992, { won: 10, drawn: 15, lost: 21, goalsFor: 42, goalsAgainst: 59 });
fixRecord('port-vale', 'tier4', 2013, { won: 21, drawn: 15, lost: 10, goalsFor: 87, goalsAgainst: 52 });

console.log('\n=== Cardiff City ===');
fixRecord('cardiff-city', 'tier2', 2009, { won: 19, drawn: 17, lost: 10, goalsFor: 65, goalsAgainst: 53 });
fixRecord('cardiff-city', 'tier2', 2017, { won: 17, drawn: 11, lost: 18, goalsFor: 60, goalsAgainst: 61 });
fixRecord('cardiff-city', 'tier2', 2018, { won: 27, drawn: 9, lost: 10, goalsFor: 69, goalsAgainst: 39 });

console.log('\n=== QPR 2009 ===');
fixRecord('queens-park-rangers', 'tier2', 2009, { won: 15, drawn: 16, lost: 15, goalsFor: 42, goalsAgainst: 44 });

console.log('\n=== Huddersfield Town ===');
fixRecord('huddersfield-town', 'tier2', 1973, { won: 8, drawn: 17, lost: 17, goalsFor: 36, goalsAgainst: 56 });
fixRecord('huddersfield-town', 'tier3', 1982, { won: 15, drawn: 12, lost: 19, goalsFor: 64, goalsAgainst: 59 });

console.log('\n=== Portsmouth ===');
fixRecord('portsmouth', 'tier3', 1978, { won: 7, drawn: 17, lost: 22, goalsFor: 41, goalsAgainst: 75 });
fixRecord('portsmouth', 'tier1', 1988, { won: 7, drawn: 14, lost: 19, goalsFor: 36, goalsAgainst: 66 });

console.log('\n=== Cambridge United 1985 ===');
fixRecord('cambridge-united', 'tier3', 1985, { won: 4, drawn: 9, lost: 33, goalsFor: 37, goalsAgainst: 95 });

console.log('\n=== Hartlepool United 2017 ===');
fixRecord('hartlepool-united', 'tier4', 2017, { won: 11, drawn: 13, lost: 22, goalsFor: 54, goalsAgainst: 75 });

console.log('\n=== Sheffield United 2018 ===');
fixRecord('sheffield-united', 'tier2', 2018, { won: 20, drawn: 9, lost: 17, goalsFor: 62, goalsAgainst: 55 });

console.log('\n=== Preston North End 2024 ===');
fixRecord('preston-north-end', 'tier2', 2024, { won: 18, drawn: 9, lost: 19, goalsFor: 56, goalsAgainst: 67 });

console.log('\nDone fixing individual records');
