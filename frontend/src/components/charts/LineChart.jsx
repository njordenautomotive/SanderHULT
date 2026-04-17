import { useMemo, useState } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { useInView } from "../../lib/hooks";
import { COLORS } from "../../lib/constants";

/* LineChart - multiple series across x values
   series: [{ name, color, points: [{x, y}] }]
*/
export default function LineChart({
    series,
    width = 640,
    height = 360,
    padding = { top: 30, right: 110, bottom: 40, left: 50 },
    xFormat = (v) => v,
    yFormat = (v) => v.toFixed(2),
    xLabel,
    yLabel,
    dataTestId,
}) {
    const [ref, inView] = useInView({ threshold: 0.25 });
    const [hover, setHover] = useState(null);

    const allX = useMemo(
        () => Array.from(new Set(series.flatMap((s) => s.points.map((p) => p.x)))).sort(),
        [series]
    );
    const x = useMemo(
        () => d3.scalePoint().domain(allX).range([padding.left, width - padding.right]).padding(0.5),
        [allX, width, padding.left, padding.right]
    );
    const maxY = d3.max(series.flatMap((s) => s.points.map((p) => p.y)));
    const y = useMemo(
        () => d3.scaleLinear().domain([0, maxY * 1.1]).range([height - padding.bottom, padding.top]),
        [maxY, height, padding.top, padding.bottom]
    );
    const yTicks = y.ticks(5);

    const line = d3
        .line()
        .x((p) => x(p.x))
        .y((p) => y(p.y))
        .curve(d3.curveMonotoneX);

    return (
        <div ref={ref} className="relative" data-testid={dataTestId}>
            <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="block">
                {yTicks.map((t, i) => (
                    <g key={i}>
                        <line x1={padding.left} x2={width - padding.right} y1={y(t)} y2={y(t)} className="tick-line" />
                        <text
                            x={padding.left - 8}
                            y={y(t) + 3}
                            textAnchor="end"
                            fill={COLORS.fg2}
                            fontSize="10"
                            fontFamily="IBM Plex Mono"
                        >
                            {yFormat(t)}
                        </text>
                    </g>
                ))}
                {allX.map((v) => (
                    <text
                        key={v}
                        x={x(v)}
                        y={height - padding.bottom + 16}
                        textAnchor="middle"
                        fill={COLORS.fg2}
                        fontSize="10"
                        fontFamily="IBM Plex Mono"
                    >
                        {xFormat(v)}
                    </text>
                ))}
                {yLabel && (
                    <text
                        transform={`translate(12,${height / 2}) rotate(-90)`}
                        textAnchor="middle"
                        fill={COLORS.fg2}
                        fontSize="10"
                        fontFamily="IBM Plex Mono"
                        letterSpacing="2"
                    >
                        {yLabel}
                    </text>
                )}
                {xLabel && (
                    <text
                        x={width / 2}
                        y={height - 6}
                        textAnchor="middle"
                        fill={COLORS.fg2}
                        fontSize="10"
                        fontFamily="IBM Plex Mono"
                        letterSpacing="2"
                    >
                        {xLabel}
                    </text>
                )}

                {series.map((s, si) => {
                    const path = line(s.points);
                    const isDim = hover && hover !== s.name;
                    return (
                        <g key={s.name} opacity={isDim ? 0.18 : 1}>
                            <motion.path
                                d={path}
                                fill="none"
                                stroke={s.color}
                                strokeWidth={hover === s.name ? 3 : 2}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: inView ? 1 : 0 }}
                                transition={{ duration: 1.1, delay: 0.1 * si, ease: "easeOut" }}
                            />
                            {s.points.map((p, i) => (
                                <motion.circle
                                    key={i}
                                    cx={x(p.x)}
                                    cy={y(p.y)}
                                    r={3.5}
                                    fill={s.color}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
                                    transition={{ delay: 0.1 * si + 0.2 + i * 0.08 }}
                                />
                            ))}
                            <text
                                x={x(s.points[s.points.length - 1].x) + 8}
                                y={y(s.points[s.points.length - 1].y) + 4}
                                fill={s.color}
                                fontSize="11"
                                fontFamily="Chivo"
                                fontWeight="700"
                                style={{ cursor: "pointer" }}
                                onMouseEnter={() => setHover(s.name)}
                                onMouseLeave={() => setHover(null)}
                            >
                                {s.name}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
