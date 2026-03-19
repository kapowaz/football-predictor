const https = require('https');
const fs = require('fs');
const path = require('path');

const SEASONS_DIR = path.join(__dirname, '../src/data/league-history/seasons');
const CLUBS_DIR = path.join(__dirname, '../src/data/all-time-rank/clubs');

const args = process.argv.slice(2);
if (args.length < 1 || args.length > 2) {
  console.error('Usage: node build-season-data.cjs <startYear> [endYear]');
  console.error('  Year is the END year of the season (e.g. 1889 for 1888-89)');
  console.error('  Example: node build-season-data.cjs 1889');
  console.error('  Example: node build-season-data.cjs 1889 1892');
  process.exit(1);
}

const startYear = parseInt(args[0]);
const endYear = args[1] ? parseInt(args[1]) : startYear;

const knownCrestSlugs = new Set(
  fs.readdirSync(CLUBS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
);

const TEAM_NAME_TO_SLUG = {
  'accrington': 'accrington-fc',
  'accrington stanley': 'accrington-stanley',
  'afc bournemouth': 'afc-bournemouth',
  'afc wimbledon': 'afc-wimbledon',
  'aldershot town': 'aldershot-town',
  'ardwick': 'manchester-city',
  'arsenal': 'arsenal',
  'aston villa': 'aston-villa',
  'barnet': 'barnet',
  'barnsley': 'barnsley',
  'barrow': 'barrow',
  'birmingham': 'birmingham-city',
  'birmingham city': 'birmingham-city',
  'blackburn rovers': 'blackburn-rovers',
  'blackpool': 'blackpool',
  'bolton wanderers': 'bolton-wanderers',
  'bootle': 'bootle',
  'bradford city': 'bradford-city',
  'bradford (park avenue)': 'bradford-park-avenue',
  'bradford park avenue': 'bradford-park-avenue',
  'brentford': 'brentford',
  'brighton & hove albion': 'brighton-and-hove-albion',
  'brighton and hove albion': 'brighton-and-hove-albion',
  'bristol city': 'bristol-city',
  'bristol rovers': 'bristol-rovers',
  'bromley': 'bromley',
  'burnley': 'burnley',
  'burslem port vale': 'port-vale',
  'burton albion': 'burton-albion',
  'burton swifts': 'burton-swifts',
  'burton united': 'burton-united',
  'burton wanderers': 'burton-wanderers',
  'bury': 'bury',
  'cambridge united': 'cambridge-united',
  'cardiff city': 'cardiff-city',
  'carlisle united': 'carlisle-united',
  'charlton athletic': 'charlton-athletic',
  'chelsea': 'chelsea',
  'cheltenham town': 'cheltenham-town',
  'chesterfield': 'chesterfield',
  'clapton orient': 'leyton-orient',
  'colchester united': 'colchester-united',
  'coventry city': 'coventry-city',
  'crawley town': 'crawley-town',
  'crewe alexandra': 'crewe-alexandra',
  'crystal palace': 'crystal-palace',
  'darwen': 'darwen',
  'derby county': 'derby-county',
  'doncaster rovers': 'doncaster-rovers',
  'everton': 'everton',
  'exeter city': 'exeter-city',
  'fleetwood town': 'fleetwood-town',
  'forest green rovers': 'forest-green-rovers',
  'fulham': 'fulham',
  'gateshead': 'gateshead',
  'gillingham': 'gillingham',
  'glossop': 'glossop',
  'glossop north end': 'glossop',
  'grimsby town': 'grimsby-town',
  'halifax town': 'halifax-town',
  'harrogate town': 'harrogate-town',
  'hartlepool united': 'hartlepool-united',
  'huddersfield town': 'huddersfield-town',
  'hull city': 'hull-city',
  'ipswich town': 'ipswich-town',
  'leeds city': 'leeds-city',
  'leeds united': 'leeds-united',
  'leicester city': 'leicester-city',
  'leicester fosse': 'leicester-city',
  'leyton orient': 'leyton-orient',
  'lincoln city': 'lincoln-city',
  'liverpool': 'liverpool',
  'loughborough': 'loughborough',
  'luton town': 'luton-town',
  'manchester city': 'manchester-city',
  'manchester united': 'manchester-united',
  'mansfield town': 'mansfield-town',
  'merthyr town': 'merthyr-town',
  'middlesbrough': 'middlesbrough',
  'middlesbrough ironopolis': 'middlesbrough-ironopolis',
  'millwall': 'millwall',
  'millwall athletic': 'millwall',
  'milton keynes dons': 'milton-keynes-dons',
  'morecambe': 'morecambe',
  'new brighton tower': 'new-brighton-tower',
  'newcastle united': 'newcastle-united',
  'newport county': 'newport-county',
  'newton heath': 'manchester-united',
  'northampton town': 'northampton-town',
  'northwich victoria': 'northwich-victoria',
  'norwich city': 'norwich-city',
  'nottingham forest': 'nottingham-forest',
  'notts county': 'notts-county',
  'oldham athletic': 'oldham-athletic',
  'orient': 'leyton-orient',
  'oxford united': 'oxford-united',
  'peterborough united': 'peterborough-united',
  'plymouth argyle': 'plymouth-argyle',
  'port vale': 'port-vale',
  'portsmouth': 'portsmouth',
  'preston north end': 'preston-north-end',
  'queens park rangers': 'queens-park-rangers',
  'reading': 'reading',
  'rochdale': 'rochdale',
  'rotherham county': 'rotherham-county',
  'rotherham town': 'rotherham-town',
  'rotherham united': 'rotherham-united',
  'salford city': 'salford-city',
  'scunthorpe united': 'scunthorpe-united',
  'sheffield united': 'sheffield-united',
  'sheffield wednesday': 'sheffield-wednesday',
  'shrewsbury town': 'shrewsbury-town',
  'small heath': 'birmingham-city',
  'south shields': 'gateshead',
  'southampton': 'southampton',
  'southend united': 'southend-united',
  'stevenage': 'stevenage',
  'stockport county': 'stockport-county',
  'stoke': 'stoke-city',
  'stoke city': 'stoke-city',
  'sunderland': 'sunderland',
  'swansea city': 'swansea-city',
  'swansea town': 'swansea-city',
  'swindon town': 'swindon-town',
  'the wednesday': 'sheffield-wednesday',
  'tottenham hotspur': 'tottenham-hotspur',
  'tranmere rovers': 'tranmere-rovers',
  'walsall': 'walsall',
  'walsall town swifts': 'walsall',
  'watford': 'watford',
  'west bromwich albion': 'west-bromwich-albion',
  'west ham united': 'west-ham-united',
  'wigan athletic': 'wigan-athletic',
  'wimbledon': 'wimbledon',
  'wolverhampton wanderers': 'wolverhampton-wanderers',
  'woolwich arsenal': 'arsenal',
  'wrexham': 'wrexham',
  'wycombe wanderers': 'wycombe-wanderers',
  'yeovil town': 'yeovil-town',
  'york city': 'york-city',
};

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const request = (u) => {
      https.get(u, { headers: { 'User-Agent': 'football-predictor-bot/1.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const loc = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, u).toString();
          request(loc);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${u}`));
          return;
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error('Invalid JSON response')); }
        });
      }).on('error', reject);
    };
    request(url);
  });
}

function buildPageTitle(seasonStartYear) {
  const endYear = seasonStartYear + 1;
  const endYearStr = (endYear % 100 === 0) ? String(endYear) : String(endYear).slice(-2);
  return `${seasonStartYear}\u201393_Football_League`
    .replace(/\u201393/, `\u2013${endYearStr}`);
}

function stripHtmlTags(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#91;/g, '[')
    .replace(/&#93;/g, ']')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanTeamName(raw) {
  return raw
    .replace(/\(C\)/gi, '')
    .replace(/\(R\)/gi, '')
    .replace(/\(P\)/gi, '')
    .replace(/\(O\)/gi, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveSlug(teamName) {
  const lower = teamName.toLowerCase();
  if (TEAM_NAME_TO_SLUG[lower]) return TEAM_NAME_TO_SLUG[lower];

  const slug = lower
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  return slug || null;
}

function parseLeagueTable(tableHtml) {
  const teams = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;

  while ((match = rowRegex.exec(tableHtml)) !== null) {
    const rowHtml = match[1];
    const cells = [];
    const cellRegex = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
      cells.push(stripHtmlTags(cellMatch[1]));
    }

    if (cells.length < 7) continue;

    const posStr = cells[0].replace(/[^0-9]/g, '');
    const pos = parseInt(posStr);
    if (isNaN(pos) || pos < 1) continue;

    const teamName = cleanTeamName(cells[1]);
    if (!teamName || /^Team$/i.test(teamName)) continue;

    const slug = resolveSlug(teamName);
    if (slug) {
      teams.push({ pos, slug, raw: teamName });
    } else {
      console.warn(`  WARNING: Could not resolve team: "${teamName}"`);
    }
  }

  teams.sort((a, b) => a.pos - b.pos);
  return teams.map(t => t.slug);
}

function detectDivisionTier(sectionTitle) {
  const lower = sectionTitle.toLowerCase();
  if (/premier\s*league/i.test(lower)) return { tier: 1, name: sectionTitle };
  if (/^league\s+table$/i.test(lower)) return { tier: 1, name: 'Football League' };
  if (/^first\s+division/i.test(lower)) return { tier: 1, name: 'First Division' };
  if (/^second\s+division/i.test(lower)) return { tier: 2, name: 'Second Division' };
  if (/third\s+division\s+south/i.test(lower)) return { tier: 3, name: 'Third Division South' };
  if (/third\s+division\s+north/i.test(lower)) return { tier: 3, name: 'Third Division North' };
  if (/^third\s+division/i.test(lower)) return { tier: 3, name: 'Third Division' };
  if (/^fourth\s+division/i.test(lower)) return { tier: 4, name: 'Fourth Division' };
  if (/championship/i.test(lower)) return { tier: 2, name: 'Championship' };
  if (/league\s+one/i.test(lower)) return { tier: 3, name: 'League One' };
  if (/league\s+two/i.test(lower)) return { tier: 4, name: 'League Two' };
  return null;
}

async function fetchPageSections(pageTitle) {
  const encodedTitle = encodeURIComponent(pageTitle);
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodedTitle}&prop=sections&format=json`;
  const data = await fetchJson(url);
  if (data.error) throw new Error(`API error: ${data.error.info}`);
  return data.parse.sections || [];
}

async function fetchSection(pageTitle, sectionIndex) {
  const encodedTitle = encodeURIComponent(pageTitle);
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodedTitle}&prop=text&section=${sectionIndex}&format=json`;
  const data = await fetchJson(url);
  if (data.error) throw new Error(`API error: ${data.error.info}`);
  return data.parse.text['*'] || '';
}

async function processYear(year) {
  const seasonStart = year - 1;
  const seasonLabel = year >= 2000
    ? `${seasonStart}-${String(year).slice(-2)}`
    : `${seasonStart}-${String(year).slice(-2)}`;

  const pageTitle = buildPageTitle(seasonStart);
  console.log(`\nFetching ${seasonLabel} (page: ${pageTitle})`);

  let sections;
  try {
    sections = await fetchPageSections(pageTitle);
  } catch (err) {
    console.error(`  Failed to fetch sections: ${err.message}`);
    return null;
  }

  const divisions = [];

  for (const section of sections) {
    const divInfo = detectDivisionTier(section.line);
    if (!divInfo) continue;

    console.log(`  Parsing section "${section.line}" (index ${section.index}) → tier ${divInfo.tier}`);

    try {
      const html = await fetchSection(pageTitle, section.index);
      const tableMatch = html.match(/<table[^>]*class="wikitable"[^>]*>([\s\S]*?)<\/table>/i);
      if (!tableMatch) {
        console.warn(`    No wikitable found in section`);
        continue;
      }

      const teams = parseLeagueTable(tableMatch[0]);
      if (teams.length === 0) {
        console.warn(`    No teams parsed from table`);
        continue;
      }

      const knownCount = teams.filter(t => knownCrestSlugs.has(t)).length;
      console.log(`    Found ${teams.length} teams (${knownCount} in club data)`);

      divisions.push({
        tier: divInfo.tier,
        name: divInfo.name,
        teamCount: teams.length,
        zones: [],
        teams,
      });
    } catch (err) {
      console.error(`    Error parsing section: ${err.message}`);
    }
  }

  if (divisions.length === 0) {
    console.warn(`  No divisions found`);
    return null;
  }

  return {
    year,
    season: seasonLabel,
    nextYear: year + 1,
    divisions: divisions.sort((a, b) => a.tier - b.tier),
  };
}

async function main() {
  const results = [];

  for (let year = startYear; year <= endYear; year++) {
    const result = await processYear(year);
    if (result) results.push(result);
    if (year < endYear) await new Promise(r => setTimeout(r, 500));
  }

  if (results.length === 0) {
    console.error('\nNo seasons were successfully parsed.');
    process.exit(1);
  }

  const outFile = path.join(SEASONS_DIR, `fetched-${startYear}-${endYear}.json`);
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2) + '\n');
  console.log(`\nWritten ${results.length} season(s) to ${outFile}`);
  console.log('Review the output and merge into the appropriate era file.');
  console.log('NOTE: Zone definitions are left empty — fill them in manually based on the era.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
