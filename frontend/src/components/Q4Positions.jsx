import SectionHeader from "./SectionHeader";
import Histogram from "./charts/Histogram";
import BarChart from "./charts/BarChart";
import { q4 } from "../lib/data";
import { POSITION_COLORS } from "../lib/constants";

export default function Q4Positions() {
    const series = q4.positionDistribution.map((p) => ({
        label: p.position,
        color: POSITION_COLORS[p.position],
        bins: p.bins,
    }));
    const categories = q4.positionDistribution[0].bins.map((b) => b.bin);

    const avgBars = q4.positionDistribution
        .map((p) => ({
            label: p.position,
            value: p.avg,
            sub: `${p.players} players`,
            color: POSITION_COLORS[p.position],
        }))
        .sort((a, b) => b.value - a.value);

    const shareBars = q4.positionShare
        .map((s) => ({
            label: s.Position,
            value: s.avg_share,
            color: POSITION_COLORS[s.Position],
        }))
        .sort((a, b) => b.value - a.value);

    return (
        <section
            id="q4"
            data-testid="q4-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-[#0a0a0a] via-[#0c0c0f] to-[#0a0a0a]"
        >
            <SectionHeader
                eyebrow="Question 04"
                title="How does usage vary by position?"
                kicker="Every offense is built from four archetypes. Their usage profiles look nothing alike — and that structural asymmetry is the reason naive rankings need position context."
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                <div className="lg:col-span-8 p-6 bg-[#121215] border border-white/10">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-1">
                        Usage Distribution by Position
                    </div>
                    <p className="text-xs text-[#a1a1aa] mb-4 font-sub">
                        Grouped bars per usage bin. QBs have a bimodal split (backups vs
                        starters). WRs and RBs taper smoothly. TEs clump at the low end.
                    </p>
                    <Histogram
                        series={series}
                        categories={categories}
                        yLabel="# PLAYER-SEASONS"
                        dataTestId="q4-histogram"
                    />
                </div>
                <div className="lg:col-span-4 space-y-5">
                    <div className="p-6 bg-[#121215] border border-white/10">
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-3">
                            Avg Usage_Overall
                        </div>
                        <BarChart
                            data={avgBars}
                            valueFormat={(v) => v.toFixed(3)}
                            barHeight={28}
                            padding={{ top: 8, right: 70, bottom: 28, left: 50 }}
                            dataTestId="q4-avg-usage"
                        />
                    </div>
                    <div className="p-6 bg-[#121215] border border-white/10">
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-3">
                            Avg Player Usage Share (%)
                        </div>
                        <BarChart
                            data={shareBars}
                            valueFormat={(v) => `${v.toFixed(1)}%`}
                            barHeight={28}
                            padding={{ top: 8, right: 80, bottom: 28, left: 50 }}
                            dataTestId="q4-avg-share"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {q4.positionDistribution.map((p) => (
                    <div
                        key={p.position}
                        className="p-5 bg-[#0a0a0a] border border-white/10 hover:border-white/30 transition-colors"
                        data-testid={`q4-position-card-${p.position}`}
                    >
                        <div
                            className="w-8 h-[3px] mb-3"
                            style={{ background: POSITION_COLORS[p.position] }}
                        />
                        <div className="font-heading text-4xl font-black text-white uppercase">
                            {p.position}
                        </div>
                        <div className="mt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717a]">
                            avg usage
                        </div>
                        <div className="font-mono text-xl text-white font-bold">
                            {p.avg.toFixed(3)}
                        </div>
                        <div className="mt-2 text-xs text-[#a1a1aa] font-sub">
                            {p.players} player-seasons
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
