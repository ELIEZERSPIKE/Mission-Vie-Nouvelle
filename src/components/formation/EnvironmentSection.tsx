import React from "react";
import { Bed, Book, ArrowRight } from "lucide-react";

export default function EnvironmentSection() {
  return (
    <section className="py-20 bg-secondary/20 border-b border-border">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 space-y-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Vie communautaire & Environnement</span>
            <h2 className="font-heading text-3xl sm:text-4xl">Un cadre pensé pour l'immersion spirituelle.</h2>
            <p className="text-foreground/75 leading-relaxed">
              La formation à Vie Nouvelle Togo dépasse la salle de cours. Les étudiants bénéficient d'une vie communautaire riche, d'un accompagnement pastoral et d'infrastructures dédiées à l'étude.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 border border-border bg-background rounded-lg space-y-2">
                <h4 className="font-heading font-semibold text-sm">Hébergement & Restauration</h4>
                <p className="text-xs text-foreground/60">Chambres et repas assurés pour les étudiants en régime Internat.</p>
              </div>
              <div className="p-4 border border-border bg-background rounded-lg space-y-2">
                <h4 className="font-heading font-semibold text-sm">Bibliothèque Théologique</h4>
                <p className="text-xs text-foreground/60">Accès à un catalogue d'ouvrages pour l'exégèse et l'histoire de l'Église.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-xl overflow-hidden border border-border">
              <img src="/images/formation/campus.jpg" alt="Vie de campus" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden border border-border mt-8">
              <img src="/images/formation/library.jpg" alt="Bibliothèque" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 border border-border bg-background rounded-2xl text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Apprendre sur le terrain</span>
          <h3 className="font-heading text-2xl sm:text-3xl">Stages pratiques au sein de la mission</h3>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm font-medium text-foreground/80">
            <span className="bg-secondary px-4 py-2 rounded-lg border border-border">1. Formation Théorique</span>
            <ArrowRight size={18} className="hidden sm:block text-accent" />
            <span className="bg-secondary px-4 py-2 rounded-lg border border-border">2. Mise en Pratique Pastoral</span>
            <ArrowRight size={18} className="hidden sm:block text-accent" />
            <span className="bg-secondary px-4 py-2 rounded-lg border border-border">3. Impact Missionnaire</span>
          </div>
          <p className="text-sm text-foreground/70 max-w-xl mx-auto">
            Chaque parcours inclut des phases d'immersion dans les paroisses et œuvres de la mission à travers le Togo.
          </p>
        </div>
      </div>
    </section>
  );
}