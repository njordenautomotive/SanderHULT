import { useMemo, useState } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { useInView } from "../../lib/hooks";
import { COLORS, CONFERENCE_COLORS } from "../../lib/constants";

/* Scatter plot
   points: [{ x, y, team, season, conference, archetype?, color? }]
*/
export default function Scatter({
    points,
    width = 720,
    height = 480,
    padding = { top: 30, right: 30, bottom: 60, left: 60 },
    xLabel = "TOP PLAYER SHARE (%)",
    yLabel = "TEAM WIN %",
    xDomain,
    yDomain,
    xFormat = (v) => `${v}%`,
    yFormat = (v) => `${Math.round(v * 100)}%`,
    colorBy = "conference",
    showTrend = true,
    quadrants = null, // { xMid, yMid }
    highlightTeam = null,
    dataTestId,
}) {
    const [ref, inView] = useInView({ threshold: 0.2 });
    const [hover, setHover] = useState(null);

    const x = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain(xDomain || d3.extent(points, (d) => d.x))
                .nice()
                .range([padding.left, width - padding.right]),
        [points, xDomain, padding.left, padding.right, width]
    );
    const y = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain(yDomain || d3.extent(points, (d) => d.y))
                .nice()
                .range([height - padding.bottom, padding.top]),
        [points, yDomain, padding.top, padding.bottom, height]
    );

    const xTicks = x.ticks(6);
    const yTicks = y.ticks(5);

    // linear regression
    const trend = useMemo(() => {
        if (!showTrend || points.length < 3) return null;
        const xs = points.map((p) => p.x);
        const ys = points.map((p) => p.y);
        const mx = d3.mean(xs);
        const my = d3.mean(ys);
        const num = d3.sum(points, (p) => (p.x - mx) * (p.y - my));
        const den = d3.sum(points, (p) => (p.x - mx) ** 2);
        const slope = den ? num / den : 0;
        const intercept = my - slope * mx;
        const x1v = x.domain()[0];
        const x2v = x.domain()[1];
        // r
        const sx = Math.sqrt(d3.sum(points, (p) => (p.x - mx) ** 2));
        const sy = Math.sqrt(d3.sum(points, (p) => (p.y - my) ** 2));
        const r = sx && sy ? num / (sx * sy) : 0;
        return {
            x1: x1v,
            x2: x2v,
            y1: slope * x1v + intercept,
            y2: slope * x2v + intercept,
            r,
            slope,
        };
    }, [points, x, showTrend]);

    return (
        <div ref={ref} className="relative" data-testid={dataTestId}>
            <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="block">
                {/* quadrants */}
                {quadrants && (
                    <>
                        <line
                            x1={x(quadrants.xMid)}
                            x2={x(quadrants.xMid)}
                            y1={padding.top}
                            y2={height - padding.bottom}
                            stroke={COLORS.fg2}
                            strokeDasharray="4 4"
                            opacity="0.4"
                        />
                        <line
                            x1={padding.left}
                            x2={width - padding.right}
                            y1={y(quadrants.yMid)}
                            y2={y(quadrants.yMid)}
                            stroke={COLORS.fg2}
                            strokeDasharray="4 4"
                            opacity="0.4"
                        />
                    </>
                )}
                {yTicks.map((t, i) => (
                    <g key={`y${i}`}>
                        <line x1={padding.left} x2={width - padding.right} y1={y(t)} y2={y(t)} className="tick-line" />
                        <text
                            x={padding.left - 10}
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
                {xTicks.map((t, i) => (
                    <g key={`x${i}`}>
                        <text
                            x={x(t)}
                            y={height - padding.bottom + 16}
                            textAnchor="middle"
                            fill={COLORS.fg2}
                            fontSize="10"
                            fontFamily="IBM Plex Mono"
                        >
                            {xFormat(t)}
                        </text>
                    </g>
                ))}
                <text
                    x={width / 2}
                    y={height - 10}
                    textAnchor="middle"
                    fill={COLORS.fg2}
                    fontSize="10"
                    fontFamily="IBM Plex Mono"
                    letterSpacing="2"
                >
                    {xLabel}
                </text>
                <text
                    transform={`translate(14, ${height / 2}) rotate(-90)`}
                    textAnchor="middle"
                    fill={COLORS.fg2}
                    fontSize="10"
                    fontFamily="IBM Plex Mono"
                    letterSpacing="2"
                >
                    {yLabel}
                </text>

                {trend && (
                    <motion.line
                        x1={x(trend.x1)}
                        y1={y(trend.y1)}
                        x2={x(trend.x2)}
                        y2={y(trend.y2)}
                        stroke={COLORS.signal}
                        strokeWidth="2"
                        strokeDasharray="6 4"
                        opacity="0.7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: inView ? 1 : 0 }}
                        transition={{ duration: 1.4, delay: 0.6 }}
                    />
                )}

                {points.map((p, i) => {
                    const c = p.color || CONFERENCE_COLORS[p[colorBy]] || COLORS.volt;
                    const isHover = hover?.idx === i;
                    const isHighlight = highlightTeam && p.team === highlightTeam;
                    const isDimmed = highlightTeam && !isHighlight && !isHover;
                    return (
                        <motion.circle
                            key={`${p.team}-${p.season}-${i}`}
                            cx={x(p.x)}
                            cy={y(p.y)}
                            fill={isHighlight ? COLORS.signal : c}
                            stroke={isHover || isHighlight ? "#fff" : "none"}
                            strokeWidth={isHover ? 2 : isHighlight ? 2 : 0}
                            initial={{ r: 0, opacity: 0 }}
                            animate={
                                inView
                                    ? {
                                          r: isHover ? 9 : isHighlight ? 8 : 5.5,
                                          opacity: isDimmed
                                              ? 0.15
                                              : hover && !isHover
                                                ? 0.25
                                                : isHighlight
                                                  ? 1
                                                  : 0.85,
                                      }
                                    : { r: 0, opacity: 0 }
                            }
                            transition={{ duration: 0.6, delay: 0.02 * i }}
                            onMouseEnter={() => setHover({ idx: i, p })}
                            onMouseLeave={() => setHover(null)}
                            style={{ cursor: "pointer" }}
                        />
                    );
                })}

                {trend && (
                    <text
                        x={width - padding.right - 4}
                        y={padding.top + 4}
                        textAnchor="end"
                        fill={COLORS.signal}
                        fontSize="11"
                        fontFamily="IBM Plex Mono"
                    >
                        {`r = ${trend.r.toFixed(2)}`}
                    </text>
                )}
            </svg>

            {hover && (
                <div
                    className="absolute z-20 pointer-events-none bg-[#121215] border border-white/25 p-3 shadow-2xl"
                    style={{
                        left: `min(${(x(hover.p.x) / width) * 100}%, 75%)`,
                        top: `${(y(hover.p.y) / height) * 100}%`,
                        transform: "translate(12px, -50%)",
                    }}
                >
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a]">
                        {hover.p.conference} · {hover.p.season}
                    </div>
                    <div className="text-lg font-heading font-bold text-white uppercase leading-tight">
                        {hover.p.team}
                    </div>
                    <div className="mt-1 text-sm font-mono text-white">
                        <span className="text-[#ffcc00]">{xFormat(hover.p.x)}</span> ·{" "}
                        <span className="text-[#007aff]">{yFormat(hover.p.y)}</span>
                    </div>
                    {hover.p.archetype && (
                        <div className="mt-1 text-[11px] font-mono text-[#a1a1aa]">{hover.p.archetype}</div>
                    )}
                </div>
            )}
        </div>
    );
}
