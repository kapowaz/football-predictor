import { describe, it, expect } from 'vitest';
import { allSeasons } from './index';
import { allTimeClubs } from '../all-time-rank/all-clubs';
import type { HistoricalSeason } from './types';
import type { AllTimeClubData } from '../all-time-rank/types';

const seasonsByYear = new Map<number, HistoricalSeason>();
for (const season of allSeasons) {
  seasonsByYear.set(season.year, season);
}

const clubsBySlug = new Map<string, AllTimeClubData>();
for (const club of allTimeClubs) {
  clubsBySlug.set(club.badge, club);
}

describe('league history – internal consistency', () => {
  it('has no duplicate years', () => {
    const years = allSeasons.map((s) => s.year);
    const dupes = years.filter((y, i) => years.indexOf(y) !== i);
    expect(dupes, `Duplicate years: ${dupes.join(', ')}`).toEqual([]);
  });

  it('seasons are sorted chronologically', () => {
    for (let i = 1; i < allSeasons.length; i++) {
      expect(allSeasons[i].year).toBeGreaterThan(allSeasons[i - 1].year);
    }
  });

  it.each(allSeasons.map((s) => [s.season, s]))(
    '%s has correct nextYear accounting for war gaps',
    (_label, season) => {
      const s = season as HistoricalSeason;
      expect(s.nextYear).toBeGreaterThan(s.year);
      if (s.year === 1915) {
        expect(s.nextYear).toBe(1920);
      } else if (s.year === 1939) {
        expect(s.nextYear).toBe(1947);
      } else {
        expect(s.nextYear).toBe(s.year + 1);
      }
    },
  );

  it.each(allSeasons.map((s) => [s.season, s]))(
    '%s has no duplicate teams within a single tier',
    (_label, season) => {
      const s = season as HistoricalSeason;
      for (const div of s.divisions) {
        if (div.teams.length === 0) continue;
        const dupes = div.teams.filter((t, i) => div.teams.indexOf(t) !== i);
        expect(dupes, `${s.season} ${div.name}: duplicate teams: ${dupes.join(', ')}`).toEqual([]);
      }
    },
  );

  it.each(allSeasons.map((s) => [s.season, s]))(
    '%s has no team appearing in multiple divisions',
    (_label, season) => {
      const s = season as HistoricalSeason;
      const allTeams: string[] = [];
      for (const div of s.divisions) {
        allTeams.push(...div.teams);
      }
      const dupes = allTeams.filter((t, i) => allTeams.indexOf(t) !== i);
      expect(dupes, `${s.season}: teams in multiple divisions: ${dupes.join(', ')}`).toEqual([]);
    },
  );

  it.each(allSeasons.map((s) => [s.season, s]))(
    '%s division teamCount matches actual teams array length (when populated)',
    (_label, season) => {
      const s = season as HistoricalSeason;
      for (const div of s.divisions) {
        if (div.teams.length === 0) continue;
        expect(
          div.teams.length,
          `${s.season} ${div.name}: teamCount is ${div.teamCount} but has ${div.teams.length} teams`,
        ).toBe(div.teamCount);
      }
    },
  );
});

describe('league history – zone validity', () => {
  it.each(allSeasons.map((s) => [s.season, s]))(
    '%s zone positions fall within 1..teamCount',
    (_label, season) => {
      const s = season as HistoricalSeason;
      for (const div of s.divisions) {
        for (const zone of div.zones) {
          expect(zone.startPosition).toBeGreaterThanOrEqual(1);
          expect(zone.endPosition).toBeLessThanOrEqual(div.teamCount);
          expect(zone.startPosition).toBeLessThanOrEqual(zone.endPosition);
        }
      }
    },
  );
});

describe('league history – cross-validation with per-club data', () => {
  const populatedSeasons = allSeasons.filter((s) => s.divisions.some((d) => d.teams.length > 0));

  it.each(populatedSeasons.map((s) => [s.season, s]))(
    '%s – where both datasets have data for a club/year, tier assignments agree',
    (_label, season) => {
      const s = season as HistoricalSeason;
      const mismatches: string[] = [];

      for (const div of s.divisions) {
        for (const slug of div.teams) {
          const club = clubsBySlug.get(slug);
          if (!club) continue;

          const tierKey = `tier${div.tier}` as keyof typeof club.leagueRecord;
          const hasYearInCorrectTier = String(s.year) in club.leagueRecord[tierKey];

          const yearInOtherTier = (['tier1', 'tier2', 'tier3', 'tier4'] as const)
            .filter((t) => t !== tierKey)
            .find((t) => String(s.year) in club.leagueRecord[t]);

          if (yearInOtherTier && !hasYearInCorrectTier) {
            mismatches.push(
              `${slug} is in ${div.name} (tier ${div.tier}) for ${s.year} ` +
                `but per-club data has it in ${yearInOtherTier}`,
            );
          }
        }
      }

      expect(mismatches, mismatches.join('\n')).toEqual([]);
    },
  );

  // 1973-74: Exeter v Scunthorpe fixture was unplayed (Exeter failed to appear).
  // 2019-20: COVID-19 caused League One & League Two to end early (ppg used).
  const KNOWN_SHORT_SEASONS: Record<number, Set<string>> = {
    1974: new Set(['exeter-city', 'scunthorpe-united']),
  };
  const COVID_CURTAILED_YEARS = new Set([2020]);

  it.each(populatedSeasons.map((s) => [s.season, s]))(
    '%s – games played matches (teamCount - 1) * 2 for clubs in this season',
    (_label, season) => {
      const s = season as HistoricalSeason;
      if (COVID_CURTAILED_YEARS.has(s.year)) return;

      const mismatches: string[] = [];
      const knownShort = KNOWN_SHORT_SEASONS[s.year];

      for (const div of s.divisions) {
        const expectedGames = (div.teamCount - 1) * 2;

        for (const slug of div.teams) {
          if (knownShort?.has(slug)) continue;

          const club = clubsBySlug.get(slug);
          if (!club) continue;

          const tierKey = `tier${div.tier}` as keyof typeof club.leagueRecord;
          const record = club.leagueRecord[tierKey][s.year];
          if (!record) continue;

          const gamesPlayed = record.won + record.drawn + record.lost;
          if (gamesPlayed !== expectedGames) {
            mismatches.push(
              `${slug} in ${div.name} ${s.year}: played ${gamesPlayed} games, expected ${expectedGames} ` +
                `(${div.teamCount} teams × home+away)`,
            );
          }
        }
      }

      expect(mismatches, mismatches.join('\n')).toEqual([]);
    },
  );

  it('per-club tier assignments match historical season data where both exist', () => {
    const mismatches: string[] = [];

    for (const club of allTimeClubs) {
      for (const tier of ['tier1', 'tier2', 'tier3', 'tier4'] as const) {
        const tierNum = parseInt(tier.slice(-1));
        for (const yearStr of Object.keys(club.leagueRecord[tier])) {
          const year = Number(yearStr);
          const season = seasonsByYear.get(year);
          if (!season) continue;

          const matchingDiv = season.divisions.find(
            (d) => d.tier === tierNum && d.teams.length > 0 && d.teams.includes(club.badge),
          );

          const inDifferentDiv = season.divisions.find(
            (d) => d.tier !== tierNum && d.teams.length > 0 && d.teams.includes(club.badge),
          );

          if (inDifferentDiv && !matchingDiv) {
            mismatches.push(
              `${club.badge} has ${tier} record for ${year} but historical data ` +
                `places them in ${inDifferentDiv.name} (tier ${inDifferentDiv.tier})`,
            );
          }
        }
      }
    }

    expect(mismatches, mismatches.join('\n')).toEqual([]);
  });
});
