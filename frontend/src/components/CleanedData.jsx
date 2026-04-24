import DataTablePage from "./DataTablePage";

export default function CleanedData() {
    return (
        <DataTablePage
            eyebrow="Appendix · Cleaned Dataset"
            title="The data, nothing hidden."
            description="Every row that made it through the cleaning funnel — P5 teams, QB / RB / WR / TE, 2021–2023. Each field is documented in the Column Audit section back on the main story."
            csvUrl="/CLEAN_DATA.csv"
            downloadName="CLEAN_DATA.csv"
            accent="#ffcc00"
            testIdBase="cleaned-data"
            columnsNote="Columns · Season, Player_ID, Player_Name, Position, Team, Conference, Usage_Overall, Team_Total_Usage, Player_Usage_Share, Rank_Within_Team, Top_Player_Flag, Top_3_Flag, Top_Player_Share, Top_3_Share, Distinct_Season_Count, Usage_Bin. See the Column Audit section for what each field means and how it was derived."
        />
    );
}
