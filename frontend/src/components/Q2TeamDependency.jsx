import { useMemo } from "react";
import SectionHeader from "./SectionHeader";
import BarChart from "./charts/BarChart";
import { dataset } from "../lib/data";
import { useFilters } from "../lib/filters";
import { CONFERENCE_COLORS } from "../lib/constants";
import { WhyBadge, WhyCallout, AnswerBlock } from "./Why";

export default function Q2TeamDependency() {
    const { season, conference, team, setTeam } = useFilters();

    // Build per (team, season) aggregates from raw
    const teamSeason = useMemo(() => {
        const map = {};
        dataset.raw.forEach((r) => {
            const key = `${r.team}__${r.season}`;
            if (!map[key]) {
                map[key] = {
                    team: r.team,
                    conference: r.conference,
                    season: r.season,
                    top_player_share: r.top_player_share,
                    top3_share: r.top3_share,
                };
            }
        });
        return Object.values(map);
    }, []);

    const filtered = useMemo(() => {
        return teamSeason.filter((ts) => {
            if (season !== "all" && ts.season !== season) return false;
            if (conference !== "all" && ts.conference !== conference) return false;
            return true;
        });
    }, [teamSeason, season, conference]);

    // Team-level averages across current filter
    const teamAvgs = useMemo(() => {
        const grp = {};
        filtered.forEach((ts) => {
            if (!grp[ts.team]) grp[ts.team] = { team: ts.team, conference: ts.conference, top: [], top3: [] };
            grp[ts.team].top.push(ts.top_player_share);
            grp[ts.team].top3.push(ts.top3_share);
        });
        return Object.values(grp).map((g) => ({
            team: g.team,
            conference: g.conference,
            avg_top_player: g.top.reduce((a, b) => a + b, 0) / g.top.length,
            avg_top3: g.top3.reduce((a, b) => a + b, 0) / g.top3.length,
            seasons: g.top.length,
        }));
    }, [filtered]);

    const makeBars = (arr, dir = "desc", key = "avg_top_player") => {
        const sorted = [...arr].sort((a, b) =>
            dir === "desc" ? b[key] - a[key] : a[key] - b[key]
        );
        return sorted.slice(0, 12).map((t) => ({
            label: t.team,
            value: t[key],
            sub: `${t.conference} · n=${t.seasons}`,
            color: CONFERENCE_COLORS[t.conference],
            tooltip: (
                <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#71717a]">
                        {t.conference} · {t.seasons} season{t.seasons === 1 ? "" : "s"} averaged
                    </div>
                    <div className="font-heading text-lg font-black text-white uppercase leading-tight mt-1">
                        {t.team}
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/10 flex gap-4">
                        <div>
                            <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#71717a]">
                                Avg Top Player
                            </div>
                            <div className="font-mono text-sm text-[#ffcc00] font-bold">
                                {t.avg_top_player.toFixed(2)}%
                            </div>
                        </div>
                        <div>
                            <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#71717a]">
                                Avg Top 3
                            </div>
                            <div className="font-mono text-sm text-white font-bold">
                                {t.avg_top3.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                </div>
            ),
        }));
    };

    const mostDependent = useMemo(() => makeBars(teamAvgs, "desc", "avg_top_player"), [teamAvgs]);
    const mostBalanced = useMemo(() => makeBars(teamAvgs, "asc", "avg_top_player"), [teamAvgs]);
    const top3Ranking = useMemo(() => makeBars(teamAvgs, "desc", "avg_top3"), [teamAvgs]);

    // Team spotlight metrics when a team is selected
    const spotlight = useMemo(() => {
        if (!team) return null;
        const sub = teamSeason.filter((t) => t.team === team);
        if (!sub.length) return null;
        const avgTop = sub.reduce((a, b) => a + b.top_player_share, 0) / sub.length;
        const avgTop3 = sub.reduce((a, b) => a + b.top3_share, 0) / sub.length;
        // rank across all P5
        const allRanked = teamAvgs
            .slice()
            .sort((a, b) => b.avg_top_player - a.avg_top_player);
        const rank = allRanked.findIndex((t) => t.team === team);
        return {
            team,
            conference: sub[0].conference,
            avgTop,
            avgTop3,
            rank: rank >= 0 ? rank + 1 : null,
            total: allRanked.length,
            seasons: sub.map((s) => ({ s: s.season, top: s.top_player_share })),
        };
    }, [team, teamSeason, teamAvgs]);

    const highlightLabel = team || null;

    return (
        <section
            id="q2"
            data-testid="q2-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-[#0a0a0a] via-[#0c0c0f] to-[#0a0a0a]"
        >
            <SectionHeader
                eyebrow={`Question 02${season !== "all" ? ` · ${season}` : ""}${conference !== "all" ? ` · ${conference}` : ""}`}
                title="Which teams lean hardest on a single player?"
                kicker="For every team-season, Top Player Share measures how much of the offense runs through one name. A team at 35%+ is carrying a true bellcow. Below 22% is genuinely balanced."
            />

            <WhyCallout>
                This question shifts the focus from individual players to team
                structure. It reveals whether teams distribute offensive
                responsibility evenly or depend heavily on a few key players — which
                is central to understanding offensive strategy.
            </WhyCallout>

            <div
                className="mb-6 p-4 bg-[#0a0a0a] border border-white/10 text-xs text-[#a1a1aa] font-sub leading-relaxed flex flex-wrap items-baseline gap-x-3 gap-y-1"
                data-testid="q2-methodology-note"
            >
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ffcc00]">
                    Methodology
                </span>
                <span>
                    Every chart on this page aggregates by team first, then ranks. A
                    team's bar is{" "}
                    <b className="text-white">
                        avg(top_player_share) across every season
                    </b>{" "}
                    that team appears in the dataset — so one bar = one team, not one
                    team-season. Hover any bar to see how many seasons were averaged
                    (shown as <span className="font-mono text-[#ffcc00]">n=</span>).
                </span>
            </div>

            {spotlight && (
                <div
                    data-testid="q2-spotlight"
                    className="mb-6 p-6 border border-[#ffcc00] bg-gradient-to-r from-[#ffcc00]/10 to-transparent"
                >
                    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ffcc00]">
                            Spotlight
                        </div>
                        <div className="font-heading text-4xl font-black uppercase text-white">
                            {spotlight.team}
                        </div>
                        <div className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa]">
                            {spotlight.conference}
                        </div>
                        <div className="flex-1" />
                        <button
                            onClick={() => setTeam(null)}
                            className="text-[10px] font-mono uppercase tracking-[0.2em] text-white border border-white/20 px-3 py-1.5 hover:bg-white hover:text-black transition-colors"
                            data-testid="q2-spotlight-clear"
                        >
                            Clear ×
                        </button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#71717a]">
                                Avg Top Player
                            </div>
                            <div className="font-heading text-2xl text-white font-black">
                                {spotlight.avgTop.toFixed(1)}%
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#71717a]">
                                Avg Top 3
                            </div>
                            <div className="font-heading text-2xl text-white font-black">
                                {spotlight.avgTop3.toFixed(1)}%
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#71717a]">
                                Rank (dependency)
                            </div>
                            <div className="font-heading text-2xl text-white font-black">
                                #{spotlight.rank}
                                <span className="text-sm text-[#71717a] font-mono ml-1">
                                    / {spotlight.total}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#71717a]">
                                Seasons
                            </div>
                            <div className="font-mono text-sm text-white mt-1">
                                {spotlight.seasons
                                    .sort((a, b) => a.s - b.s)
                                    .map((p) => `${p.s}: ${p.top.toFixed(1)}%`)
                                    .join(" · ")}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-[#121215] border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#ff3b30]">
                            Most Player-Dependent
                        </div>
                        <div className="text-[10px] font-mono text-[#71717a]">
                            avg top player share
                        </div>
                    </div>
                    <WhyBadge color="#ff3b30">
                        Top player share is the clearest indicator of extreme
                        concentration — it measures exactly how much of the offense
                        runs through one name.
                    </WhyBadge>
                    {mostDependent.length ? (
                        <BarChart
                            data={mostDependent}
                            valueFormat={(v) => `${v.toFixed(1)}%`}
                            xLabel="AVG TOP PLAYER SHARE"
                            padding={{ top: 12, right: 90, bottom: 32, left: 160 }}
                            defaultColor="#ff3b30"
                            highlightIndex={mostDependent.findIndex((b) => b.label === highlightLabel)}
                            dataTestId="q2-most-dependent"
                        />
                    ) : (
                        <div className="text-[#71717a] text-sm py-10 text-center">
                            No teams match current filters.
                        </div>
                    )}
                </div>
                <div className="p-6 bg-[#121215] border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#34c759]">
                            Most Balanced Offenses
                        </div>
                        <div className="text-[10px] font-mono text-[#71717a]">
                            lowest top player share
                        </div>
                    </div>
                    <WhyBadge color="#34c759">
                        Flipping the ranking surfaces the counter-example — offenses
                        that genuinely spread touches rather than funnel them to a
                        single star.
                    </WhyBadge>
                    {mostBalanced.length ? (
                        <BarChart
                            data={mostBalanced}
                            valueFormat={(v) => `${v.toFixed(1)}%`}
                            xLabel="AVG TOP PLAYER SHARE"
                            padding={{ top: 12, right: 90, bottom: 32, left: 160 }}
                            defaultColor="#34c759"
                            highlightIndex={mostBalanced.findIndex((b) => b.label === highlightLabel)}
                            dataTestId="q2-most-balanced"
                        />
                    ) : (
                        <div className="text-[#71717a] text-sm py-10 text-center">
                            No teams match current filters.
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
                <div className="lg:col-span-7 p-6 bg-[#121215] border border-white/10">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-2">
                        Top 3 Players · Share of Offense
                    </div>
                    <p className="text-xs text-[#a1a1aa] mb-4 font-sub">
                        Across every Power Five team, the top three contributors absorb on
                        average <b className="text-white">53%</b> of offensive usage.
                    </p>
                    <WhyBadge color="#ffcc00">
                        The top-three view gives a more stable read on team structure
                        than any single player — one outlier season can't swing the
                        whole picture.
                    </WhyBadge>
                    {top3Ranking.length ? (
                        <BarChart
                            data={top3Ranking}
                            valueFormat={(v) => `${v.toFixed(1)}%`}
                            xLabel="AVG TOP-3 SHARE"
                            padding={{ top: 12, right: 90, bottom: 32, left: 160 }}
                            defaultColor="#ffcc00"
                            highlightIndex={top3Ranking.findIndex((b) => b.label === highlightLabel)}
                            dataTestId="q2-top3-ranking"
                        />
                    ) : (
                        <div className="text-[#71717a] text-sm py-10 text-center">
                            No matches.
                        </div>
                    )}
                </div>
                <div className="lg:col-span-5 space-y-4">
                    <div className="p-6 bg-[#0a0a0a] border border-[#ff3b30]/30">
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ff3b30] mb-2">
                            Pattern
                        </div>
                        <p className="text-white text-sm font-sub leading-relaxed">
                            Extreme player-dependency is often tied to a single dual-threat
                            quarterback carrying both the pass game and the designed run
                            game.
                        </p>
                    </div>
                    <div className="p-6 bg-[#0a0a0a] border border-[#34c759]/30">
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#34c759] mb-2">
                            Counter-pattern
                        </div>
                        <p className="text-white text-sm font-sub leading-relaxed">
                            The most balanced offenses typically feature a committee
                            backfield, a spread-the-ball passing attack, or an RPO system
                            that diffuses touches across a deep rotation.
                        </p>
                    </div>
                    <div className="p-4 bg-[#0a0a0a] border border-white/10">
                        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#71717a]">
                            Tip — pick a team from the filter bar to spotlight it across Q2, Q5 and Q6.
                        </div>
                    </div>
                </div>
            </div>

            {teamAvgs.length >= 2 && (() => {
                const sortedDep = [...teamAvgs].sort(
                    (a, b) => b.avg_top_player - a.avg_top_player
                );
                const top = sortedDep[0];
                const bot = sortedDep[sortedDep.length - 1];
                const mean =
                    teamAvgs.reduce((a, b) => a + b.avg_top_player, 0) /
                    teamAvgs.length;
                const top3Mean =
                    teamAvgs.reduce((a, b) => a + b.avg_top3, 0) /
                    teamAvgs.length;
                const scope = [
                    season !== "all" ? season : "2021–23",
                    conference !== "all" ? conference : "all P5",
                ].join(" · ");
                return (
                    <AnswerBlock live testId="q2-answer">
                        Across <b className="text-white">{scope}</b>, the most
                        player-dependent team is{" "}
                        <b className="text-[#ffcc00]">{top.team}</b> ({top.conference})
                        with an average top-player share of{" "}
                        <b className="text-[#ffcc00]">
                            {top.avg_top_player.toFixed(1)}%
                        </b>
                        . The most balanced is{" "}
                        <b className="text-[#34c759]">{bot.team}</b> at{" "}
                        <b className="text-[#34c759]">
                            {bot.avg_top_player.toFixed(1)}%
                        </b>
                        . The overall average across {teamAvgs.length} teams sits at{" "}
                        <b className="text-white">{mean.toFixed(1)}%</b> top player ·{" "}
                        <b className="text-white">{top3Mean.toFixed(1)}%</b> top-3 —
                        confirming that most P5 offenses run a plurality of their
                        touches through a small core.
                    </AnswerBlock>
                );
            })()}
        </section>
    );
}
