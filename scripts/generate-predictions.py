"""
EFL Championship Match Prediction Generator

Poisson regression model that reads match results and FotMob xG stats to generate
predicted scores for all remaining SCHEDULED fixtures. Uses Monte Carlo season
simulation to produce predictions and a projected final table.

Usage:
    python scripts/generate-predictions.py
    python scripts/generate-predictions.py --xg-weight 0.6
    python scripts/generate-predictions.py --no-xg
    python scripts/generate-predictions.py --simulations 50000
"""

import json
import math
import os
import random
import sys
import argparse
from collections import defaultdict
from datetime import datetime, timezone

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "..", "src", "data")

MATCHES_PATH = os.path.join(DATA_DIR, "matches.json")
FOTMOB_STATS_PATH = os.path.join(DATA_DIR, "fotmob-stats.json")
OUTPUT_PATH = os.path.join(DATA_DIR, "model-predictions.json")

FORM_LENGTH = 6
FORM_DECAY = 0.85  # exponential decay factor per match in form window
MAX_GOALS = 7
NUM_SIMULATIONS = 10000
SIMULATION_SEED = 42

# Per-team hard overrides applied after blending.
# attack_mult / defense_mult scale ratings; max_goals caps predicted output.
TEAM_OVERRIDES = {
    "345": {  # Sheffield Wednesday
        "attack_mult": 0.4,
        "defense_mult": 1.5,
        "max_goals": 1,
    },
}


def load_json(filepath):
    with open(filepath, "r") as f:
        return json.load(f)


def build_team_profiles(matches):
    """
    Build per-team home/away attack and defense profiles from finished matches.
    Returns (profiles, league_stats) where profiles is keyed by team ID string.
    """
    profiles = defaultdict(lambda: {
        "home_gf": 0, "home_ga": 0, "home_games": 0,
        "away_gf": 0, "away_ga": 0, "away_games": 0,
        "recent_matches": [],
    })

    sorted_matches = sorted(
        [m for m in matches if m["status"] == "FINISHED"],
        key=lambda m: m["utcDate"],
    )

    for match in sorted_matches:
        hid = str(match["homeTeamId"])
        aid = str(match["awayTeamId"])
        hg = match["homeGoals"]
        ag = match["awayGoals"]

        if hg is None or ag is None:
            continue

        profiles[hid]["home_gf"] += hg
        profiles[hid]["home_ga"] += ag
        profiles[hid]["home_games"] += 1
        profiles[hid]["recent_matches"].append(("home", hg, ag))

        profiles[aid]["away_gf"] += ag
        profiles[aid]["away_ga"] += hg
        profiles[aid]["away_games"] += 1
        profiles[aid]["recent_matches"].append(("away", ag, hg))

    total_home_goals = sum(p["home_gf"] for p in profiles.values())
    total_away_goals = sum(p["away_gf"] for p in profiles.values())
    total_home_games = sum(p["home_games"] for p in profiles.values())
    total_away_games = sum(p["away_games"] for p in profiles.values())

    league_avg_home = total_home_goals / total_home_games if total_home_games else 1.0
    league_avg_away = total_away_goals / total_away_games if total_away_games else 1.0

    league_stats = {
        "avg_home_goals": league_avg_home,
        "avg_away_goals": league_avg_away,
    }

    return dict(profiles), league_stats


def compute_form_factor(recent_matches):
    """
    Weighted recent form factor. Returns a multiplier around 1.0 based on
    recent goal-scoring and conceding relative to overall averages.
    Uses exponential decay so the most recent matches count most.
    """
    matches = recent_matches[-FORM_LENGTH:]
    if not matches:
        return 1.0, 1.0

    weighted_gf = 0.0
    weighted_ga = 0.0
    total_weight = 0.0

    for i, (_, gf, ga) in enumerate(matches):
        weight = FORM_DECAY ** (len(matches) - 1 - i)
        weighted_gf += gf * weight
        weighted_ga += ga * weight
        total_weight += weight

    avg_gf = weighted_gf / total_weight if total_weight else 1.0
    avg_ga = weighted_ga / total_weight if total_weight else 1.0

    return avg_gf, avg_ga


def compute_match_ratings(profiles, league_stats):
    """
    Compute per-team attack and defense strength ratings from match results.
    Ratings are relative to league average (1.0 = average).
    """
    avg_h = league_stats["avg_home_goals"]
    avg_a = league_stats["avg_away_goals"]

    ratings = {}
    for tid, p in profiles.items():
        home_att = (p["home_gf"] / p["home_games"] / avg_h) if p["home_games"] else 1.0
        home_def = (p["home_ga"] / p["home_games"] / avg_a) if p["home_games"] else 1.0
        away_att = (p["away_gf"] / p["away_games"] / avg_a) if p["away_games"] else 1.0
        away_def = (p["away_ga"] / p["away_games"] / avg_h) if p["away_games"] else 1.0

        form_gf, form_ga = compute_form_factor(p["recent_matches"])
        overall_gf = (p["home_gf"] + p["away_gf"]) / max(p["home_games"] + p["away_games"], 1)
        overall_ga = (p["home_ga"] + p["away_ga"]) / max(p["home_games"] + p["away_games"], 1)

        # Form multiplier: how recent form compares to season average
        form_att_mult = (form_gf / overall_gf) if overall_gf > 0 else 1.0
        form_def_mult = (form_ga / overall_ga) if overall_ga > 0 else 1.0

        # Blend season rating with form (80% season, 20% form adjustment)
        form_weight = 0.20

        ratings[tid] = {
            "home_attack": home_att * (1 + form_weight * (form_att_mult - 1)),
            "home_defense": home_def * (1 + form_weight * (form_def_mult - 1)),
            "away_attack": away_att * (1 + form_weight * (form_att_mult - 1)),
            "away_defense": away_def * (1 + form_weight * (form_def_mult - 1)),
        }

    return ratings


def compute_xg_ratings(fotmob_stats, league_stats):
    """
    Compute per-team attack and defense strength ratings from FotMob xG data.
    Returns None if xG data is unavailable.
    """
    stats = fotmob_stats.get("stats", {})
    if not stats:
        return None

    xg_data = {}
    for tid, team_stats in stats.items():
        xg_entry = team_stats.get("expected_goals_team")
        xga_entry = team_stats.get("expected_goals_conceded_team")
        mp = team_stats.get("matchesPlayed", 0)

        if not xg_entry or not xga_entry or mp == 0:
            continue

        xg_data[tid] = {
            "xg_per_game": xg_entry["value"] / mp,
            "xga_per_game": xga_entry["value"] / mp,
            "matches_played": mp,
        }

    if not xg_data:
        return None

    avg_xg = sum(d["xg_per_game"] for d in xg_data.values()) / len(xg_data)
    avg_xga = sum(d["xga_per_game"] for d in xg_data.values()) / len(xg_data)

    ratings = {}
    for tid, d in xg_data.items():
        att = d["xg_per_game"] / avg_xg if avg_xg > 0 else 1.0
        defe = d["xga_per_game"] / avg_xga if avg_xga > 0 else 1.0

        # xG doesn't distinguish home/away, so use the same for both
        # but scale by league home/away ratio
        home_away_ratio = (
            league_stats["avg_home_goals"] / league_stats["avg_away_goals"]
            if league_stats["avg_away_goals"] > 0
            else 1.0
        )

        ratings[tid] = {
            "home_attack": att * math.sqrt(home_away_ratio),
            "home_defense": defe / math.sqrt(home_away_ratio),
            "away_attack": att / math.sqrt(home_away_ratio),
            "away_defense": defe * math.sqrt(home_away_ratio),
        }

    return ratings


def blend_ratings(match_ratings, xg_ratings, xg_weight):
    """Blend match-derived and xG-derived ratings."""
    if xg_ratings is None or xg_weight <= 0:
        return match_ratings

    mw = 1.0 - xg_weight
    blended = {}

    for tid in match_ratings:
        mr = match_ratings[tid]
        xr = xg_ratings.get(tid)

        if xr is None:
            blended[tid] = mr
            continue

        blended[tid] = {
            key: mw * mr[key] + xg_weight * xr[key]
            for key in mr
        }

    return blended


def apply_overrides(ratings):
    """Apply hard per-team multipliers to blended ratings."""
    for tid, overrides in TEAM_OVERRIDES.items():
        if tid not in ratings:
            continue
        r = ratings[tid]
        att_mult = overrides.get("attack_mult", 1.0)
        def_mult = overrides.get("defense_mult", 1.0)
        ratings[tid] = {
            "home_attack": r["home_attack"] * att_mult,
            "home_defense": r["home_defense"] * def_mult,
            "away_attack": r["away_attack"] * att_mult,
            "away_defense": r["away_defense"] * def_mult,
        }
    return ratings


def poisson_sample(lam, rng):
    """Sample from a Poisson distribution capped at MAX_GOALS."""
    threshold = math.exp(-lam)
    k = 0
    p = 1.0
    while k < MAX_GOALS:
        p *= rng.random()
        if p < threshold:
            break
        k += 1
    return k


def compute_match_lambdas(scheduled, ratings, league_stats):
    """
    Pre-compute Poisson lambda (expected goals) and goal cap for each team
    in every scheduled match, so simulation loops stay fast.
    """
    match_params = []
    for match in scheduled:
        hid = str(match["homeTeamId"])
        aid = str(match["awayTeamId"])
        hr = ratings.get(hid)
        ar = ratings.get(aid)

        if not hr or not ar:
            match_params.append((match["id"], hid, aid, 1.0, 1.0, MAX_GOALS, MAX_GOALS))
            continue

        lam_h = hr["home_attack"] * ar["away_defense"] * league_stats["avg_home_goals"]
        lam_a = ar["away_attack"] * hr["home_defense"] * league_stats["avg_away_goals"]
        lam_h = max(0.3, min(lam_h, 5.0))
        lam_a = max(0.3, min(lam_a, 5.0))

        cap_h = TEAM_OVERRIDES.get(hid, {}).get("max_goals", MAX_GOALS)
        cap_a = TEAM_OVERRIDES.get(aid, {}).get("max_goals", MAX_GOALS)

        match_params.append((match["id"], hid, aid, lam_h, lam_a, cap_h, cap_a))

    return match_params


def compute_base_standings(finished_matches):
    """Compute points, GF, GA from already-finished matches."""
    standings = defaultdict(lambda: {"points": 0, "gf": 0, "ga": 0})
    for m in finished_matches:
        hid = str(m["homeTeamId"])
        aid = str(m["awayTeamId"])
        hg = m["homeGoals"]
        ag = m["awayGoals"]
        if hg is None or ag is None:
            continue

        standings[hid]["gf"] += hg
        standings[hid]["ga"] += ag
        standings[aid]["gf"] += ag
        standings[aid]["ga"] += hg

        if hg > ag:
            standings[hid]["points"] += 3
        elif hg == ag:
            standings[hid]["points"] += 1
            standings[aid]["points"] += 1
        else:
            standings[aid]["points"] += 3

    return standings


def simulate_season(match_params, num_sims):
    """
    Run Monte Carlo season simulation.

    Returns:
        match_tallies: {match_id: {(hg, ag): count}}
        team_sim_points: {team_id: [total_sim_points_per_run]}
        team_sim_gd: {team_id: [total_sim_gd_per_run]}
    """
    rng = random.Random(SIMULATION_SEED)

    all_tids = set()
    for _, hid, aid, *_ in match_params:
        all_tids.add(hid)
        all_tids.add(aid)

    match_tallies = {mid: defaultdict(int) for mid, *_ in match_params}
    team_sim_points = {tid: [] for tid in all_tids}
    team_sim_gd = {tid: [] for tid in all_tids}

    for _ in range(num_sims):
        sim_pts = defaultdict(int)
        sim_gd = defaultdict(int)

        for mid, hid, aid, lam_h, lam_a, cap_h, cap_a in match_params:
            hg = min(poisson_sample(lam_h, rng), cap_h)
            ag = min(poisson_sample(lam_a, rng), cap_a)

            match_tallies[mid][(hg, ag)] += 1

            sim_gd[hid] += hg - ag
            sim_gd[aid] += ag - hg

            if hg > ag:
                sim_pts[hid] += 3
            elif hg == ag:
                sim_pts[hid] += 1
                sim_pts[aid] += 1
            else:
                sim_pts[aid] += 3

        for tid in all_tids:
            team_sim_points[tid].append(sim_pts[tid])
            team_sim_gd[tid].append(sim_gd[tid])

    return match_tallies, team_sim_points, team_sim_gd


def main():
    parser = argparse.ArgumentParser(
        description="Generate match predictions via Monte Carlo season simulation"
    )
    parser.add_argument(
        "--xg-weight", type=float, default=0.5,
        help="Weight for xG-derived ratings (0.0-1.0). Default: 0.5"
    )
    parser.add_argument(
        "--no-xg", action="store_true",
        help="Disable xG integration, use match results only"
    )
    parser.add_argument(
        "--simulations", type=int, default=NUM_SIMULATIONS,
        help=f"Number of Monte Carlo simulations. Default: {NUM_SIMULATIONS}"
    )
    args = parser.parse_args()

    if not os.path.exists(MATCHES_PATH):
        print(f"Error: {MATCHES_PATH} not found. Run 'yarn fetch-data' first.", file=sys.stderr)
        sys.exit(1)

    matches_data = load_json(MATCHES_PATH)
    matches = matches_data["matches"]

    finished = [m for m in matches if m["status"] == "FINISHED"]
    scheduled = [m for m in matches if m["status"] == "SCHEDULED"]

    print(f"Loaded {len(matches)} matches ({len(finished)} finished, {len(scheduled)} scheduled)")

    profiles, league_stats = build_team_profiles(matches)
    print(f"Built profiles for {len(profiles)} teams")
    print(f"League averages: {league_stats['avg_home_goals']:.2f} home goals/game, "
          f"{league_stats['avg_away_goals']:.2f} away goals/game")

    match_ratings = compute_match_ratings(profiles, league_stats)

    xg_ratings = None
    xg_weight = 0.0 if args.no_xg else args.xg_weight

    if xg_weight > 0 and os.path.exists(FOTMOB_STATS_PATH):
        fotmob_stats = load_json(FOTMOB_STATS_PATH)
        xg_ratings = compute_xg_ratings(fotmob_stats, league_stats)
        if xg_ratings:
            print(f"Loaded xG data for {len(xg_ratings)} teams (weight: {xg_weight:.0%})")
        else:
            print("Warning: xG data loaded but no usable entries found, using match-only ratings")
    elif xg_weight > 0:
        print(f"Warning: {FOTMOB_STATS_PATH} not found, using match-only ratings")

    ratings = blend_ratings(match_ratings, xg_ratings, xg_weight)
    ratings = apply_overrides(ratings)

    if TEAM_OVERRIDES:
        print(f"Applied hard overrides for {len(TEAM_OVERRIDES)} team(s)")

    # Pre-compute lambdas and run simulation
    match_params = compute_match_lambdas(scheduled, ratings, league_stats)
    num_sims = args.simulations
    print(f"Running {num_sims:,} season simulations...")

    match_tallies, team_sim_points, team_sim_gd = simulate_season(match_params, num_sims)

    # Extract per-match predictions (most common scoreline)
    predictions = {}
    total_home = 0
    total_away = 0

    for mid, *_ in match_params:
        tally = match_tallies[mid]
        best_score = max(tally, key=tally.get)
        predictions[str(mid)] = {"homeGoals": best_score[0], "awayGoals": best_score[1]}
        total_home += best_score[0]
        total_away += best_score[1]

    output = {
        "lastUpdated": datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z"),
        "predictions": predictions,
    }

    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    home_wins = sum(1 for p in predictions.values() if p["homeGoals"] > p["awayGoals"])
    draws = sum(1 for p in predictions.values() if p["homeGoals"] == p["awayGoals"])
    away_wins = sum(1 for p in predictions.values() if p["homeGoals"] < p["awayGoals"])

    print(f"\n✓ Generated predictions for {len(predictions)} matches")
    print(f"  Average predicted score: {total_home / len(predictions):.1f} - {total_away / len(predictions):.1f}")
    print(f"  Outcomes: {home_wins} home wins, {draws} draws, {away_wins} away wins")
    print(f"  Written to {OUTPUT_PATH}")

    # Predicted final table (base standings + average simulated remaining points)
    teams_data = load_json(os.path.join(DATA_DIR, "teams.json"))
    team_names = {str(t["id"]): t["shortName"] for t in teams_data["teams"]}
    base = compute_base_standings(finished)

    table = []
    for tid in team_sim_points:
        avg_sim_pts = sum(team_sim_points[tid]) / num_sims
        avg_sim_gd = sum(team_sim_gd[tid]) / num_sims
        total_pts = base[tid]["points"] + avg_sim_pts
        total_gd = (base[tid]["gf"] - base[tid]["ga"]) + avg_sim_gd
        name = team_names.get(tid, tid)
        table.append((name, total_pts, total_gd))

    table.sort(key=lambda r: (-r[1], -r[2]))

    print(f"\n{'Predicted Final Table':>30}")
    print(f"  {'#':>2}  {'Team':<18} {'Pts':>5}  {'GD':>5}")
    print(f"  {'—' * 34}")
    for i, (name, pts, gd) in enumerate(table, 1):
        print(f"  {i:>2}. {name:<18} {pts:>5.1f}  {gd:>+5.1f}")


if __name__ == "__main__":
    main()
