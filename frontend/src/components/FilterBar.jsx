import { useFilters } from "../lib/filters";

const selectCls =
    "w-full bg-[#0a0a0a] border border-white/15 text-white text-xs font-mono uppercase tracking-widest px-3 py-2 hover:border-white/40 focus:border-[#ffcc00] focus:outline-none transition-colors cursor-pointer";

const labelCls =
    "text-[10px] font-mono uppercase tracking-[0.25em] text-[#71717a] mb-1.5 block";

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

            <div>
                <label className={labelCls} htmlFor="filter-season-select">
                    Season
                </label>
                <select
                    id="filter-season-select"
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
                <label className={labelCls} htmlFor="filter-conference-select">
                    Conference
                </label>
                <select
                    id="filter-conference-select"
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
                <label className={labelCls} htmlFor="filter-team-select">
                    Team
                </label>
                <select
                    id="filter-team-select"
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
        </aside>
    );
}
