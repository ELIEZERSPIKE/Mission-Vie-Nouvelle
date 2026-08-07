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

const INSTITUTION = [
  { label: "Notre histoire", to: "/mission" },
  { label: "Notre vision", to: "/mission" },
  { label: "Notre gouvernance", to: "/mission" },
  { label: "Témoignages", to: "/#temoignages" },
  { label: "Médiathèque", to: "/#mediatheque" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pottery-pattern">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-20 pb-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="block h-px w-7 bg-accent" />
              <span className="font-heading text-xl">
                Vie Nouvelle <span className="text-accent">Togo</span>
              </span>
            </div>
            <p className="font-heading text-2xl sm:text-3xl leading-tight text-balance text-primary-foreground/90">
              « Suivez-moi, et je vous ferai pêcheurs d'hommes. »
            </p>
            <p className="text-sm text-primary-foreground/50 mt-3">— Matthieu 4:19</p>

            <div className="mt-8 space-y-3 text-sm text-primary-foreground/70">
              <p className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-accent shrink-0" />
                Togoville & Tokoin, Togo
              </p>
              <p className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 text-accent shrink-0" />
                contact@vienouvelletogo.org
              </p>
              <p className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 text-accent shrink-0" />
                +228 90 00 00 00
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">Départements</p>
            <ul className="space-y-3">
              {DEPARTMENTS.map((d) => (
                <li key={d.label}>
                  <Link to={d.to} className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">Institution</p>
            <ul className="space-y-3">
              {INSTITUTION.map((d) => (
                <li key={d.label}>
                  <Link to={d.to} className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">Participer</p>
            <Link
              to="/soutenir"
              className="group inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-3 text-sm font-medium hover:bg-accent/90 transition-all"
            >
              Soutenir la Mission
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-primary-foreground/40">
          <p>© {new Date().getFullYear()} Vie Nouvelle Togo. Tous droits réservés.</p>
          <p>Mission chrétienne — Spirituel · Éducatif · Professionnel · Social</p>
        </div>
      </div>
    </footer>
  );
}