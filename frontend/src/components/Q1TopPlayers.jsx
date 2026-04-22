import { useMemo } from "react";
import SectionHeader from "./SectionHeader";
import BarChart from "./charts/BarChart";
import Histogram from "./charts/Histogram";
import LineChart from "./charts/LineChart";
import { dataset } from "../lib/data";
import { useFilters, applyFilters } from "../lib/filters";
import { POSITION_COLORS } from "../lib/constants";
import { WhyBadge, WhyCallout, AnswerBlock } from "./Why";

export default function Q1TopPlayers() {
    const { season, conference, team } = useFilters();

    const filteredRows = useMemo(
        () => applyFilters(dataset.raw, { season, conference, team }),
        [season, conference, team]
    );

    const truncate = (s, n = 26) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

    const topBars = useMemo(
        () =>
            [...filteredRows]
                .sort((a, b) => b.usage - a.usage)
                .slice(0, 15)
                .map((p) => ({
                    label: truncate(`${p.player} · ${p.team} ${p.season}`, 28),
                    value: p.usage,
                    sub: p.position,
                    color: POSITION_COLORS[p.position],
                    tooltip: (
                        <div>
                            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#71717a]">
                                {p.position} · {p.conference} · {p.season}
                            </div>
                            <div className="font-heading text-lg font-black text-white uppercase leading-tight mt-1">
                                {p.player}
                            </div>
                            <div className="text-sm font-sub text-[#a1a1aa] mt-0.5">
                                {p.team}
                            </div>
                            <div className="mt-2 pt-2 border-t border-white/10 flex gap-4">
                                <div>
                                    <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#71717a]">
                                        Usage
                                    </div>
                                    <div className="font-mono text-sm text-[#ffcc00] font-bold">
                                        {(p.usage * 100).toFixed(1)}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#71717a]">
                                        Team share
                                    </div>
                                    <div className="font-mono text-sm text-white font-bold">
                                        {p.share.toFixed(1)}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#71717a]">
                                        Rank
                                    </div>
                                    <div className="font-mono text-sm text-white font-bold">
                                        #{p.rank}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                })),
        [filteredRows]
    );

    const positionAvgBars = useMemo(() => {
        const groups = {};
        filteredRows.forEach((r) => {
            if (!groups[r.position]) groups[r.position] = [];
            groups[r.position].push(r.usage);
        });
        return Object.entries(groups)
            .map(([pos, arr]) => ({
                label: pos,
                value: arr.reduce((a, b) => a + b, 0) / (arr.length || 1),
                sub: `n = ${arr.length}`,
                color: POSITION_COLORS[pos],
            }))
            .sort((a, b) => b.value - a.value);
    }, [filteredRows]);

    const { edges, labels } = dataset.bins;
    const distribution = useMemo(() => {
        const counts = Array(labels.length).fill(0);
        filteredRows.forEach((r) => {
            for (let i = 0; i < labels.length; i++) {
                const lo = edges[i];
                const hi = edges[i + 1];
                if (r.usage >= lo && r.usage <= hi) {
                    counts[i]++;
                    break;
                }
            }
        });
        return labels.map((lbl, i) => ({ bin: lbl, count: counts[i] }));
    }, [filteredRows, edges, labels]);

    // Three-year players - only show when no single-season filter is active
    const trendSeries = useMemo(() => {
        if (season !== "all") return [];
        const pool = conference === "all" ? dataset.q1.playerTrends : dataset.q1.playerTrends
            .filter((p) => dataset.raw.some(
                (r) => r.player === p.player && r.conference === conference
            ));
        return pool.slice(0, 5).map((p, i) => ({
            name: p.player,
            color: ["#ffcc00", "#007aff", "#34c759", "#ff3b30", "#a78bfa"][i],
            points: p.points.map((pt) => ({ x: pt.Season, y: pt.Usage_Overall })),
        }));
    }, [season, conference]);

    const distSeries = [{ label: "All players", color: "#007aff", bins: distribution }];

    const filterTag =
        season !== "all" || conference !== "all" || team
            ? `${[
                  season !== "all" ? season : null,
                  conference !== "all" ? conference : null,
                  team,
              ]
                  .filter(Boolean)
                  .join(" · ")}`
            : null;

    return (
        <section
            id="q1"
            data-testid="q1-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <SectionHeader
                eyebrow={`Question 01${filterTag ? ` · ${filterTag}` : ""}`}
                title="Which player-seasons dominated offensive usage?"
                kicker="Usage_Overall caps near 1.0 (a full offensive load). A handful of quarterbacks sit at the very top — and the gap between the top and the median is enormous."
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 p-6 bg-[#121215] border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                            Top 15 Player-Seasons
                        </div>
                        <div className="text-[11px] font-mono text-[#a1a1aa]">
                            n = {filteredRows.length.toLocaleString()}
                        </div>
                    </div>
                    <WhyBadge>
                        A bar chart ranks players directly and highlights extreme
                        values, making the most dominant player-seasons easy to spot.
                    </WhyBadge>
                    {topBars.length ? (
                        <BarChart
                            data={topBars}
                            width={760}
                            valueFormat={(v) => `${(v * 100).toFixed(1)}%`}
                            xLabel="USAGE OVERALL"
                            padding={{ top: 16, right: 80, bottom: 32, left: 260 }}
                            dataTestId="q1-top-bars"
                        />
                    ) : (
                        <div className="text-[#71717a] text-sm py-12 text-center">
                            No player-seasons match the current filters.
                        </div>
                    )}
                </div>

                <div className="lg:col-span-5 space-y-5">
                    <div className="p-6 bg-[#121215] border border-white/10">
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-2">
                            Average Usage by Position
                        </div>
                        <WhyBadge color="#34c759">
                            Comparing positions explains structural differences in
                            offensive roles and shows which positions naturally carry
                            the most responsibility.
                        </WhyBadge>
                        {positionAvgBars.length ? (
                            <BarChart
                                data={positionAvgBars}
                                valueFormat={(v) => `${(v * 100).toFixed(1)}%`}
                                barHeight={32}
                                padding={{ top: 12, right: 80, bottom: 32, left: 60 }}
                                dataTestId="q1-position-avg"
                            />
                        ) : (
                            <div className="text-[#71717a] text-sm py-8 text-center">
                                No matches.
                            </div>
                        )}
                    </div>
                    <div className="p-6 bg-[#0a0a0a] border border-[#ffcc00]/30">
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ffcc00] mb-2">
                            Read this
                        </div>
                        <p className="text-white text-sm font-sub leading-relaxed">
                            QBs average roughly <b>3× the usage</b> of WRs and RBs — and{" "}
                            <b>10× the usage of TEs</b>. Position is the single biggest factor
                            driving an individual player's raw usage.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                <div className="lg:col-span-7 p-6 bg-[#121215] border border-white/10">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-2">
                        Usage Distribution
                    </div>
                    <p className="text-xs text-[#a1a1aa] mb-4 font-sub">
                        Over half of all Power Five skill players sit under 5% usage. The
                        tail is heavy, not fat.
                    </p>
                    <WhyBadge>
                        A distribution reveals how usage is spread across all
                        players — whether most sit near zero and only a few dominate.
                    </WhyBadge>
                    <Histogram
                        series={distSeries}
                        categories={labels}
                        yLabel="# PLAYER-SEASONS"
                        dataTestId="q1-histogram"
                    />
                </div>
                <div className="lg:col-span-5 p-6 bg-[#121215] border border-white/10">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-2">
                        Three-Year Workhorses
                    </div>
                    <p className="text-xs text-[#a1a1aa] mb-4 font-sub">
                        Players who appeared all three seasons with the highest total usage.
                        {season !== "all" && " (Requires all seasons — clear season filter.)"}
                    </p>
                    <WhyBadge color="#ff3b30">
                        A time-based view shows whether dominant players are
                        consistent year over year or whether offensive leadership
                        changes each season.
                    </WhyBadge>
                    {trendSeries.length ? (
                        <LineChart
                            series={trendSeries}
                            xFormat={(v) => `'${String(v).slice(2)}`}
                            yFormat={(v) => `${(v * 100).toFixed(0)}%`}
                            dataTestId="q1-trend-line"
                        />
                    ) : (
                        <div className="text-[#71717a] text-sm py-12 text-center">
                            {season !== "all"
                                ? "Clear the season filter to see trends."
                                : "No multi-year players match the filter."}
                        </div>
                    )}
                </div>
            </div>

            <AnswerBlock testId="q1-answer">
                Offensive usage is heavily concentrated at the top of the
                quarterback ladder. The leading player-seasons —{" "}
                <b className="text-[#ffcc00]">
                    Will Rogers (Miss. State, 2021)
                </b>{" "}
                at 74.4% and{" "}
                <b className="text-[#ffcc00]">D'Eriq King (Miami, 2021)</b> at
                73.5% — sit more than{" "}
                <b className="text-white">3× above the average Power Five skill player</b>.
                These are dual-threat QBs whose offenses funneled nearly every
                designed opportunity through one name.
            </AnswerBlock>
        </section>
    );
}
