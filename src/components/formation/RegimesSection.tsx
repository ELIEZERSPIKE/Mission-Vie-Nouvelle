import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function RegimesSection() {
  return (
    <section className="py-20 bg-secondary/30 border-b border-border">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Flexibilité</span>
          <h2 className="font-heading text-3xl sm:text-4xl">Nos régimes de formation</h2>
          <p className="text-foreground/70">Des formules adaptées aux disponibilités et aux engagements de chacun.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl border border-border bg-background space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-full">
                Immersif
              </span>
              <h3 className="font-heading text-2xl font-bold">Régime Internat</h3>
              <p className="text-sm text-foreground/70">Pour ceux qui se consacrent pleinement à leur temps de formation.</p>
              <ul className="space-y-3 text-sm text-foreground/80 pt-2">
                <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-accent" /> Cours classiques en journée</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-accent" /> Hébergement et restauration intégrés</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-accent" /> Vie de communauté et prières quotidiennes</li>
              </ul>
            </div>
            <a href="#contact" className="w-full text-center bg-primary text-primary-foreground py-3 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
              Choisir le Régime Internat
            </a>
          </div>

          <div className="p-8 rounded-2xl border border-border bg-background space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider bg-accent/10 text-accent px-3 py-1 rounded-full">
                Flexible
              </span>
              <h3 className="font-heading text-2xl font-bold">Régime Externat</h3>
              <p className="text-sm text-foreground/70">Pour ceux qui maintiennent des responsabilités professionnelles ou familiales.</p>
              <ul className="space-y-3 text-sm text-foreground/80 pt-2">
                <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-accent" /> Cours modulaires & cours du soir</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-accent" /> Programme d'alphabétisation disponible</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-accent" /> Emploi du temps adapté</li>
              </ul>
            </div>
            <a href="#contact" className="w-full text-center bg-secondary text-secondary-foreground border border-border py-3 rounded-lg font-medium text-sm hover:bg-secondary/80 transition-colors">
              Choisir le Régime Externat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}