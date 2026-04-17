import SectionHeader from "./SectionHeader";
import BarChart from "./charts/BarChart";
import Heatmap from "./charts/Heatmap";
import { q3 } from "../lib/data";
import { CONFERENCE_COLORS } from "../lib/constants";

export default function Q3Conferences() {
    const sorted = [...q3.conferenceAverages].sort((a, b) => b.avg_top_player - a.avg_top_player);
    const confTop = sorted.map((c) => ({
        label: c.Conference,
        value: c.avg_top_player,
        sub: `${c.teams} teams`,
        color: CONFERENCE_COLORS[c.Conference],
    }));
    const confTop3 = sorted
        .map((c) => ({
            label: c.Conference,
            value: c.avg_top3,
            color: CONFERENCE_COLORS[c.Conference],
        }))
        .sort((a, b) => b.value - a.value);

    const conferences = ["SEC", "Big Ten", "Big 12", "ACC", "Pac-12"];
    const positions = ["QB", "RB", "WR", "TE"];
    const heatData = q3.conferencePosition.map((d) => ({
        row: d.Conference,
        col: d.Position,
        value: d.avg_usage,
    }));

    return (
        <section
            id="q3"
            data-testid="q3-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <SectionHeader
                eyebrow="Question 03"
                title="How do conferences differ in concentration?"
                kicker="The Power Five aren't homogeneous. Even at the conference average level, some leagues play a more star-driven brand than others — and it shows up in every single position group."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="p-6 bg-[#121215] border border-white/10">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-3">
                        Top Player Share · Conference Avg
                    </div>
                    <BarChart
                        data={confTop}
                        valueFormat={(v) => `${v.toFixed(1)}%`}
                        xLabel="% OF OFFENSE"
                        barHeight={30}
                        padding={{ top: 12, right: 90, bottom: 32, left: 110 }}
                        dataTestId="q3-conf-top"
                    />
                </div>
                <div className="p-6 bg-[#121215] border border-white/10">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-3">
                        Top 3 Share · Conference Avg
                    </div>
                    <BarChart
                        data={confTop3}
                        valueFormat={(v) => `${v.toFixed(1)}%`}
                        xLabel="% OF OFFENSE"
                        barHeight={30}
                        padding={{ top: 12, right: 90, bottom: 32, left: 110 }}
                        dataTestId="q3-conf-top3"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 p-6 bg-[#121215] border border-white/10">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-3">
                        Conference × Position · Avg Usage
                    </div>
                    <Heatmap
                        data={heatData}
                        rows={conferences}
                        cols={positions}
                        dataTestId="q3-heatmap"
                    />
                </div>
                <div className="lg:col-span-4 space-y-4">
                    <div className="p-5 bg-[#0a0a0a] border border-white/10">
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#007aff] mb-1">
                            Tightest gap
                        </div>
                        <p className="text-sm text-[#a1a1aa] font-sub leading-relaxed">
                            Only about <b className="text-white">3 percentage points</b>{" "}
                            separate the most concentrated conference from the most balanced
                            — a meaningful but not dramatic gap.
                        </p>
                    </div>
                    <div className="p-5 bg-[#0a0a0a] border border-white/10">
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ffcc00] mb-1">
                            Position signal
                        </div>
                        <p className="text-sm text-[#a1a1aa] font-sub leading-relaxed">
                            Across every conference, <b className="text-white">QB usage dwarfs everything else</b>.
                            The real between-league differences live in WR vs RB allocation.
                        </p>
                    </div>
                    <div className="p-5 bg-[#0a0a0a] border border-[#ff3b30]/30">
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ff3b30] mb-1">
                            Caveat
                        </div>
                        <p className="text-sm text-[#a1a1aa] font-sub leading-relaxed">
                            Conference averages flatten huge within-conference variance.
                            Alabama and Vanderbilt share a league — not a system.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
