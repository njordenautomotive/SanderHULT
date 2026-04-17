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

export const AnswerBlock = ({ children, live = false, testId = "answer-block" }) => (
    <div
        className="mt-10 p-6 md:p-8 bg-gradient-to-r from-[#ffcc00]/15 via-[#ffcc00]/5 to-transparent border border-[#ffcc00]/40"
        data-testid={testId}
    >
        <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-[#ffcc00] inline-block" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ffcc00]">
                The answer
            </span>
            {live && (
                <span
                    className="ml-2 text-[9px] font-mono uppercase tracking-[0.25em] text-[#0a0a0a] bg-[#ffcc00] px-1.5 py-[2px]"
                    data-testid="answer-live-tag"
                >
                    ● Live
                </span>
            )}
        </div>
        <div className="font-sub text-white text-lg md:text-xl leading-relaxed">
            {children}
        </div>
    </div>
);
