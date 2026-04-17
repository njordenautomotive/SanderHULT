import { motion } from "framer-motion";
import { summary } from "../lib/data";

const HERO_BG =
    "https://images.unsplash.com/photo-1634306320557-4c4e4660692f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwyfHxjb2xsZWdlJTIwZm9vdGJhbGwlMjBzdGFkaXVtJTIwbmlnaHQlMjBkYXJrfGVufDB8fHx8MTc3NjM5OTU0MXww&ixlib=rb-4.1.0&q=85";

export default function Hero() {
    return (
        <section
            id="hero"
            data-testid="hero-section"
            className="relative min-h-[100svh] flex items-center overflow-hidden"
        >
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${HERO_BG})`,
                    filter: "grayscale(60%) brightness(0.6)",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#0a0a0a]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col gap-2 mb-6"
                >
                    <div className="flex items-center gap-3">
                        <span className="w-10 h-[2px] bg-[#ffcc00]" />
                        <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#a1a1aa]">
                            Data Visualization · 2021–2023 · Power Five
                        </span>
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#71717a] pl-[52px]">
                        Group 5 · Hult International Business School · BOS1
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className="font-heading text-[clamp(3.5rem,9vw,8rem)] font-black uppercase leading-[0.85] tracking-[-0.02em] text-white max-w-6xl"
                >
                    The
                    <br />
                    <span className="shine-text">Concentration</span>
                    <br />
                    Equation.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.4 }}
                    className="mt-8 text-lg sm:text-xl text-[#a1a1aa] max-w-2xl leading-relaxed font-sub"
                >
                    Some teams ride a single star. Others spread the ball like a
                    portfolio. A data‑driven look at how{" "}
                    <span className="text-white font-semibold">Power Five</span>{" "}
                    offenses allocate opportunity — and whether concentration
                    wins games.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.6 }}
                    className="mt-10 flex flex-wrap gap-4 items-center"
                >
                    <a
                        href="#overview"
                        data-testid="hero-cta-start"
                        className="inline-flex items-center gap-2 bg-[#ffcc00] text-black font-bold uppercase tracking-[0.2em] px-7 py-4 text-sm hover:bg-white transition-colors"
                    >
                        Start the Story
                        <span>→</span>
                    </a>
                    <a
                        href="#cleaning"
                        data-testid="hero-cta-process"
                        className="inline-flex items-center gap-2 border border-white/25 text-white font-semibold uppercase tracking-[0.2em] px-6 py-4 text-sm hover:bg-white/10 transition-all"
                    >
                        How the data was cleaned
                    </a>
                </motion.div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl"
                    data-testid="hero-stats"
                >
                    {[
                        { l: "Player‑seasons", v: summary.total_rows.toLocaleString() },
                        { l: "P5 Teams", v: summary.teams },
                        { l: "Seasons", v: "2021–23" },
                        { l: "Positions", v: summary.positions.join(" · ") },
                    ].map((s) => (
                        <div key={s.l} className="border-l-2 border-white/20 pl-4">
                            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                                {s.l}
                            </div>
                            <div className="mt-1 font-heading text-3xl md:text-4xl font-black text-white">
                                {s.v}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
            >
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                    Scroll
                </span>
                <div className="scroll-arrow text-[#ffcc00] text-lg">↓</div>
            </motion.div>
        </section>
    );
}
