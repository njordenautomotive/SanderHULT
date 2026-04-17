import { createContext, useContext, useMemo, useState } from "react";
import { dataset } from "./data";

const FilterCtx = createContext(null);

export const FilterProvider = ({ children }) => {
    const [season, setSeason] = useState("all"); // "all" | 2021 | 2022 | 2023
    const [conference, setConference] = useState("all"); // "all" | "SEC" etc.
    const [team, setTeam] = useState(null); // null | team name

    const seasons = useMemo(() => dataset.summary.seasons, []);
    const conferences = useMemo(() => dataset.summary.conferences, []);
    const teams = useMemo(() => {
        const set = new Set(dataset.raw.map((r) => r.team));
        return Array.from(set).sort();
    }, []);

    const filteredTeams = useMemo(() => {
        if (conference === "all") return teams;
        const set = new Set(
            dataset.raw
                .filter((r) => r.conference === conference)
                .map((r) => r.team)
        );
        return Array.from(set).sort();
    }, [conference, teams]);

    const clearAll = () => {
        setSeason("all");
        setConference("all");
        setTeam(null);
    };

    const isActive =
        season !== "all" || conference !== "all" || team !== null;

    const value = {
        season,
        conference,
        team,
        setSeason,
        setConference,
        setTeam,
        seasons,
        conferences,
        teams,
        filteredTeams,
        clearAll,
        isActive,
    };

    return <FilterCtx.Provider value={value}>{children}</FilterCtx.Provider>;
};

export const useFilters = () => {
    const ctx = useContext(FilterCtx);
    if (!ctx) throw new Error("useFilters outside FilterProvider");
    return ctx;
};

/* Helpers */
export const applyFilters = (rows, { season, conference, team }) => {
    return rows.filter((r) => {
        if (season !== "all" && r.season !== season) return false;
        if (conference !== "all" && r.conference !== conference) return false;
        if (team && r.team !== team) return false;
        return true;
    });
};

export const applySeasonConf = (rows, { season, conference }) => {
    return rows.filter((r) => {
        if (season !== "all" && r.season !== season) return false;
        if (conference !== "all" && r.conference !== conference) return false;
        return true;
    });
};
