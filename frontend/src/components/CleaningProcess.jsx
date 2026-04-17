import SectionHeader from "./SectionHeader";
import Funnel from "./charts/Funnel";
import { cleaningFunnel, summary } from "../lib/data";
import { motion } from "framer-motion";

const DECISIONS = [
    {
        tag: "Scope",
        title: "Why Power Five only",
        body: "We removed ten conference buckets outright — AAC, ASUN, CUSA, Ind, INDAA, MAC, MWC, SBC, WAC, plus rows with blank conference values. That single cut trimmed 8,958 rows. Power Five teams share comparable schedules, recruiting tiers, and scholarship depth; mixing in Group of Five or FCS would blur the structural comparison.",
    },
    {
        tag: "Positions",
        title: "Why only QB, RB, WR, TE",
        body: "The fullback position (FB) was removed — 18 rows. Those four skill positions account for effectively all designed offensive touches in a modern P5 offense; FB is a specialty role that inflates per-player share math without contributing meaningfully to a usage story.",
    },
    {
        tag: "Distribution integrity",
        title: "Why low- and high-usage players were kept",
        body: "We are studying the DISTRIBUTION of player usage — the whole shape, tails included. Dropping outliers would have flattened teams that genuinely run through one star and erased the low-usage depth rotation that rounds out every real offense. Trimming either tail would produce a cleaner-looking but less honest dataset.",
    },
    {
        tag: "Edge case",
        title: "Multi-team player-seasons",
        body: "A small number of players appeared on two teams in the same season (mid-year transfers). We kept those as separate team-rows rather than merging — the unit of analysis is team usage structure, not player career totals.",
    },
    {
        tag: "Quality",
        title: "Zero nulls, zero duplicates",
        body: "After the two filters were applied, we confirmed there were no missing Player_IDs, no duplicate (Player_ID, Team, Season) tuples, and no corrupt rows. The final analytic table was ready to plot directly — no imputation, no fabrication.",
    },
    {
        tag: "Window",
        title: "Why 2021–2023",
        body: "The three-season window reflects the post-COVID / transfer-portal era. It keeps rosters, rule sets, and conference alignments comparable across every team-season in the analysis — so cross-season comparisons aren't polluted by format shifts.",
    },
];

export default function CleaningProcess() {
    return (
        <section
            id="cleaning"
            data-testid="cleaning-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <SectionHeader
                eyebrow="Ch. 02 · Methodology"
                title="From 12,880 rows to 3,904."
                kicker="Two deliberate cuts — one big, one surgical. 8,958 rows were dropped by narrowing the scope to Power Five conferences; 18 more were dropped by removing the fullback position. Nothing else was filtered — the shape of the distribution was left intact."
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-7">
                    <div className="p-6 bg-[#121215] border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                                Row Reduction Funnel
                            </div>
                            <div className="text-[11px] font-mono text-[#ffcc00]">
                                {cleaningFunnel[0].rows.toLocaleString()} →{" "}
                                {cleaningFunnel[cleaningFunnel.length - 1].rows.toLocaleString()}
                            </div>
                        </div>
                        <Funnel steps={cleaningFunnel} dataTestId="cleaning-funnel" />
                    </div>

                    {/* before / after table */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="p-5 bg-[#0a0a0a] border border-white/10">
                            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                                Before
                            </div>
                            <div className="mt-2 font-heading text-4xl font-black text-white">
                                12,880
                            </div>
                            <div className="mt-1 text-xs text-[#a1a1aa]">
                                all conferences · all positions · 2021–2023
                            </div>
                        </div>
                        <div className="p-5 bg-[#ffcc00]/10 border border-[#ffcc00]/30">
                            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ffcc00]">
                                After
                            </div>
                            <div className="mt-2 font-heading text-4xl font-black text-white">
                                {summary.total_rows.toLocaleString()}
                            </div>
                            <div className="mt-1 text-xs text-[#a1a1aa]">
                                P5 · QB/RB/WR/TE · 2021–2023
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                    {DECISIONS.map((d, i) => (
                        <motion.div
                            key={d.title}
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            className="p-5 border border-white/10 bg-[#0a0a0a] hover:border-[#007aff]/50 transition-colors"
                            data-testid={`cleaning-decision-${i}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.2em] text-[#007aff] border border-[#007aff]/40 bg-[#007aff]/5">
                                    {d.tag}
                                </span>
                            </div>
                            <div className="font-sub font-bold text-white text-sm mb-1 uppercase tracking-wide">
                                {d.title}
                            </div>
                            <p className="text-[#a1a1aa] text-sm leading-relaxed">{d.body}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-12 p-6 border-l-4 border-[#ffcc00] bg-[#121215]"
            >
                <p className="font-sub text-white text-lg leading-relaxed">
                    <span className="text-[#ffcc00] font-bold">Takeaway.</span>{" "}
                    Only two filters were applied — scope and position. No usage
                    outliers were trimmed, no bottom tail was dropped. Because the
                    entire analysis asks how usage is{" "}
                    <em className="text-white">distributed</em>, removing either
                    extreme would have rewritten the story we set out to tell.
                </p>
            </motion.div>
        </section>
    );
}
