import { useMemo } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { useInView } from "../../lib/hooks";
import { COLORS } from "../../lib/constants";

/* Grouped/stacked histogram
   series: [{ label, color, bins: [{bin, count}] }]
   categories: ["0-5%", ...]
*/
export default function Histogram({
    series,
    categories,
    width = 720,
    height = 320,
    padding = { top: 24, right: 20, bottom: 50, left: 56 },
    valueFormat = (v) => v,
    mode = "grouped", // or "stacked"
    yLabel = "COUNT",
    dataTestId,
}) {
    const [ref, inView] = useInView({ threshold: 0.25 });
    const x0 = useMemo(
        () => d3.scaleBand().domain(categories).range([padding.left, width - padding.right]).padding(0.22),
        [categories, width, padding.left, padding.right]
    );
    const x1 = useMemo(
        () => d3.scaleBand().domain(series.map((s) => s.label)).range([0, x0.bandwidth()]).padding(0.08),
        [series, x0]
    );

    const maxVal = useMemo(() => {
        if (mode === "stacked") {
            return d3.max(categories, (c) =>
                d3.sum(series, (s) => s.bins.find((b) => b.bin === c)?.count || 0)
            );
        }
        return d3.max(series, (s) => d3.max(s.bins, (b) => b.count));
    }, [series, categories, mode]);

    const y = useMemo(
        () => d3.scaleLinear().domain([0, maxVal * 1.05]).range([height - padding.bottom, padding.top]),
        [maxVal, height, padding.top, padding.bottom]
    );
    const yTicks = y.ticks(5);

    return (
        <div ref={ref} className="relative" data-testid={dataTestId}>
            <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="block">
                {yTicks.map((t, i) => (
                    <g key={i}>
                        <line
                            x1={padding.left}
                            x2={width - padding.right}
                            y1={y(t)}
                            y2={y(t)}
                            className="tick-line"
                        />
                        <text
                            x={padding.left - 8}
                            y={y(t) + 3}
                            textAnchor="end"
                            fill={COLORS.fg2}
                            fontSize="10"
                            fontFamily="IBM Plex Mono"
                        >
                            {valueFormat(t)}
                        </text>
                    </g>
                ))}
                <text
                    x={12}
                    y={padding.top - 6}
                    fill={COLORS.fg2}
                    fontSize="10"
                    fontFamily="IBM Plex Mono"
                    letterSpacing="2"
                >
                    {yLabel}
                </text>

                {categories.map((cat) => {
                    let stackAcc = 0;
                    return (
                        <g key={cat} transform={`translate(${x0(cat)},0)`}>
                            {series.map((s, si) => {
                                const bin = s.bins.find((b) => b.bin === cat);
                                const val = bin?.count || 0;
                                if (mode === "stacked") {
                                    const y0 = y(stackAcc);
                                    const y1v = y(stackAcc + val);
                                    stackAcc += val;
                                    return (
                                        <motion.rect
                                            key={s.label}
                                            x={0}
                                            width={x0.bandwidth()}
                                            fill={s.color}
                                            initial={{ y: height - padding.bottom, height: 0 }}
                                            animate={
                                                inView
                                                    ? { y: y1v, height: y0 - y1v }
                                                    : { y: height - padding.bottom, height: 0 }
                                            }
                                            transition={{ duration: 0.8, delay: si * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                        />
                                    );
                                }
                                return (
                                    <motion.rect
                                        key={s.label}
                                        x={x1(s.label)}
                                        width={x1.bandwidth()}
                                        fill={s.color}
                                        initial={{ y: height - padding.bottom, height: 0 }}
                                        animate={
                                            inView
                                                ? { y: y(val), height: y(0) - y(val) }
                                                : { y: height - padding.bottom, height: 0 }
                                        }
                                        transition={{ duration: 0.75, delay: si * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                );
                            })}
                            <text
                                x={x0.bandwidth() / 2}
                                y={height - padding.bottom + 16}
                                textAnchor="middle"
                                fill={COLORS.fg2}
                                fontSize="10"
                                fontFamily="IBM Plex Mono"
                            >
                                {cat}
                            </text>
                        </g>
                    );
                })}
                <line
                    x1={padding.left}
                    x2={width - padding.right}
                    y1={height - padding.bottom}
                    y2={height - padding.bottom}
                    stroke={COLORS.fg2}
                    strokeOpacity="0.3"
                />
            </svg>
            <div className="flex flex-wrap gap-4 mt-2 px-2">
                {series.map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                        <span
                            className="inline-block w-3 h-3"
                            style={{ background: s.color }}
                            aria-hidden
                        />
                        <span className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa]">
                            {s.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
