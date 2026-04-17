import SectionHeader from "./SectionHeader";
import { motion } from "framer-motion";

const NOTES = [
    {
        chart: "Horizontal Bar",
        use: "Rankings — Q1 top players, Q2 team dependency",
        why: "Ranking calls for a direct comparison. Horizontal bars let long player/team names breathe and keep the value axis easy to scan.",
        iter: "Early drafts used vertical bars — the labels got crushed at the bottom. Rotating ≠ clarity.",
    },
    {
        chart: "Histogram",
        use: "Distributions — Q1 usage, Q4 by position",
        why: "To show how concentrated the tail of top players is, we need shape, not a ranking. Binned counts reveal that most players cluster near zero while a handful dominate.",
        iter: "A density curve looked pretty but hid the discrete counts. Bars tell you 1,988 players live under 5% usage. That number matters.",
    },
    {
        chart: "Heatmap",
        use: "Q3 Conference × Position",
        why: "Two categorical axes with one continuous value = heatmap. A grouped bar got noisy at 5 conferences × 4 positions = 20 bars.",
        iter: "The color scale went through three versions. A rainbow gradient read as arbitrary; the current blue→yellow ramp is ordered and accessible.",
    },
    {
        chart: "Scatter + trend",
        use: "Q5 Performance vs concentration",
        why: "We're asking about a relationship between two continuous variables. That's what scatter plots do — and adding a trend line quantifies it.",
        iter: "The first scatter had no trend line. Readers couldn't tell if they should see a pattern. Adding r-value plus the dashed line makes the (weak) signal explicit.",
    },
    {
        chart: "Quadrant",
        use: "Q6 Offensive archetypes",
        why: "To split teams into four strategic groups, we drop median lines on the scatter and label the four corners. It turns abstract numbers into identity.",
        iter: "We tried k-means clustering first. With 196 team-seasons it overfit. Median-based quadrants are simpler and defensible.",
    },
    {
        chart: "Line (multi-series)",
        use: "Q1 Longitudinal player comparison",
        why: "Three years, multiple players — lines show trajectory. Bars at three timepoints would waste space and hide direction.",
        iter: "Stacked area looked artistic but made it impossible to compare absolute values. Clean mono-color lines with end labels won.",
    },
];

export default function VizDesignProcess() {
    return (
        <section
            id="design"
            data-testid="design-section"
            className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <SectionHeader
                eyebrow="Ch. 03 · Design Notes"
                title="How the visualizations were built."
                kicker="A chart is a decision. These are the six we made, what they're for, and where earlier drafts fell apart."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {NOTES.map((n, i) => (
                    <motion.div
                        key={n.chart}
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        className="p-6 bg-[#121215] border border-white/10 hover:border-[#ffcc00]/40 transition-colors group"
                        data-testid={`design-note-${i}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-heading text-2xl font-black uppercase text-white">
                                {n.chart}
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                                0{i + 1}/06
                            </div>
                        </div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-[#ffcc00] mb-4">
                            {n.use}
                        </div>
                        <div className="space-y-3 text-sm text-[#a1a1aa] leading-relaxed">
                            <div>
                                <span className="text-white font-semibold">Why this type. </span>
                                {n.why}
                            </div>
                            <div className="pt-3 border-t border-white/10">
                                <span className="text-[#ff3b30] font-semibold font-mono text-xs uppercase tracking-wider">
                                    Revision ·{" "}
                                </span>
                                {n.iter}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
