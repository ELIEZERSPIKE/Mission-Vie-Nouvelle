import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaithPoint } from "@/types/formation";

interface ConfessionAccordionProps {
  points: FaithPoint[];
}

export default function ConfessionAccordion({ points }: ConfessionAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-background border-b border-border">
      <div className="max-w-[1000px] mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Ancrage doctrinal</span>
          <h2 className="font-heading text-3xl sm:text-4xl">Notre confession de foi</h2>
          <p className="text-foreground/70">Les principes fondamentaux qui guident l'enseignement de l'Institut et du FATT.</p>
        </div>

        <div className="space-y-4">
          {points.map((point, index) => (
            <div key={point.id} className="border border-border rounded-xl overflow-hidden bg-card">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-5 text-left font-heading text-lg font-semibold flex items-center justify-between hover:bg-secondary/40 transition-colors"
              >
                <span>{point.title}</span>
                <ChevronDown className={`transition-transform duration-300 ${openIndex === index ? "rotate-180 text-accent" : ""}`} size={20} />
              </button>
              {openIndex === index && (
                <div className="p-5 pt-0 text-sm text-foreground/75 leading-relaxed border-t border-border/40 bg-secondary/10">
                  <p className="mb-2">{point.content}</p>
                  {point.scripture && (
                    <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-2.5 py-0.5 rounded">
                      Référence : {point.scripture}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}