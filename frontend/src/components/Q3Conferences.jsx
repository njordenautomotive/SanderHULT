import { useMemo } from "react";
import SectionHeader from "./SectionHeader";
import BarChart from "./charts/BarChart";
import Heatmap from "./charts/Heatmap";
import { dataset } from "../lib/data";
import { useFilters } from "../lib/filters";
import { CONFERENCE_COLORS } from "../lib/constants";
import { WhyBadge, WhyCallout, AnswerBlock } from "./Why";

export default function Q3Conferences() {
    const { season } = useFilters();

    const rows = useMemo(
        () => dataset.raw.filter((r) => season === "all" || r.season === season),
        [season]
    );

    // Conference averages — Excel-pivot style: AVERAGE(Top_Player_Share) grouped by
    // conference over EVERY raw player row. Each team-season contributes proportional
    // to its player count, matching the source Excel methodology.
    const confAgg = useMemo(() => {
        const grp = {};
        rows.forEach((r) => {
            if (!grp[r.conference]) {
                grp[r.conference] = { topSum: 0, top3Sum: 0, n: 0, teams: new Set() };
            }
            grp[r.conference].topSum += r.top_player_share;
            grp[r.conference].top3Sum += r.top3_share;
            grp[r.conference].n += 1;
            grp[r.conference].teams.add(r.team);
        });
        return Object.entries(grp).map(([c, v]) => ({
            conference: c,
            avg_top_player: v.topSum / v.n,
            avg_top3: v.top3Sum / v.n,
            teams: v.teams.size,
        }));
    }, [rows]);

    const confPos = useMemo(() => {
        const grp = {};
        rows.forEach((r) => {
            const key = `${r.conference}__${r.position}`;
            if (!grp[key]) grp[key] = { conf: r.conference, pos: r.position, sum: 0, n: 0 };
            grp[key].sum += r.usage;
            grp[key].n++;
        });
        return Object.values(grp).map((g) => ({
            row: g.conf,
            col: g.pos,
            value: g.sum / (g.n || 1),
        }));
    }, [rows]);

    const sorted = [...confAgg].sort((a, b) => b.avg_top_player - a.avg_top_player);
    const confTop = sorted.map((c) => ({
        label: c.conference,
        value: c.avg_top_player,
        sub: `${c.teams} teams`,
        color: CONFERENCE_COLORS[c.conference],
    }));
    const confTop3 = [...confAgg]
        .sort((a, b) => b.avg_top3 - a.avg_top3)
        .map((c) => ({
            label: c.conference,
            value: c.avg_top3,
            color: CONFERENCE_COLORS[c.conference],
        }));

    const conferences = ["SEC", "Big Ten", "Big 12", "ACC", "Pac-12"];
    const positions = ["QB", "RB", "WR", "TE"];

    return (
        <section
            id="q3"
            data-testid="q3-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <SectionHeader
                eyebrow={`Question 03${season !== "all" ? ` · ${season}` : ""}`}
                title="How do conferences differ in concentration?"
                kicker="The Power Five aren't homogeneous. Even at the conference average level, some leagues play a more star-driven brand than others."
            />

            <WhyCallout>
                This question examines whether offensive strategies vary across
                competitive environments. Differences across conferences may reflect
                coaching styles, talent distribution, or systemic trends in how teams
                structure their offenses.
            </WhyCallout>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="p-6 bg-[#121215] border border-white/10">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-3">
                        Top Player Share · Conference Avg
                    </div>
                    <WhyBadge>
                        Aggregating by conference allows a direct comparison of
                        average dependency levels across groups.
                    </WhyBadge>
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
                    <WhyBadge color="#ffcc00">
                        The top-three cut smooths over single-player outliers and
                        captures whole-offense structure at the conference level.
                    </WhyBadge>
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
                    <WhyBadge color="#34c759">
                        A heatmap handles two categorical axes with one continuous
                        value — showing whether differences are consistent across
                        positions or driven by a few extremes.
                    </WhyBadge>
                    <Heatmap
                        data={confPos}
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

            {confAgg.length > 1 && (() => {
                const sorted = [...confAgg].sort(
                    (a, b) => b.avg_top_player - a.avg_top_player
                );
                const high = sorted[0];
                const low = sorted[sorted.length - 1];
                const gap = (high.avg_top_player - low.avg_top_player).toFixed(1);
                const scope = season !== "all" ? season : "2021–23";
                return (
                    <AnswerBlock live testId="q3-answer">
                        Across <b className="text-white">{scope}</b>, the{" "}
                        <b className="text-[#ffcc00]">{high.conference}</b> leans
                        most heavily on its top player (avg{" "}
                        <b className="text-[#ffcc00]">
                            {high.avg_top_player.toFixed(1)}%
                        </b>
                        ), while the <b className="text-[#34c759]">{low.conference}</b>{" "}
                        is the most balanced (
                        <b className="text-[#34c759]">
                            {low.avg_top_player.toFixed(1)}%
                        </b>
                        ). The full spread across every Power Five conference is just{" "}
                        <b className="text-white">{gap} percentage points</b> — a real
                        but modest gap. Conferences differ in style, but not in
                        systemic structure.
                    </AnswerBlock>
                );
            })()}
        </section>
    );
}
