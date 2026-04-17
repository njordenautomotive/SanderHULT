import { useMemo } from "react";
import SectionHeader from "./SectionHeader";
import Histogram from "./charts/Histogram";
import BarChart from "./charts/BarChart";
import { dataset } from "../lib/data";
import { useFilters } from "../lib/filters";
import { POSITION_COLORS } from "../lib/constants";
import { WhyBadge, WhyCallout, AnswerBlock } from "./Why";

export default function Q4Positions() {
    const { season, conference } = useFilters();

    const rows = useMemo(
        () =>
            dataset.raw.filter((r) => {
                if (season !== "all" && r.season !== season) return false;
                if (conference !== "all" && r.conference !== conference) return false;
                return true;
            }),
        [season, conference]
    );

    const { edges, labels } = dataset.bins;

    const positionDistribution = useMemo(() => {
        return ["QB", "RB", "WR", "TE"].map((pos) => {
            const sub = rows.filter((r) => r.position === pos);
            const counts = Array(labels.length).fill(0);
            sub.forEach((r) => {
                for (let i = 0; i < labels.length; i++) {
                    if (r.usage >= edges[i] && r.usage <= edges[i + 1]) {
                        counts[i]++;
                        break;
                    }
                }
            });
            const avg = sub.length ? sub.reduce((a, b) => a + b.usage, 0) / sub.length : 0;
            return {
                position: pos,
                bins: labels.map((lbl, i) => ({ bin: lbl, count: counts[i] })),
                avg,
                players: sub.length,
            };
        });
    }, [rows, edges, labels]);

    const avgBars = useMemo(
        () =>
            positionDistribution
                .map((p) => ({
                    label: p.position,
                    value: p.avg,
                    sub: `${p.players} players`,
                    color: POSITION_COLORS[p.position],
                }))
                .filter((b) => b.value > 0)
                .sort((a, b) => b.value - a.value),
        [positionDistribution]
    );

    const shareBars = useMemo(() => {
        const grp = {};
        rows.forEach((r) => {
            if (!grp[r.position]) grp[r.position] = [];
            grp[r.position].push(r.share);
        });
        return Object.entries(grp)
            .map(([pos, arr]) => ({
                label: pos,
                value: arr.reduce((a, b) => a + b, 0) / arr.length,
                color: POSITION_COLORS[pos],
            }))
            .sort((a, b) => b.value - a.value);
    }, [rows]);

    const series = positionDistribution.map((p) => ({
        label: p.position,
        color: POSITION_COLORS[p.position],
        bins: p.bins,
    }));

    return (
        <section
            id="q4"
            data-testid="q4-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-[#0a0a0a] via-[#0c0c0f] to-[#0a0a0a]"
        >
            <SectionHeader
                eyebrow={`Question 04${season !== "all" ? ` · ${season}` : ""}${conference !== "all" ? ` · ${conference}` : ""}`}
                title="How does usage vary by position?"
                kicker="Every offense is built from four archetypes. Their usage profiles look nothing alike — and that structural asymmetry is the reason naive rankings need position context."
            />

            <WhyCallout>
                This question explores how offensive responsibility is structurally
                assigned across positions. It helps explain whether certain positions
                inherently carry more workload and how teams design their offenses
                around them.
            </WhyCallout>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                <div className="lg:col-span-8 p-6 bg-[#121215] border border-white/10">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-1">
                        Usage Distribution by Position
                    </div>
                    <p className="text-xs text-[#a1a1aa] mb-4 font-sub">
                        Grouped bars per usage bin. QBs have a bimodal split (backups vs
                        starters). WRs and RBs taper smoothly. TEs clump at the low end.
                    </p>
                    <WhyBadge>
                        Distribution shows whether usage within a position is evenly
                        spread or dominated by a few players.
                    </WhyBadge>
                    <Histogram
                        series={series}
                        categories={labels}
                        yLabel="# PLAYER-SEASONS"
                        dataTestId="q4-histogram"
                    />
                </div>
                <div className="lg:col-span-4 space-y-5">
                    <div className="p-6 bg-[#121215] border border-white/10">
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-3">
                            Avg Usage_Overall
                        </div>
                        <WhyBadge color="#34c759">
                            Direct comparison of workload across positions, making
                            structural role differences immediately readable.
                        </WhyBadge>
                        {avgBars.length ? (
                            <BarChart
                                data={avgBars}
                                valueFormat={(v) => v.toFixed(3)}
                                barHeight={28}
                                padding={{ top: 8, right: 70, bottom: 28, left: 50 }}
                                dataTestId="q4-avg-usage"
                            />
                        ) : (
                            <div className="text-[#71717a] text-sm py-8">No matches.</div>
                        )}
                    </div>
                    <div className="p-6 bg-[#121215] border border-white/10">
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-3">
                            Avg Player Usage Share (%)
                        </div>
                        {shareBars.length ? (
                            <BarChart
                                data={shareBars}
                                valueFormat={(v) => `${v.toFixed(1)}%`}
                                barHeight={28}
                                padding={{ top: 8, right: 80, bottom: 28, left: 50 }}
                                dataTestId="q4-avg-share"
                            />
                        ) : (
                            <div className="text-[#71717a] text-sm py-8">No matches.</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {positionDistribution.map((p) => (
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

            {positionDistribution.some((p) => p.players > 0) && (() => {
                const ranked = [...positionDistribution]
                    .filter((p) => p.players > 0)
                    .sort((a, b) => b.avg - a.avg);
                const top = ranked[0];
                const bot = ranked[ranked.length - 1];
                const ratio = bot.avg > 0 ? (top.avg / bot.avg).toFixed(1) : "—";
                return (
                    <AnswerBlock live testId="q4-answer">
                        Usage is not distributed evenly by position.{" "}
                        <b className="text-[#ffcc00]">{top.position}s</b> carry the
                        heaviest load (avg {top.avg.toFixed(3)}), while{" "}
                        <b className="text-white">{bot.position}s</b> sit at the
                        bottom ({bot.avg.toFixed(3)}) — a{" "}
                        <b className="text-[#ffcc00]">{ratio}×</b> structural gap.
                        Any leaderboard that doesn't control for position is ranking
                        positions, not players.
                    </AnswerBlock>
                );
            })()}
        </section>
    );
}
