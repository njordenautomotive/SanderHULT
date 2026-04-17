import { motion } from "framer-motion";
import { COLORS } from "../lib/constants";

export default function SectionHeader({ eyebrow, title, kicker, id }) {
    return (
        <div id={id} className="mb-12 md:mb-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-3"
            >
                <span className="w-10 h-[2px] bg-[#ffcc00] inline-block" />
                <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                    {eyebrow}
                </span>
            </motion.div>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[0.9] tracking-tight text-white max-w-4xl"
            >
                {title}
            </motion.h2>
            {kicker && (
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-5 text-base sm:text-lg text-[#a1a1aa] leading-relaxed max-w-3xl"
                >
                    {kicker}
                </motion.p>
            )}
        </div>
    );
}
