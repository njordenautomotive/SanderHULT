import { useEffect, useRef, useState } from "react";
import { useFilters } from "../lib/filters";

const selectCls =
    "w-full bg-[#0a0a0a] border border-white/15 text-white text-xs font-mono uppercase tracking-widest px-3 py-2 hover:border-white/40 focus:border-[#ffcc00] focus:outline-none transition-colors cursor-pointer";

const labelCls =
    "text-[10px] font-mono uppercase tracking-[0.25em] text-[#71717a] mb-1.5 block";

function FilterFields({ scope }) {
    const {
        season,
        conference,
        team,
        setSeason,
        setConference,
        setTeam,
        seasons,
        conferences,
        filteredTeams,
        clearAll,
        isActive,
    } = useFilters();

    const seasonId = `filter-season-${scope}`;
    const confId = `filter-conference-${scope}`;
    const teamId = `filter-team-${scope}`;

    return (
        <>
            <div>
                <label className={labelCls} htmlFor={seasonId}>
                    Season
                </label>
                <select
                    id={seasonId}
                    data-testid="filter-season"
                    className={selectCls}
                    value={season}
                    onChange={(e) =>
                        setSeason(
                            e.target.value === "all" ? "all" : Number(e.target.value)
                        )
                    }
                >
                    <option value="all">All</option>
                    {seasons.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className={labelCls} htmlFor={confId}>
                    Conference
                </label>
                <select
                    id={confId}
                    data-testid="filter-conference"
                    className={selectCls}
                    value={conference}
                    onChange={(e) => {
                        setConference(e.target.value);
                        if (team) setTeam(null);
                    }}
                >
                    <option value="all">All Power Five</option>
                    {conferences.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className={labelCls} htmlFor={teamId}>
                    Team
                </label>
                <select
                    id={teamId}
                    data-testid="filter-team"
                    className={selectCls}
                    value={team || ""}
                    onChange={(e) => setTeam(e.target.value || null)}
                >
                    <option value="">None</option>
                    {filteredTeams.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                {isActive ? (
                    <button
                        onClick={clearAll}
                        data-testid="filter-clear"
                        className="text-[10px] font-mono uppercase tracking-[0.3em] text-white border border-white/20 px-3 py-2 hover:bg-white hover:text-black transition-colors"
                    >
                        Clear ×
                    </button>
                ) : null}
                <div
                    className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#71717a]"
                    data-testid="filter-status"
                >
                    {isActive ? "· filters active" : "· showing all data"}
                </div>
            </div>
        </>
    );
}

export default function FilterBar() {
    const { isActive } = useFilters();
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);

    // close on outside click / Escape
    useEffect(() => {
        const onClick = (e) => {
            if (!open) return;
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <>
            {/* Desktop sidebar (xl and up) */}
            <aside
                data-testid="filter-bar"
                className="hidden xl:flex fixed left-4 2xl:left-8 top-20 w-[188px] z-40 flex-col gap-4 p-4 bg-[#0a0a0a]/85 backdrop-blur-xl border border-white/10"
            >
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#ffcc00] inline-block" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ffcc00]">
                        Filters
                    </span>
                </div>
                <FilterFields scope="desktop" />
            </aside>

            {/* Mobile / tablet: floating toggle button + dropdown panel */}
            <div className="xl:hidden fixed top-2.5 right-3 z-[60]" ref={panelRef}>
                <button
                    data-testid="filter-toggle"
                    aria-label="Toggle filters"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                    className={`relative flex items-center gap-2 px-3 py-2 border border-white/25 text-[10px] font-mono uppercase tracking-[0.3em] transition-colors ${
                        open
                            ? "bg-[#ffcc00] text-black border-[#ffcc00]"
                            : "bg-[#0a0a0a]/90 backdrop-blur text-white hover:border-white/50"
                    }`}
                >
                    <span className="flex flex-col gap-[3px]">
                        <span className={`block w-3.5 h-px ${open ? "bg-black" : "bg-white"}`} />
                        <span className={`block w-2.5 h-px ml-1 ${open ? "bg-black" : "bg-white"}`} />
                        <span className={`block w-1.5 h-px ml-2 ${open ? "bg-black" : "bg-white"}`} />
                    </span>
                    <span>Filters</span>
                    {isActive && !open && (
                        <span className="w-1.5 h-1.5 bg-[#ffcc00] inline-block" aria-hidden />
                    )}
                </button>

                {open && (
                    <div
                        data-testid="filter-panel-mobile"
                        className="absolute right-0 mt-2 w-[260px] p-4 flex flex-col gap-4 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-[#ffcc00] inline-block" />
                                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ffcc00]">
                                    Filters
                                </span>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Close filters"
                                className="text-[#71717a] hover:text-white text-lg leading-none"
                            >
                                ×
                            </button>
                        </div>
                        <FilterFields scope="mobile" />
                    </div>
                )}
            </div>
        </>
    );
}
