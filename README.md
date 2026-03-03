# EFL Championship Predictor

A simple application that lets you predict the outcome of every remaining EFL Championship fixture and see how the final league table could look. Enter score predictions for upcoming matches and watch the standings update in real time.

Built with React, TypeScript, Vite and [Vanilla Extract](https://vanilla-extract.style/). Match and standings data is sourced from the [football-data.org](https://www.football-data.org/) API.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Yarn](https://classic.yarnpkg.com/) (v1)

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

# Fetch the latest data from football-data.org
yarn fetch-data

# Fetch the latest fotmob stats
yarn fetch-fotmob-stats

# Start the dev server
yarn dev
```

The app will be available at `http://localhost:5173`.

### Other Commands

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `yarn build`   | Type-check and build for production  |
| `yarn preview` | Preview the production build locally |
| `yarn lint`    | Run ESLint                           |
| `yarn format`  | Format source files with Prettier    |

## Data Files

All data lives in `src/data/` as static JSON files. Three of these are fetched from the football-data.org API by running `yarn fetch-data`; the other two are maintained by hand.

### Fetched automatically

| File             | Description                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `teams.json`     | The list of teams currently in the Championship, including abbreviated names and identifiers for club badges. |
| `matches.json`   | Every fixture for the season with dates, status and scores for completed matches.                             |
| `standings.json` | The official league table from the API; this is used to validate the standings calculation is correct!        |

To pull in the latest results and standings, run `yarn fetch-data` periodically. The script fetches teams, matches, and standings sequentially from the API and writes the updated JSON files to `src/data/`.

### Maintained manually

| File              | Description                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `overrides.json`  | Match-level overrides that take precedence over `matches.json`. Useful for correcting data that the API reports incorrectly (e.g. a match result that was later amended). |
| `deductions.json` | Points deductions applied to specific teams, including the amount and the reason for the deduction.                                                                       |
