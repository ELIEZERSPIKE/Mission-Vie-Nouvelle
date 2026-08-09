import React, { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import { Check } from "lucide-react";

const PILLARS = [
  { id: "eglises", name: "Soutenir une paroisse", desc: "Permettre à une église locale de grandir et de rayonner.", impact: "Fait vivre une communauté de foi" },
  { id: "formation", name: "Soutenir un étudiant", desc: "Financer une année de l'Institut Biblique ou du FATT.", impact: "Forme un futur serviteur" },
  { id: "education", name: "Scolariser un enfant", desc: "Couvrir les frais de scolarité d'un élève.", impact: "Offre l'éducation à un enfant" },
  { id: "centre", name: "Apprentissage d'un métier", desc: "Équiper un jeune dans un atelier de formation.", impact: "Donne un métier et la dignité" },
  { id: "medical", name: "Soigner à Petit Paradis", desc: "Financer des consultations et des campagnes de soins.", impact: "Soigne les plus vulnérables" },
];

const AMOUNTS = [25, 50, 100, 250];

export default function Soutenir() {
  const [pillar, setPillar] = useState(PILLARS[0].id);
  const [amount, setAmount] = useState(50);

  return (
    <>
     <PageHeader
  eyebrow="Soutenir la mission"
  title="Investissez dans la transformation d'une vie."
  intro="Choisissez le pilier d'impact qui vous tient. Chaque contribution soutient un acte concret de la mission."
  image="/images/soutenir-hero.jpg"
/>

      <section className="bg-background py-20 sm:py-28 grain">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Pillar selection */}
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Étape 1 — Choisissez votre pilier d'impact</p>
              <div className="space-y-3">
                {PILLARS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPillar(p.id)}
                    className={`w-full text-left p-5 border transition-all ${
                      pillar === p.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-heading text-lg mb-1">{p.name}</h3>
                        <p className="text-sm text-foreground/60">{p.desc}</p>
                      </div>
                      <span className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${pillar === p.id ? "border-accent bg-accent" : "border-border"}`}>
                        {pillar === p.id && <Check size={12} className="text-white" />}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount + summary */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32 bg-primary text-primary-foreground p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Étape 2 — Votre participation</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {AMOUNTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className={`py-4 text-center font-heading text-xl transition-colors ${
                        amount === a ? "bg-accent text-accent-foreground" : "bg-white/10 hover:bg-white/15"
                      }`}
                    >
                      {a} XOF
                    </button>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-6 mt-6">
                  <p className="text-sm text-primary-foreground/60 mb-1">Votre impact</p>
                  <p className="font-heading text-xl leading-snug">{PILLARS.find((p) => p.id === pillar)?.impact}</p>
                </div>

                <div className="border-t border-white/10 pt-6 mt-6 flex items-baseline justify-between">
                  <span className="text-sm text-primary-foreground/60">Total</span>
                  <span className="font-heading text-3xl">{amount} XOF</span>
                </div>

                <button className="w-full mt-6 bg-accent text-accent-foreground py-4 font-medium hover:bg-accent/90 transition-colors">
                  Participer maintenant
                </button>
                <p className="text-xs text-primary-foreground/40 mt-4 text-center">Don sécurisé · Reçu fiscal disponible</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}