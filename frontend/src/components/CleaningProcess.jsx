import SectionHeader from "./SectionHeader";
import Funnel from "./charts/Funnel";
import { cleaningFunnel } from "../lib/data";
import { motion } from "framer-motion";

const DECISIONS = [
    {
        tag: "Scope",
        title: "Why Power Five only",
        body: "We removed ten conference buckets outright — AAC, ASUN, CUSA, Ind, INDAA, MAC, MWC, SBC, WAC, plus rows with blank conference values. That single cut trimmed 8,958 rows. Power Five teams share comparable schedules, recruiting tiers, and scholarship depth; mixing in Group of Five or FCS would blur the structural comparison.",
    },
    {
        tag: "Positions",
        title: "Why only QB, RB, WR, TE",
        body: "The fullback position (FB) was removed — 18 rows. Those four skill positions account for effectively all designed offensive touches in a modern P5 offense; FB is a specialty role that inflates per-player share math without contributing meaningfully to a usage story.",
    },
    {
        tag: "Distribution integrity",
        title: "Why low- and high-usage players were kept",
        body: "We are studying the DISTRIBUTION of player usage — the whole shape, tails included. Dropping outliers would have flattened teams that genuinely run through one star and erased the low-usage depth rotation that rounds out every real offense. Trimming either tail would produce a cleaner-looking but less honest dataset.",
    },
    {
        tag: "Edge case",
        title: "Multi-team player-seasons",
        body: "A small number of players appeared on two teams in the same season (mid-year transfers). We kept those as separate team-rows rather than merging — the unit of analysis is team usage structure, not player career totals.",
    },
    {
        tag: "Quality",
        title: "Zero nulls, zero duplicates",
        body: "After the two filters were applied, we confirmed there were no missing Player_IDs, no duplicate (Player_ID, Team, Season) tuples, and no corrupt rows. The final analytic table was ready to plot directly — no imputation, no fabrication.",
    },
    {
        tag: "Window",
        title: "Why 2021–2023",
        body: "The three-season window reflects the post-COVID / transfer-portal era. It keeps rosters, rule sets, and conference alignments comparable across every team-season in the analysis — so cross-season comparisons aren't polluted by format shifts.",
    },
];

const WIN_STEPS = [
    {
        tag: "Step 01",
        title: "Performance Data Construction (Q5)",
        body: "To analyze the relationship between offensive usage and team success, additional performance data was constructed from raw game-level results. The original dataset contained one row per game, with separate home and away team records.",
    },
    {
        tag: "Step 02",
        title: "Game-to-Team Transformation",
        body: "Each game was split into two observations — one for each team — so that every row represents a single team's performance in a single game. This transformation enabled consistent aggregation and alignment with the usage dataset.",
    },
    {
        tag: "Step 03",
        title: "Scope Alignment",
        body: "The dataset was filtered to include only Power 5 conferences (SEC, ACC, Big Ten, Big 12, Pac-12), ensuring consistency with the cleaned usage dataset and removing irrelevant observations.",
    },
    {
        tag: "Step 04",
        title: "Outcome Calculation",
        body: "Game outcomes were derived by comparing points scored and points allowed. A win was assigned when points_for exceeded points_against. Helper columns were created to track wins and total games.",
    },
    {
        tag: "Step 05",
        title: "Aggregation to Team-Season Level",
        body: "The data was aggregated by team and season. Total wins were calculated as the sum of wins, and total games were calculated as the sum of the game indicator column.",
    },
    {
        tag: "Step 06",
        title: "Win Percentage",
        body: "Win percentage was calculated as total wins divided by total games for each team-season, providing a standardized measure of team performance.",
    },
    {
        tag: "Step 07",
        title: "Integration with Usage Data",
        body: "The team-season performance dataset was merged with the cleaned usage dataset using team and season as keys, enabling direct comparison between offensive usage concentration and team success in Q5 and Q6.",
    },
];

export default function CleaningProcess() {
    return (
        <section
            id="cleaning"
            data-testid="cleaning-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <SectionHeader
                eyebrow="Ch. 02 · Methodology"
                title="From 272,034 data points to 81,496."
                kicker="Combined unaltered source data (RAW_DATA + RAW_Win_Data) begins at 32,200 rows. 25,917 rows were dropped by narrowing the scope to Power Five conferences; 18 more were dropped by removing the fullback position. Nothing else was filtered — the shape of the distribution was left intact."
            />

            {/* Dataset dimensions panel — data points × rows */}
            <div
                className="mb-10 p-6 bg-[#121215] border border-white/10"
                data-testid="dataset-dimensions"
            >
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#ffcc00] mb-3">
                    Datasets · Data Points × Rows
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            label: "RAW_DATA",
                            points: "175,453",
                            rows: "12,880",
                            caption: "Original player-level dataset.",
                            accent: "#ff3b30",
                        },
                        {
                            label: "CLEAN_DATA",
                            points: "62,464",
                            rows: "3,904",
                            caption: "Processed player-level dataset used for Q1–Q4.",
                            accent: "#ffcc00",
                        },
                        {
                            label: "RAW_Win_Data",
                            points: "96,600",
                            rows: "19,320",
                            caption: "Original game-level dataset.",
                            accent: "#ff3b30",
                        },
                        {
                            label: "CLEAN_Win_Data",
                            points: "19,032",
                            rows: "2,379",
                            caption:
                                "Processed team-game dataset used to calculate win%.",
                            accent: "#34c759",
                        },
                    ].map((d) => (
                        <div
                            key={d.label}
                            className="p-4 bg-[#0a0a0a] border-t-2 border-white/10 border-t-transparent"
                            style={{ borderTopColor: d.accent }}
                            data-testid={`dataset-card-${d.label}`}
                        >
                            <div
                                className="text-[10px] font-mono uppercase tracking-[0.25em]"
                                style={{ color: d.accent }}
                            >
                                {d.label}
                            </div>
                            <div className="mt-2 font-heading text-3xl font-black text-white leading-none">
                                {d.points}
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717a] mt-1">
                                data points
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/10 text-[11px] font-mono text-[#a1a1aa]">
                                {d.rows} rows
                            </div>
                            <p className="mt-2 text-xs text-[#a1a1aa] font-sub leading-relaxed">
                                {d.caption}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-7">
                    <div className="p-6 bg-[#121215] border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                                Data Reduction Funnel
                            </div>
                            <div className="text-[11px] font-mono text-[#ffcc00]">
                                {cleaningFunnel[0].rows.toLocaleString()} →{" "}
                                {cleaningFunnel[cleaningFunnel.length - 1].rows.toLocaleString()}
                            </div>
                        </div>
                        <Funnel steps={cleaningFunnel} dataTestId="cleaning-funnel" />
                    </div>

                    {/* before / after — combined (RAW_DATA + RAW_Win_Data) */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="p-5 bg-[#0a0a0a] border border-white/10">
                            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                                Before · RAW_DATA + RAW_Win_Data
                            </div>
                            <div className="mt-2 font-heading text-4xl font-black text-white leading-none">
                                272,034
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717a] mt-1">
                                data points · 32,200 rows
                            </div>
                            <div className="mt-2 text-xs text-[#a1a1aa]">
                                all conferences · all positions · 2021–2023
                            </div>
                        </div>
                        <div className="p-5 bg-[#ffcc00]/10 border border-[#ffcc00]/30">
                            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ffcc00]">
                                After · CLEAN_DATA + CLEAN_Win_Data
                            </div>
                            <div className="mt-2 font-heading text-4xl font-black text-white leading-none">
                                81,496
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#ffcc00] mt-1">
                                data points · 6,265 rows
                            </div>
                            <div className="mt-2 text-xs text-[#a1a1aa]">
                                P5 · QB/RB/WR/TE · 2021–2023
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                    {DECISIONS.map((d, i) => (
                        <motion.div
                            key={d.title}
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            className="p-5 border border-white/10 bg-[#0a0a0a] hover:border-[#007aff]/50 transition-colors"
                            data-testid={`cleaning-decision-${i}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.2em] text-[#007aff] border border-[#007aff]/40 bg-[#007aff]/5">
                                    {d.tag}
                                </span>
                            </div>
                            <div className="font-sub font-bold text-white text-sm mb-1 uppercase tracking-wide">
                                {d.title}
                            </div>
                            <p className="text-[#a1a1aa] text-sm leading-relaxed">{d.body}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-12 p-6 border-l-4 border-[#ffcc00] bg-[#121215]"
            >
                <p className="font-sub text-white text-lg leading-relaxed">
                    <span className="text-[#ffcc00] font-bold">Takeaway.</span>{" "}
                    Only two filters were applied — scope and position. No usage
                    outliers were trimmed, no bottom tail was dropped. Because the
                    entire analysis asks how usage is{" "}
                    <em className="text-white">distributed</em>, removing either
                    extreme would have rewritten the story we set out to tell.
                </p>
            </motion.div>

            {/* -------- Win Data Methodology -------- */}
            <div
                id="win-methodology"
                data-testid="win-methodology"
                className="mt-20 pt-12 border-t border-white/10"
            >
                <div className="flex flex-wrap items-end justify-between gap-4 mb-3">
                    <div>
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#ffcc00] mb-2">
                            Ch. 02 · Methodology · Part II
                        </div>
                        <h3 className="font-heading text-3xl md:text-4xl font-black uppercase text-white leading-tight max-w-3xl">
                            How win data was built for Q5.
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <a
                            href="/RAW_Win_Data.csv"
                            download
                            data-testid="methodology-raw-win-link"
                            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-white border border-[#ff3b30]/60 px-3 py-2 hover:bg-[#ff3b30] transition-colors"
                        >
                            RAW_Win_Data.csv <span>↓</span>
                        </a>
                        <a
                            href="/CLEAN_Win_Data.csv"
                            download
                            data-testid="methodology-clean-win-link"
                            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-white border border-[#ffcc00]/60 px-3 py-2 hover:bg-[#ffcc00] hover:text-black transition-colors"
                        >
                            CLEAN_Win_Data.csv <span>↓</span>
                        </a>
                    </div>
                </div>

                <p className="text-[#a1a1aa] text-sm md:text-base font-sub leading-relaxed max-w-4xl mb-8">
                    <b className="text-white">RAW_Win_Data</b> contains the original
                    game-level data, while <b className="text-white">CLEAN_Win_Data</b>{" "}
                    reflects the transformed team-level dataset used to calculate the
                    performance metrics shown in Q5. The seven steps below document
                    exactly how one became the other.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {WIN_STEPS.map((s, i) => (
                        <motion.div
                            key={s.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
                            className="p-5 border border-white/10 bg-[#0a0a0a] hover:border-[#ffcc00]/50 transition-colors"
                            data-testid={`win-methodology-step-${i}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.25em] text-[#ffcc00] border border-[#ffcc00]/40 bg-[#ffcc00]/5">
                                    {s.tag}
                                </span>
                            </div>
                            <div className="font-sub font-bold text-white text-sm mb-2 uppercase tracking-wide">
                                {s.title}
                            </div>
                            <p className="text-[#a1a1aa] text-sm leading-relaxed">
                                {s.body}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
