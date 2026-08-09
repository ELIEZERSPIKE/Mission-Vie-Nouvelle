import React, { useState, useEffect, useRef } from "react";
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
  const menuRef = useRef(null);

  // Amélioration : détection plus précise de la page Formation
  const isFormationPage = location.pathname === "/formation" || 
                          location.pathname.startsWith("/formation/");
  const isNavActive = scrolled || isFormationPage;

  // Gestion du scroll avec throttling pour meilleures performances
  useEffect(() => {
    let timeoutId;
    const onScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        setScrolled(window.scrollY > 40);
        timeoutId = null;
      }, 10);
    };
    
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Fermeture automatique du menu
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Fermeture en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Empêcher le scroll quand le menu est ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Fonction pour vérifier si un lien est actif (plus robuste)
  const isActiveLink = (path) => {
    if (path === "/") return location.pathname === "/";
    // Évite les correspondances partielles problématiques
    if (path === "/formation") {
      return location.pathname === "/formation" || location.pathname.startsWith("/formation/");
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isNavActive
          ? "bg-background/95 backdrop-blur-md border-b border-border/70 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <span className={`font-heading text-base sm:text-xl tracking-tight transition-colors duration-500 whitespace-nowrap ${
            isNavActive ? "text-primary" : "text-white"
          }`}>
            Vie Nouvelle <span className="text-accent">Togo</span>
          </span>
        </Link>

        {/* Navigation desktop - responsive avec des tailles adaptatives */}
        <nav className="hidden xl:flex items-center gap-3 2xl:gap-6 min-w-0 flex-wrap justify-end">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 relative whitespace-nowrap ${
                isNavActive 
                  ? "text-foreground/75 hover:text-accent" 
                  : "text-white/85 hover:text-white"
              } ${isActiveLink(item.to) ? "text-accent font-semibold" : ""}`}
            >
              {item.label}
              {/* Indicateur de lien actif */}
              {isActiveLink(item.to) && (
                <span className={`absolute -bottom-1 left-0 right-0 h-0.5 transition-all ${
                  isNavActive ? "bg-accent" : "bg-white"
                }`} />
              )}
            </Link>
          ))}
        </nav>

        {/* Boutons d'action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/soutenir"
            className={`hidden sm:inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-medium tracking-wide transition-all duration-300 whitespace-nowrap ${
              isNavActive
                ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm"
                : "bg-white/15 text-white backdrop-blur-sm border border-white/25 hover:bg-white/25"
            }`}
          >
            Soutenir
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className={`xl:hidden p-2 rounded-md transition-colors duration-300 hover:bg-white/10 ${
              isNavActive ? "text-primary hover:bg-primary/10" : "text-white"
            }`}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile avec animations */}
      <div
        ref={menuRef}
        className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[calc(100vh-64px)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-background/98 backdrop-blur-md border-t border-border/70">
          <nav className="flex flex-col px-4 sm:px-6 py-4 max-h-[calc(100vh-70px)] overflow-y-auto">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`py-3 px-2 text-base font-medium border-b border-border/40 last:border-0 transition-colors ${
                  isActiveLink(item.to) 
                    ? "text-accent bg-accent/5 rounded-md" 
                    : "text-foreground hover:text-accent hover:bg-accent/5 rounded-md"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/soutenir"
              className="mt-4 inline-flex items-center justify-center px-5 py-3 bg-accent text-accent-foreground font-medium rounded-md hover:bg-accent/90 transition-colors"
              onClick={() => setOpen(false)}
            >
              Soutenir la Mission
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}