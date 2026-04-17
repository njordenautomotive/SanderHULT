import { useMemo } from "react";
import SectionHeader from "./SectionHeader";
import BarChart from "./charts/BarChart";
import Heatmap from "./charts/Heatmap";
import { dataset } from "../lib/data";
import { useFilters } from "../lib/filters";
import { CONFERENCE_COLORS } from "../lib/constants";

export default function Q3Conferences() {
    const { season } = useFilters();

    const rows = useMemo(
        () => dataset.raw.filter((r) => season === "all" || r.season === season),
        [season]
    );

    // Build per team-season top player + top3 (dedupe by team-season key)
    const teamSeason = useMemo(() => {
        const map = {};
        rows.forEach((r) => {
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
    }, [rows]);

    const confAgg = useMemo(() => {
        const grp = {};
        teamSeason.forEach((t) => {
            if (!grp[t.conference]) grp[t.conference] = { top: [], top3: [], teams: new Set() };
            grp[t.conference].top.push(t.top_player_share);
            grp[t.conference].top3.push(t.top3_share);
            grp[t.conference].teams.add(t.team);
        });
        return Object.entries(grp).map(([c, v]) => ({
            conference: c,
            avg_top_player: v.top.reduce((a, b) => a + b, 0) / v.top.length,
            avg_top3: v.top3.reduce((a, b) => a + b, 0) / v.top3.length,
            teams: v.teams.size,
        }));
    }, [teamSeason]);

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
        </section>
    );
}
