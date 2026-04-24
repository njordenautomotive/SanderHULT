import DataTablePage from "./DataTablePage";

export default function RawWinData() {
    return (
        <DataTablePage
            eyebrow="Appendix · Raw Win Data"
            title="Every game, before we cleaned it."
            description="The unaltered game-level export used to derive team performance. One row per game, with Season · Team · Conference · Points_for · Points_against. This is the starting point of the win-data cleaning funnel for Q5 and Q6."
            csvUrl="/RAW_Win_Data.csv"
            downloadName="RAW_Win_Data.csv"
            accent="#ff3b30"
            testIdBase="raw-win-data"
            columnsNote="Columns · Season, Team, Conference, Points_for, Points_against. The raw export has two rows per matchup (home & away). Cleaning split each game into one row per team and added Win / Game / Loss flags — see the CLEAN_Win_Data view for the result."
        />
    );
}
