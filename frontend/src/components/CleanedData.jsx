import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { dataset } from "../lib/data";

const COLS = [
    { key: "season", label: "Season" },
    { key: "player", label: "Player" },
    { key: "position", label: "Pos" },
    { key: "team", label: "Team" },
    { key: "conference", label: "Conf" },
    { key: "usage", label: "Usage", fmt: (v) => v.toFixed(3), num: true },
    {
        key: "share",
        label: "Share %",
        fmt: (v) => `${v.toFixed(1)}%`,
        num: true,
    },
    { key: "rank", label: "Rank", num: true },
    {
        key: "top_player_share",
        label: "Top Plr %",
        fmt: (v) => `${v.toFixed(1)}%`,
        num: true,
    },
    {
        key: "top3_share",
        label: "Top 3 %",
        fmt: (v) => `${v.toFixed(1)}%`,
        num: true,
    },
];

export default function CleanedData() {
    const [query, setQuery] = useState("");
    const [sortKey, setSortKey] = useState("usage");
    const [sortDir, setSortDir] = useState("desc");
    const [page, setPage] = useState(0);
    const pageSize = 50;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let rows = dataset.raw;
        if (q) {
            rows = rows.filter((r) =>
                `${r.player} ${r.team} ${r.position} ${r.conference} ${r.season}`
                    .toLowerCase()
                    .includes(q)
            );
        }
        rows = [...rows].sort((a, b) => {
            const va = a[sortKey];
            const vb = b[sortKey];
            if (va === vb) return 0;
            const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
            return sortDir === "asc" ? cmp : -cmp;
        });
        return rows;
    }, [query, sortKey, sortDir]);

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const pageRows = filtered.slice(page * pageSize, page * pageSize + pageSize);

    const setSort = (k) => {
        if (sortKey === k) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(k);
            setSortDir(COLS.find((c) => c.key === k)?.num ? "desc" : "asc");
        }
    };

    return (
        <div className="App grain bg-[#0a0a0a] text-white min-h-screen">
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between gap-6">
                    <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
                        <span className="w-2 h-2 bg-[#ffcc00] inline-block" />
                        <span className="font-heading text-sm font-black uppercase tracking-widest">
                            Concentration / Equation
                        </span>
                    </Link>
                    <Link
                        to="/"
                        data-testid="back-to-story"
                        className="text-[10px] font-mono uppercase tracking-widest text-white border border-white/25 px-3 py-1.5 hover:bg-white hover:text-black transition-colors"
                    >
                        ← Back to Story
                    </Link>
                </div>
            </header>

            <main className="relative z-[2] pt-24 pb-20 px-4 sm:px-6 lg:px-10 max-w-[1500px] mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="w-10 h-[2px] bg-[#ffcc00] inline-block" />
                        <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                            Appendix · Cleaned Dataset
                        </span>
                    </div>
                    <h1
                        className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[0.9] tracking-tight text-white"
                        data-testid="cleaned-data-title"
                    >
                        The data, nothing hidden.
                    </h1>
                    <p className="mt-5 text-base sm:text-lg text-[#a1a1aa] leading-relaxed max-w-3xl font-sub">
                        Every row that made it through the cleaning funnel — {dataset.summary.total_rows.toLocaleString()} player-seasons
                        across {dataset.summary.teams} Power Five teams, 2021–2023. Search, sort,
                        page through, or download the CSV directly.
                    </p>
                </div>

                <div
                    className="sticky top-14 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-y border-white/10 py-3 flex flex-wrap items-center gap-3 mb-6"
                    data-testid="cleaned-data-toolbar"
                >
                    <input
                        type="text"
                        placeholder="Search player / team / conference…"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(0);
                        }}
                        className="flex-1 min-w-[240px] bg-[#0a0a0a] border border-white/15 text-white text-sm px-4 py-2 focus:border-[#ffcc00] focus:outline-none transition-colors font-mono"
                        data-testid="cleaned-data-search"
                    />
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                        {total.toLocaleString()} rows
                    </div>
                    <a
                        href="/cleaned-data.csv"
                        download
                        data-testid="cleaned-data-download"
                        className="text-[10px] font-mono uppercase tracking-[0.3em] text-black bg-[#ffcc00] px-3 py-2 hover:bg-white transition-colors"
                    >
                        ↓ Download CSV
                    </a>
                </div>

                <div className="overflow-x-auto border border-white/10 bg-[#121215]">
                    <table className="w-full text-sm" data-testid="cleaned-data-table">
                        <thead>
                            <tr className="border-b border-white/10 bg-[#0a0a0a]">
                                {COLS.map((c) => {
                                    const active = sortKey === c.key;
                                    return (
                                        <th
                                            key={c.key}
                                            onClick={() => setSort(c.key)}
                                            className={`px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] cursor-pointer select-none whitespace-nowrap ${
                                                c.num ? "text-right" : "text-left"
                                            } ${active ? "text-[#ffcc00]" : "text-[#a1a1aa]"} hover:text-white`}
                                        >
                                            {c.label}
                                            {active && (
                                                <span className="ml-1">
                                                    {sortDir === "asc" ? "↑" : "↓"}
                                                </span>
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.map((r, i) => (
                                <tr
                                    key={`${r.player}-${r.team}-${r.season}-${i}`}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    {COLS.map((c) => (
                                        <td
                                            key={c.key}
                                            className={`px-4 py-2.5 whitespace-nowrap ${
                                                c.num ? "text-right font-mono" : "text-left"
                                            } ${c.key === "player" ? "font-semibold text-white" : "text-[#d4d4d8]"}`}
                                        >
                                            {c.fmt ? c.fmt(r[c.key]) : r[c.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {pageRows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={COLS.length}
                                        className="px-4 py-20 text-center text-[#71717a] text-sm font-mono"
                                    >
                                        No rows match your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 text-xs font-mono text-[#a1a1aa]">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#71717a]">
                        Page {page + 1} / {pages} · showing{" "}
                        {pageRows.length ? page * pageSize + 1 : 0}–
                        {page * pageSize + pageRows.length} of {total.toLocaleString()}
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            className="px-3 py-1.5 border border-white/15 text-[10px] uppercase tracking-[0.25em] hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white transition-colors"
                            data-testid="cleaned-data-prev"
                        >
                            ← Prev
                        </button>
                        <button
                            disabled={page + 1 >= pages}
                            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                            className="px-3 py-1.5 border border-white/15 text-[10px] uppercase tracking-[0.25em] hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white transition-colors"
                            data-testid="cleaned-data-next"
                        >
                            Next →
                        </button>
                    </div>
                </div>

                <div className="mt-8 p-5 bg-[#121215] border border-white/10 text-xs text-[#a1a1aa] font-mono leading-relaxed">
                    Columns · season, player, position, team, conference,
                    Usage_Overall, Player_Usage_Share, Rank_Within_Team,
                    Top_Player_Share, Top_3_Share. This is the same file used
                    throughout the visualizations — no aggregation, no interpolation.
                </div>
            </main>
        </div>
    );
}
