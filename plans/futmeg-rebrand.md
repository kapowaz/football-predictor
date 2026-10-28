# Rebrand as Futmeg on futmeg.com

## Goal

The app becomes Futmeg and is served at `https://futmeg.com/`. Hosting stays on GitHub Pages with `futmeg.com` as its custom domain. The deploy pipeline does not change. The brand assets are committed to this public repo with no license, so all rights stay reserved. The repo keeps the name `football-predictor` for now. The rebrand and the domain move ship together, in one release, once the final logo SVGs exist.

## Decisions

| # | Decision | Chosen option | Rationale |
| --- | --- | --- | --- |
| N1 | Host | GitHub Pages with the custom domain `futmeg.com`. Netlify is dropped | Nothing Netlify offers is needed. Netlify Free has 300 credits a month and charges 15 per production deploy, which allows about 20 deploys. The site made 23 in the last 30 days, and live scores need a deploy for each update. Pages has no deploy limit. |
| N2 | Pipeline | `deploy.yml`, `check-for-updates.yml` and the macOS OG render stay as they are. The only changes are the custom domain and the URL constants | Follows from N1. |
| N3 | Saved predictions on the old origin | Accept the loss. There is no migration step | localStorage belongs to one origin, and `futmeg.com` cannot read data saved under `kapowaz.github.io`. Shared `?predictions=` links still work through the Pages 301. |
| N4 | Hostname and DNS | The apex `futmeg.com` is canonical. `www` is a CNAME to `kapowaz.github.io`, and GitHub redirects it to the apex. The Cloudflare records are DNS-only (grey cloud) | Gives the shortest URL in shares and OG tags. GitHub issues and renews the certificate itself, which a proxied record would block. |
| N5a | Name styling | "Futmeg" in text, "FUTMEG" in the logo, `futmeg` in identifiers | Decided by the owner. |
| N5b | Copy | The meta and OG descriptions keep their current text, and only the name changes. The standings image footer reads "Futmeg by kapowaz" | Only the name changes. |
| N5d | Header logo | The FUTMEG text logo (no mark) replaces the current 32×32 mark plus live-text `h1` in `AppHeading`. It sits inside the `h1` as an `img` with `alt="Futmeg"`, and its light or dark version switches with colour mode. With `isTitleHidden` (All Time Rank page) the square mark shows on its own, as it does today. `isFullRender` (standings image and OG renders) scales the text logo up instead of switching the text to `huge`. The standings image footer shows the Futmeg `icon.svg` mark (48 px) in place of the kapowaz bolt icon | Live text would repeat the name that the logo already contains. Keeping the `h1` keeps the page heading for screen readers and SEO. The text logo replaced an earlier mark-plus-text lockup on 2026-10-28. |
| N5c | Release order | One release, once the final logo SVGs arrive | The name and the logo change together, with no interim wordmark. |
| N6a | Internal identifiers | `package.json` name, service worker cache prefix, storage keys and User-Agent strings all become `futmeg`. Remove the legacy key migration | The new origin starts with no stored data, so the old keys never exist there. |
| N6b | License | None (all rights reserved) | The code and the brand stay visible, but nobody gets reuse rights. This discourages forks with nothing to maintain. |

## Rejected options

- **Brand assets in a private repo or private `@kapowaz` package.** Rejected so the repo keeps the advantages of being public. The OG renders and the standings image include the logo, so a private brand would have needed the macOS render in a private repo. That would bill about 4,400 Actions minutes a month: the 5-minute update check at about 3,600 plus deploys at about 800. That is more than the private-repo allowance on Free (2,000) and Pro (3,000).
- **Netlify, any plan.** Personal costs $9/month and would cover the deploy rate, but it offers nothing needed today. Free would limit deploys to about one per match day, and live scores would go stale during matches.
- **Cloudflare proxy.** Can block GitHub certificate renewal and adds a second cache layer to debug.
- **Move-notice window for saved predictions.** The owner chose to accept the loss over shipping a migration banner first.
- **Ship the domain now with an interim wordmark or the old logo.** The owner chose to ship the rebrand all at once.
- **MIT for the code with the brand reserved, or a source-available notice.** No license is simpler and already reserves all rights.

## Facts established from the codebase

- The repo is public with no LICENSE. The Pages config is `build_type: workflow`, `cname: null`, `https_enforced: true`.
- `futmeg.com` is registered at Porkbun, and its nameservers are on Cloudflare (`kristina`/`martin.ns.cloudflare.com`). It had no A or CNAME records as of 2026-10-28.
- Deploys: 23 in the 30 days to 2026-10-27 (7 from pushes, 16 started by the update check), with up to 5 in one day. Billed job time per deploy with a render: build 1 min, macOS render 1 min (billed ×10), publish 1 min, deploy 1 min.
- Base path `/football-predictor/` appears in `vite.config.ts:12`, `src/main.tsx:73` (`basename`), `scripts/render-og.ts:27` and `public/404.html:29` (`pathSegmentsToKeep = 1`, which must become `0`).
- `https://kapowaz.github.io/football-predictor/` appears in `index.html:15,19,27`, `all-time-rank/index.html:14,18,26`, `public/404.html:11,15,23`, `scripts/generate-route-pages.ts:32` and `scripts/generate-route-pages.test.ts:13`. A host-only form appears in `src/components/StandingsImageView/StandingsImageView.tsx:58`.
- "Football Predictor" appears in `<title>`/OG/Twitter tags in the same three HTML files, in `scripts/generate-route-pages.ts:43,120` and in its test. In the app it appears at `src/components/AppHeading/AppHeading.tsx:27` (logo alt), `src/components/StandingsImageView/StandingsImageView.tsx:183` (credit) and `src/hooks/useImageDownload.ts:32` (PNG title). It also appears in `README.md:1`.
- The `football-predictor` identifier appears in `public/sw.js:1` (`CACHE_PREFIX`), `src/main.tsx:61` (dev cache cleanup), `src/utils/storage.ts:3-8` (keys), `scripts/build-season-data.cjs:172` and `scripts/populate-all-seasons.cjs:202` (User-Agent), and `package.json` `name`.
- `src/utils/storage.ts:15-36` moves the pre-multi-competition keys over. These keys cannot exist on `futmeg.com`.
- `public/sw.js` handles only static assets (cache-first) and `live-scores/*.json` (stale-while-revalidate). It does not intercept page loads, so the Pages 301 reaches returning visitors.
- `AppHeading` (`src/components/AppHeading/AppHeading.tsx`) renders a 32×32 `img` of the logo next to a live-text `h1` reading "Predictor" (uppercase, condensed UI font; text colour switches with colour mode in `AppHeading.css.ts`). `isFullRender` changes the `h1` size from `xl` to `huge`, and `isTitleHidden` drops the `h1`. It is used in `AppHeader.tsx:37`, `NavBar.tsx:133`, `StandingsImageView.tsx:158` (`isFullRender`) and `AllTimeRankPage.tsx:121` (`isTitleHidden`).
- `StandingsImagePage.tsx:104` has a colour-mode toggle, so in-app standings downloads can be light or dark. `scripts/render-og.ts:116` renders OG images in dark only.
- The brand assets to replace are `src/assets/football-predictor-logo.svg` (512×512; used by `AppHeading`, the standings image and the OG renders), `public/icon.svg`, `public/favicon.ico`, `public/icon.icns` (linked as `apple-touch-icon` at `index.html:8`) and `public/opengraph.png` (1200×630).

## Cutover sequence

1. Verify `futmeg.com` for the `kapowaz` account under GitHub Settings → Pages → Verified domains (TXT record in Cloudflare). This blocks other accounts from claiming the domain.
2. Add the DNS-only records in Cloudflare: apex A `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`; apex AAAA `2606:50c0:8000::153`, `8001::153`, `8002::153`, `8003::153`; `www` CNAME `kapowaz.github.io`. Nothing serves on them until step 4.
3. Merge the rebrand PR. Its deploy builds with base `/`.
4. As soon as that deploy finishes, set the custom domain: `gh api -X PUT repos/kapowaz/football-predictor/pages -f cname=futmeg.com`.
5. Wait for GitHub to issue the certificate, then confirm `https_enforced` is still true and check `https://futmeg.com/`, `https://www.futmeg.com/` and `https://kapowaz.github.io/football-predictor/premier-league/?predictions=…`.

Between steps 3 and 4 the old URL serves a build that expects the root path, so its assets 404 for a few minutes. Between steps 4 and 5, HTTPS on `futmeg.com` can fail for up to about an hour while the certificate is issued.

## Still open

- **Final brand assets.** Received 2026-10-28 and added on `futmeg-rebrand`; this no longer blocks the release (N5c). They replace `src/assets/football-predictor-logo.svg` (deleted), `public/icon.svg`, `public/favicon.ico`, `public/icon.icns` (deleted) and `public/opengraph.png`. The owner will provide:
  - In-app logos (SVG):
    1. `src/assets/futmeg-textlogo-light.svg`: the FUTMEG text logo for light backgrounds. It is shown in the app header (`AppHeader`, `NavBar`) and in light-mode standings image downloads.
    2. `src/assets/futmeg-textlogo-dark.svg`: the text logo for dark backgrounds. It is shown in dark mode, in the OG renders (`render-og.ts:116` always uses dark) and in dark-mode standings image downloads. One file is enough if its colours work on both backgrounds.
    3. `src/assets/futmeg-mark.svg`: the square mark without text. It is shown at 32×32 CSS px next to the "All Time Rank" title (`AllTimeRankPage.tsx:121`) on both backgrounds, so it needs fixed colours that work on both, or light and dark versions.
  - Icons and share image:
    4. `public/icon.svg` and `public/favicon.ico` (16×16 and 32×32), from the square mark, which can be simplified for 16 px. `icon.svg` is also the README icon.
    5. `public/apple-touch-icon.png`, 180×180, opaque, no rounded corners. It replaces the `icon.icns` link at `index.html:8` and `all-time-rank/index.html:8`.
    6. `public/opengraph.png`, 1200×630, the generic share image used when no per-competition render exists. The key content sits in the central 630×630.
- **Repo rename to `futmeg`.** Deferred "for now". GitHub redirects renamed repos, and the Pages custom domain makes the URL independent of the repo name.
- **Netlify.** Revisit only if PR deploy previews, redirects and headers, or functions become needed.
