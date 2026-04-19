/**
 * Creates empty stub JSON files for any competition data directory that is
 * missing the generated data files (matches, standings, etc.). This allows
 * static imports to resolve for competitions that haven't had their data
 * fetched yet, preventing build failures.
 *
 * Run before `build` to guarantee all imports resolve.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

import { COMPETITIONS } from './common';

const DATA_DIR = path.join(import.meta.dirname, '../src/data');

const STUBS: Record<string, object> = {
  'teams.json': { competition: '', season: '', teams: [] },
  'matches.json': { lastUpdated: '', matches: [] },
  'standings.json': { lastUpdated: '', standings: [] },
  'model-predictions.json': { lastUpdated: '', predictions: {} },
  'fotmob-stats.json': { lastUpdated: '', season: '', stats: {} },
};

let created = 0;

for (const slug of Object.keys(COMPETITIONS)) {
  const dir = path.join(DATA_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });

  for (const [file, content] of Object.entries(STUBS)) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
      console.log(`Created stub: src/data/${slug}/${file}`);
      created++;
    }
  }
}

if (created === 0) {
  console.log('All data files present, no stubs needed.');
} else {
  console.log(`\nCreated ${created} stub file(s).`);
}
