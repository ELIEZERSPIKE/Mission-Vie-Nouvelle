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

  const isFormationPage = location.pathname === "/formation" ||
    location.pathname.startsWith("/formation/");
  const isHomePage = location.pathname === "/";
  const isNavActive = scrolled || isFormationPage || isHomePage;

  useEffect(() => {
    const isHome = location.pathname === "/";

    const getThreshold = () =>
      isHome ? Math.max(window.innerHeight - 80, 120) : 40;

    const handleScroll = () => {
      setScrolled(window.scrollY > getThreshold());
    };

    const handleResize = () => {
      setScrolled(window.scrollY > getThreshold());
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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

  const isActiveLink = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/formation") {
      return location.pathname === "/formation" || location.pathname.startsWith("/formation/");
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isNavActive
          ? "bg-background border-b border-border/70 py-3 shadow-soft"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <span
            className={`font-heading font-semibold text-lg sm:text-xl tracking-tight transition-colors duration-300 ${
              isNavActive ? "text-primary" : "text-white"
            }`}
          >
            Vie Nouvelle <span className="text-accent">Togo</span>
          </span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-medium transition-all duration-300 relative ${
                isNavActive
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-white/80 hover:text-white"
              } ${isActiveLink(item.to) ? "text-accent font-semibold" : ""}`}
            >
              {item.label}
              {isActiveLink(item.to) && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/soutenir"
            className={`hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
              isNavActive
                ? "bg-accent text-accent-foreground hover:bg-accent/90 rounded-md shadow-md hover:shadow-lg"
                : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 rounded-md border border-white/10"
            }`}
          >
            Soutenir
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className={`xl:hidden p-1.5 transition-colors duration-300 ${
              isNavActive ? "text-primary" : "text-white"
            }`}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div
        ref={menuRef}
        className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[calc(100vh-64px)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-background border-t border-border/70">
          <nav className="flex flex-col px-5 py-4 max-h-[calc(100vh-70px)] overflow-y-auto">
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
              className="mt-4 inline-flex items-center justify-center px-5 py-3 bg-accent text-accent-foreground font-medium rounded-md hover:bg-accent/90 transition-colors shadow-md"
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