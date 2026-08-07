import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";

interface FormationHeroProps {
  onSelectBranch: (branch: "fatt" | "fathet") => void;
}

export default function FormationHero({ onSelectBranch }: FormationHeroProps) {
  return (
    <section className="relative bg-background border-b border-border overflow-hidden py-16 sm:py-24">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent bg-accent/10 px-3.5 py-1.5 rounded-full">
              <Sparkles size={14} />
              <span>Centre de Formation Vie Nouvelle</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Former pour <span className="text-accent">transformer</span>.
            </h1>

            <p className="text-lg sm:text-xl text-foreground/75 leading-relaxed max-w-2xl">
              Un investissement dans la maturité spirituelle, le leadership et l’efficacité dans le ministère pour l’Église et la société.
            </p>

            <div className="p-4 sm:p-5 border-l-2 border-accent bg-secondary/30 rounded-r-lg max-w-xl">
              <blockquote className="text-sm sm:text-base italic text-foreground/80">
                « Je vous exhorte donc, frères, par les compassions de Dieu, à offrir vos corps comme un sacrifice vivant... Ne vous conformez pas au siècle présent, mais soyez transformés par le renouvellement de l’intelligence. »
              </blockquote>
              <cite className="block text-xs font-semibold text-accent mt-2 not-italic">
                — Romains 12:1-2
              </cite>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <a 
                href="#branches" 
                onClick={() => onSelectBranch("fatt")}
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3 rounded-lg font-medium transition-colors border border-border text-sm"
              >
                Découvrir le FATT
              </a>
              <a 
                href="#branches" 
                onClick={() => onSelectBranch("fathet")}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm text-sm"
              >
                Découvrir l'Institut <ArrowUpRight size={18} />
              </a>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border shadow-2xl">
              <img 
                src="/images/formation/hero.jpg" 
                alt="Étudiants en formation biblique" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1">Maturité & Service</p>
                <p className="font-heading text-lg leading-snug">Deux voies complémentaires pour répondre à votre appel.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}