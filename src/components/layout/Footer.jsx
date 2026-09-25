import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";

const DEPARTMENTS = [
  { label: "Églises", to: "/eglises" },
  { label: "Formation", to: "/formation" },
  { label: "Éducation", to: "/education" },
  { label: "Centre de Formation", to: "/centre-de-formation" },
  { label: "Médical", to: "/medical" },
];

export default function Footer() {
  return (
    <footer className="footer-white text-foreground border-t-4 border-accent">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* ── Colonne 1 : marque + citation ── */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-heading text-xl text-foreground">
                Vie Nouvelle <span className="text-accent">Togo</span>
              </span>
            </div>
            <p className="font-heading text-2xl sm:text-3xl leading-tight text-balance text-foreground/90">
              « Suivez-moi, et je vous ferai pêcheurs d'hommes. »
            </p>
            <p className="text-sm text-muted-foreground mt-3">— Matthieu 4:19</p>
          </div>

          {/* ── Colonne 2 : départements ── */}
          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">
              Départements
            </p>
            <ul className="space-y-3">
              {DEPARTMENTS.map((d) => (
                <li key={d.label}>
                  <Link
                    to={d.to}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Colonne 3 : contact ── */}
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">
              Contact
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-accent shrink-0" />
                <span>Togoville &amp; Tokoin, Togo</span>
              </p>
              <p className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 text-accent shrink-0" />
                <a
                  href="mailto:contact@vienouvelletogo.org"
                  className="break-all hover:text-accent transition-colors"
                >
                  contact@vienouvelletogo.org
                </a>
              </p>
              <p className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 text-accent shrink-0" />
                <a
                  href="tel:+22890000000"
                  className="whitespace-nowrap hover:text-accent transition-colors"
                >
                  +228 90 00 00 00
                </a>
              </p>
            </div>
          </div>

          {/* ── Colonne 4 : participer ── */}
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">
              Participer
            </p>
            <Link
              to="/soutenir"
              className="group inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-3 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Soutenir la Mission
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* ── Barre du bas ── */}
        <div className="mt-16 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row gap-2 justify-between text-xs text-muted-foreground/70">
          <p>© {new Date().getFullYear()} spike. Tous droits réservés.</p>
          <p>Togoville &amp; Tokoin</p>
        </div>
      </div>
    </footer>
  );
}