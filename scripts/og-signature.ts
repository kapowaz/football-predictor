/**
 * Computes a signature per enabled competition over everything its social
 * preview images depend on, plus a combined cache key, so CI re-renders only
 * when an image would change.
 *
 * A competition's signature covers its finished results (after overrides),
 * teams and deductions. Every signature also covers the render code: `src/`
 * (minus per-competition data), `index.html`, `vite.config.ts`,
 * `scripts/render-og.ts` and `pnpm-lock.yaml`. Live scores and predictions are
 * left out because the preview shows finished results only.
 *
 * Usage: tsx scripts/og-signature.ts [--github-output]
 * With --github-output, writes `key=<cache key>` to $GITHUB_OUTPUT.
 */

import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

import ENABLED_COMPETITION_SLUGS from '../src/data/enabled-competitions.json';
import { COMPETITIONS } from './common';
import { getSeasonId } from './season';

const root = path.join(import.meta.dirname, '..');
const seasonId = getSeasonId();

interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  status: string;
  homeGoals: number | null;
  awayGoals: number | null;
}

const sha = (value: string | Buffer) =>
  createHash('sha256').update(value).digest('hex');

const readJson = <T>(file: string): T =>
  JSON.parse(fs.readFileSync(file, 'utf-8')) as T;

/** Every file under `dir`, sorted, skipping the per-competition data dirs. */
const listFiles = (dir: string): string[] => {
  const dataDirs = new Set(
    Object.keys(COMPETITIONS).map((slug) => path.join(root, 'src/data', slug)),
  );
  const out: string[] = [];
  const walk = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!dataDirs.has(full)) walk(full);
      } else {
        out.push(full);
      }
    }
  };
  walk(dir);
  return out.sort();
};

export const renderCodeHash = (): string => {
  const files = [
    ...listFiles(path.join(root, 'src')),
    ...[
      'index.html',
      'vite.config.ts',
      'scripts/render-og.ts',
      'pnpm-lock.yaml',
    ].map((f) => path.join(root, f)),
  ];
  const hash = createHash('sha256');
  for (const file of files) {
    hash.update(path.relative(root, file));
    hash.update(fs.readFileSync(file));
  }
  return hash.digest('hex');
};

/** Finished results with overrides applied, as compact tuples. */
export const finishedResults = (matches: Match[], overrides: Match[]) => {
  const byId = new Map(overrides.map((m) => [m.id, m]));
  return matches
    .map((m) => byId.get(m.id) ?? m)
    .filter((m) => m.status === 'FINISHED')
    .map((m) => [m.id, m.homeTeamId, m.awayTeamId, m.homeGoals, m.awayGoals])
    .sort((a, b) => Number(a[0]) - Number(b[0]));
};

export const competitionSignature = (
  slug: string,
  codeHash: string,
): string => {
  const dir = path.join(root, 'src/data', slug, seasonId);
  const { matches } = readJson<{ matches: Match[] }>(
    path.join(dir, 'matches.json'),
  );
  const { matches: overrides } = readJson<{ matches: Match[] }>(
    path.join(dir, 'overrides.json'),
  );
  return sha(
    JSON.stringify({
      slug,
      seasonId,
      codeHash,
      results: finishedResults(matches, overrides),
      teams: readJson(path.join(dir, 'teams.json')),
      deductions: readJson(path.join(dir, 'deductions.json')),
    }),
  );
};

const main = () => {
  const codeHash = renderCodeHash();
  const signatures = Object.fromEntries(
    ENABLED_COMPETITION_SLUGS.map((slug) => [
      slug,
      competitionSignature(slug, codeHash),
    ]),
  );
  const key = `og-${sha(JSON.stringify(signatures)).slice(0, 16)}`;
  for (const [slug, signature] of Object.entries(signatures)) {
    console.log(`${slug}: ${signature.slice(0, 16)}`);
  }
  console.log(`key: ${key}`);
  if (process.argv.includes('--github-output') && process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `key=${key}\n`);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
