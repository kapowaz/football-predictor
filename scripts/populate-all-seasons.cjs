const https = require('https');
const fs = require('fs');
const path = require('path');

const SEASONS_DIR = path.join(__dirname, '../src/data/league-history/seasons');
const CLUBS_DIR = path.join(__dirname, '../src/data/all-time-rank/clubs');

const knownCrestSlugs = new Set(
  fs.readdirSync(CLUBS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
);

const TEAM_NAME_TO_SLUG = {
  'aberdare athletic': 'aberdare-athletic',
  'accrington': 'accrington-fc',
  'accrington f.c.': 'accrington-fc',
  'accrington stanley': 'accrington-stanley',
  'afc bournemouth': 'afc-bournemouth',
  'afc wimbledon': 'afc-wimbledon',
  'aldershot': 'aldershot-town',
  'aldershot town': 'aldershot-town',
  'ardwick': 'manchester-city',
  'arsenal': 'arsenal',
  'ashington': 'ashington',
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
  'bournemouth': 'afc-bournemouth',
  'bradford': 'bradford-park-avenue',
  'bournemouth & boscombe athletic': 'afc-bournemouth',
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
  'chester': 'chester-city',
  'chester city': 'chester-city',
  'cheltenham town': 'cheltenham-town',
  'chesterfield': 'chesterfield',
  'clapton orient': 'leyton-orient',
  'colchester united': 'colchester-united',
  'coventry city': 'coventry-city',
  'crawley town': 'crawley-town',
  'crewe alexandra': 'crewe-alexandra',
  'crystal palace': 'crystal-palace',
  'dagenham & redbridge': 'dagenham-and-redbridge',
  'dagenham and redbridge': 'dagenham-and-redbridge',
  'darlington': 'darlington',
  'darwen': 'darwen',
  'derby county': 'derby-county',
  'doncaster rovers': 'doncaster-rovers',
  'durham city': 'durham-city',
  'everton': 'everton',
  'exeter city': 'exeter-city',
  'fleetwood town': 'fleetwood-town',
  'forest green rovers': 'forest-green-rovers',
  'fulham': 'fulham',
  'gainsborough trinity': 'gainsborough-trinity',
  'gateshead': 'gateshead',
  'gillingham': 'gillingham',
  'glossop': 'glossop',
  'glossop north end': 'glossop',
  'grimsby town': 'grimsby-town',
  'halifax town': 'halifax-town',
  'harrogate town': 'harrogate-town',
  'hartlepool': 'hartlepool-united',
  'hartlepool united': 'hartlepool-united',
  'hartlepools united': 'hartlepool-united',
  'hereford united': 'hereford-united',
  'huddersfield town': 'huddersfield-town',
  'hull city': 'hull-city',
  'ipswich town': 'ipswich-town',
  'kidderminster harriers': 'kidderminster-harriers',
  'boston united': 'boston-united',
  'maidstone united': 'maidstone-united',
  'leeds city': 'leeds-city',
  'leeds united': 'leeds-united',
  'leicester city': 'leicester-city',
  'leicester fosse': 'leicester-city',
  'leyton orient': 'leyton-orient',
  'lincoln city': 'lincoln-city',
  'liverpool': 'liverpool',
  'loughborough': 'loughborough',
  'loughborough town': 'loughborough',
  'luton town': 'luton-town',
  'macclesfield town': 'macclesfield-town',
  'manchester city': 'manchester-city',
  'manchester united': 'manchester-united',
  'mansfield town': 'mansfield-town',
  'merthyr town': 'merthyr-town',
  'middlesbrough': 'middlesbrough',
  'middlesbrough ironopolis': 'middlesbrough-ironopolis',
  'millwall': 'millwall',
  'millwall athletic': 'millwall',
  'milton keynes dons': 'milton-keynes-dons',
  'mk dons': 'milton-keynes-dons',
  'morecambe': 'morecambe',
  'nelson': 'nelson',
  'new brighton': 'new-brighton',
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
  "queen's park rangers": 'queens-park-rangers',
  'reading': 'reading',
  'rochdale': 'rochdale',
  'rotherham county': 'rotherham-county',
  'rotherham town': 'rotherham-town',
  'rotherham town f.c.': 'rotherham-town',
  'darwen f.c.': 'darwen',
  'rotherham united': 'rotherham-united',
  'rushden & diamonds': 'rushden-and-diamonds',
  'salford city': 'salford-city',
  'scarborough': 'scarborough',
  'scunthorpe & lindsey united': 'scunthorpe-united',
  'scunthorpe united': 'scunthorpe-united',
  'sheffield united': 'sheffield-united',
  'sheffield wednesday': 'sheffield-wednesday',
  'shrewsbury': 'shrewsbury-town',
  'shrewsbury town': 'shrewsbury-town',
  'small heath': 'birmingham-city',
  'small heath alliance': 'birmingham-city',
  'south shields': 'gateshead',
  'south shields f.c.': 'gateshead',
  'southampton': 'southampton',
  'southend united': 'southend-united',
  'southport': 'southport',
  'stalybridge celtic': 'stalybridge-celtic',
  'stevenage': 'stevenage',
  'stevenage borough': 'stevenage',
  'stockport county': 'stockport-county',
  'stoke': 'stoke-city',
  'stoke city': 'stoke-city',
  'sunderland': 'sunderland',
  'sutton united': 'sutton-united',
  'swansea city': 'swansea-city',
  'swansea town': 'swansea-city',
  'swindon town': 'swindon-town',
  'thames': 'thames',
  'the wednesday': 'sheffield-wednesday',
  'torquay united': 'torquay-united',
  'tottenham hotspur': 'tottenham-hotspur',
  'tranmere rovers': 'tranmere-rovers',
  'walsall': 'walsall',
  'walsall town swifts': 'walsall',
  'watford': 'watford',
  'west bromwich albion': 'west-bromwich-albion',
  'west ham united': 'west-ham-united',
  'wigan athletic': 'wigan-athletic',
  'wigan borough': 'wigan-borough',
  'wimbledon': 'wimbledon',
  'wolverhampton wanderers': 'wolverhampton-wanderers',
  'woolwich arsenal': 'arsenal',
  'workington': 'workington',
  'wrexham': 'wrexham',
  'wycombe wanderers': 'wycombe-wanderers',
  'yeovil town': 'yeovil-town',
  'york city': 'york-city',
};

function fetchJson(url, retries = 3) {
  return new Promise((resolve, reject) => {
    const request = (u, attempt) => {
      https.get(u, { headers: { 'User-Agent': 'football-predictor-bot/1.0 (data research project)' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const loc = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, u).toString();
          request(loc, attempt);
          return;
        }
        if (res.statusCode === 429) {
          const retryAfter = parseInt(res.headers['retry-after'] || '60');
          if (attempt < retries) {
            const waitSec = Math.min(retryAfter, 120);
            console.warn(`    Rate limited, waiting ${waitSec}s (attempt ${attempt + 1}/${retries})...`);
            setTimeout(() => request(u, attempt + 1), waitSec * 1000);
          } else {
            reject(new Error(`Rate limited after ${retries} attempts`));
          }
          res.resume();
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
          catch (e) { reject(new Error('Invalid JSON')); }
        });
      }).on('error', reject);
    };
    request(url, 0);
  });
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
function range(s, e) { return Array.from({length: e - s + 1}, (_, i) => s + i); }

function stripHtmlTags(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#91;/g, '[')
    .replace(/&#93;/g, ']')
    .replace(/&\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanTeamName(raw) {
  return raw
    .replace(/\(C\)/gi, '')
    .replace(/\(R\)/gi, '')
    .replace(/\(P\)/gi, '')
    .replace(/\(O\)/gi, '')
    .replace(/\(D\)/gi, '')
    .replace(/\(A\)/gi, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveSlug(teamName) {
  const lower = teamName.toLowerCase().trim();
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
  let rowIndex = 0;

  while ((match = rowRegex.exec(tableHtml)) !== null) {
    const rowHtml = match[1];
    const cells = [];
    const cellRegex = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
      cells.push(cellMatch[1]);
    }

    if (cells.length < 5) continue;

    const firstCellText = stripHtmlTags(cells[0]);
    const posStr = firstCellText.replace(/[^0-9]/g, '');
    const pos = parseInt(posStr);

    let teamCellIndex;
    let position;

    if (!isNaN(pos) && pos >= 1 && pos <= 100) {
      teamCellIndex = 1;
      position = pos;
    } else {
      const hasLink = /<a\s/i.test(cells[0]);
      if (hasLink && cells.length >= 5) {
        teamCellIndex = 0;
        rowIndex++;
        position = rowIndex;
      } else {
        continue;
      }
    }

    if (teamCellIndex >= cells.length) continue;

    const rawTeamHtml = cells[teamCellIndex];
    const linkMatch = rawTeamHtml.match(/<a[^>]*title="([^"]*)"[^>]*>/i);
    let teamName;
    if (linkMatch) {
      teamName = linkMatch[1]
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/ season.*$/i, '')
        .replace(/\d{4}[–\-]?\d{0,4}.*$/i, '')
        .replace(/ F\.?C\.?\s*$/i, '')
        .replace(/ A\.?F\.?C\.?\s*$/i, '')
        .trim();

      if (!TEAM_NAME_TO_SLUG[teamName.toLowerCase().trim()]) {
        teamName = teamName.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
      }
    }

    if (!teamName || teamName.length < 2) {
      teamName = stripHtmlTags(rawTeamHtml);
    }

    teamName = cleanTeamName(teamName);
    if (!teamName || /^(Team|Club|Pos|#)$/i.test(teamName)) continue;

    const slug = resolveSlug(teamName);
    if (slug) {
      teams.push({ pos: position, slug, raw: teamName });
    } else {
      console.warn(`    WARNING: Could not resolve team: "${teamName}"`);
    }
  }

  teams.sort((a, b) => a.pos - b.pos);
  return teams.map(t => t.slug);
}

function buildSeasonStr(year) {
  const start = year - 1;
  const endStr = (year % 100 === 0) ? String(year) : String(year).slice(-2);
  return `${start}\u2013${endStr}`;
}

async function fetchSections(pageTitle) {
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=sections&format=json`;
  const data = await fetchJson(url);
  if (data.error) throw new Error(`API error: ${data.error.info}`);
  return data.parse.sections || [];
}

async function fetchSectionHtml(pageTitle, sectionIndex) {
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=text&section=${sectionIndex}&format=json`;
  const data = await fetchJson(url);
  if (data.error) throw new Error(`API error: ${data.error.info}`);
  return data.parse.text['*'] || '';
}

async function fetchTeamsFromSection(pageTitle, sectionIndex) {
  const html = await fetchSectionHtml(pageTitle, sectionIndex);
  const tables = [];
  const tableRegex = /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>([\s\S]*?)<\/table>/gi;
  let m;
  while ((m = tableRegex.exec(html)) !== null) {
    tables.push(m[0]);
  }

  for (const table of tables) {
    const teams = parseLeagueTable(table);
    if (teams.length >= 8) return teams;
  }

  for (const table of tables) {
    const teams = parseLeagueTable(table);
    if (teams.length >= 2) return teams;
  }

  return [];
}

function getPageConfigs(year) {
  const ss = buildSeasonStr(year);

  if (year <= 1892) {
    return [{
      pageTitles: [`${ss}_Football_League`],
      sectionMap: { 'final league table': { tier: 1, name: 'Football League' } }
    }];
  }

  if (year <= 1920) {
    return [{
      pageTitles: [`${ss}_Football_League`],
      sectionMap: {
        'first division': { tier: 1, name: 'First Division' },
        'second division': { tier: 2, name: 'Second Division' }
      }
    }];
  }

  if (year <= 1958) {
    const sections = {
      'first division': { tier: 1, name: 'First Division' },
      'second division': { tier: 2, name: 'Second Division' },
    };
    if (year === 1921) {
      sections['third division'] = { tier: 3, name: 'Third Division' };
    } else {
      sections['third division south'] = { tier: 3, name: 'Third Division South' };
      sections['third division north'] = { tier: 3, name: 'Third Division North' };
    }
    return [{
      pageTitles: [`${ss}_Football_League`],
      sectionMap: sections
    }];
  }

  if (year <= 1992) {
    return [{
      pageTitles: [`${ss}_Football_League`],
      sectionMap: {
        'first division': { tier: 1, name: 'First Division' },
        'second division': { tier: 2, name: 'Second Division' },
        'third division': { tier: 3, name: 'Third Division' },
        'fourth division': { tier: 4, name: 'Fourth Division' }
      }
    }];
  }

  if (year <= 2004) {
    return [
      {
        pageTitles: [`${ss}_FA_Premier_League`, `${ss}_Premier_League`],
        sectionMap: {
          'league table': { tier: 1, name: 'Premier League' },
          'final league table': { tier: 1, name: 'Premier League' }
        }
      },
      {
        pageTitles: [`${ss}_Football_League`],
        sectionMap: {
          'first division': { tier: 2, name: 'First Division' },
          'second division': { tier: 3, name: 'Second Division' },
          'third division': { tier: 4, name: 'Third Division' }
        }
      }
    ];
  }

  if (year <= 2016) {
    return [
      {
        pageTitles: [`${ss}_Premier_League`, `${ss}_FA_Premier_League`],
        sectionMap: {
          'league table': { tier: 1, name: 'Premier League' },
          'final league table': { tier: 1, name: 'Premier League' }
        }
      },
      {
        pageTitles: [`${ss}_Football_League_Championship`],
        sectionMap: {
          'league table': { tier: 2, name: 'Championship' },
          'final league table': { tier: 2, name: 'Championship' }
        }
      },
      {
        pageTitles: [`${ss}_Football_League_One`, `${ss}_League_One`],
        sectionMap: {
          'league table': { tier: 3, name: 'League One' },
          'final league table': { tier: 3, name: 'League One' }
        }
      },
      {
        pageTitles: [`${ss}_Football_League_Two`, `${ss}_League_Two`],
        sectionMap: {
          'league table': { tier: 4, name: 'League Two' },
          'final league table': { tier: 4, name: 'League Two' }
        }
      },
      {
        pageTitles: [`${ss}_Football_League`],
        sectionMap: {
          'championship': { tier: 2, name: 'Championship' },
          'league one': { tier: 3, name: 'League One' },
          'league two': { tier: 4, name: 'League Two' }
        }
      }
    ];
  }

  return [
    {
      pageTitles: [`${ss}_Premier_League`],
      sectionMap: {
        'league table': { tier: 1, name: 'Premier League' },
        'final league table': { tier: 1, name: 'Premier League' }
      }
    },
    {
      pageTitles: [`${ss}_EFL_Championship`],
      sectionMap: {
        'league table': { tier: 2, name: 'EFL Championship' },
        'final league table': { tier: 2, name: 'EFL Championship' }
      }
    },
    {
      pageTitles: [`${ss}_EFL_League_One`],
      sectionMap: {
        'league table': { tier: 3, name: 'EFL League One' },
        'final league table': { tier: 3, name: 'EFL League One' }
      }
    },
    {
      pageTitles: [`${ss}_EFL_League_Two`],
      sectionMap: {
        'league table': { tier: 4, name: 'EFL League Two' },
        'final league table': { tier: 4, name: 'EFL League Two' }
      }
    }
  ];
}

async function fetchSeasonTeams(year) {
  const configs = getPageConfigs(year);
  const divisions = [];
  const foundTiers = new Set();

  for (const config of configs) {
    let pageFound = false;

    for (const pageTitle of config.pageTitles) {
      if (pageFound) break;

      let sections;
      try {
        sections = await fetchSections(pageTitle);
        await wait(1500);
      } catch {
        continue;
      }

      for (const section of sections) {
        const sectionLower = section.line.toLowerCase().trim();

        for (const [pattern, info] of Object.entries(config.sectionMap)) {
          if (sectionLower !== pattern) continue;
          if (foundTiers.has(`${info.tier}-${info.name}`)) continue;

          try {
            const teams = await fetchTeamsFromSection(pageTitle, section.index);
            await wait(1500);
            if (teams.length > 0) {
              divisions.push({ tier: info.tier, name: info.name, teams });
              foundTiers.add(`${info.tier}-${info.name}`);
              pageFound = true;
            }
          } catch (err) {
            console.warn(`    Error: ${err.message}`);
          }
          break;
        }
      }
    }
  }

  return divisions.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return a.name.localeCompare(b.name);
  });
}

function getNextYear(year) {
  if (year === 1915) return 1920;
  if (year === 1939) return 1947;
  return year + 1;
}

function getSeasonLabel(year) {
  const start = year - 1;
  const endStr = (year % 100 === 0) ? String(year) : String(year).slice(-2);
  return `${start}-${endStr}`;
}

function findNearestTemplate(existingByYear, targetYear) {
  let nearest = null;
  let minDist = Infinity;
  for (const [year, season] of existingByYear) {
    if (Math.abs(year - targetYear) < minDist) {
      minDist = Math.abs(year - targetYear);
      nearest = season;
    }
  }
  return nearest;
}

function adjustZones(templateZones, templateTeamCount, actualTeamCount) {
  if (templateTeamCount === actualTeamCount) return templateZones;

  const diff = actualTeamCount - templateTeamCount;
  return templateZones.map(zone => {
    const z = { ...zone };
    const isBottomHalf = zone.startPosition > templateTeamCount / 2;
    if (isBottomHalf) {
      z.startPosition = Math.max(1, zone.startPosition + diff);
    }
    if (zone.endPosition >= templateTeamCount - 2) {
      z.endPosition = Math.max(z.startPosition, zone.endPosition + diff);
    }
    z.startPosition = Math.max(1, Math.min(z.startPosition, actualTeamCount));
    z.endPosition = Math.max(1, Math.min(z.endPosition, actualTeamCount));
    return z;
  });
}

const ERA_CONFIGS = [
  { file: '1889-1892.json', years: range(1889, 1892) },
  { file: '1893-1920.json', years: [...range(1893, 1915), 1920] },
  { file: '1921-1958.json', years: [...range(1921, 1939), ...range(1947, 1958)] },
  { file: '1959-1992.json', years: range(1959, 1992) },
  { file: '1993-2004.json', years: range(1993, 2004) },
  { file: 'present.json', years: range(2005, 2025), extraYears: [2026] },
];

async function processEra(eraConfig) {
  const filePath = path.join(SEASONS_DIR, eraConfig.file);
  const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const existingByYear = new Map(existingData.map(s => [s.year, s]));

  const result = [];
  let fetched = 0;
  let skipped = 0;

  console.log(`\n=== ${eraConfig.file} (${eraConfig.years.length} seasons) ===`);

  for (const year of eraConfig.years) {
    const existing = existingByYear.get(year);

    if (existing && existing.divisions.every(d => d.teams && d.teams.length > 0)) {
      result.push(existing);
      skipped++;
      continue;
    }

    console.log(`  ${getSeasonLabel(year)}: fetching...`);
    const fetchedDivs = await fetchSeasonTeams(year);
    fetched++;

    if (fetchedDivs.length === 0) {
      console.error(`  WARNING: No data for ${getSeasonLabel(year)}`);
      if (existing) result.push(existing);
      continue;
    }

    for (const d of fetchedDivs) {
      const unknowns = d.teams.filter(t => !knownCrestSlugs.has(t));
      if (unknowns.length > 0) {
        console.log(`    ${d.name}: unknown slugs: ${unknowns.join(', ')}`);
      }
      console.log(`    ${d.name}: ${d.teams.length} teams`);
    }

    if (existing) {
      const updated = {
        ...existing,
        divisions: existing.divisions.map(div => {
          const fetched = fetchedDivs.find(f =>
            f.name === div.name || (f.tier === div.tier && !fetchedDivs.some(ff => ff !== f && ff.tier === div.tier))
          );
          if (fetched && (!div.teams || div.teams.length === 0)) {
            return { ...div, teams: fetched.teams, teamCount: fetched.teams.length };
          }
          return div;
        })
      };
      result.push(updated);
    } else {
      const template = findNearestTemplate(existingByYear, year);
      const divisions = fetchedDivs.map(f => {
        let zones = [];
        if (template) {
          const tmplDiv = template.divisions.find(d =>
            d.name === f.name || (d.tier === f.tier && !template.divisions.some(dd => dd !== d && dd.tier === f.tier))
          );
          if (tmplDiv) {
            zones = adjustZones(tmplDiv.zones, tmplDiv.teamCount, f.teams.length);
          }
        }
        return {
          tier: f.tier,
          name: f.name,
          teamCount: f.teams.length,
          zones,
          teams: f.teams
        };
      });

      result.push({
        year,
        season: getSeasonLabel(year),
        nextYear: getNextYear(year),
        divisions
      });
    }

    await wait(2000);
  }

  const extraYears = eraConfig.extraYears || [];
  for (const ey of extraYears) {
    const existing = existingByYear.get(ey);
    if (existing && !result.some(s => s.year === ey)) {
      result.push(existing);
    }
  }

  result.sort((a, b) => a.year - b.year);
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2) + '\n');
  console.log(`  Written ${result.length} seasons (fetched: ${fetched}, kept: ${skipped})`);
}

async function main() {
  const eraArg = process.argv[2];

  let eras = ERA_CONFIGS;
  if (eraArg) {
    eras = ERA_CONFIGS.filter(e => e.file.includes(eraArg));
    if (eras.length === 0) {
      console.error(`No era matching "${eraArg}". Available: ${ERA_CONFIGS.map(e => e.file).join(', ')}`);
      process.exit(1);
    }
  }

  for (const era of eras) {
    await processEra(era);
  }

  console.log('\nDone!');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
