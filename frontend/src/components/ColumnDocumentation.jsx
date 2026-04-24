import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const ACTION_STYLE = {
    kept: { color: "#34c759", tag: "KEPT" },
    "kept and validated": { color: "#34c759", tag: "KEPT" },
    filtered: { color: "#007aff", tag: "FILTERED" },
    "filtered and standardized": { color: "#007aff", tag: "FILTERED" },
    dropped: { color: "#ff3b30", tag: "DROPPED" },
    created: { color: "#ffcc00", tag: "CREATED" },
};

const COLUMNS = [
    {
        column_name: "season",
        action: "kept",
        preprocessing: "No transformation required.",
        reasoning:
            "Essential for temporal analysis; enables comparison across 2021–2023 and drives time-based filtering.",
    },
    {
        column_name: "id",
        action: "kept",
        preprocessing: "No transformation required.",
        reasoning:
            "Uniquely identifies each player; used for deduplication checks and data integrity even though it isn't plotted directly.",
    },
    {
        column_name: "name",
        action: "kept",
        preprocessing: "Trimmed for formatting consistency.",
        reasoning:
            "Needed to identify top player-seasons and label visualizations. Whitespace trimmed without altering meaning.",
    },
    {
        column_name: "position",
        action: "filtered",
        preprocessing: "Only QB, RB, WR, and TE retained; FB and others removed.",
        reasoning:
            "The analysis focuses on offensive skill positions; keeping other positions would dilute the usage interpretation.",
    },
    {
        column_name: "team",
        action: "kept",
        preprocessing: "Trimmed and standardized.",
        reasoning:
            "Core grouping variable for nearly every analysis. Standardization avoids duplicate categories from stray casing or spacing.",
    },
    {
        column_name: "conference",
        action: "filtered and standardized",
        preprocessing: "Restricted to Power Five (ACC, B1G, B12, PAC, SEC) and renamed for clarity.",
        reasoning:
            "Limits to teams that share comparable competitive environments and scholarship depth; labels standardized for readable legends.",
    },
    {
        column_name: "usage_overall",
        action: "kept and validated",
        preprocessing: "Verified as numeric and free of missing values.",
        reasoning:
            "The primary metric of the analysis — it represents player offensive involvement. Type and completeness checks are mandatory upstream.",
    },
    {
        column_name: "usage_pass",
        action: "dropped",
        preprocessing: "Removed from dataset.",
        reasoning:
            "Informative but outside the scope of the research questions, which focus on overall usage rather than play-type breakdowns.",
    },
    {
        column_name: "usage_rush",
        action: "dropped",
        preprocessing: "Removed from dataset.",
        reasoning: "Same reasoning as usage_pass — extra detail not required for the defined scope.",
    },
    {
        column_name: "usage_firstdown",
        action: "dropped",
        preprocessing: "Removed from dataset.",
        reasoning: "Down-specific usage is outside the scope and would add complexity without insight.",
    },
    {
        column_name: "usage_seconddown",
        action: "dropped",
        preprocessing: "Removed from dataset.",
        reasoning: "Removed for the same reason as first-down usage.",
    },
    {
        column_name: "usage_thirddown",
        action: "dropped",
        preprocessing: "Removed from dataset.",
        reasoning: "Down-specific metric excluded to maintain focus and avoid unnecessary complexity.",
    },
    {
        column_name: "usage_standarddowns",
        action: "dropped",
        preprocessing: "Removed from dataset.",
        reasoning: "Not required for the analytical scope; added complexity would not improve insight.",
    },
    {
        column_name: "usage_passingdowns",
        action: "dropped",
        preprocessing: "Removed from dataset.",
        reasoning: "Dropped for consistency with the other down-based variables.",
    },
    {
        column_name: "team_total_usage",
        action: "created",
        preprocessing: "Aggregated total usage per team-season.",
        reasoning:
            "Enables normalization of individual player usage and within-team comparison.",
    },
    {
        column_name: "player_usage_share",
        action: "created",
        preprocessing: "Computed as player usage ÷ team total usage.",
        reasoning:
            "Key derived metric — a player's share of team offensive involvement, comparable across teams.",
    },
    {
        column_name: "rank_within_team",
        action: "created",
        preprocessing: "Ranked by usage inside each team-season.",
        reasoning:
            "Identifies top contributors and supports concentration / dependency analysis.",
    },
    {
        column_name: "top_player_flag",
        action: "created",
        preprocessing: "Binary indicator for rank = 1.",
        reasoning:
            "Isolates the single most-used player per team-season; drives dependency metrics.",
    },
    {
        column_name: "top_3_flag",
        action: "created",
        preprocessing: "Binary indicator for rank ≤ 3.",
        reasoning:
            "Supports analysis of how much offense is concentrated in a small group.",
    },
    {
        column_name: "top_player_share",
        action: "created",
        preprocessing: "Usage share of the top-ranked player per team-season.",
        reasoning:
            "Primary metric for measuring team dependency on a single player.",
    },
    {
        column_name: "top_3_share",
        action: "created",
        preprocessing: "Combined usage share of the top three players per team-season.",
        reasoning:
            "Main concentration metric — captures how offensive responsibility is distributed across a team's core.",
    },
];

const WIN_COLUMNS = [
    {
        column_name: "season",
        action: "kept",
        preprocessing: "No transformation required.",
        reasoning:
            "Used as a key variable for aggregating team performance and merging with the cleaned usage data.",
    },
    {
        column_name: "team",
        action: "kept",
        preprocessing: "Trimmed and standardized.",
        reasoning:
            "Primary identifier for aggregation and merging. Naming was aligned with CLEAN_DATA to ensure accurate joins.",
    },
    {
        column_name: "conference",
        action: "filtered",
        preprocessing: "Restricted to Power Five (SEC, ACC, Big Ten, Big 12, Pac-12).",
        reasoning:
            "Kept the scope consistent with the usage dataset so every Q5 join has a matching team-season on both sides.",
    },
    {
        column_name: "points_for",
        action: "kept",
        preprocessing: "Retained; renamed for clarity.",
        reasoning:
            "Used to determine the outcome of each game (wins vs losses). No transformation beyond renaming.",
    },
    {
        column_name: "points_against",
        action: "kept",
        preprocessing: "Retained; renamed for clarity.",
        reasoning:
            "Compared against points_for to determine the outcome of each game.",
    },
    {
        column_name: "win",
        action: "created",
        preprocessing:
            "Derived flag — 1 when points_for > points_against, 0 otherwise.",
        reasoning:
            "Enables clean aggregation of team success using SUM() instead of conditional counting.",
    },
    {
        column_name: "game",
        action: "created",
        preprocessing: "Constant value of 1 for each row.",
        reasoning:
            "Allows total games played to be computed with a simple SUM — consistent with how wins are aggregated.",
    },
    {
        column_name: "loss",
        action: "created",
        preprocessing: "Inverse of win — 1 on a loss, 0 on a win.",
        reasoning:
            "Improves interpretability and enables quick validation that wins + losses = games.",
    },
    {
        column_name: "win_percentage",
        action: "created",
        preprocessing:
            "Computed post-aggregation as SUM(win) ÷ SUM(game) per team-season.",
        reasoning:
            "Performance is only meaningful after aggregation, so win% is derived at the team-season level — not per row.",
    },
];

// Group columns by action family for the eyebrow counters
const groupedCounts = COLUMNS.reduce((acc, c) => {
    const style = ACTION_STYLE[c.action] || { tag: c.action.toUpperCase() };
    acc[style.tag] = (acc[style.tag] || 0) + 1;
    return acc;
}, {});

export default function ColumnDocumentation() {
    return (
        <section
            id="columns"
            data-testid="columns-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-[#0a0a0a] via-[#0c0c0f] to-[#0a0a0a]"
        >
            <SectionHeader
                eyebrow="Ch. 02.5 · Column Audit"
                title="Every field, accounted for."
                kicker="The cleaning funnel showed rows disappearing. This is the column-level view — what stayed, what was dropped, what was engineered, and why. One card per field, in the order they appeared in the raw export."
            />

            <div className="flex flex-wrap gap-3 mb-8" data-testid="columns-legend">
                {Object.entries(ACTION_STYLE)
                    .filter(([k, v], i, arr) => arr.findIndex((x) => x[1].tag === v.tag) === i)
                    .map(([k, v]) => (
                        <div
                            key={v.tag}
                            className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-[#121215]"
                        >
                            <span
                                className="inline-block w-2.5 h-2.5"
                                style={{ background: v.color }}
                            />
                            <span
                                className="text-[10px] font-mono uppercase tracking-[0.25em]"
                                style={{ color: v.color }}
                            >
                                {v.tag}
                            </span>
                            <span className="text-[10px] font-mono text-[#71717a]">
                                {groupedCounts[v.tag] || 0}
                            </span>
                        </div>
                    ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COLUMNS.map((c, i) => {
                    const style = ACTION_STYLE[c.action] || { color: "#a1a1aa", tag: c.action.toUpperCase() };
                    return (
                        <motion.div
                            key={c.column_name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: (i % 8) * 0.04 }}
                            className="p-5 bg-[#121215] border border-white/10 hover:border-white/30 transition-colors relative"
                            data-testid={`column-card-${c.column_name}`}
                        >
                            <div
                                className="absolute top-0 left-0 w-12 h-[2px]"
                                style={{ background: style.color }}
                            />
                            <div className="flex items-center justify-between mb-3">
                                <div className="font-mono text-sm text-white font-semibold tracking-tight">
                                    {c.column_name}
                                </div>
                                <span
                                    className="text-[9px] font-mono uppercase tracking-[0.25em] px-2 py-1 border"
                                    style={{ color: style.color, borderColor: `${style.color}66` }}
                                >
                                    {style.tag}
                                </span>
                            </div>
                            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#71717a] mb-1">
                                Transformation
                            </div>
                            <p className="text-sm text-white mb-4 leading-snug">{c.preprocessing}</p>
                            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#71717a] mb-1">
                                Why
                            </div>
                            <p className="text-sm text-[#a1a1aa] leading-relaxed">
                                {c.reasoning}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-10 p-6 border-l-4 border-[#ffcc00] bg-[#121215]"
            >
                <p className="font-sub text-white text-lg leading-relaxed">
                    <span className="text-[#ffcc00] font-bold">Overall.</span> Every
                    transformation was guided by one goal — a clean, interpretable
                    dataset aligned with the six research questions. Variables were
                    kept, removed, or engineered based on their direct relevance to
                    measuring offensive usage distribution and team dependency.
                </p>
            </motion.div>

            {/* -------- CLEAN_Win_Data · Column Audit -------- */}
            <div
                id="win-columns"
                data-testid="win-columns"
                className="mt-20 pt-12 border-t border-white/10"
            >
                <div className="flex flex-wrap items-end justify-between gap-4 mb-3">
                    <div>
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#ffcc00] mb-2">
                            Ch. 02.5 · Column Audit · CLEAN_Win_Data
                        </div>
                        <h3 className="font-heading text-3xl md:text-4xl font-black uppercase text-white leading-tight max-w-3xl">
                            Performance columns, accounted for.
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <a
                            href="/RAW_Win_Data.csv"
                            download
                            data-testid="columns-raw-win-link"
                            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-white border border-[#ff3b30]/60 px-3 py-2 hover:bg-[#ff3b30] transition-colors"
                        >
                            RAW_Win_Data.csv <span>↓</span>
                        </a>
                        <a
                            href="/CLEAN_Win_Data.csv"
                            download
                            data-testid="columns-clean-win-link"
                            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-white border border-[#ffcc00]/60 px-3 py-2 hover:bg-[#ffcc00] hover:text-black transition-colors"
                        >
                            CLEAN_Win_Data.csv <span>↓</span>
                        </a>
                    </div>
                </div>

                <p className="text-[#a1a1aa] text-sm md:text-base font-sub leading-relaxed max-w-4xl mb-8">
                    <b className="text-white">RAW_Win_Data</b> contains the original
                    game-level data;{" "}
                    <b className="text-white">CLEAN_Win_Data</b> is the transformed
                    team-game dataset used to calculate the performance metrics
                    powering Q5. Each column below is documented in the same style
                    as the usage-data audit above.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {WIN_COLUMNS.map((c, i) => {
                        const style =
                            ACTION_STYLE[c.action] || {
                                color: "#a1a1aa",
                                tag: c.action.toUpperCase(),
                            };
                        return (
                            <motion.div
                                key={c.column_name}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: (i % 8) * 0.04 }}
                                className="p-5 bg-[#121215] border border-white/10 hover:border-white/30 transition-colors relative"
                                data-testid={`win-column-card-${c.column_name}`}
                            >
                                <div
                                    className="absolute top-0 left-0 w-12 h-[2px]"
                                    style={{ background: style.color }}
                                />
                                <div className="flex items-center justify-between mb-3">
                                    <div className="font-mono text-sm text-white font-semibold tracking-tight">
                                        {c.column_name}
                                    </div>
                                    <span
                                        className="text-[9px] font-mono uppercase tracking-[0.25em] px-2 py-1 border"
                                        style={{
                                            color: style.color,
                                            borderColor: `${style.color}66`,
                                        }}
                                    >
                                        {style.tag}
                                    </span>
                                </div>
                                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#71717a] mb-1">
                                    Transformation
                                </div>
                                <p className="text-sm text-white mb-4 leading-snug">
                                    {c.preprocessing}
                                </p>
                                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#71717a] mb-1">
                                    Why
                                </div>
                                <p className="text-sm text-[#a1a1aa] leading-relaxed">
                                    {c.reasoning}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
