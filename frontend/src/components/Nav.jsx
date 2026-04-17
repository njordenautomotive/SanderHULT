import { useEffect, useState } from "react";

const LINKS = [
    { id: "hero", label: "Intro" },
    { id: "overview", label: "What is Usage" },
    { id: "cleaning", label: "Data Cleaning" },
    { id: "design", label: "Viz Design" },
    { id: "q1", label: "Q1 Players" },
    { id: "q2", label: "Q2 Teams" },
    { id: "q3", label: "Q3 Conferences" },
    { id: "q4", label: "Q4 Positions" },
    { id: "q5", label: "Q5 Performance" },
    { id: "q6", label: "Q6 Archetypes" },
    { id: "conclusion", label: "Takeaways" },
];

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", h);
        h();
        return () => window.removeEventListener("scroll", h);
    }, []);
    return (
        <nav
            data-testid="site-nav"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between gap-6">
                <a
                    href="#hero"
                    className="flex items-center gap-2 flex-shrink-0"
                    data-testid="nav-logo"
                >
                    <span className="w-2 h-2 bg-[#ffcc00] inline-block" />
                    <span className="font-heading text-sm font-black uppercase tracking-widest">
                        Concentration / Equation
                    </span>
                </a>
                <div className="hidden xl:flex gap-5 flex-1 justify-center">
                    {LINKS.map((l) => (
                        <a
                            key={l.id}
                            href={`#${l.id}`}
                            className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] hover:text-white transition-colors whitespace-nowrap"
                            data-testid={`nav-link-${l.id}`}
                        >
                            {l.label}
                        </a>
                    ))}
                </div>
                <a
                    href="#cleaning"
                    className="hidden md:inline-block text-[10px] font-mono uppercase tracking-widest text-black bg-[#ffcc00] px-3 py-1.5 hover:bg-white transition-colors flex-shrink-0"
                    data-testid="nav-cta"
                >
                    Start
                </a>
            </div>
        </nav>
    );
}
