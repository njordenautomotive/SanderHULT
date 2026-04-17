export const WhyCallout = ({ children, color = "#ffcc00" }) => (
    <div
        className="mb-8 p-5 border-l-4 bg-[#121215]"
        style={{ borderLeftColor: color }}
        data-testid="why-callout"
    >
        <div
            className="text-[10px] font-mono uppercase tracking-[0.3em] mb-1.5"
            style={{ color }}
        >
            Why we ask this
        </div>
        <p className="font-sub text-white text-base leading-relaxed">{children}</p>
    </div>
);

export const WhyBadge = ({ children, color = "#007aff" }) => (
    <div
        className="flex items-start gap-2 text-xs text-[#a1a1aa] leading-relaxed mb-3"
        data-testid="why-badge"
    >
        <span
            className="inline-block flex-shrink-0 text-[9px] font-mono uppercase tracking-[0.25em] px-1.5 py-[3px] border"
            style={{ color, borderColor: `${color}66` }}
        >
            Why
        </span>
        <span className="font-sub">{children}</span>
    </div>
);
