import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionHeader from "./SectionHeader";

const TAKEAWAYS = [
    {
        n: "01",
        title: "Usage is structural, not reputational",
        body: "QBs hold ~3x the average usage of WRs. Any leaderboard that doesn't filter by position is ranking positions, not players.",
    },
    {
        n: "02",
        title: "Most offenses are more dependent than you'd guess",
        body: "The average Power Five team funnels 27% of its offense through one player and 53% through three. 'Balance' is the exception, not the norm.",
    },
    {
        n: "03",
        title: "Conferences differ — modestly",
        body: "Only about 3 percentage points separate the most and least concentrated conferences. The real variance lives between teams, not leagues.",
    },
    {
        n: "04",
        title: "Concentration ≠ winning",
        body: "The correlation between top-player share and win% is weak across 2021–23. Elite teams appear in every quadrant.",
    },
    {
        n: "05",
        title: "The answer is alignment",
        body: "Both balanced and star-driven systems produce champions. The question isn't which model is 'correct' — it's whether a team's usage distribution fits the talent actually on the roster.",
    },
];

export default function Conclusion() {
    return (
        <section
            id="conclusion"
            data-testid="conclusion-section"
            className="relative py-24 md:py-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <SectionHeader
                eyebrow="Ch. 04 · Closing"
                title="Five things the data actually says."
                kicker="Tying together six research questions, three years, and 3,904 player-seasons."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {TAKEAWAYS.map((t, i) => (
                    <motion.div
                        key={t.n}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        className="p-7 bg-[#121215] border border-white/10 hover:border-[#ffcc00]/50 transition-colors group"
                        data-testid={`takeaway-${t.n}`}
                    >
                        <div className="flex items-baseline gap-4">
                            <span className="font-heading text-6xl font-black text-[#ffcc00]/30 group-hover:text-[#ffcc00] transition-colors">
                                {t.n}
                            </span>
                            <div>
                                <h3 className="font-heading text-xl font-black uppercase text-white leading-tight mb-2">
                                    {t.title}
                                </h3>
                                <p className="text-[#a1a1aa] text-sm leading-relaxed">
                                    {t.body}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="mt-14 p-10 border border-white/10 bg-gradient-to-br from-[#121215] to-[#0a0a0a]"
            >
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-3">
                    Where this goes next
                </div>
                <h3 className="font-heading text-3xl md:text-4xl font-black uppercase text-white mb-4 max-w-3xl leading-tight">
                    Next: tie usage to efficiency, not just opportunity.
                </h3>
                <p className="text-[#a1a1aa] text-base leading-relaxed max-w-3xl font-sub">
                    Usage measures how often an offense calls your number. The natural
                    follow-up is whether concentration pairs with{" "}
                    <b className="text-white">efficiency</b> (yards per touch, success
                    rate) — and whether star-driven offenses buckle when that star is
                    injured or neutralized. That's the next dataset, and the next story.
                </p>
            </motion.div>

            <footer className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div data-testid="credit-block">
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-2">
                        Project credit
                    </div>
                    <div className="font-heading text-2xl md:text-3xl font-black uppercase text-white leading-tight">
                        Group 5 · Hult International
                        <br />
                        Business School · BOS1
                    </div>
                    <div className="mt-2 text-xs font-mono uppercase tracking-[0.2em] text-[#a1a1aa]">
                        Data Visualization Module
                    </div>
                </div>
                <div className="flex flex-col gap-3 md:items-end">
                    <div className="flex flex-wrap gap-2 md:justify-end">
                        <Link
                            to="/raw-data"
                            data-testid="footer-raw-data-link"
                            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.3em] text-white bg-[#ff3b30] px-4 py-2.5 hover:bg-white hover:text-black transition-colors"
                        >
                            Raw Data <span>→</span>
                        </Link>
                        <Link
                            to="/cleaned-data"
                            data-testid="footer-cleaned-data-link"
                            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.3em] text-black bg-[#ffcc00] px-4 py-2.5 hover:bg-white transition-colors"
                        >
                            Cleaned Data <span>→</span>
                        </Link>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                        <a
                            href="/RAW_Win_Data.csv"
                            download
                            data-testid="footer-raw-win-data-link"
                            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.3em] text-white border border-[#ff3b30]/60 px-4 py-2.5 hover:bg-[#ff3b30] hover:text-white transition-colors"
                            title="Original game-level results used to calculate team performance"
                        >
                            Raw Win Data <span>↓</span>
                        </a>
                        <a
                            href="/CLEAN_Win_Data.csv"
                            download
                            data-testid="footer-clean-win-data-link"
                            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.3em] text-white border border-[#ffcc00]/60 px-4 py-2.5 hover:bg-[#ffcc00] hover:text-black transition-colors"
                            title="Processed team-game dataset used to calculate wins, games, and win%"
                        >
                            Clean Win Data <span>↓</span>
                        </a>
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                        Data · 2021–2023 Power Five · QB · RB · WR · TE
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                        Built with D3 + Framer Motion
                    </div>
                </div>
            </footer>
        </section>
    );
}
