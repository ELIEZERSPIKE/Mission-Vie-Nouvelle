import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { DEPARTMENTS } from "@/lib/content";

export default function Ecosystem() {
  return (
    <section className="relative bg-background py-24 sm:py-36 grain overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-5">Notre mission</p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-balance">
            Un écosystème où chaque acte sert l'être humain tout entier.
          </h2>
        </div>

        {/* Woven overlapping diagram */}
        <div className="relative grid md:grid-cols-5 gap-0 max-w-5xl mx-auto">
          {DEPARTMENTS.map((dept, i) => (
            <motion.div
              key={dept.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative"
              style={{ marginTop: i % 2 === 1 ? "2.5rem" : 0 }}
            >
              <div className="mx-auto w-px h-16 bg-accent/40" style={{ marginLeft: "50%", transform: "translateX(-50%)" }} />
              <div className="text-center px-3">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-accent/40 text-accent text-sm font-heading mb-3">
                  0{i + 1}
                </span>
                <p className="font-heading text-lg leading-tight">{dept.name}</p>
                <p className="text-xs text-foreground/50 mt-1.5 leading-snug hidden sm:block">{dept.tagline}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Horizon line connecting them */}
        <div className="relative max-w-5xl mx-auto mt-8">
          <div className="horizon-line h-px w-full" />
          <div className="text-center mt-8">
            <p className="font-heading italic text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto text-balance">
              « L'Évangile n'est pas une parole qu'on écoute — c'est une vie qu'on transmet. »
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/mission" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all">
            Lire notre histoire complète <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}