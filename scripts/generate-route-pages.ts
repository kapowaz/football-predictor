/**
 * Writes a real page for each enabled competition's standings route
 * (`dist/<slug>/index.html`), so GitHub Pages serves it with HTTP 200 and
 * competition-specific social preview tags instead of the SPA 404 fallback.
 * Also rewrites `dist/index.html` with the default competition's tags.
 *
 * Preview images come from `dist/og/manifest.json` when it exists (written by
 * the preview-image render step). A competition missing from it gets the
 * generic `opengraph.png`.
 *
 * Run after `vite build`.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

import ENABLED_COMPETITION_SLUGS from '../src/data/enabled-competitions.json';
import { COMPETITIONS } from './common';
import { getSeasonId } from './season';

/** Image entries for one competition, in the order they appear in the page. */
export interface PreviewImage {
  /** Path relative to the site root, e.g. `og/premier-league-top.3f9a1c.png`. */
  file: string;
  width: number;
  height: number;
  alt: string;
}

export type PreviewManifest = Record<string, PreviewImage[]>;

const SITE_URL = 'https://kapowaz.github.io/football-predictor/';
// Mirrors DEFAULT_COMPETITION in src/data/competitions.ts, which Node can't
// import because it pulls in SVG logos.
const DEFAULT_COMPETITION = 'premier-league';
const START_MARKER = '<!-- social-meta:start';
const END_MARKER = '<!-- social-meta:end -->';

const GENERIC_IMAGE: PreviewImage = {
  file: 'opengraph.png',
  width: 1200,
  height: 630,
  alt: 'Football Predictor',
};

const distDir = path.join(import.meta.dirname, '../dist');
const seasonDisplay = getSeasonId().replace('-', '/');

const escapeAttr = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const meta = (attr: 'name' | 'property', key: string, content: string) =>
  `  <meta ${attr}="${key}" content="${escapeAttr(content)}" />`;

interface PageMeta {
  url: string;
  title: string;
  description: string;
  images: PreviewImage[];
}

// One og:image + twitter:image pair per image, in order, as bsky.app does
// for multi-image posts.
export const renderSocialMeta = ({
  url,
  title,
  description,
  images,
}: PageMeta): string =>
  [
    meta('name', 'description', description),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:url', url),
    meta('property', 'og:title', title),
    meta('property', 'og:description', description),
    ...images.flatMap((image) => [
      meta('property', 'og:image', `${SITE_URL}${image.file}`),
      meta('property', 'og:image:width', String(image.width)),
      meta('property', 'og:image:height', String(image.height)),
      meta('property', 'og:image:alt', image.alt),
      meta('name', 'twitter:image', `${SITE_URL}${image.file}`),
    ]),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', description),
    `  <title>${escapeAttr(title)}</title>`,
  ].join('\n');

/**
 * Replaces the tags between the start and end markers, keeping the markers so
 * the page can be rewritten again (the render step reruns this on dist/).
 */
export const replaceSocialMeta = (html: string, block: string): string => {
  const start = html.indexOf(START_MARKER);
  const end = html.indexOf(END_MARKER);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(
      'index.html is missing the social-meta:start / social-meta:end markers',
    );
  }
  const startLineEnd = html.indexOf('\n', start) + 1;
  const endLineStart = html.lastIndexOf('\n', end) + 1;
  return html.slice(0, startLineEnd) + block + '\n' + html.slice(endLineStart);
};

const readManifest = (): PreviewManifest => {
  const manifestPath = path.join(distDir, 'og', 'manifest.json');
  if (!fs.existsSync(manifestPath)) return {};
  return JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as PreviewManifest;
};

const pageMetaFor = (slug: string, manifest: PreviewManifest): PageMeta => {
  const { name } = COMPETITIONS[slug];
  return {
    url: `${SITE_URL}${slug}/`,
    title: `${name} ${seasonDisplay} Table | Football Predictor`,
    description: `Predict every remaining ${name} fixture and see how the ${seasonDisplay} table could finish.`,
    images: manifest[slug]?.length ? manifest[slug] : [GENERIC_IMAGE],
  };
};

const main = () => {
  const indexPath = path.join(distDir, 'index.html');
  const template = fs.readFileSync(indexPath, 'utf-8');
  const manifest = readManifest();

  for (const slug of ENABLED_COMPETITION_SLUGS) {
    const dir = path.join(distDir, slug);
    fs.mkdirSync(dir, { recursive: true });
    const html = replaceSocialMeta(
      template,
      renderSocialMeta(pageMetaFor(slug, manifest)),
    );
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    const imageCount = manifest[slug]?.length ?? 0;
    console.log(
      `✓ dist/${slug}/index.html (${imageCount > 0 ? `${imageCount} preview image(s)` : 'generic image'})`,
    );
  }

  // The root page shows the default competition, but keeps its own URL.
  const rootMeta = {
    ...pageMetaFor(DEFAULT_COMPETITION, manifest),
    url: SITE_URL,
  };
  fs.writeFileSync(
    indexPath,
    replaceSocialMeta(template, renderSocialMeta(rootMeta)),
  );
  console.log(`✓ dist/index.html (${DEFAULT_COMPETITION} preview)`);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
