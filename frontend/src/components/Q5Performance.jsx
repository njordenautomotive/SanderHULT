import { useMemo } from "react";
import SectionHeader from "./SectionHeader";
import Scatter from "./charts/Scatter";
import { dataset } from "../lib/data";
import { useFilters } from "../lib/filters";
import { WhyBadge, WhyCallout, AnswerBlock } from "./Why";

export default function Q5Performance() {
    const { season, conference, team } = useFilters();

    // Build team-season records with joined win%
    const joined = useMemo(() => {
        const winMap = {};
        dataset.wins.forEach((w) => {
            winMap[`${w.team}__${w.season}`] = w.win_pct;
        });
        const map = {};
        dataset.raw.forEach((r) => {
            const k = `${r.team}__${r.season}`;
            if (!map[k]) {
                map[k] = {
                    team: r.team,
                    conference: r.conference,
                    season: r.season,
                    top_player: r.top_player_share,
                    top_3: r.top3_share,
                };
            }
        });
        return Object.values(map)
            .map((t) => ({ ...t, win_pct: winMap[`${t.team}__${t.season}`] }))
            .filter((t) => t.win_pct !== undefined);
    }, []);

    const filtered = useMemo(
        () =>
            joined.filter((j) => {
                if (season !== "all" && j.season !== season) return false;
                if (conference !== "all" && j.conference !== conference) return false;
                return true;
            }),
        [joined, season, conference]
    );

    const pts1 = filtered.map((s) => ({
        x: s.top_player,
        y: s.win_pct,
        team: s.team,
        conference: s.conference,
        season: s.season,
    }));
    const pts3 = filtered.map((s) => ({
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
                eyebrow={`Question 05${season !== "all" ? ` · ${season}` : ""}${conference !== "all" ? ` · ${conference}` : ""}`}
                title="Does concentration predict winning?"
                kicker="Each dot is a team-season. Horizontal axis = how much of the offense one player owned. Vertical axis = season win percentage. Colored by conference."
            />

            <WhyCallout>
                Win percentage was calculated from real team-game results by summing
                wins and games for each team-season. This allows the performance
                analysis to test whether offensive usage concentration is related to
                actual team success.
            </WhyCallout>

            <div className="mb-4 p-4 bg-[#0a0a0a] border border-[#007aff]/30">
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#007aff] mb-1">
                    Methodology · Win% from real game results
                </div>
                <p className="text-xs text-[#a1a1aa] font-sub leading-relaxed">
                    Team performance is computed directly from{" "}
                    <b className="text-white">CLEAN_Win_Data.csv</b> — one row per
                    team per game — by summing{" "}
                    <span className="font-mono text-[#ffcc00]">Win</span> and{" "}
                    <span className="font-mono text-[#ffcc00]">Game</span> per
                    team-season, then dividing to get win%. No estimates, no
                    hardcoded values, no simulations. Both the raw game-level file
                    and the cleaned team-game file are linked at the bottom of the
                    page.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-[#121215] border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                            Win % vs Top Player Share
                        </div>
                        <div className="text-[10px] font-mono text-[#71717a]">
                            n = {pts1.length}
                        </div>
                    </div>
                    <WhyBadge>
                        A scatter plot is ideal for spotting relationships between
                        two variables — or confirming the absence of one. Isolating
                        top-player share focuses on single-player dependency.
                    </WhyBadge>
                    {pts1.length ? (
                        <Scatter
                            points={pts1}
                            xLabel="TOP PLAYER SHARE (%)"
                            yLabel="WIN %"
                            xDomain={[15, 45]}
                            yDomain={[0, 1]}
                            highlightTeam={team}
                            dataTestId="q5-scatter-top"
                        />
                    ) : (
                        <div className="text-[#71717a] text-sm py-16 text-center">
                            No team-seasons match the filters.
                        </div>
                    )}
                </div>
                <div className="p-6 bg-[#121215] border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                            Win % vs Top 3 Share
                        </div>
                        <div className="text-[10px] font-mono text-[#71717a]">
                            n = {pts3.length}
                        </div>
                    </div>
                    <WhyBadge color="#ffcc00">
                        Using top-3 share tests whether the depth of concentration —
                        not just a single star — is what moves the needle on winning.
                    </WhyBadge>
                    {pts3.length ? (
                        <Scatter
                            points={pts3}
                            xLabel="TOP 3 SHARE (%)"
                            yLabel="WIN %"
                            xDomain={[35, 75]}
                            yDomain={[0, 1]}
                            highlightTeam={team}
                            dataTestId="q5-scatter-top3"
                        />
                    ) : (
                        <div className="text-[#71717a] text-sm py-16 text-center">
                            No team-seasons match the filters.
                        </div>
                    )}
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

            {pts1.length >= 3 && (() => {
                const corr = (a, b) => {
                    const n = a.length;
                    const ma = a.reduce((x, y) => x + y, 0) / n;
                    const mb = b.reduce((x, y) => x + y, 0) / n;
                    let num = 0, da = 0, db = 0;
                    for (let i = 0; i < n; i++) {
                        num += (a[i] - ma) * (b[i] - mb);
                        da += (a[i] - ma) ** 2;
                        db += (b[i] - mb) ** 2;
                    }
                    const den = Math.sqrt(da * db);
                    return den ? num / den : 0;
                };
                const r1 = corr(
                    pts1.map((p) => p.x),
                    pts1.map((p) => p.y)
                );
                const r3 = corr(
                    pts3.map((p) => p.x),
                    pts3.map((p) => p.y)
                );
                const abs = Math.abs(r1);
                let strength;
                if (abs < 0.15) strength = "essentially no";
                else if (abs < 0.3) strength = "a weak";
                else if (abs < 0.5) strength = "a moderate";
                else strength = "a strong";
                const direction = r1 >= 0 ? "positive" : "negative";
                const scope = [
                    season !== "all" ? season : "2021–23",
                    conference !== "all" ? conference : "all P5",
                ].join(" · ");
                return (
                    <AnswerBlock live testId="q5-answer">
                        Across <b className="text-white">{scope}</b> (
                        {pts1.length} team-seasons), the correlation between top
                        player share and win% is{" "}
                        <b className="text-[#ffcc00]">r = {r1.toFixed(3)}</b>{" "}
                        <span className="text-[#71717a]">
                            (R² = {(r1 * r1).toFixed(3)})
                        </span>{" "}
                        — {strength} {direction} relationship. The top-3 view lands
                        at{" "}
                        <b className="text-[#ffcc00]">r = {r3.toFixed(3)}</b>{" "}
                        <span className="text-[#71717a]">
                            (R² = {(r3 * r3).toFixed(3)})
                        </span>
                        . The conclusion:{" "}
                        <b className="text-white">
                            concentration alone does not predict winning
                        </b>
                        . Great and poor teams appear across the full range of the
                        concentration axis.
                    </AnswerBlock>
                );
            })()}
        </section>
    );
}
