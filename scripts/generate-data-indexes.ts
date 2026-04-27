/**
 * Writes `src/data/<slug>/index.ts` for every enabled competition with
 * static imports pointing at the current season's data files. Vite needs
 * literal import paths for static analysis, so this codegen step bakes the
 * season into each barrel file at build time.
 *
 * Run automatically before `dev` and `build`. Override the season via
 * `VITE_SEASON` or `SEASON` env vars.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

import ENABLED_COMPETITION_SLUGS from '../src/data/enabled-competitions.json';
import { getSeasonId } from './season';

const seasonId = getSeasonId();
const dataRoot = path.join(import.meta.dirname, '../src/data');

const FILES: ReadonlyArray<readonly [string, string]> = [
  ['deductionsData', 'deductions.json'],
  ['matchesData', 'matches.json'],
  ['modelPredictionsData', 'model-predictions.json'],
  ['overridesData', 'overrides.json'],
  ['standingsData', 'standings.json'],
  ['teamsData', 'teams.json'],
];

const banner = `// THIS FILE IS GENERATED. Do not edit by hand.
// Regenerate with \`pnpm gen:data-indexes\`.
//
// Source season: ${seasonId} (override with VITE_SEASON / SEASON env vars
// or by editing src/data/season.json).
`;

let written = 0;

for (const slug of ENABLED_COMPETITION_SLUGS) {
  const seasonDir = path.join(dataRoot, slug, seasonId);
  if (!fs.existsSync(seasonDir)) {
    console.warn(
      `generate-data-indexes: ${slug}/${seasonId} not present yet — writing index anyway. Run \`pnpm prepare:data\` (or \`pnpm ensure-data-stubs\`) before \`pnpm build\` so the imports resolve.`,
    );
  }

  const importLines = FILES.map(
    ([name, file]) => `import ${name} from './${seasonId}/${file}';`,
  ).join('\n');
  const exportNames = FILES.map(([name]) => `  ${name},`).join('\n');
  const content = `${banner}\n${importLines}\n\nexport {\n${exportNames}\n};\n`;

  const outputPath = path.join(dataRoot, slug, 'index.ts');
  const existing = fs.existsSync(outputPath)
    ? fs.readFileSync(outputPath, 'utf-8')
    : '';
  if (existing !== content) {
    fs.writeFileSync(outputPath, content);
    written += 1;
  }
}

console.log(
  `generate-data-indexes: ${written} file(s) updated for season ${seasonId}.`,
);
