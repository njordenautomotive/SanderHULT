import SectionHeader from "./SectionHeader";
import Scatter from "./charts/Scatter";
import { q6 } from "../lib/data";
import { ARCHETYPE_COLORS } from "../lib/constants";

export default function Q6Archetypes() {
    const pts = q6.archetypes.map((a) => ({
        x: a.top_player,
        y: a.win_pct,
        team: a.team,
        season: a.season,
        conference: a.conference,
        archetype: a.archetype,
        color: ARCHETYPE_COLORS[a.archetype],
    }));

    const med = q6.archetypes[0] || { med_top: 27, med_win: 0.54 };

    // Example representatives per archetype (top by winpct)
    const examples = {};
    q6.archetypes.forEach((a) => {
        if (!examples[a.archetype] || a.win_pct > examples[a.archetype].win_pct) {
            examples[a.archetype] = a;
        }
    });
    const exampleList = Object.values(examples).sort((a, b) => b.win_pct - a.win_pct);

    return (
        <section
            id="q6"
            data-testid="q6-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-[#0a0a0a] via-[#0c0c0f] to-[#0a0a0a]"
        >
            <SectionHeader
                eyebrow="Question 06"
                title="Balanced winners or star-driven winners?"
                kicker="Split the scatter on the medians. Four quadrants. Four strategic identities. The distribution of team-seasons across them tells you which styles actually travel to the postseason."
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 p-6 bg-[#121215] border border-white/10 relative">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-3">
                        Archetype Quadrants
                    </div>
                    <Scatter
                        points={pts}
                        xLabel="TOP PLAYER SHARE (%)"
                        yLabel="WIN %"
                        xDomain={[15, 45]}
                        yDomain={[0, 1]}
                        quadrants={{ xMid: med.med_top, yMid: med.med_win }}
                        showTrend={false}
                        dataTestId="q6-archetypes"
                    />
                    <div className="absolute top-12 left-12 text-[10px] font-mono uppercase tracking-wider text-[#34c759]">
                        Balanced · Winners ↗
                    </div>
                    <div className="absolute top-12 right-20 text-[10px] font-mono uppercase tracking-wider text-[#007aff]">
                        ↖ Star · Winners
                    </div>
                    <div className="absolute bottom-20 left-12 text-[10px] font-mono uppercase tracking-wider text-[#ffcc00]">
                        Balanced · Strugglers ↘
                    </div>
                    <div className="absolute bottom-20 right-20 text-[10px] font-mono uppercase tracking-wider text-[#ff3b30]">
                        ↙ Concentrated · Strugglers
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                    {Object.entries(ARCHETYPE_COLORS).map(([k, c]) => {
                        const count = q6.archetypes.filter((a) => a.archetype === k).length;
                        const ex = examples[k];
                        return (
                            <div
                                key={k}
                                className="p-5 bg-[#0a0a0a] border border-white/10"
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
        </section>
    );
}
