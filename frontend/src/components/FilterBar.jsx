import { useFilters } from "../lib/filters";

const selectCls =
    "bg-[#0a0a0a] border border-white/15 text-white text-xs font-mono uppercase tracking-widest px-3 py-2 hover:border-white/40 focus:border-[#ffcc00] focus:outline-none transition-colors cursor-pointer";

const labelCls = "text-[10px] font-mono uppercase tracking-[0.25em] text-[#71717a] mr-2";

export default function FilterBar() {
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

    return (
        <div
            className="sticky top-14 z-40 bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-white/10"
            data-testid="filter-bar"
        >
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#ffcc00] inline-block" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ffcc00]">
                        Filters
                    </span>
                </div>
                <div className="flex items-center">
                    <span className={labelCls}>Season</span>
                    <select
                        data-testid="filter-season"
                        className={selectCls}
                        value={season}
                        onChange={(e) =>
                            setSeason(
                                e.target.value === "all"
                                    ? "all"
                                    : Number(e.target.value)
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
                <div className="flex items-center">
                    <span className={labelCls}>Conference</span>
                    <select
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
                <div className="flex items-center">
                    <span className={labelCls}>Team</span>
                    <select
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
                <div className="flex-1" />
                {isActive && (
                    <button
                        onClick={clearAll}
                        data-testid="filter-clear"
                        className="text-[10px] font-mono uppercase tracking-[0.3em] text-white border border-white/20 px-3 py-2 hover:bg-white hover:text-black transition-colors"
                    >
                        Clear ×
                    </button>
                )}
                <div
                    className="hidden md:flex items-center text-[10px] font-mono uppercase tracking-[0.25em] text-[#71717a]"
                    data-testid="filter-status"
                >
                    {isActive ? "Filters active" : "Showing all data"}
                </div>
            </div>
        </div>
    );
}
