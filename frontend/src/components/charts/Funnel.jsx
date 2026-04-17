import { motion } from "framer-motion";
import { useInView } from "../../lib/hooks";
import { COLORS } from "../../lib/constants";

/* Cleaning funnel/waterfall: shows rows retained at each step.
   steps: [{ step, rows, note }]
*/
export default function Funnel({ steps, width = 720, dataTestId }) {
    const [ref, inView] = useInView({ threshold: 0.2 });
    const max = Math.max(...steps.map((s) => s.rows));
    const rowHeight = 84;
    const barH = 14;
    const headerGap = 36;
    const height = steps.length * rowHeight + 20;
    const padLeft = 12;
    const padRight = 140;
    const innerW = width - padLeft - padRight;

    return (
        <div ref={ref} className="relative" data-testid={dataTestId}>
            <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
                <defs>
                    <pattern id="dropPattern" width="6" height="6" patternUnits="userSpaceOnUse">
                        <path d="M0 6 L6 0" stroke="#ff3b30" strokeWidth="1" opacity="0.45" />
                    </pattern>
                </defs>
                {steps.map((s, i) => {
                    const isLast = i === steps.length - 1;
                    const w = (s.rows / max) * innerW;
                    const y = 10 + i * rowHeight;
                    const labelY = y + 14;
                    const noteY = y + 30;
                    const barY = y + headerGap;
                    const prev = i > 0 ? steps[i - 1].rows : steps[0].rows;
                    const drop = Math.max(0, prev - s.rows);
                    const dropPct = i > 0 && prev ? ((drop / prev) * 100).toFixed(1) : null;
                    const dropLabel = dropPct ? `−${drop.toLocaleString()} (${dropPct}%)` : null;
                    return (
                        <g key={s.step}>
                            <text
                                x={padLeft}
                                y={labelY}
                                fill={isLast ? COLORS.signal : "#fff"}
                                fontFamily="Barlow Condensed"
                                fontWeight="800"
                                fontSize="15"
                                letterSpacing="1.5"
                            >
                                {s.step.toUpperCase()}
                            </text>
                            <text
                                x={padLeft}
                                y={noteY}
                                fill={COLORS.fg1}
                                fontFamily="IBM Plex Mono"
                                fontSize="10"
                            >
                                {s.note.length > 72 ? s.note.slice(0, 70) + "…" : s.note}
                            </text>
                            {/* ghost bar */}
                            <rect
                                x={padLeft}
                                y={barY}
                                width={innerW}
                                height={barH}
                                fill={COLORS.bg2}
                                opacity="0.4"
                            />
                            {/* main bar */}
                            <motion.rect
                                x={padLeft}
                                y={barY}
                                height={barH}
                                fill={isLast ? COLORS.signal : COLORS.volt}
                                initial={{ width: 0 }}
                                animate={{ width: inView ? w : 0 }}
                                transition={{ duration: 0.85, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                            />
                            {/* drop portion */}
                            {i > 0 && (
                                <motion.rect
                                    x={padLeft + w}
                                    y={barY}
                                    height={barH}
                                    fill="url(#dropPattern)"
                                    initial={{ width: 0 }}
                                    animate={{ width: inView ? ((drop / max) * innerW) : 0 }}
                                    transition={{ duration: 0.7, delay: i * 0.18 + 0.25 }}
                                />
                            )}
                            {/* rows count */}
                            <motion.text
                                x={width - padRight + 12}
                                y={barY + barH - 1}
                                fill="#fff"
                                fontFamily="Barlow Condensed"
                                fontWeight="900"
                                fontSize="22"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: inView ? 1 : 0 }}
                                transition={{ delay: i * 0.18 + 0.6 }}
                            >
                                {s.rows.toLocaleString()}
                            </motion.text>
                            {dropLabel && (
                                <motion.text
                                    x={width - padRight + 12}
                                    y={barY - 4}
                                    fill={COLORS.blaze}
                                    fontFamily="IBM Plex Mono"
                                    fontSize="10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: inView ? 1 : 0 }}
                                    transition={{ delay: i * 0.18 + 0.7 }}
                                >
                                    {dropLabel}
                                </motion.text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
