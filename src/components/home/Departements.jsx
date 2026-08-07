import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { DEPARTMENTS } from "@/lib/content";

const ACCENT_BG = {
  ochre: "bg-accent text-accent-foreground",
  indigo: "bg-primary text-primary-foreground",
  veridian: "bg-veridian text-white",
};

export default function Departments() {
  const [active, setActive] = useState(0);

  return (
    <section id="departements" className="bg-primary text-primary-foreground py-24 sm:py-36 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-5">Que faisons-nous ?</p>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-balance max-w-3xl">
              Cinq départements, un même écosystème de restauration.
            </h2>
          </div>
          <p className="max-w-sm text-primary-foreground/60 text-base">
            Chaque pilier est interconnecté : la foi nourrit l'éducation, l'éducation ouvre au métier, le métier soutient la famille, et les soins protègent la vie.
          </p>
        </div>

        {/* Desktop: vertical film-strip cards */}
        <div className="hidden lg:grid grid-cols-5 gap-3">
          {DEPARTMENTS.map((dept, i) => {
            const isActive = active === i;
            return (
              <Link
                key={dept.slug}
                to={`/${dept.slug}`}
                onMouseEnter={() => setActive(i)}
                className={`group relative overflow-hidden transition-all duration-500 ease-out ${
                  isActive ? "col-span-2" : "col-span-1"
                }`}
                style={{ height: "560px" }}
              >
                <img
                  src={dept.image}
                  alt={dept.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-primary/10" />
                <div className="absolute inset-0 p-7 flex flex-col justify-end">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-accent mb-2 transition-all duration-500"
                     style={{ opacity: isActive ? 1 : 0.7 }}>
                    0{i + 1}
                  </p>
                  <h3 className="font-heading text-2xl mb-2">{dept.name}</h3>
                  <div className={`overflow-hidden transition-all duration-500 ${isActive ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="text-sm text-primary-foreground/70 mb-1">{dept.tagline}</p>
                    <p className="text-sm text-primary-foreground/60 leading-relaxed">{dept.description}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorer <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile: horizontal swiper */}
        <div className="lg:hidden -mx-5 px-5 flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
          {DEPARTMENTS.map((dept) => (
            <Link
              key={dept.slug}
              to={`/${dept.slug}`}
              className="group relative shrink-0 w-[78vw] snap-center overflow-hidden"
              style={{ height: "440px" }}
            >
              <img src={dept.image} alt={dept.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <p className="text-[10px] uppercase tracking-[0.25em] text-accent mb-2">{dept.tagline}</p>
                <h3 className="font-heading text-2xl">{dept.name}</h3>
                <p className="text-sm text-primary-foreground/60 mt-2 leading-relaxed">{dept.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-accent">
                  Explorer <ArrowUpRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}