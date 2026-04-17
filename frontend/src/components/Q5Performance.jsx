import SectionHeader from "./SectionHeader";
import Scatter from "./charts/Scatter";
import { q5 } from "../lib/data";

export default function Q5Performance() {
    const points = q5.scatter.map((s) => ({
        x: s.top_player,
        y: s.win_pct,
        team: s.team,
        conference: s.conference,
        season: s.season,
    }));
    const points3 = q5.scatter.map((s) => ({
        x: s.top_3,
        y: s.win_pct,
        team: s.team,
        conference: s.conference,
        season: s.season,
    }));

    return (
        <section
            id="q5"
            data-testid="q5-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <SectionHeader
                eyebrow="Question 05"
                title="Does concentration predict winning?"
                kicker="Each dot is a team-season. Horizontal axis = how much of the offense one player owned. Vertical axis = season win percentage. Colored by conference."
            />

            <div className="mb-4 p-4 bg-[#0a0a0a] border border-[#007aff]/30">
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#007aff] mb-1">
                    Note on data
                </div>
                <p className="text-xs text-[#a1a1aa] font-sub leading-relaxed">
                    The raw dataset doesn't carry wins. Win% is stitched in from public
                    season records (regular + postseason) for each P5 team-season — a
                    transparent external join. Any team-season without a clean record
                    match is excluded from these scatters.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-[#121215] border border-white/10">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-3">
                        Win % vs Top Player Share
                    </div>
                    <Scatter
                        points={points}
                        xLabel="TOP PLAYER SHARE (%)"
                        yLabel="WIN %"
                        xDomain={[15, 45]}
                        yDomain={[0, 1]}
                        dataTestId="q5-scatter-top"
                    />
                </div>
                <div className="p-6 bg-[#121215] border border-white/10">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-3">
                        Win % vs Top 3 Share
                    </div>
                    <Scatter
                        points={points3}
                        xLabel="TOP 3 SHARE (%)"
                        yLabel="WIN %"
                        xDomain={[35, 75]}
                        yDomain={[0, 1]}
                        dataTestId="q5-scatter-top3"
                    />
                </div>
            </div>

            <div className="mt-6 p-6 border-l-4 border-[#ffcc00] bg-[#121215]">
                <p className="font-sub text-white text-lg leading-relaxed">
                    <span className="text-[#ffcc00] font-bold">What the trend says.</span>{" "}
                    The relationship between concentration and winning is{" "}
                    <b>weak</b>. Both heavily-concentrated and highly-balanced offenses
                    show up across the win% range. Concentration, alone, is not destiny —
                    talent and system matter more than whether the ball goes to one name
                    or five.
                </p>
            </div>
        </section>
    );
}
