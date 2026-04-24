import DataTablePage from "./DataTablePage";

export default function CleanWinData() {
    return (
        <DataTablePage
            eyebrow="Appendix · Clean Win Data"
            title="The performance data behind Q5 & Q6."
            description="The cleaned team-game dataset. One row per team per game. Win / Game / Loss flags enable SUM-based aggregation into team-season totals, which is then merged with CLEAN_DATA on Team + Season to feed every performance chart."
            csvUrl="/CLEAN_Win_Data.csv"
            downloadName="CLEAN_Win_Data.csv"
            accent="#ffcc00"
            testIdBase="clean-win-data"
            columnsNote="Columns · Season, Team, Conference, Points For, Points Against, Win, Game, Loss. Win = 1 when Points For > Points Against, Loss is its inverse, Game is a constant 1 — together they allow team-season win% = SUM(Win) / SUM(Game)."
        />
    );
}
