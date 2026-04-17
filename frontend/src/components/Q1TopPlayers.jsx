import SectionHeader from "./SectionHeader";
import BarChart from "./charts/BarChart";
import Histogram from "./charts/Histogram";
import LineChart from "./charts/LineChart";
import { q1 } from "../lib/data";
import { POSITION_COLORS } from "../lib/constants";

export default function Q1TopPlayers() {
    const topBars = q1.topPlayerSeasons.slice(0, 15).map((p) => ({
        label: `${p.Player_Name} · ${p.Team} ${p.Season}`,
        value: p.Usage_Overall,
        sub: p.Position,
        color: POSITION_COLORS[p.Position],
    }));

    const positionAvgBars = q1.positionAverages
        .sort((a, b) => b.mean - a.mean)
        .map((p) => ({
            label: p.Position,
            value: p.mean,
            sub: `n = ${p.count}`,
            color: POSITION_COLORS[p.Position],
        }));

    // Pick top 5 trends
    const trendSeries = q1.playerTrends.slice(0, 5).map((p, i) => ({
        name: p.player,
        color: ["#ffcc00", "#007aff", "#34c759", "#ff3b30", "#a78bfa"][i],
        points: p.points.map((pt) => ({ x: pt.Season, y: pt.Usage_Overall })),
    }));

    const distSeries = [
        {
            label: "All players",
            color: "#007aff",
            bins: q1.distribution,
        },
    ];
    const categories = q1.distribution.map((d) => d.bin);

    return (
        <section
            id="q1"
            data-testid="q1-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <SectionHeader
                eyebrow="Question 01"
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
                            Usage_Overall
                        </div>
                    </div>
                    <BarChart
                        data={topBars}
                        valueFormat={(v) => v.toFixed(3)}
                        xLabel="USAGE OVERALL"
                        padding={{ top: 16, right: 80, bottom: 32, left: 220 }}
                        dataTestId="q1-top-bars"
                    />
                </div>

                <div className="lg:col-span-5 space-y-5">
                    <div className="p-6 bg-[#121215] border border-white/10">
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-2">
                            Average Usage by Position
                        </div>
                        <BarChart
                            data={positionAvgBars}
                            valueFormat={(v) => v.toFixed(3)}
                            barHeight={32}
                            padding={{ top: 12, right: 80, bottom: 32, left: 60 }}
                            dataTestId="q1-position-avg"
                        />
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
                        Usage Distribution · All Players
                    </div>
                    <p className="text-xs text-[#a1a1aa] mb-4 font-sub">
                        Over half of all Power Five skill players sit under 5% usage. The
                        tail is heavy, not fat.
                    </p>
                    <Histogram
                        series={distSeries}
                        categories={categories}
                        yLabel="# PLAYER-SEASONS"
                        dataTestId="q1-histogram"
                    />
                </div>
                <div className="lg:col-span-5 p-6 bg-[#121215] border border-white/10">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-2">
                        Three-Year Workhorses
                    </div>
                    <p className="text-xs text-[#a1a1aa] mb-4 font-sub">
                        Players who appeared all three seasons (2021–23) with the highest
                        total usage.
                    </p>
                    {trendSeries.length ? (
                        <LineChart
                            series={trendSeries}
                            xFormat={(v) => `'${String(v).slice(2)}`}
                            yFormat={(v) => v.toFixed(2)}
                            dataTestId="q1-trend-line"
                        />
                    ) : (
                        <div className="text-[#71717a] text-sm">No multi-year players found.</div>
                    )}
                </div>
            </div>
        </section>
    );
}
