/**
 * Renders each enabled competition's social preview images from the built
 * site: the top and bottom halves of its table, as shown by
 * `/standings-image/<slug>/?preview`, screenshotted at 2x in dark mode.
 *
 * Writes `dist/og/<slug>-<half>.<hash>.png` and merges their entries into
 * `dist/og/manifest.json`, which `generate-route-pages.ts` turns into
 * og:image / twitter:image tags. Entries for competitions not rendered this
 * time (e.g. restored from the CI cache) are kept.
 *
 * Usage: tsx scripts/render-og.ts [--only premier-league,efl-championship]
 * Run after `vite build`.
 */

import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as http from 'node:http';
import type { AddressInfo } from 'node:net';
import * as path from 'node:path';
import { chromium } from 'playwright';

import ENABLED_COMPETITION_SLUGS from '../src/data/enabled-competitions.json';
import { COMPETITIONS } from './common';
import type { PreviewImage, PreviewManifest } from './generate-route-pages';
import { getSeasonId } from './season';

const BASE_PATH = '/football-predictor/';
const distDir = path.join(import.meta.dirname, '../dist');
const ogDir = path.join(distDir, 'og');
const manifestPath = path.join(ogDir, 'manifest.json');
const seasonDisplay = getSeasonId().replace('-', '/');

const CONTENT_TYPES: Record<string, string> = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

/**
 * Serves dist/ under BASE_PATH. Paths with no file fall back to index.html,
 * so client-side routes load the app, as GitHub Pages' 404 redirect does.
 */
const serveDist = (): Promise<http.Server> =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url ?? '/', 'http://localhost');
      if (!url.pathname.startsWith(BASE_PATH)) {
        res.writeHead(404).end();
        return;
      }
      let file = path.join(distDir, url.pathname.slice(BASE_PATH.length));
      if (!file.startsWith(distDir)) {
        res.writeHead(403).end();
        return;
      }
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        const index = path.join(file, 'index.html');
        file = fs.existsSync(index) ? index : path.join(distDir, 'index.html');
      }
      res.writeHead(200, {
        'Content-Type':
          CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream',
      });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });

/** Width and height from a PNG's IHDR chunk. */
const pngSize = (png: Buffer) => ({
  width: png.readUInt32BE(16),
  height: png.readUInt32BE(20),
});

const parseOnly = (): string[] => {
  const index = process.argv.indexOf('--only');
  if (index === -1) return ENABLED_COMPETITION_SLUGS;
  const slugs = (process.argv[index + 1] ?? '').split(',').filter(Boolean);
  for (const slug of slugs) {
    if (!ENABLED_COMPETITION_SLUGS.includes(slug)) {
      throw new Error(`--only: ${slug} is not an enabled competition`);
    }
  }
  return slugs;
};

const readManifest = (): PreviewManifest =>
  fs.existsSync(manifestPath)
    ? (JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as PreviewManifest)
    : {};

const main = async () => {
  const slugs = parseOnly();
  if (slugs.length === 0) {
    console.log('render-og: nothing to render');
    return;
  }
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    throw new Error('dist/index.html not found; run `pnpm build` first');
  }
  fs.mkdirSync(ogDir, { recursive: true });

  const server = await serveDist();
  const { port } = server.address() as AddressInfo;
  const browser = await chromium.launch();
  const manifest = readManifest();

  try {
    const context = await browser.newContext({
      viewport: { width: 2000, height: 1600 },
      deviceScaleFactor: 2,
      colorScheme: 'dark',
    });
    for (const slug of slugs) {
      const page = await context.newPage();
      await page.goto(
        `http://127.0.0.1:${port}${BASE_PATH}standings-image/${slug}/?preview`,
      );
      // Both halves measured and sized, fonts loaded, badges decoded.
      await page.waitForSelector(
        '[data-image-half="top"][data-layout-ready] >> nth=0',
      );
      await page.waitForSelector(
        '[data-image-half="bottom"][data-layout-ready]',
      );
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map((img) =>
            img.complete ? undefined : img.decode().catch(() => undefined),
          ),
        );
      });

      const { name } = COMPETITIONS[slug];
      const images: PreviewImage[] = [];
      for (const half of ['top', 'bottom'] as const) {
        const outer = page.locator(`[data-image-half="${half}"]`);
        const positions = (await outer.getAttribute('data-positions')) ?? '';
        const [first, last] = positions.split('-');
        const png = await outer.locator('> div').screenshot();
        const hash = createHash('sha256')
          .update(png)
          .digest('hex')
          .slice(0, 10);
        const file = `og/${slug}-${half}.${hash}.png`;
        fs.writeFileSync(path.join(distDir, file), png);
        images.push({
          file,
          ...pngSize(png),
          alt: `${name} ${seasonDisplay} table, positions ${first} to ${last}`,
        });
        console.log(
          `✓ dist/${file} (${pngSize(png).width}x${pngSize(png).height})`,
        );
      }
      manifest[slug] = images;
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log('✓ dist/og/manifest.json');
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
