import React from "react";
import { ArrowUpRight } from "lucide-react";
import type { Program } from "@/types/formation";

interface ProgramGridProps {
  programs: Program[];
}

export default function ProgramGrid({ programs }: ProgramGridProps) {
  return (
    <section id="programmes" className="py-20 bg-background border-b border-border">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Parcours académiques</span>
            <h2 className="font-heading text-3xl sm:text-4xl">Nos programmes de formation</h2>
          </div>
          <p className="text-foreground/70 max-w-md">
            Des cursus structurés pour développer l'excellence théologique et la maîtrise pratique du ministère.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((prog) => (
            <div key={prog.id} className="flex flex-col justify-between p-7 rounded-xl border border-border bg-card hover:shadow-lg transition-all">
              <div className="space-y-4">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded">
                  {prog.regime}
                </span>
                <h3 className="font-heading text-xl font-bold">{prog.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{prog.description}</p>
                
                <div className="pt-4 border-t border-border/60">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-2">Objectifs clés :</p>
                  <ul className="space-y-1.5 text-xs text-foreground/80">
                    {prog.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent font-bold">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-foreground/60">{prog.duration}</span>
                <a href="#contact" className="text-xs font-semibold text-accent flex items-center gap-1 hover:underline">
                  En savoir plus <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}