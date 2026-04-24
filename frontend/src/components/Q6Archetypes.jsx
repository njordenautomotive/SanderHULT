import { useCallback, useMemo } from "react";
import SectionHeader from "./SectionHeader";
import Scatter from "./charts/Scatter";
import { dataset } from "../lib/data";
import { useFilters } from "../lib/filters";
import { ARCHETYPE_COLORS } from "../lib/constants";
import { WhyBadge, WhyCallout, AnswerBlock } from "./Why";

// ------------------------------------------------------------------
// Fixed Excel-derived thresholds for Q6.
// Do NOT recompute these — they are the constants from the source
// workbook's pivot analysis. Boundary is inclusive on the "balanced"
// side (<=) and inclusive on "winners" side (>=), which reproduces
// the Excel counts exactly:
//   Star Winners 55 · Balanced Winners 50
//   Balanced Strugglers 50 · Concentrated Strugglers 41
// Total = 196 team-seasons.
// ------------------------------------------------------------------
const TOP_PLAYER_SHARE_MEDIAN = 26.9; // percent (0.269)
const WIN_PERCENTAGE_MEDIAN = 0.54;

export default function Q6Archetypes() {
    const { season, conference, team } = useFilters();

    // Full joined set (usage × CLEAN_Win_Data) — 196 team-seasons
    const base = useMemo(() => {
        const winMap = {};
        dataset.wins.forEach((w) => {
            winMap[`${w.team}__${w.season}`] = w.win_pct;
        });
        const map = {};
        dataset.raw.forEach((r) => {
            const k = `${r.team}__${r.season}`;
            if (!map[k]) {
                map[k] = {
                    team: r.team,
                    conference: r.conference,
                    season: r.season,
                    top_player: r.top_player_share,
                    top_3: r.top3_share,
                };
            }
        });
        return Object.values(map)
            .map((t) => ({ ...t, win_pct: winMap[`${t.team}__${t.season}`] }))
            .filter((t) => t.win_pct !== undefined);
    }, []);

    const filtered = useMemo(
        () =>
            base.filter((j) => {
                if (season !== "all" && j.season !== season) return false;
                if (conference !== "all" && j.conference !== conference) return false;
                return true;
            }),
        [base, season, conference]
    );

    // Excel classification — fixed constants, no dynamic medians.
    const classify = useCallback((t) => {
        const balanced = t.top_player <= TOP_PLAYER_SHARE_MEDIAN;
        const winner = t.win_pct >= WIN_PERCENTAGE_MEDIAN;
        if (balanced && winner) return "Balanced Winners";
        if (!balanced && winner) return "Star Winners";
        if (balanced && !winner) return "Balanced Strugglers";
        return "Concentrated Strugglers";
    }, []);

    const pts = filtered.map((a) => {
        const arch = classify(a);
        return {
            x: a.top_player,
            y: a.win_pct,
            team: a.team,
            season: a.season,
            conference: a.conference,
            archetype: arch,
            color: ARCHETYPE_COLORS[arch],
        };
    });

    const counts = useMemo(() => {
        const c = {};
        Object.keys(ARCHETYPE_COLORS).forEach((k) => (c[k] = []));
        filtered.forEach((t) => {
            const arch = classify(t);
            c[arch].push(t);
        });
        return c;
    }, [filtered, classify]);

    const representatives = useMemo(() => {
        const r = {};
        Object.entries(counts).forEach(([k, arr]) => {
            r[k] = arr.length
                ? arr.reduce((best, cur) =>
                      !best ? cur : cur.win_pct > best.win_pct ? cur : best
                  , null)
                : null;
        });
        return r;
    }, [counts]);

    return (
        <section
            id="q6"
            data-testid="q6-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-[#0a0a0a] via-[#0c0c0f] to-[#0a0a0a]"
        >
            <SectionHeader
                eyebrow={`Question 06${season !== "all" ? ` · ${season}` : ""}${conference !== "all" ? ` · ${conference}` : ""}`}
                title="Balanced winners or star-driven winners?"
                kicker="Split the scatter on the medians. Four quadrants. Four strategic identities. The distribution of team-seasons across them tells you which styles actually travel to the postseason."
            />

            <WhyCallout>
                This final question synthesizes all previous findings to classify
                offensive strategies. It moves from analysis to insight by
                identifying whether balanced or player-dependent systems are more
                effective at the top of the sport.
            </WhyCallout>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 p-6 bg-[#121215] border border-white/10 relative">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                            Archetype Quadrants
                        </div>
                        <div className="text-[10px] font-mono text-[#71717a]">
                            medians · top {TOP_PLAYER_SHARE_MEDIAN.toFixed(1)}% · win{" "}
                            {Math.round(WIN_PERCENTAGE_MEDIAN * 100)}% (Excel-fixed)
                        </div>
                    </div>
                    <WhyBadge>
                        A quadrant split groups team-seasons into four strategic
                        categories, making it easy to compare outcomes across
                        different offensive structures.
                    </WhyBadge>
                    {pts.length ? (
                        <Scatter
                            points={pts}
                            xLabel="TOP PLAYER SHARE (%)"
                            yLabel="WIN %"
                            xDomain={[15, 45]}
                            yDomain={[0, 1]}
                            quadrants={{
                                xMid: TOP_PLAYER_SHARE_MEDIAN,
                                yMid: WIN_PERCENTAGE_MEDIAN,
                            }}
                            showTrend={false}
                            highlightTeam={team}
                            dataTestId="q6-archetypes"
                        />
                    ) : (
                        <div className="text-[#71717a] text-sm py-16 text-center">
                            No team-seasons match the filters.
                        </div>
                    )}
                    <div className="absolute top-32 left-12 text-[10px] font-mono uppercase tracking-wider text-[#34c759] pointer-events-none">
                        Balanced · Winners ↗
                    </div>
                    <div className="absolute top-32 right-20 text-[10px] font-mono uppercase tracking-wider text-[#007aff] pointer-events-none">
                        ↖ Star · Winners
                    </div>
                    <div className="absolute bottom-20 left-12 text-[10px] font-mono uppercase tracking-wider text-[#ffcc00] pointer-events-none">
                        Balanced · Strugglers ↘
                    </div>
                    <div className="absolute bottom-20 right-20 text-[10px] font-mono uppercase tracking-wider text-[#ff3b30] pointer-events-none">
                        ↙ Concentrated · Strugglers
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                    {Object.entries(ARCHETYPE_COLORS).map(([k, c]) => {
                        const count = counts[k]?.length || 0;
                        const ex = representatives[k];
                        const containsTeam = team && counts[k]?.some((t) => t.team === team);
                        return (
                            <div
                                key={k}
                                className={`p-5 bg-[#0a0a0a] border transition-all ${
                                    containsTeam
                                        ? "border-[#ffcc00] bg-[#ffcc00]/5"
                                        : "border-white/10"
                                }`}
                                data-testid={`q6-archetype-${k.replace(/\s+/g, "-").toLowerCase()}`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className="inline-block w-3 h-3"
                                        style={{ background: c }}
                                    />
                                    <span
                                        className="text-[10px] font-mono uppercase tracking-[0.25em]"
                                        style={{ color: c }}
                                    >
                                        {k}
                                    </span>
                                </div>
                                <div className="font-heading text-3xl font-black text-white">
                                    {count}
                                </div>
                                <div className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">
                                    team-seasons
                                </div>
                                {ex && (
                                    <div className="mt-3 pt-3 border-t border-white/10 text-xs text-[#a1a1aa] font-sub">
                                        <span className="text-white font-semibold">{ex.team}</span>{" "}
                                        · {ex.season} · {Math.round(ex.win_pct * 100)}% win
                                    </div>
                                )}
                                {containsTeam && (
                                    <div className="mt-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#ffcc00]">
                                        ★ {team} appears here
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-8 p-6 border-l-4 border-[#007aff] bg-[#121215]">
                <p className="font-sub text-white text-lg leading-relaxed">
                    <span className="text-[#007aff] font-bold">Punchline.</span> Winning
                    teams sit on <b>both sides</b> of the concentration median. Elite
                    programs like Georgia and Michigan trend balanced. Alabama under
                    Bryce Young and Washington's 2023 run trend star-driven. The
                    successful <i>answer</i> isn't a formula — it's alignment between
                    your talent and your system.
                </p>
            </div>

            {filtered.length > 0 && (() => {
                const starWinners = counts["Star Winners"]?.length || 0;
                const balWinners = counts["Balanced Winners"]?.length || 0;
                const concStrug = counts["Concentrated Strugglers"]?.length || 0;
                const balStrug = counts["Balanced Strugglers"]?.length || 0;
                const totalWinners = starWinners + balWinners;
                const verdict =
                    totalWinners === 0
                        ? "no winning team-seasons under the current filter"
                        : starWinners === balWinners
                          ? "a dead heat"
                          : starWinners > balWinners
                            ? "a slight edge to star winners"
                            : "a slight edge to balanced winners";
                const scope = [
                    season !== "all" ? season : "2021–23",
                    conference !== "all" ? conference : "all P5",
                ].join(" · ");
                return (
                    <AnswerBlock live testId="q6-answer">
                        Across <b className="text-white">{scope}</b> (
                        {filtered.length} team-seasons),{" "}
                        <b className="text-[#34c759]">{balWinners}</b> balanced
                        winners,{" "}
                        <b className="text-[#007aff]">{starWinners}</b> star
                        winners,{" "}
                        <b className="text-[#ff3b30]">{concStrug}</b> concentrated
                        strugglers, and{" "}
                        <b className="text-[#ffcc00]">{balStrug}</b> balanced
                        strugglers. The verdict: <b className="text-white">{verdict}</b>.
                        Success is not a function of concentration — it's a function of
                        fit between a team's talent and the system running it.
                    </AnswerBlock>
                );
            })()}
        </section>
    );
}
