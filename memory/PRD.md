# The Concentration Equation — PRD

## Problem Statement (original)
Create an interactive scrollytelling website that tells a clear, data-driven story
about offensive player usage in college football (2021–2023 Power Five, QB/RB/WR/TE).
Answer six research questions with animated visualizations, guide the viewer with
concise explanatory text, and document the full data-cleaning and chart-design process.

Audience: course instructor, students, sports-analytics readers.

## Architecture
- **Data layer**: `/app/scripts/preprocess.py` reads the raw CSV
  (`/app/data/cfb_usage.csv`), computes everything needed for all six questions
  plus an external public win-percentage lookup, and emits
  `/app/frontend/src/data/dataset.json` which is bundled with the app.
- **Frontend**: React 19 + Tailwind + Framer Motion + D3 (scales/geometry) +
  React Intersection Observer. Six chart components:
  `BarChart`, `Histogram`, `Scatter`, `Heatmap`, `LineChart`, `Funnel`.
- **Backend**: Default FastAPI template kept for health; not used for data.
- **Theme**: Performance Pro — obsidian (#0a0a0a) canvas, electric volt blue,
  blaze red, signal yellow, success green. Fonts: Barlow Condensed + Chivo +
  IBM Plex Sans + IBM Plex Mono (per design guidelines).

## Site Structure
1. Hero — stadium backdrop, "The Concentration Equation", stats row.
2. What is Usage — 3 concept cards.
3. Data Cleaning — animated row-reduction funnel, before/after, 6 decision cards.
4. Viz Design — 6 annotated design notes with revision history.
5. Q1 Top players — top-15 horizontal bar, distribution histogram, position avg, 3-yr line chart.
6. Q2 Team dependency — most dependent vs most balanced, top-3 ranking.
7. Q3 Conferences — top-player & top-3 bars, 5×4 heatmap, callouts.
8. Q4 Positions — grouped histogram, avg usage/share bars, 4 position cards.
9. Q5 Performance — two scatters (win% vs top player; vs top-3) with trend lines.
10. Q6 Archetypes — quadrant scatter + 4 archetype tallies with representative teams.
11. Conclusion — 5 takeaway cards + next-steps block.

## Personas
- **Instructor/Grader**: wants transparency around methodology + clarity of story.
- **Student**: wants to understand the thinking behind the charts.
- **Analytics Reader**: wants interactive, hover-rich visualizations.

## Implemented (Feb 2026)
- All 11 sections, 6 custom D3 + Framer Motion charts.
- Scroll-triggered animations via IntersectionObserver.
- Rich hover tooltips on scatter charts.
- Responsive dark theme with grain overlay.
- Transparent external win% lookup for Q5/Q6 (fully disclosed in UI).
- Preprocessing pipeline producing deterministic JSON bundle.
- Global Filter Bar (Season/Conference/Team) — desktop sidebar + mobile dropdown.
- Column-Level Data Cleaning Documentation + Raw and Cleaned data tables.
- Live "Answer" block per question that updates with filters.
- **Q2/Q3 aggregation aligned to source Excel pivot (Feb 2026 patch):**
  team- and conference-level averages now use `AVERAGE(Top_Player_Share)` over
  every raw player-row (weighted by player count per season) — matching the
  user-provided Excel exactly (Houston 41.9%, Arizona 30.6%, etc.).
- **Q5 rebuilt on real game data (Feb 2026):** scatter + R² now sourced from
  `CLEAN_Win_Data.csv` (SUM(Win)/SUM(Game) per team-season, 196 team-seasons).
- **Q6 locked to Excel-fixed thresholds (Feb 2026):** top_player_share median =
  26.9%, win_pct median = 54%. Classification counts exactly match Excel
  (Star Winners 55, Balanced Winners 50, Balanced Strugglers 50, Concentrated
  Strugglers 41, total 196).
- **CLEAN_DATA refresh (Feb 2026):** new high-precision `cleaned-data.csv`
  (shares stored as floats instead of percent-strings) now powers every chart,
  eliminating sub-percent Excel drift. Methodology section now shows all four
  datasets in "data points × rows" format (RAW_DATA 175,453/12,880,
  CLEAN_DATA 62,464/3,904, RAW_Win_Data 96,600/19,320,
  CLEAN_Win_Data 19,032/2,379) plus the 7-step Q5 win-data construction
  process.

## Backlog / Future
- **P1**: Global filter bar (season/conference/team) that cross-filters every chart.
- **P1**: Highlight-selected-team thread across Q2/Q5/Q6.
- **P2**: Expanded cleaning-process funnel with detailed before/after sample rows.
- **P2**: Share/export story page as PDF.
- **P2**: Efficiency dataset (yards/touch, success rate) to extend the analysis.

## Next Tasks
- Add global filter state + React context.
- Build team-highlight handlers.
- Mobile polish (smaller chart paddings, stacked layouts).
