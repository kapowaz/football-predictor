# <img src="public/icon.svg" alt="Football Predictor icon" width="30" valign="middle" /> Football Predictor

A web app for predicting the outcome of remaining fixtures and seeing how each competition's final table could look. Enter score predictions manually, optionally seed fixtures with model-generated predictions, and watch standings update in real time.

Built with React, TypeScript, Vite and [Vanilla Extract](https://vanilla-extract.style/). Core match and standings data is sourced from the [football-data.org](https://www.football-data.org/) API, with optional xG/stat inputs fetched from FotMob for model generation.

## Current Scope

- Supports multiple competitions (Premier League, EFL Championship, EFL League One, EFL League Two), with per-competition routes and data sets.
- Lets you make fixture-by-fixture predictions and immediately recalculate standings.
- Includes model-generated prediction support via a Python Monte Carlo pipeline (blend of results-derived ratings and FotMob xG).
- Supports shareable URLs with compact prediction/deduction encoding.
- Includes responsive/mobile-first UI improvements, dark/light theming, and season summary flow refinements.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Yarn](https://classic.yarnpkg.com/) (v1)
- [Python 3](https://www.python.org/) (required for `generate-predictions` scripts)

### API Key

The data-fetching script requires a free API key from football-data.org:

1. Create an account and get an API key at <https://www.football-data.org/>
2. Copy the example environment file and add your key:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and replace `your_api_key_here` with your actual API key.

### Install & Run

```bash
# Install dependencies
yarn install

# Fetch latest matches/standings data for enabled competitions
yarn fetch-data

# (Optional) fetch latest FotMob stats used by the model
yarn fetch-fotmob-stats

# (Optional) generate model predictions
yarn generate-predictions

# Start the dev server
yarn dev
```

The app will be available at `http://localhost:5173`.

### Other Commands

| Command                  | Description                                                                 |
| ------------------------ | --------------------------------------------------------------------------- |
| `yarn build`             | Type-check and build for production                                         |
| `yarn preview`           | Preview the production build locally                                        |
| `yarn lint`              | Run ESLint                                                                  |
| `yarn format`            | Format source files with Prettier                                           |
| `yarn fetch-data:*`      | Fetch football-data.org matches/standings for a specific competition        |
| `yarn fetch-teams:*`     | Refresh teams metadata for a specific competition                           |
| `yarn fetch-fotmob-stats:*` | Fetch FotMob stats for all or specific competitions                      |
| `yarn generate-predictions:*` | Generate model predictions for all or specific competitions            |
| `yarn ensure-data-stubs` | Create empty JSON stubs so static imports still resolve before data fetches |

## Data Files

Data is organized per competition under `src/data/<competition-slug>/`.

### Generated/fetched automatically

| File             | Description                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `teams.json`     | Team metadata, including names, crest paths and identifiers (plus FotMob mappings where available).          |
| `matches.json`   | Every fixture for the season, including dates, status and scores for completed matches.                      |
| `standings.json` | Latest official standings from the API, used as the baseline and validation source.                          |
| `fotmob-stats.json` | Team-level stat payload from FotMob (used by prediction generation when available).                       |
| `model-predictions.json` | Output of the Monte Carlo prediction script for unresolved fixtures.                                |

Use `yarn fetch-data`, `yarn fetch-teams`, and `yarn fetch-fotmob-stats` to refresh data. Then run `yarn generate-predictions` to regenerate `model-predictions.json`.

### Maintained manually

| File              | Description                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `overrides.json`  | Match-level overrides that take precedence over `matches.json`. Useful for correcting data that the API reports incorrectly (e.g. a match result that was later amended). |
| `deductions.json` | Points deductions applied to specific teams, including the amount and the reason for the deduction.                                                                       |
