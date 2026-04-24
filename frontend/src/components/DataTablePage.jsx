import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// Lightweight CSV parser — handles optional quoted fields and the \uFEFF BOM.
function parseCSV(text) {
    const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.length);
    if (!lines.length) return { headers: [], rows: [] };
    const splitLine = (line) => {
        const cells = [];
        let cur = "";
        let inQuote = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQuote && line[i + 1] === '"') {
                    cur += '"';
                    i++;
                } else {
                    inQuote = !inQuote;
                }
            } else if (ch === "," && !inQuote) {
                cells.push(cur);
                cur = "";
            } else {
                cur += ch;
            }
        }
        cells.push(cur);
        return cells.map((c) => c.trim());
    };
    const headers = splitLine(lines[0]);
    const rows = lines.slice(1).map((line) => {
        const cells = splitLine(line);
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = cells[i] ?? "";
        });
        return obj;
    });
    return { headers, rows };
}

const isNumericValue = (v) => v !== "" && !isNaN(parseFloat(v)) && isFinite(v);

/**
 * Generic paginated / sortable / searchable CSV table page.
 * Props:
 *   title         Large headline
 *   eyebrow       Small uppercase tag above the title
 *   accent        Hex colour for active sort + accent bars
 *   description   Lead paragraph (node)
 *   csvUrl        Public URL of the CSV to render
 *   downloadName  Suggested filename for the download button
 *   columnsNote   Optional footer note describing the columns
 *   testIdBase    Prefix for data-testid attributes
 */
export default function DataTablePage({
    title,
    eyebrow,
    accent = "#ffcc00",
    description,
    csvUrl,
    downloadName,
    columnsNote,
    testIdBase = "data-table",
}) {
    const [data, setData] = useState({ headers: [], rows: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState("desc");
    const [page, setPage] = useState(0);
    const pageSize = 50;

    useEffect(() => {
        let alive = true;
        setLoading(true);
        setError(null);
        fetch(csvUrl, { cache: "no-cache" })
            .then((r) => {
                if (!r.ok) throw new Error(`${r.status}`);
                return r.text();
            })
            .then((t) => {
                if (!alive) return;
                const parsed = parseCSV(t);
                setData(parsed);
                if (parsed.headers.length && sortKey === null) {
                    setSortKey(parsed.headers[0]);
                }
                setLoading(false);
            })
            .catch((e) => {
                if (!alive) return;
                setError(String(e));
                setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [csvUrl]); // eslint-disable-line react-hooks/exhaustive-deps

    // Detect which columns are numeric by sampling the first non-empty value.
    const numericHeaders = useMemo(() => {
        const set = new Set();
        data.headers.forEach((h) => {
            const sample = data.rows.find((r) => r[h] !== "");
            if (sample && isNumericValue(sample[h])) set.add(h);
        });
        return set;
    }, [data]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let rows = data.rows;
        if (q) {
            rows = rows.filter((r) =>
                Object.values(r).join(" ").toLowerCase().includes(q)
            );
        }
        if (sortKey) {
            rows = [...rows].sort((a, b) => {
                const va = a[sortKey];
                const vb = b[sortKey];
                let cmp;
                if (numericHeaders.has(sortKey)) {
                    cmp = (parseFloat(va) || 0) - (parseFloat(vb) || 0);
                } else {
                    cmp = String(va).localeCompare(String(vb));
                }
                return sortDir === "asc" ? cmp : -cmp;
            });
        }
        return rows;
    }, [data.rows, query, sortKey, sortDir, numericHeaders]);

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const pageRows = filtered.slice(page * pageSize, page * pageSize + pageSize);

    const setSort = (k) => {
        if (sortKey === k) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(k);
            setSortDir(numericHeaders.has(k) ? "desc" : "asc");
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
                        <span
                            className="w-10 h-[2px] inline-block"
                            style={{ background: accent }}
                        />
                        <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                            {eyebrow}
                        </span>
                    </div>
                    <h1
                        className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[0.9] tracking-tight text-white"
                        data-testid={`${testIdBase}-title`}
                    >
                        {title}
                    </h1>
                    <p className="mt-5 text-base sm:text-lg text-[#a1a1aa] leading-relaxed max-w-3xl font-sub">
                        {description}{" "}
                        {data.rows.length ? (
                            <>
                                Currently showing{" "}
                                <b className="text-white">
                                    {data.rows.length.toLocaleString()}
                                </b>{" "}
                                rows × {data.headers.length} columns ={" "}
                                <b className="text-white">
                                    {(data.rows.length * data.headers.length).toLocaleString()}
                                </b>{" "}
                                data points.
                            </>
                        ) : null}
                    </p>
                </div>

                <div
                    className="sticky top-14 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-y border-white/10 py-3 flex flex-wrap items-center gap-3 mb-6"
                    data-testid={`${testIdBase}-toolbar`}
                >
                    <input
                        type="text"
                        placeholder="Search…"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(0);
                        }}
                        className="flex-1 min-w-[260px] bg-[#0a0a0a] border border-white/15 text-white text-sm px-4 py-2 focus:outline-none transition-colors font-mono"
                        style={{ borderColor: `${accent}55` }}
                        data-testid={`${testIdBase}-search`}
                    />
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#71717a]">
                        {total.toLocaleString()} rows
                    </div>
                    <a
                        href={csvUrl}
                        download={downloadName}
                        data-testid={`${testIdBase}-download`}
                        className="text-[10px] font-mono uppercase tracking-[0.3em] text-black px-3 py-2 hover:brightness-110 transition-all"
                        style={{ background: accent }}
                    >
                        ↓ Download CSV
                    </a>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-[#71717a] font-mono text-sm border border-white/10 bg-[#121215]">
                        Loading dataset…
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-[#ff3b30] font-mono text-sm border border-[#ff3b30]/30 bg-[#121215]">
                        Could not load {csvUrl} · {error}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto border border-white/10 bg-[#121215]">
                            <table
                                className="w-full text-sm"
                                data-testid={`${testIdBase}-table`}
                            >
                                <thead>
                                    <tr className="border-b border-white/10 bg-[#0a0a0a] sticky top-0">
                                        {data.headers.map((h) => {
                                            const active = sortKey === h;
                                            const isNum = numericHeaders.has(h);
                                            return (
                                                <th
                                                    key={h}
                                                    onClick={() => setSort(h)}
                                                    className={`px-3 py-3 font-mono text-[10px] uppercase tracking-[0.18em] cursor-pointer select-none whitespace-nowrap ${
                                                        isNum ? "text-right" : "text-left"
                                                    } ${active ? "" : "text-[#a1a1aa]"} hover:text-white`}
                                                    style={active ? { color: accent } : {}}
                                                >
                                                    {h}
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
                                            key={i}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            {data.headers.map((h) => (
                                                <td
                                                    key={h}
                                                    className={`px-3 py-2 whitespace-nowrap ${
                                                        numericHeaders.has(h)
                                                            ? "text-right font-mono"
                                                            : "text-left"
                                                    } text-[#d4d4d8]`}
                                                >
                                                    {r[h]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {pageRows.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={data.headers.length}
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
                                {page * pageSize + pageRows.length} of{" "}
                                {total.toLocaleString()}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    disabled={page === 0}
                                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                                    className="px-3 py-1.5 border border-white/15 text-[10px] uppercase tracking-[0.25em] hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white transition-colors"
                                    data-testid={`${testIdBase}-prev`}
                                >
                                    ← Prev
                                </button>
                                <button
                                    disabled={page + 1 >= pages}
                                    onClick={() =>
                                        setPage((p) => Math.min(pages - 1, p + 1))
                                    }
                                    className="px-3 py-1.5 border border-white/15 text-[10px] uppercase tracking-[0.25em] hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white transition-colors"
                                    data-testid={`${testIdBase}-next`}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {columnsNote && (
                    <div className="mt-8 p-5 bg-[#121215] border border-white/10 text-xs text-[#a1a1aa] font-mono leading-relaxed">
                        {columnsNote}
                    </div>
                )}
            </main>
        </div>
    );
}
