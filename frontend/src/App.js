import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import FilterBar from "./components/FilterBar";
import Hero from "./components/Hero";
import UsageExplainer from "./components/UsageExplainer";
import CleaningProcess from "./components/CleaningProcess";
import VizDesignProcess from "./components/VizDesignProcess";
import Q1TopPlayers from "./components/Q1TopPlayers";
import Q2TeamDependency from "./components/Q2TeamDependency";
import Q3Conferences from "./components/Q3Conferences";
import Q4Positions from "./components/Q4Positions";
import Q5Performance from "./components/Q5Performance";
import Q6Archetypes from "./components/Q6Archetypes";
import Conclusion from "./components/Conclusion";
import { FilterProvider } from "./lib/filters";

const Home = () => {
    return (
        <div className="App grain bg-[#0a0a0a] text-white min-h-screen">
            <FilterProvider>
                <Nav />
                <FilterBar />
                <main className="relative z-[2]">
                    <Hero />
                    <UsageExplainer />
                    <CleaningProcess />
                    <VizDesignProcess />
                    <Q1TopPlayers />
                    <Q2TeamDependency />
                    <Q3Conferences />
                    <Q4Positions />
                    <Q5Performance />
                    <Q6Archetypes />
                    <Conclusion />
                </main>
            </FilterProvider>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
