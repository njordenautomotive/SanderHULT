import { useMemo, useState } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { useInView } from "../../lib/hooks";
import { COLORS } from "../../lib/constants";

/*
  Horizontal bar chart.
  data: [{ label, value, sub?, color? }]
*/
export default function BarChart({
    data,
    width = 640,
    barHeight = 22,
    gap = 6,
    padding = { top: 16, right: 80, bottom: 16, left: 160 },
    valueFormat = (v) => v.toFixed(2),
    highlightIndex = null,
    defaultColor = COLORS.volt,
    xLabel,
    dataTestId,
}) {
    const height = padding.top + padding.bottom + data.length * (barHeight + gap);
    const x = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain([0, d3.max(data, (d) => d.value) * 1.08])
                .range([padding.left, width - padding.right]),
        [data, width, padding.left, padding.right]
    );
    const [ref, inView] = useInView({ threshold: 0.25 });
    const [hover, setHover] = useState(null);

    const ticks = x.ticks(5);

    const hovered = hover !== null ? data[hover] : null;
    const hoveredY = hover !== null ? padding.top + hover * (barHeight + gap) + barHeight / 2 : 0;

    return (
        <div ref={ref} className="relative" data-testid={dataTestId}>
            <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="block">
                {ticks.map((t, i) => (
                    <g key={i}>
                        <line
                            x1={x(t)}
                            x2={x(t)}
                            y1={padding.top - 4}
                            y2={height - padding.bottom}
                            className="tick-line"
                        />
                        <text
                            x={x(t)}
                            y={height - padding.bottom + 14}
                            textAnchor="middle"
                            fill={COLORS.fg2}
                            fontSize="10"
                            fontFamily="IBM Plex Mono"
                        >
                            {valueFormat(t)}
                        </text>
                    </g>
                ))}
                {data.map((d, i) => {
                    const y = padding.top + i * (barHeight + gap);
                    const isHover = hover === i;
                    const isHl = highlightIndex === i;
                    const color = d.color || defaultColor;
                    return (
                        <g
                            key={`${d.label}-${i}`}
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(null)}
                            style={{ cursor: "pointer" }}
                        >
                            <text
                                x={padding.left - 10}
                                y={y + barHeight / 2 + 4}
                                textAnchor="end"
                                fill={isHover || isHl ? COLORS.fg0 : COLORS.fg1}
                                fontSize="12"
                                fontFamily="IBM Plex Sans"
                                fontWeight={isHl ? 700 : 500}
                            >
                                {d.label}
                            </text>
                            <rect
                                x={padding.left}
                                y={y}
                                width={x(x.domain()[1]) - padding.left}
                                height={barHeight}
                                fill={COLORS.bg1}
                                opacity={0.4}
                            />
                            <motion.rect
                                x={padding.left}
                                y={y}
                                height={barHeight}
                                fill={isHover || isHl ? COLORS.signal : color}
                                initial={{ width: 0 }}
                                animate={{
                                    width: inView ? x(d.value) - padding.left : 0,
                                }}
                                transition={{
                                    duration: 0.9,
                                    delay: 0.04 * i,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            />
                            <motion.text
                                x={padding.left + 8}
                                y={y + barHeight / 2 + 4}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: inView ? 1 : 0 }}
                                transition={{ delay: 0.04 * i + 0.3 }}
                                fill={COLORS.bg0}
                                fontSize="11"
                                fontWeight="700"
                                fontFamily="IBM Plex Mono"
                            >
                                {valueFormat(d.value)}
                            </motion.text>
                            {d.sub && (
                                <motion.text
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: inView ? 0.8 : 0 }}
                                    transition={{ delay: 0.04 * i + 0.4 }}
                                    x={x(d.value) + 6}
                                    y={y + barHeight / 2 + 4}
                                    fill={COLORS.fg2}
                                    fontSize="10"
                                    fontFamily="IBM Plex Mono"
                                >
                                    {d.sub}
                                </motion.text>
                            )}
                        </g>
                    );
                })}
            </svg>
            {hovered?.tooltip && (
                <div
                    className="absolute z-20 pointer-events-none bg-[#121215] border border-white/25 p-3 shadow-2xl min-w-[200px]"
                    style={{
                        left: `${(padding.left / width) * 100}%`,
                        top: `${(hoveredY / height) * 100}%`,
                        transform: "translate(8px, -110%)",
                    }}
                    data-testid="bar-tooltip"
                >
                    {hovered.tooltip}
                </div>
            )}
            {xLabel && (
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717a] mt-1 text-center">
                    {xLabel}
                </div>
            )}
        </div>
    );
}
