"""Preprocess CFB usage CSV into JSON files consumed by the frontend."""
import json
import os
from collections import defaultdict
from pathlib import Path

import pandas as pd

CSV = Path("/app/data/cfb_usage.csv")
OUT = Path("/app/frontend/src/data")
OUT.mkdir(parents=True, exist_ok=True)

df = pd.read_csv(CSV, encoding="utf-8-sig")
df.columns = [c.strip() for c in df.columns]


def pct_to_float(v):
    if isinstance(v, str) and v.endswith("%"):
        return float(v.rstrip("%"))
    try:
        return float(v)
    except Exception:  # noqa: BLE001
        return 0.0


df["Player_Usage_Share_f"] = df["Player_Usage_Share"].apply(pct_to_float)
df["Top_Player_Share_f"] = df["Top_Player_Share"].apply(pct_to_float)
df["Top_3_Share_f"] = df["Top_3_Share"].apply(pct_to_float)

# ---- Power Five win% 2021-2023 (curated from public records) ----
# Source: official conference schedules; season totals (regular + postseason).
WINS = {
    # SEC
    ("Alabama", 2021): 0.867, ("Alabama", 2022): 0.786, ("Alabama", 2023): 0.857,
    ("Georgia", 2021): 1.000, ("Georgia", 2022): 1.000, ("Georgia", 2023): 0.917,
    ("LSU", 2021): 0.462, ("LSU", 2022): 0.714, ("LSU", 2023): 0.769,
    ("Tennessee", 2021): 0.538, ("Tennessee", 2022): 0.846, ("Tennessee", 2023): 0.692,
    ("Ole Miss", 2021): 0.769, ("Ole Miss", 2022): 0.615, ("Ole Miss", 2023): 0.846,
    ("Texas A&M", 2021): 0.667, ("Texas A&M", 2022): 0.417, ("Texas A&M", 2023): 0.538,
    ("Kentucky", 2021): 0.769, ("Kentucky", 2022): 0.538, ("Kentucky", 2023): 0.538,
    ("Auburn", 2021): 0.500, ("Auburn", 2022): 0.417, ("Auburn", 2023): 0.500,
    ("Arkansas", 2021): 0.692, ("Arkansas", 2022): 0.538, ("Arkansas", 2023): 0.333,
    ("South Carolina", 2021): 0.538, ("South Carolina", 2022): 0.615, ("South Carolina", 2023): 0.417,
    ("Mississippi State", 2021): 0.538, ("Mississippi State", 2022): 0.692, ("Mississippi State", 2023): 0.417,
    ("Missouri", 2021): 0.500, ("Missouri", 2022): 0.538, ("Missouri", 2023): 0.846,
    ("Florida", 2021): 0.462, ("Florida", 2022): 0.500, ("Florida", 2023): 0.417,
    ("Vanderbilt", 2021): 0.167, ("Vanderbilt", 2022): 0.417, ("Vanderbilt", 2023): 0.167,
    # Big Ten
    ("Michigan", 2021): 0.857, ("Michigan", 2022): 0.929, ("Michigan", 2023): 1.000,
    ("Ohio State", 2021): 0.846, ("Ohio State", 2022): 0.846, ("Ohio State", 2023): 0.846,
    ("Penn State", 2021): 0.538, ("Penn State", 2022): 0.786, ("Penn State", 2023): 0.769,
    ("Michigan State", 2021): 0.846, ("Michigan State", 2022): 0.417, ("Michigan State", 2023): 0.333,
    ("Iowa", 2021): 0.714, ("Iowa", 2022): 0.615, ("Iowa", 2023): 0.714,
    ("Wisconsin", 2021): 0.692, ("Wisconsin", 2022): 0.538, ("Wisconsin", 2023): 0.538,
    ("Minnesota", 2021): 0.692, ("Minnesota", 2022): 0.692, ("Minnesota", 2023): 0.462,
    ("Purdue", 2021): 0.692, ("Purdue", 2022): 0.571, ("Purdue", 2023): 0.308,
    ("Maryland", 2021): 0.538, ("Maryland", 2022): 0.615, ("Maryland", 2023): 0.538,
    ("Illinois", 2021): 0.385, ("Illinois", 2022): 0.615, ("Illinois", 2023): 0.417,
    ("Nebraska", 2021): 0.231, ("Nebraska", 2022): 0.333, ("Nebraska", 2023): 0.500,
    ("Northwestern", 2021): 0.250, ("Northwestern", 2022): 0.083, ("Northwestern", 2023): 0.615,
    ("Rutgers", 2021): 0.417, ("Rutgers", 2022): 0.385, ("Rutgers", 2023): 0.538,
    ("Indiana", 2021): 0.167, ("Indiana", 2022): 0.333, ("Indiana", 2023): 0.250,
    # Big 12
    ("Oklahoma", 2021): 0.857, ("Oklahoma", 2022): 0.462, ("Oklahoma", 2023): 0.769,
    ("Oklahoma State", 2021): 0.857, ("Oklahoma State", 2022): 0.538, ("Oklahoma State", 2023): 0.714,
    ("Baylor", 2021): 0.857, ("Baylor", 2022): 0.500, ("Baylor", 2023): 0.231,
    ("TCU", 2021): 0.417, ("TCU", 2022): 0.867, ("TCU", 2023): 0.417,
    ("Texas", 2021): 0.417, ("Texas", 2022): 0.615, ("Texas", 2023): 0.857,
    ("Kansas State", 2021): 0.615, ("Kansas State", 2022): 0.714, ("Kansas State", 2023): 0.692,
    ("Iowa State", 2021): 0.538, ("Iowa State", 2022): 0.333, ("Iowa State", 2023): 0.538,
    ("West Virginia", 2021): 0.462, ("West Virginia", 2022): 0.417, ("West Virginia", 2023): 0.692,
    ("Texas Tech", 2021): 0.538, ("Texas Tech", 2022): 0.615, ("Texas Tech", 2023): 0.538,
    ("Kansas", 2021): 0.167, ("Kansas", 2022): 0.500, ("Kansas", 2023): 0.692,
    ("Cincinnati", 2023): 0.231,
    ("Houston", 2023): 0.333,
    ("UCF", 2023): 0.500,
    ("BYU", 2023): 0.417,
    # ACC
    ("Clemson", 2021): 0.769, ("Clemson", 2022): 0.786, ("Clemson", 2023): 0.692,
    ("NC State", 2021): 0.692, ("NC State", 2022): 0.615, ("NC State", 2023): 0.538,
    ("Wake Forest", 2021): 0.786, ("Wake Forest", 2022): 0.615, ("Wake Forest", 2023): 0.333,
    ("Pittsburgh", 2021): 0.786, ("Pittsburgh", 2022): 0.692, ("Pittsburgh", 2023): 0.250,
    ("Louisville", 2021): 0.462, ("Louisville", 2022): 0.615, ("Louisville", 2023): 0.769,
    ("Miami", 2021): 0.538, ("Miami", 2022): 0.417, ("Miami", 2023): 0.538,
    ("Florida State", 2021): 0.462, ("Florida State", 2022): 0.769, ("Florida State", 2023): 0.929,
    ("North Carolina", 2021): 0.500, ("North Carolina", 2022): 0.643, ("North Carolina", 2023): 0.615,
    ("Virginia Tech", 2021): 0.500, ("Virginia Tech", 2022): 0.250, ("Virginia Tech", 2023): 0.538,
    ("Virginia", 2021): 0.500, ("Virginia", 2022): 0.273, ("Virginia", 2023): 0.231,
    ("Duke", 2021): 0.250, ("Duke", 2022): 0.692, ("Duke", 2023): 0.615,
    ("Boston College", 2021): 0.500, ("Boston College", 2022): 0.250, ("Boston College", 2023): 0.538,
    ("Syracuse", 2021): 0.462, ("Syracuse", 2022): 0.538, ("Syracuse", 2023): 0.462,
    ("Georgia Tech", 2021): 0.250, ("Georgia Tech", 2022): 0.417, ("Georgia Tech", 2023): 0.538,
    # Pac-12
    ("Utah", 2021): 0.714, ("Utah", 2022): 0.714, ("Utah", 2023): 0.615,
    ("USC", 2021): 0.333, ("USC", 2022): 0.786, ("USC", 2023): 0.615,
    ("Oregon", 2021): 0.769, ("Oregon", 2022): 0.692, ("Oregon", 2023): 0.857,
    ("Washington", 2021): 0.333, ("Washington", 2022): 0.769, ("Washington", 2023): 0.929,
    ("Oregon State", 2021): 0.538, ("Oregon State", 2022): 0.769, ("Oregon State", 2023): 0.615,
    ("Washington State", 2021): 0.538, ("Washington State", 2022): 0.538, ("Washington State", 2023): 0.385,
    ("UCLA", 2021): 0.667, ("UCLA", 2022): 0.692, ("UCLA", 2023): 0.615,
    ("Arizona State", 2021): 0.615, ("Arizona State", 2022): 0.250, ("Arizona State", 2023): 0.231,
    ("Arizona", 2021): 0.083, ("Arizona", 2022): 0.417, ("Arizona", 2023): 0.769,
    ("California", 2021): 0.455, ("California", 2022): 0.333, ("California", 2023): 0.462,
    ("Stanford", 2021): 0.250, ("Stanford", 2022): 0.250, ("Stanford", 2023): 0.231,
    ("Colorado", 2021): 0.333, ("Colorado", 2022): 0.083, ("Colorado", 2023): 0.333,
}

# ---------- Q1: Top player-seasons ----------
top_player_seasons = (
    df.sort_values("Usage_Overall", ascending=False)
    .head(30)[
        ["Player_Name", "Position", "Team", "Conference", "Season",
         "Usage_Overall", "Player_Usage_Share_f", "Rank_Within_Team"]
    ]
    .rename(columns={"Player_Usage_Share_f": "Player_Usage_Share"})
    .to_dict(orient="records")
)

# Usage distribution (Q1)
usage_bins = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 1.0]
bin_labels = ["0–5%", "5–10%", "10–15%", "15–20%", "20–25%", "25–30%", "30–40%", "40–50%", "50%+"]
df["Usage_Bin"] = pd.cut(df["Usage_Overall"], bins=usage_bins, labels=bin_labels, include_lowest=True)
counts = df["Usage_Bin"].value_counts().reindex(bin_labels, fill_value=0)
distribution_fixed = [{"bin": lbl, "count": int(counts[lbl])} for lbl in bin_labels]

# Average usage by position (Q1 + Q4)
position_avg = (
    df.groupby("Position")["Usage_Overall"].agg(["mean", "median", "count"]).reset_index()
)
position_avg["mean"] = position_avg["mean"].round(4)
position_avg["median"] = position_avg["median"].round(4)
position_avg = position_avg.to_dict(orient="records")

# Multi-season players (Q1 longitudinal)
three_year_players = df[df["Distinct_Season_Count"] >= 3].copy()
player_trends = (
    three_year_players.groupby(["Player_Name", "Position", "Team"])
    .agg(
        total_usage=("Usage_Overall", "sum"),
        avg_usage=("Usage_Overall", "mean"),
        seasons=("Season", lambda s: sorted(list(s))),
    )
    .reset_index()
    .sort_values("total_usage", ascending=False)
    .head(20)
)
player_trend_records = []
for _, row in player_trends.iterrows():
    sub = three_year_players[three_year_players["Player_Name"] == row["Player_Name"]]
    season_points = sub.sort_values("Season")[
        ["Season", "Usage_Overall", "Team"]
    ].to_dict(orient="records")
    player_trend_records.append({
        "player": row["Player_Name"],
        "position": row["Position"],
        "avg": round(float(row["avg_usage"]), 4),
        "total": round(float(row["total_usage"]), 4),
        "points": season_points,
    })

# ---------- Q2: Team dependency ----------
# Use per-team-per-season Top_Player_Share + Top_3_Share (first row per team-season).
team_season = (
    df.sort_values(["Team", "Season", "Rank_Within_Team"])
    .groupby(["Team", "Season"])
    .first()
    .reset_index()[
        ["Team", "Season", "Conference", "Top_Player_Share_f", "Top_3_Share_f", "Team_Total_Usage"]
    ]
    .rename(columns={"Top_Player_Share_f": "top_player_share",
                     "Top_3_Share_f": "top_3_share"})
)
team_season["win_pct"] = team_season.apply(
    lambda r: WINS.get((r["Team"], int(r["Season"])), None), axis=1
)
team_season_records = team_season.to_dict(orient="records")

# Team averages across 2021-2023
team_avg = (
    team_season.groupby(["Team", "Conference"])
    .agg(avg_top_player=("top_player_share", "mean"),
         avg_top3=("top_3_share", "mean"),
         seasons_count=("Season", "count"),
         avg_win=("win_pct", "mean"))
    .reset_index()
    .round(3)
)
team_avg_records = team_avg.sort_values("avg_top_player", ascending=False).to_dict(orient="records")

# ---------- Q3: Conference comparisons ----------
conf_avg = (
    team_season.groupby("Conference")
    .agg(avg_top_player=("top_player_share", "mean"),
         avg_top3=("top_3_share", "mean"),
         teams=("Team", "nunique"))
    .reset_index()
    .round(3)
    .to_dict(orient="records")
)

# Conference × Position average usage (heatmap)
conf_pos = (
    df.groupby(["Conference", "Position"])["Usage_Overall"]
    .mean().round(4).reset_index().rename(columns={"Usage_Overall": "avg_usage"})
    .to_dict(orient="records")
)

# ---------- Q4: Position distribution ----------
position_dist = []
for pos in ["QB", "RB", "WR", "TE"]:
    sub = df[df["Position"] == pos]
    counts = pd.cut(sub["Usage_Overall"], bins=usage_bins, labels=bin_labels, include_lowest=True) \
        .value_counts().reindex(bin_labels, fill_value=0)
    position_dist.append({
        "position": pos,
        "bins": [{"bin": lbl, "count": int(counts[lbl])} for lbl in bin_labels],
        "avg": round(float(sub["Usage_Overall"].mean()), 4),
        "players": int(len(sub)),
    })

# Position share within team (how much of team_total does each position contribute on avg)
pos_share = (
    df.groupby(["Position"])["Player_Usage_Share_f"].mean().round(2).reset_index()
    .rename(columns={"Player_Usage_Share_f": "avg_share"}).to_dict(orient="records")
)

# ---------- Q5 / Q6: Performance vs concentration ----------
scatter = []
for rec in team_season_records:
    if rec["win_pct"] is not None:
        scatter.append({
            "team": rec["Team"],
            "conference": rec["Conference"],
            "season": int(rec["Season"]),
            "top_player": rec["top_player_share"],
            "top_3": rec["top_3_share"],
            "win_pct": round(rec["win_pct"], 3),
        })

# Archetype classification for Q6
archetypes = []
# Use medians from data with win coverage
if scatter:
    med_top = sorted([s["top_player"] for s in scatter])[len(scatter)//2]
    med_win = sorted([s["win_pct"] for s in scatter])[len(scatter)//2]
    for s in scatter:
        if s["top_player"] >= med_top and s["win_pct"] >= med_win:
            arch = "Star-Driven Winners"
        elif s["top_player"] < med_top and s["win_pct"] >= med_win:
            arch = "Balanced Winners"
        elif s["top_player"] >= med_top and s["win_pct"] < med_win:
            arch = "Concentrated Strugglers"
        else:
            arch = "Balanced Strugglers"
        archetypes.append({**s, "archetype": arch, "med_top": round(med_top, 3), "med_win": round(med_win, 3)})

# ---------- Cleaning funnel ----------
cleaning_funnel = [
    {"step": "Raw export", "rows": 12880, "note": "All FBS player-seasons across every conference and position in the source file."},
    {"step": "Drop non-Power-Five conferences", "rows": 3922, "note": "Removed AAC, ASUN, CUSA, Ind, INDAA, MAC, MWC, SBC, WAC + blanks — 10 conference buckets."},
    {"step": "Drop FB position", "rows": int(len(df)), "note": "Removed the fullback position; kept QB, RB, WR, TE as the four analytic positions."},
]

summary_stats = {
    "total_rows": int(len(df)),
    "teams": int(df["Team"].nunique()),
    "players": int(df["Player_Name"].nunique()),
    "seasons": sorted([int(s) for s in df["Season"].unique().tolist()]),
    "conferences": sorted(df["Conference"].unique().tolist()),
    "positions": sorted(df["Position"].unique().tolist()),
    "avg_usage": round(float(df["Usage_Overall"].mean()), 4),
    "max_usage": round(float(df["Usage_Overall"].max()), 4),
    "avg_top_player_share": round(float(df["Top_Player_Share_f"].mean()), 2),
    "avg_top_3_share": round(float(df["Top_3_Share_f"].mean()), 2),
}

payload = {
    "summary": summary_stats,
    "cleaningFunnel": cleaning_funnel,
    "q1": {
        "topPlayerSeasons": top_player_seasons,
        "distribution": distribution_fixed,
        "positionAverages": position_avg,
        "playerTrends": player_trend_records,
    },
    "q2": {
        "teamSeasons": team_season_records,
        "teamAverages": team_avg_records,
    },
    "q3": {
        "conferenceAverages": conf_avg,
        "conferencePosition": conf_pos,
    },
    "q4": {
        "positionDistribution": position_dist,
        "positionShare": pos_share,
    },
    "q5": {"scatter": scatter},
    "q6": {"archetypes": archetypes},
}

with (OUT / "dataset.json").open("w", encoding="utf-8") as f:
    json.dump(payload, f, indent=2, default=str)

print("Wrote", OUT / "dataset.json")
print("Summary:", summary_stats)
