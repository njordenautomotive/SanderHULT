import SectionHeader from "./SectionHeader";
import { motion } from "framer-motion";

const POINTS = [
    {
        title: "Usage = opportunity",
        body: "It measures how often a player is asked to do something offensive — carry the ball, catch a pass, drop back to throw. Not efficiency. Not yardage. Opportunity.",
        color: "#007aff",
    },
    {
        title: "Share tells the story",
        body: "Player Usage Share is that player's slice of their team's total offensive opportunities. A QB taking 35% of snaps tells a different story than a WR getting 6%.",
        color: "#ffcc00",
    },
    {
        title: "Concentration vs spread",
        body: "Some offenses funnel the ball to one or two stars. Others distribute touches across five or six names. Both can win — but they're different blueprints.",
        color: "#ff3b30",
    },
];

export default function UsageExplainer() {
    return (
        <section
            id="overview"
            data-testid="overview-section"
            className="relative py-24 md:py-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <SectionHeader
                eyebrow="Ch. 01 · Concept"
                title="What does offensive usage actually mean?"
                kicker="Before we rank anything, we need a shared language. Usage isn't about how good a player is — it's about how often an offense leans on them."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {POINTS.map((p, i) => (
                    <motion.div
                        key={p.title}
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, delay: i * 0.15 }}
                        className="relative p-7 bg-[#121215] border border-white/10 hover:border-white/25 transition-colors"
                        data-testid={`usage-concept-${i}`}
                    >
                        <div
                            className="absolute top-0 left-0 w-12 h-[2px]"
                            style={{ background: p.color }}
                        />
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#71717a] mb-3">
                            0{i + 1}
                        </div>
                        <h3 className="font-heading text-2xl font-black uppercase leading-tight mb-3">
                            {p.title}
                        </h3>
                        <p className="text-[#a1a1aa] leading-relaxed text-sm">
                            {p.body}
                        </p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-10 p-6 border border-[#ffcc00]/30 bg-[#ffcc00]/5"
            >
                <div className="flex flex-wrap items-start gap-4">
                    <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#ffcc00]">
                        Core question
                    </div>
                    <p className="flex-1 text-white text-lg font-sub">
                        Do winning teams concentrate usage on a star, or spread it
                        across a deeper cast? That is the thread we'll follow for
                        the next eleven scrolls.
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
