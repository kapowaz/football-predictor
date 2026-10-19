# Social preview images per competition

## Goal

Links to the site show a preview of the linked competition's current table on Slack, X, iMessage, Discord, Facebook and similar platforms. `/premier-league/` and `/efl-championship/` return HTTP 200 with their own title, description and images instead of today's 404. The default route `/` shows the Premier League. Each competition has two preview images, the top and bottom halves of its table, rendered in CI from the existing standings image page.

## Decisions

| # | Decision | Chosen option | Rationale |
| --- | --- | --- | --- |
| D1 | Which routes become real pages | `/`, `/<slug>/` for enabled competitions only (today `premier-league`, `efl-championship`), driven by `enabled-competitions.json` | These are the links people share. Sub-routes (New Rules, Bonus Points, Run In, Relegation, Standings Image) keep the current 404 and generic preview. |
| D2 | Titles and descriptions | `<title>` and `og:title`: `"<name> <season> Table \| Football Predictor"`, e.g. "Premier League 2026/27 Table \| Football Predictor". Description: "Predict every remaining <name> fixture and see how the <season> table could finish." `/` uses the Premier League values, but its `og:url` stays the root URL | Season comes from `seasonDisplay`, so it updates with `season.json`. |
| D3 | How the two halves appear | Two images, Bluesky style: an `og:image` + `twitter:image` pair per image, top half first, then bottom, with the same HTML for every crawler | Same markup `bsky.app` uses for multi-image posts. Platforms that show one image show the top half. |
| D4 | Image size and layout | Each half has a 1.91:1 aspect ratio, captured at 2x. There is no fixed canvas. Both halves first get the same height, padding the bottom half if needed. The width is then `round(height × 1.91)`, and the table layout widens to fill it. Example: halves equalised at 820x582 become 1112x582 CSS px, giving 2224x1164 PNGs. Odd team counts split as top `ceil(n/2)`, bottom the rest (19 teams: 10/9). The layout replaces the in-app download and share layout too | 1.91:1 is what Facebook, LinkedIn and X crop to, so no rows are lost. Taking the size from the table's real height keeps rows at their natural size. One layout for previews and downloads. |
| D4b | Where the split and padding fix lives | `@kapowaz/football` (`design-system/packages/football`), released, then bumped here | Fixes the genuine-mode height bug for every consumer of `StandingsTable`. |
| D5 | Rendering | Playwright + Chromium on a `macos-latest` runner. Playwright element screenshot of each half's capture node at `deviceScaleFactor: 2`, from `StandingsImagePage` served off the built `dist` | macOS text rendering. A screenshot avoids `foreignObject` quirks in the in-app capture. |
| D6 | What the image shows | Finished results only (no predictions, no live scores), genuine mode at its default (on), dark theme (`colorScheme: 'dark'`) | Image changes only when a match finishes, so in-play deploys can skip rendering. |
| D7 | Freshness and efficiency | Per-competition signature over finished results, deductions, overrides and the render code. PNGs stored in the Actions cache keyed by that signature. The macOS job runs only on a cache miss. Filenames carry a content hash, e.g. `og/premier-league-top.3f9a1c.png`. The render job uses its own concurrency group with `cancel-in-progress: true` | No macOS job on unchanged data, no backlog, and platforms pick up new images when they re-scrape. |
| D8 | Render failure | The deploy still ships. Fallback is the newest cached images for that competition (cache `restore-keys` prefix), else `opengraph.png`. The render job fails as its own red check, so GitHub emails the owner | Fresh scores never wait on preview images, and failures stay visible. |
| D9 | Delivery | Step 0: one consolidated dependency and security PR in design-system (see below). Step 1: `@kapowaz/football` fix and release in design-system. Step 2: one PR here with route pages and images. Inside that PR the route pages are built and checked on opengraph.xyz before the image work. Local `pnpm og:render` runs the same Playwright script on your Mac and writes to `dist/og/` | Step 1 then builds on current dependencies with the security alerts cleared. Matches the request to fix the 404 first, then add images. |

## Step 0: consolidate design-system dependencies and security fixes

Before the `@kapowaz/football` fix, roll every open Dependabot PR and every open security alert in `kapowaz/design-system` into one PR. The process mirrors grafana/design's `consolidate-deps` and `patch-vulnerabilities` skills and its `consolidate-deps.yml` workflow. That repo consolidates Renovate PRs, not Dependabot ones. The steps carry over, and the differences are listed under "Differences from grafana/design".

### Inputs (as of 2026-10-19)

Open Dependabot PRs:

| PR | Change | Where | Kind |
| --- | --- | --- | --- |
| #151 | `pnpm/action-setup` 6.0.9 → 6.1.0 | workflows | GitHub Actions |
| #152 | `actions/setup-node` 7.0.0 → 7.1.0 | workflows | GitHub Actions |
| #153 | `@modelcontextprotocol/sdk` 1.29.0 → 1.31.0 | `packages/design-mcp` | runtime `dependency` of a public package |
| #154 | `handlebars` 4.7.9 → 4.7.10 | `packages/icons` | devDependency |
| #155 | `handlebars` 4.7.9 → 4.7.10 | root | devDependency |
| #156 | `handlebars` 4.7.9 → 4.7.10 | `packages/football-badges` | devDependency |

Open security alerts (`https://github.com/kapowaz/design-system/security/dependabot/<n>`):

| Package | Relationship | Alerts | Highest severity | First patched |
| --- | --- | --- | --- | --- |
| `handlebars` | direct (root, icons, football-badges) | #136-#143, #146-#149 (GHSA-p8wg-vrv2-v86f, GHSA-8r5x-fm3f-whwj, GHSA-xw65-4hp5-5hc7) | critical | 4.7.10, covered by #154-#156 |
| `@modelcontextprotocol/sdk` | inconclusive | #134 (GHSA-6qxp-vccf-f47h) | high | 1.31.0, covered by #153 |
| `proxy-addr` | transitive | #135 | critical | 2.0.8 |
| `shell-quote` | transitive | #133 | critical | 1.11.0 |
| `source-map-js` | transitive | #144 | high | 1.2.2 |
| `brace-expansion` | transitive | #131 | high | 5.0.10 |
| `ip-address` | transitive | #132 | medium | 10.7.1 |
| `sprintf-js` | transitive | #145 | medium | none published |
| `esbuild` | direct (`football`, `components`) | #13, #27 (GHSA-g7r4-m6w7-qqqr) | low | 0.28.1 |

The esbuild alerts are still open although #141 consolidated esbuild 0.28.1. Find out why first. It may be a second copy below 0.28.1 in the lockfile, or the alerts may just be stale.

### Process

1. **Branch.** Create `consolidate-deps` from the current `main` of design-system.
2. **Inventory.** List the open Dependabot PRs and keep each one's version table and release notes for the PR body. Hold back any major bump, draft, PR with commits from someone other than Dependabot, or diff that won't apply, and give the reason. None of the six PRs above meets a hold rule.
3. **Apply.**
   - Take only the `package.json` and workflow file changes from each PR.
   - Raise the floor of each range. A caret range that still matches the old version does not move on `pnpm install`.
   - Where two PRs target the same dependency, the higher version wins.
   - Regenerate `pnpm-lock.yaml` with `pnpm install --no-frozen-lockfile`. Never edit the lockfile by hand.
4. **Security.**
   - **Direct dependencies:** raise each to the higher of its current version and `first_patched_version`. Confirm the result is outside `vulnerable_version_range`. An alert already cleared by a step 3 bump is "covered".
   - **Transitive dependencies:** run `pnpm --recursive update <pkg>` within the parents' existing ranges, then re-check the lockfile.
   - **If a vulnerable copy remains:** prefer bumping the parent. Use a `pnpm.overrides` pin in the root `package.json` only as a last resort. Name its alert in the PR body, and open a follow-up issue to remove the pin. #146's check, which flags overrides that no longer change resolution, will find it later.
   - **`sprintf-js`:** no fix has been published. Remove it through a parent bump if possible. Otherwise list it as "needs a human". Never dismiss it silently.
5. **Verify.** Run the same checks as design-system's `ci.yml`: build, lint, typecheck, format check, tests, and changeset validation. Stop and report if anything fails. Revert only the failing bump, move it to "held back" with the reason, and verify again.
6. **Published-files check.**
   - Pack every public package on `main` and on the branch (`pnpm pack`) and compare the contents.
   - Any package whose published files changed and has no changeset gets a `patch` changeset.
   - This catches build-toolchain and transitive changes. An esbuild or vite bump that changes the built output of `football` or `components` is an example.
7. **Changesets.** These follow design-system's existing rule (see `.changeset/dependency-bumps.md`) and grafana's.
   - Every dependency-only change gets `patch`.
   - Changesets go only to public, non-ignored packages whose runtime dependencies or published files change.
   - Changes to devDependencies or workflows alone get none, and the changeset says so.
   - The expected minimum is `'@kapowaz/design-mcp': patch` (`@modelcontextprotocol/sdk`), plus whatever step 6 adds.
   - Use one grouped file, `.changeset/consolidated-deps-20261019.md`, that names each bump. A separate security file is not needed, because the PR body carries the per-alert links.
8. **PR.** One PR against design-system `main`, ready for review, not a draft.
   - **Title:** `chore(deps): consolidated dependency bumps and security fixes`.
   - **Body**, adapted from grafana's template:
     - checks status
     - "Consolidated" (`- #N, title`)
     - "Held back" (with reasons)
     - "No release" (devDependency- and workflow-only changes)
     - "Published files changed"
     - "Security fixes", one line per alert: package, from → to, file, linked GHSA and severity
     - a "Not auto-patched, needs a human" warning block for anything left
     - the source PRs' version tables and release notes
   - No sign-off line.
9. **Close superseded PRs after merge.** Dependabot closes its own PRs once `main` already has the version. Check each of #151-#156. Close any still open only after confirming its change is on `main`, using a comment that names the merge commit and the consolidated PR. Confirm afterwards that the alerts have closed.

### Effect on releases

Release PR #133 ("chore: version packages", open since 2026-09-13) already holds unreleased changesets. One of them is `@kapowaz/components@15.0.0` (major: `components.css` now `@import`s its dependencies). Step 0's changesets add to #133. Step 1 then adds the `@kapowaz/football` changeset, and merging #133 publishes everything queued. football-predictor depends on `@kapowaz/components@^13.3.0`, so the caret range does not pick up 15.0.0. Only the `@kapowaz/football` bump is needed in step 2.

### Differences from grafana/design

- **Dependabot instead of Renovate.** Filter on author `app/dependabot`. Dependabot's PR body has no `| Package | Change | Age | Confidence |` table, so the version table is built from each PR's title and diff.
- **Workflow bumps included.** grafana holds back PRs that touch `.github/workflows`, because its signed GraphQL commits need a `workflows: write` permission the org does not grant. Here the branch is pushed with your own credentials, so #151 and #152 go in the same PR, as you asked.
- **Done once, by hand.** No scheduled workflow, Claude triage step, AI-written summary or GitHub App token. The steps follow grafana's manual skill. One exception: the branch is pushed and the PR opened, because you asked for a PR.

## Rejected options

- **Generating every route (12 pages)**, or only the visible sub-routes. Rejected for D1: the standings pages are what gets shared.
- **Pages for disabled competitions.** They have no data, and the app already redirects them to `/`.
- **`fullTitle` for the title.** It says "Predictions"; the chosen wording says "Table".
- **One composite image with both halves side by side, or the top half only.** Rejected for D3 in favour of two images, Bluesky style.
- **Native 820px-wide capture.** Platforms that crop to 1.91:1 lose rows.
- **A fixed 1200x630 canvas (2400x1260 at 2x).** The halves would have to be scaled to fit it. Deriving the width from the equalised height keeps the 1.91:1 ratio without rescaling.
- **A separate layout only for previews.** Rejected for D4: one layout serves previews and downloads.
- **Fixing the split only in this app.** That would duplicate the split rule outside the library.
- **Puppeteer.** It downloads Chrome on every install.
- **Reusing the in-app capture (modern-screenshot).** It draws through the host browser's SVG `foreignObject`, so its pixels are not OS-independent, and it has CSS and font quirks.
- **Ubuntu runner.** Linux text rendering differs from what most visitors see.
- **Live scores in previews.** That forces a macOS render every 5 minutes during matches.
- **Light theme.**
- **Committing images to the repo, or fetching them from the live site.** Committing bloats the git history after every finished match; fetching leaves nothing to reuse after a failed deploy.
- **Stable filenames.** Slack and Facebook keep cached images for days.
- **Queued renders.** They create a backlog of macOS jobs.
- **Failing the deploy on a render error.** That blocks score updates.
- **Always using the generic image on failure.** It drops a usable cached table.
- **Annotation-only alerting.** It is too easy to miss.
- **Three PRs.** You prefer one PR here.
- **CI-only rendering.** A layout check would need a push and a deploy.

## Facts established from the codebase

- `/premier-league/` returns 404 because GitHub Pages has no file there. `public/404.html:29` runs the spa-github-pages redirect to `/?/premier-league`, which crawlers do not follow. Checked live on 2026-10-19: `/` gives 200, `/premier-league/` gives 404.
- `index.html:14-18` has a single generic `og:url`, `og:title` and `og:image` (`opengraph.png`, 1200x630) for every route.
- Vite already builds a second HTML entry for `all-time-rank/index.html` (`vite.config.ts:46-47`). Route pages can be emitted the same way, or by a post-build step that copies `index.html` into `dist/<slug>/index.html`.
- The images come from `StandingsImagePage` at route `standings-image/:slug/` (`src/main.tsx:84`). It renders `StandingsImageView` twice with `partial="top"` and `partial="bottom"`, visibly.
- The page loads predictions with `persistenceMode: 'storageOnly'` (`StandingsImagePage.tsx:55`) and merges live scores (`StandingsImagePage.tsx:50,58`). D6 needs a preview mode that skips live scores.
- The capture width is fixed at 820px (`StandingsImageView.css.ts:38`). For the Premier League in genuine mode, the current halves measure 820x558 (top) and 820x605 (bottom), per your measurement. The bottom-half footer has a fixed height, `calc(45px + 48px)` (`StandingsImageView.css.ts:96`), which assumes both halves have the same number of rows.
- The genuine-mode height bug comes from `@kapowaz/football` `StandingsTable.js:94`: `Math.floor(standings.length / 2)` gives 9/10 for 19 teams, while the footer padding assumes equal halves.
- In-app downloads capture at `scale = 2` (`useImageDownload.ts:27`) via modern-screenshot. That library draws through SVG `foreignObject` onto a canvas (`modern-screenshot/dist/index.mjs`).
- The season label comes from `seasonDisplay` (`src/data/season.ts:20`).
- Enabled competitions come from `src/data/enabled-competitions.json`.
- `deploy.yml:13-15` uses concurrency group `pages` with `cancel-in-progress: false`. `check-for-updates.yml:10` runs `*/5 13-22 * * *` and triggers deploys on finished-count changes and while matches are in play.
- The library source is `../design-system/packages/football` (`scripts/toggle-linked-packages.ts:13`). It is installed here as `"@kapowaz/football": "^0.3.0"` (`package.json:56`).
- Bluesky's crawler HTML for multi-image post `3lv2nr32whs2m` has one `og:image` + `twitter:image` pair per image, in post order. The same HTML is served to Discordbot, Slackbot and facebookexternalhit.

## Still open

- **Discord gallery rendering of repeated image tags** is not verified from documentation. Test with a real link after step 2 deploys. If Discord shows only one image, it shows the top half, which is still acceptable under D3.
- **Interpretation of "once that's working"** in the original request. It was read as build order inside the step 2 PR. The 404 stays live until that PR merges. Revisit if the 404 fix is needed sooner.
- **Exact `og:image:alt` text** defaults to "<name> <season> table, positions 1 to 10" and "positions 11 to 20" (computed per half). Settle during implementation.
- **Exact description wording** uses the D2 default unless changed in review.
- **Automating Step 0 in design-system.** Step 0 is a one-off by hand. A scheduled workflow like grafana's `consolidate-deps.yml` and `close-consolidated.yml`, adapted for Dependabot, would keep this from building up again. It would need its own decisions (token, schedule, triage) and is out of scope until asked for.
- **`sprintf-js` (alert #145)** has no patched version. Its outcome depends on whether a parent bump removes it; otherwise it stays listed as needing a human.
- **Final image size** is known only after the library fix equalises the halves. The width follows from that height. `og:image:width` and `og:image:height` are written from each rendered image's real pixel size, not hard-coded.
- **Championship sizing.** Its halves (12 rows each) are taller than the Premier League's (10 and 9), so its 1.91:1 images are wider. Confirm the widened layout still reads well at that width.
- **What triggers a re-render** includes "the render code". The exact list of files hashed (e.g. `StandingsImageView`, `StandingsImagePage`, the `@kapowaz/football` version, the Playwright script) is settled during implementation.
