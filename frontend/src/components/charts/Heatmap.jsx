import { useMemo, useState } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { useInView } from "../../lib/hooks";
import { COLORS } from "../../lib/constants";

/* Heatmap
   data: [{ row, col, value }]
   rows: [string], cols: [string]
*/
export default function Heatmap({
    data,
    rows,
    cols,
    width = 640,
    cellHeight = 46,
    padding = { top: 40, right: 20, bottom: 20, left: 100 },
    valueFormat = (v) => (v * 100).toFixed(1) + "%",
    dataTestId,
}) {
    const [ref, inView] = useInView({ threshold: 0.25 });
    const [hover, setHover] = useState(null);

    const cellWidth = (width - padding.left - padding.right) / cols.length;
    const height = padding.top + padding.bottom + rows.length * cellHeight;

    const maxVal = d3.max(data, (d) => d.value);
    const minVal = d3.min(data, (d) => d.value);
    const color = useMemo(
        () =>
            d3
                .scaleSequential()
                .domain([minVal * 0.9, maxVal])
                .interpolator(d3.interpolateRgbBasis(["#0a0a0a", "#0a2540", "#1d4e89", "#007aff", "#60a5fa", "#ffcc00"])),
        [minVal, maxVal]
    );

    return (
        <div ref={ref} className="relative" data-testid={dataTestId}>
            <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="block">
                {cols.map((c, ci) => (
                    <text
                        key={c}
                        x={padding.left + ci * cellWidth + cellWidth / 2}
                        y={padding.top - 14}
                        textAnchor="middle"
                        fill={COLORS.fg1}
                        fontSize="11"
                        fontFamily="IBM Plex Mono"
                        fontWeight="600"
                    >
                        {c}
                    </text>
                ))}
                {rows.map((r, ri) => (
                    <text
                        key={r}
                        x={padding.left - 10}
                        y={padding.top + ri * cellHeight + cellHeight / 2 + 4}
                        textAnchor="end"
                        fill={COLORS.fg1}
                        fontSize="11"
                        fontFamily="Chivo"
                        fontWeight="700"
                    >
                        {r}
                    </text>
                ))}

                {rows.map((r, ri) =>
                    cols.map((c, ci) => {
                        const cell = data.find((d) => d.row === r && d.col === c);
                        const val = cell?.value ?? 0;
                        const isHover = hover?.r === r && hover?.c === c;
                        return (
                            <g key={`${r}-${c}`}>
                                <motion.rect
                                    x={padding.left + ci * cellWidth + 2}
                                    y={padding.top + ri * cellHeight + 2}
                                    width={cellWidth - 4}
                                    height={cellHeight - 4}
                                    fill={color(val)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: inView ? (isHover ? 1 : 0.92) : 0 }}
                                    transition={{ duration: 0.5, delay: (ri * cols.length + ci) * 0.02 }}
                                    stroke={isHover ? "#ffffff" : "transparent"}
                                    strokeWidth={isHover ? 2 : 0}
                                    onMouseEnter={() => setHover({ r, c, val })}
                                    onMouseLeave={() => setHover(null)}
                                    style={{ cursor: "pointer" }}
                                />
                                <text
                                    x={padding.left + ci * cellWidth + cellWidth / 2}
                                    y={padding.top + ri * cellHeight + cellHeight / 2 + 4}
                                    textAnchor="middle"
                                    fill={val > maxVal * 0.6 ? "#0a0a0a" : "#fff"}
                                    fontSize="11"
                                    fontFamily="IBM Plex Mono"
                                    fontWeight="600"
                                    pointerEvents="none"
                                >
                                    {valueFormat(val)}
                                </text>
                            </g>
                        );
                    })
                )}
            </svg>
        </div>
    );
}
