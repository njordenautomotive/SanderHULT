import SectionHeader from "./SectionHeader";
import BarChart from "./charts/BarChart";
import { q2 } from "../lib/data";
import { CONFERENCE_COLORS } from "../lib/constants";

export default function Q2TeamDependency() {
    // top 15 most dependent teams (by avg top player share)
    const mostDependent = q2.teamAverages.slice(0, 12).map((t) => ({
        label: t.Team,
        value: t.avg_top_player,
        sub: t.Conference,
        color: CONFERENCE_COLORS[t.Conference],
    }));

    // top 15 most balanced teams
    const mostBalanced = [...q2.teamAverages]
        .sort((a, b) => a.avg_top_player - b.avg_top_player)
        .slice(0, 12)
        .map((t) => ({
            label: t.Team,
            value: t.avg_top_player,
            sub: t.Conference,
            color: CONFERENCE_COLORS[t.Conference],
        }));

    const top3Ranking = [...q2.teamAverages]
        .sort((a, b) => b.avg_top3 - a.avg_top3)
        .slice(0, 12)
        .map((t) => ({
            label: t.Team,
            value: t.avg_top3,
            sub: t.Conference,
            color: CONFERENCE_COLORS[t.Conference],
        }));

    return (
        <section
            id="q2"
            data-testid="q2-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-[#0a0a0a] via-[#0c0c0f] to-[#0a0a0a]"
        >
            <SectionHeader
                eyebrow="Question 02"
                title="Which teams lean hardest on a single player?"
                kicker="For every team-season, Top Player Share measures how much of the offense runs through one name. A team at 35%+ is carrying a true bellcow. Below 22% is genuinely balanced."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-[#121215] border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#ff3b30]">
                            Most Player-Dependent
                        </div>
                        <div className="text-[10px] font-mono text-[#71717a]">
                            avg top player share · 2021–23
                        </div>
                    </div>
                    <BarChart
                        data={mostDependent}
                        valueFormat={(v) => `${v.toFixed(1)}%`}
                        xLabel="AVG TOP PLAYER SHARE"
                        padding={{ top: 12, right: 90, bottom: 32, left: 160 }}
                        defaultColor="#ff3b30"
                        dataTestId="q2-most-dependent"
                    />
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
                    <BarChart
                        data={mostBalanced}
                        valueFormat={(v) => `${v.toFixed(1)}%`}
                        xLabel="AVG TOP PLAYER SHARE"
                        padding={{ top: 12, right: 90, bottom: 32, left: 160 }}
                        defaultColor="#34c759"
                        dataTestId="q2-most-balanced"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
                <div className="lg:col-span-7 p-6 bg-[#121215] border border-white/10">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-2">
                        Top 3 Players · Share of Offense
                    </div>
                    <p className="text-xs text-[#a1a1aa] mb-4 font-sub">
                        Across every Power Five team, the top three contributors absorb on
                        average <b className="text-white">53%</b> of offensive usage. The
                        twelve teams below cross 60%.
                    </p>
                    <BarChart
                        data={top3Ranking}
                        valueFormat={(v) => `${v.toFixed(1)}%`}
                        xLabel="AVG TOP-3 SHARE"
                        padding={{ top: 12, right: 90, bottom: 32, left: 160 }}
                        defaultColor="#ffcc00"
                        dataTestId="q2-top3-ranking"
                    />
                </div>
                <div className="lg:col-span-5 space-y-4">
                    <div className="p-6 bg-[#0a0a0a] border border-[#ff3b30]/30">
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ff3b30] mb-2">
                            Pattern
                        </div>
                        <p className="text-white text-sm font-sub leading-relaxed">
                            Extreme player-dependency is often tied to a single dual-threat
                            quarterback carrying both the pass game and the designed run
                            game — Mississippi State's Will Rogers, Miami's QB carousel,
                            Washington State's mobile QBs.
                        </p>
                    </div>
                    <div className="p-6 bg-[#0a0a0a] border border-[#34c759]/30">
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#34c759] mb-2">
                            Counter-pattern
                        </div>
                        <p className="text-white text-sm font-sub leading-relaxed">
                            The most balanced offenses typically feature a committee backfield,
                            a spread-the-ball passing attack, or a run-pass RPO system that
                            diffuses touches across a deep rotation.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
