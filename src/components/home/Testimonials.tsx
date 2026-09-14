import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const t = TESTIMONIALS[idx];

  const go = (dir: number) => setIdx((p) => (p + dir + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section id="temoignages" className="relative bg-primary text-primary-foreground py-24 sm:py-36 overflow-hidden pottery-pattern">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-5">Témoignages</p>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl mb-16 text-balance">Des vies transformées, des histoires de dignité retrouvée.</h2>

        <div className="relative min-h-[280px] sm:min-h-[240px]">
          <Quote className="mx-auto text-accent/40 mb-8" size={40} />
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-heading text-2xl sm:text-3xl lg:text-4xl leading-snug text-balance text-primary-foreground/95">
                « {t.quote} »
              </p>
              <p className="mt-8 font-medium text-accent">{t.name}</p>
              <p className="text-sm text-primary-foreground/50">{t.role}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-6 mt-12">
          <button onClick={() => go(-1)} className="p-2 border border-white/15 hover:border-accent hover:text-accent transition-colors" aria-label="Précédent">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1.5 transition-all ${i === idx ? "w-8 bg-accent" : "w-1.5 bg-white/25"}`}
                aria-label={`Témoignage ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={() => go(1)} className="p-2 border border-white/15 hover:border-accent hover:text-accent transition-colors" aria-label="Suivant">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}