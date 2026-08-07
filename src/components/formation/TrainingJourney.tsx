import React from "react";

export default function TrainingJourney() {
  const steps = [
    { num: "1", title: "Découvrir" },
    { num: "2", title: "Choisir le programme" },
    { num: "3", title: "Définir le régime" },
    { num: "4", title: "S'inscrire" },
    { num: "5", title: "Se former" },
    { num: "6", title: "Pratiquer" },
    { num: "7", title: "Servir" },
  ];

  return (
    <section className="py-20 bg-background border-b border-border">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Progression</span>
          <h2 className="font-heading text-3xl sm:text-4xl">Votre parcours de formation</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
          {steps.map((step) => (
            <div key={step.num} className="p-4 rounded-xl border border-border bg-card space-y-2">
              <span className="text-xs font-bold text-accent">{step.num}</span>
              <p className="text-xs font-semibold text-foreground/80">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}