import React, { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import { CalendarDays, MapPin } from "lucide-react";
import { NEWS, EVENTS } from "@/lib/content";

const TAGS = ["Tous", "Formation", "Éducation", "Médical", "Églises"];

export default function Actualites() {
  const [tag, setTag] = useState("Tous");
  const filtered = tag === "Tous" ? NEWS : NEWS.filter((n) => n.tag === tag);

  return (
    <>
      <PageHeader
  eyebrow="Actualités & Événements"
  title="La mission en mouvement."
  intro="Suivez la vie des départements, les temps forts et les rendez-vous à venir de Vie Nouvelle Togo."
  image="/images/actualites-hero.jpg"
/>

      <section className="bg-background py-16 sm:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          {/* Events */}
          <div className="mb-16">
            <h2 className="font-heading text-2xl mb-6">Prochains événements</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {EVENTS.map((ev, i) => {
                const d = new Date(ev.date);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="border border-border p-6 hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-heading text-3xl text-accent leading-none">{d.toLocaleDateString("fr-FR", { day: "2-digit" })}</span>
                      <span className="text-sm uppercase text-foreground/50">{d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</span>
                    </div>
                    <h3 className="font-medium leading-snug mb-2">{ev.title}</h3>
                    <p className="flex items-center gap-1.5 text-xs text-foreground/50"><MapPin size={12} /> {ev.location}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* News filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`px-4 py-2 text-sm border transition-colors ${tag === t ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground/60 hover:border-accent/50"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* News grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {filtered.map((item, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-background p-7 group hover:bg-secondary/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-accent border border-accent/30 px-2.5 py-1">{item.tag}</span>
                  <span className="text-xs text-foreground/40 flex items-center gap-1"><CalendarDays size={12} /> {item.date}</span>
                </div>
                <h3 className="font-heading text-xl leading-snug mb-3 group-hover:text-accent transition-colors">{item.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{item.excerpt}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}