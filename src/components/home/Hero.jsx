import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Mission", to: "/mission" },
  { label: "Églises", to: "/eglises" },
  { label: "Formation", to: "/formation" },
  { label: "Éducation", to: "/education" },
  { label: "Centre de Formation", to: "/centre-de-formation" },
  { label: "Médical", to: "/medical" },
  { label: "Actualités", to: "/actualites" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isFormationPage = location.pathname === "/formation" || location.pathname.startsWith("/formation");
  const isNavActive = scrolled || isFormationPage;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isNavActive
          ? "bg-background/92 backdrop-blur-md border-b border-border/70 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <span className={`font-heading text-lg sm:text-xl tracking-tight transition-colors duration-500 whitespace-nowrap ${isNavActive ? "text-primary" : "text-white"}`}>
            Vie Nouvelle <span className="text-accent">Togo</span>
          </span>
        </Link>

        {/* Desktop nav: passe à xl (1280px) car 8 liens ne tiennent pas à partir de lg (1024px) */}
        <nav className="hidden xl:flex items-center gap-5 2xl:gap-7 min-w-0">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 relative whitespace-nowrap ${
                isNavActive ? "text-foreground/75 hover:text-accent" : "text-white/85 hover:text-white"
              } ${location.pathname.startsWith(item.to) && item.to !== "/" ? "text-accent" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/soutenir"
            className={`hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-300 whitespace-nowrap ${
              isNavActive
                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                : "bg-white/12 text-white backdrop-blur-sm border border-white/25 hover:bg-white/20"
            }`}
          >
            Soutenir
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className={`xl:hidden p-1.5 transition-colors duration-300 ${isNavActive ? "text-primary" : "text-white"}`}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden bg-background border-t border-border max-h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="flex flex-col px-6 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`py-3 text-base font-medium border-b border-border/60 last:border-0 ${
                  location.pathname.startsWith(item.to) && item.to !== "/" ? "text-accent" : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/soutenir"
              className="mt-4 inline-flex items-center justify-center px-5 py-3 bg-accent text-accent-foreground font-medium"
            >
              Soutenir la Mission
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}