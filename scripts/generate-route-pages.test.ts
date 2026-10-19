import { describe, expect, it } from 'vitest';

import { renderSocialMeta, replaceSocialMeta } from './generate-route-pages';

const template = `<head>
  <meta charset="UTF-8" />
  <!-- social-meta:start (rewritten per route by scripts/generate-route-pages.ts) -->
  <title>Football Predictor</title>
  <!-- social-meta:end -->
</head>`;

const page = {
  url: 'https://kapowaz.github.io/football-predictor/premier-league/',
  title: 'Premier League 2026/27 Table | Football Predictor',
  description: 'Predict every remaining Premier League fixture.',
  images: [
    {
      file: 'og/premier-league-top.abc.png',
      width: 2316,
      height: 1212,
      alt: 'Top & "half"',
    },
    {
      file: 'og/premier-league-bottom.def.png',
      width: 2316,
      height: 1212,
      alt: 'Bottom',
    },
  ],
};

describe('renderSocialMeta', () => {
  it('writes an og:image and twitter:image pair per image, in order', () => {
    const block = renderSocialMeta(page);
    const images = [
      ...block.matchAll(/(og:image|twitter:image)" content="([^"]+)"/g),
    ].map((m) => `${m[1]} ${m[2].split('/').pop()}`);
    expect(images).toEqual([
      'og:image premier-league-top.abc.png',
      'twitter:image premier-league-top.abc.png',
      'og:image premier-league-bottom.def.png',
      'twitter:image premier-league-bottom.def.png',
    ]);
    expect(block).toContain(
      '<meta property="og:image:width" content="2316" />',
    );
  });

  it('escapes attribute values', () => {
    expect(renderSocialMeta(page)).toContain(
      'content="Top &amp; &quot;half&quot;"',
    );
  });
});

describe('replaceSocialMeta', () => {
  it('replaces the tags between the markers', () => {
    const html = replaceSocialMeta(template, renderSocialMeta(page));
    expect(html).toContain(
      '<title>Premier League 2026/27 Table | Football Predictor</title>',
    );
    expect(html).not.toContain('<title>Football Predictor</title>');
    expect(html).toContain('<meta charset="UTF-8" />');
  });

  it('can rewrite a page it has already rewritten', () => {
    const once = replaceSocialMeta(template, renderSocialMeta(page));
    const twice = replaceSocialMeta(once, renderSocialMeta(page));
    expect(twice).toBe(once);
  });

  it('throws when the markers are missing', () => {
    expect(() => replaceSocialMeta('<head></head>', '')).toThrow(/markers/);
  });
});
