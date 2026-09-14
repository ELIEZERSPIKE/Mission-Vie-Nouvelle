import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut, LayoutDashboard, ChevronDown, User } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { resolveHomeRoute } from "@/auth/resolveHomeRoute";

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
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  const { user, isLoading, logout } = useAuth();

  /* ── Scroll listener ───────────────────────────────────────────── */
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

  /* ── Fermer les menus à chaque changement de route ─────────────── */
  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  /* ── Fermer le menu mobile au clic extérieur ────────────────────── */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  /* ── Fermer le dropdown profil au clic extérieur ────────────────── */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileOpen &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  /* ── Bloquer le scroll quand le menu mobile est ouvert ──────────── */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const isActiveLink = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/formation") {
      return (
        location.pathname === "/formation" ||
        location.pathname.startsWith("/formation/")
      );
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    setOpen(false);
    await logout();
    navigate("/");
  };

  /* ── Initiales de l'utilisateur ─────────────────────────────────── */
  const getInitials = (fullName) => {
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) return null;
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  /* ── Avatar ou icône User ───────────────────────────────────────── */
  const renderAvatar = (size = "w-7 h-7", iconSize = 14) => {
    if (user?.avatar_url) {
      return (
        <img
          src={user.avatar_url}
          alt={user.full_name || "Profil"}
          className={`${size} rounded-full object-cover border border-accent/30`}
        />
      );
    }

    const initials = getInitials(user?.full_name);

    if (initials) {
      return (
        <span
          className={`${size} rounded-full flex items-center justify-center text-xs font-bold bg-accent text-accent-foreground`}
        >
          {initials}
        </span>
      );
    }

    // Pas de nom → icône User
    return (
      <span
        className={`${size} rounded-full flex items-center justify-center bg-accent text-accent-foreground`}
      >
        <User size={iconSize} />
      </span>
    );
  };

  /* ── Nom d'affichage ────────────────────────────────────────────── */
  const displayName = user?.full_name?.trim() || user?.email || user?.phone || "Mon compte";
  const shortName = user?.full_name?.trim()?.split(" ")[0] || "Profil";

  /* ── Dashboard route (memoized) ─────────────────────────────────── */
  const dashboardRoute = user ? resolveHomeRoute(user.roles) : "/login";

  /* ── Rendu ──────────────────────────────────────────────────────── */
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background border-b border-border/70 py-3 shadow-soft"
          : "bg-background border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <span
            className="font-heading font-semibold text-lg sm:text-xl tracking-tight text-primary transition-colors duration-300"
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
              className={`text-sm font-medium transition-all duration-300 relative text-foreground/70 hover:text-foreground ${isActiveLink(item.to) ? "text-accent font-semibold" : ""}`}
            >
              {item.label}
              {isActiveLink(item.to) && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions Desktop */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Bouton Soutenir */}
          <Link
            to="/soutenir"
            className="hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-medium transition-all duration-300 bg-accent text-accent-foreground hover:bg-accent/90 rounded-md shadow-md hover:shadow-lg"
          >
            Soutenir
          </Link>

          {/* ─── Auth Desktop : Se connecter OU Profil ──────────────── */}
          {!isLoading && !user && (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md border border-primary/30 text-primary hover:bg-primary/5"
            >
              <LogIn size={15} />
              Se connecter
            </Link>
          )}

          {!isLoading && user && (
            <div className="relative hidden sm:block" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 border border-border/60 hover:bg-accent/5 text-foreground"
                aria-label="Menu profil"
              >
                {renderAvatar()}
                <span className="text-sm font-medium max-w-[120px] truncate hidden lg:block">
                  {shortName}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-background border border-border/60 rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* En-tête */}
                  <div className="px-4 py-3 border-b border-border/40 bg-accent/5">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {displayName}
                    </p>
                    {user.email && (
                      <p className="text-xs text-foreground/50 truncate mt-0.5">
                        {user.email}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="py-1.5">
                    <Link
                      to={dashboardRoute}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-accent/5 transition-colors"
                    >
                      <LayoutDashboard size={15} className="text-accent" />
                      Mon espace
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut size={15} />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Placeholder invisible pendant le chargement */}
          {isLoading && <div className="w-24 h-9 rounded-md opacity-0 hidden sm:block" />}

          {/* Bouton hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="xl:hidden p-1.5 text-primary transition-colors duration-300"
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

            {/* Soutenir mobile */}
            <Link
              to="/soutenir"
              className="mt-4 inline-flex items-center justify-center px-5 py-3 bg-accent text-accent-foreground font-medium rounded-md hover:bg-accent/90 transition-colors shadow-md"
              onClick={() => setOpen(false)}
            >
              Soutenir la Mission
            </Link>

            {/* ─── Auth Mobile ──────────────────────────────────────── */}
            {!isLoading && !user && (
              <Link
                to="/login"
                className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 border border-primary text-primary font-medium rounded-md hover:bg-primary/5 transition-colors"
                onClick={() => setOpen(false)}
              >
                <LogIn size={16} />
                Se connecter
              </Link>
            )}

            {!isLoading && user && (
              <div className="mt-4 space-y-2 border-t border-border/40 pt-4">
                {/* Profil mini */}
                <div className="flex items-center gap-3 px-2 py-2">
                  {renderAvatar("w-9 h-9", 16)}
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {displayName}
                    </p>
                    {user.email && (
                      <p className="text-xs text-foreground/50">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  to={dashboardRoute}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground/80 hover:text-accent rounded-md hover:bg-accent/5 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard size={15} className="text-accent" />
                  Mon espace
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut size={15} />
                  Se déconnecter
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}