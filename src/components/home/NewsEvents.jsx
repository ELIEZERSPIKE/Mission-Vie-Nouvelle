import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { NEWS, EVENTS } from "@/lib/content";

export default function NewsEvents() {
  return (
    <section className="bg-background py-24 sm:py-36">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* News */}
          <div className="lg:col-span-7">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Actualités</p>
                <h2 className="font-heading text-3xl sm:text-4xl">Les dernières nouvelles</h2>
              </div>
              <Link to="/actualites" className="text-sm text-accent hover:underline shrink-0">Tout voir</Link>
            </div>
            <div className="space-y-px bg-border">
              {NEWS.map((item, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-background p-7 group cursor-pointer hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-accent border border-accent/30 px-2.5 py-1">{item.tag}</span>
                    <span className="text-xs text-foreground/40">{item.date}</span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl leading-snug mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">{item.excerpt}</p>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="lg:col-span-5">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Événements</p>
              <h2 className="font-heading text-3xl sm:text-4xl">À venir</h2>
            </div>
            <div className="space-y-5">
              {EVENTS.map((ev, i) => {
                const d = new Date(ev.date);
                const day = d.toLocaleDateString("fr-FR", { day: "2-digit" });
                const month = d.toLocaleDateString("fr-FR", { month: "short" });
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="flex items-center gap-5 p-5 border border-border hover:border-accent/50 transition-colors group"
                  >
                    <div className="text-center shrink-0 w-14">
                      <p className="font-heading text-3xl text-accent leading-none">{day}</p>
                      <p className="text-xs uppercase tracking-wide text-foreground/50 mt-1">{month}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium leading-snug group-hover:text-accent transition-colors">{ev.title}</h3>
                      <p className="flex items-center gap-1.5 text-xs text-foreground/50 mt-1.5">
                        <MapPin size={12} /> {ev.location}
                      </p>
                    </div>
                    <CalendarDays size={18} className="text-foreground/30 group-hover:text-accent transition-colors shrink-0" />
                  </motion.div>
                );
              })}
            </div>
            <Link to="/actualites" className="mt-8 inline-flex items-center gap-2 text-sm text-accent hover:gap-3 transition-all">
              Voir le calendrier complet <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}