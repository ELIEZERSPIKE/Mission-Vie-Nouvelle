import React from "react";
import type { Seminar } from "@/types/formation";

interface SeminarsSectionProps {
  seminars: Seminar[];
}

export default function SeminarsSection({ seminars }: SeminarsSectionProps) {
  return (
    <section className="py-20 bg-background border-b border-border">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Perfectionnement continu</span>
          <h2 className="font-heading text-3xl sm:text-4xl">Séminaires pratiques</h2>
          <p className="text-foreground/70">Des modules de courte durée ciblant des besoins spécifiques.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {seminars.map((sem) => (
            <div key={sem.id} className="p-6 border border-border rounded-xl bg-card space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent px-2.5 py-1 rounded">
                Public : {sem.audience}
              </span>
              <h3 className="font-heading text-lg font-bold">{sem.title}</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">{sem.description}</p>
              <div className="pt-3 text-xs text-foreground/50 border-t border-border/50">
                Intervenant : <span className="font-medium text-foreground">{sem.speaker}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}