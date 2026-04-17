import SectionHeader from "./SectionHeader";
import Funnel from "./charts/Funnel";
import { cleaningFunnel, summary } from "../lib/data";
import { motion } from "framer-motion";

const DECISIONS = [
    {
        tag: "Scope",
        title: "Why 2021–2023 only",
        body: "Older seasons reflected different rosters, different rules (COVID eligibility, transfer portal rules), and older conference alignments. A three‑year window keeps the analysis contemporary and comparable.",
    },
    {
        tag: "Focus",
        title: "Why Power Five only",
        body: "We wanted structural comparability. Power Five teams play similar schedules, recruit similarly, and operate with comparable scholarship depth. Mixing in Group of Five or FCS data would blur the story.",
    },
    {
        tag: "Positions",
        title: "Why only QB, RB, WR, TE",
        body: "These four positions account for virtually all designed offensive touches. FB, OL, and defensive cross‑overs were removed — they either don't meaningfully carry usage or they warped the per‑player share calculations.",
    },
    {
        tag: "Inclusion",
        title: "Why low‑usage players were kept",
        body: "A 1% usage WR is still part of the picture. Dropping the bottom tail would artificially flatten team distributions and overstate how concentrated offenses actually are.",
    },
    {
        tag: "Edge case",
        title: "Multi‑team player‑seasons",
        body: "A handful of players appeared on two teams in one season (transfer mid‑year). We kept them as separate team‑rows rather than merging — the analysis is about team usage structure, not career totals.",
    },
    {
        tag: "Quality",
        title: "Zero nulls, zero duplicates",
        body: "After filtering we confirmed no missing player IDs, no duplicate (Player_ID, Team, Season) tuples, and no corrupt rows. The final analytic table was clean enough to plot directly.",
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
                title="From thirteen thousand rows to four."
                kicker="Good charts start with honest data. Here's exactly how the raw export was pared down — and why every cut was deliberate, not mechanical."
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
                                12,987
                            </div>
                            <div className="mt-1 text-xs text-[#a1a1aa]">
                                all FBS / all positions / 2015–2023
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
                    Every row that survived cleaning is here for a reason. Every
                    row that didn't, left because it would have distorted a team's
                    usage distribution — not because it was convenient to drop.
                </p>
            </motion.div>
        </section>
    );
}
