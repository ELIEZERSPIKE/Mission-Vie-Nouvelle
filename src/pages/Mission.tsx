import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import { Check } from "lucide-react";

const TABS = [
  {
    key: "histoire",
    label: "Notre histoire",
    heading: "D'un petit groupe à un écosystème de mission",
    body: [
      "Tout a commencé à Togoville, sur les rives du lac Togo, lorsqu'un petit groupe de croyants s'est rassemblé autour de l'appel du Christ : « Suivez-moi, et je vous ferai pêcheurs d'hommes. »",
      "De cette obéissance simple sont nées, au fil des décennies, des églises, des écoles, des ateliers de formation et des centres de soins — chacun répondant à un besoin concret du peuple togolais.",
      "Aujourd'hui, Vie Nouvelle Togo est une mission interconnectée, présente à Togoville comme à Tokoin, et rayonnant à travers tout le pays.",
    ],
  },
  {
    key: "vision",
    label: "Notre vision",
    heading: "Voir le Togo restauré dans toutes ses dimensions",
    body: [
      "Nous croyons que l'Évangile du Christ touche l'être humain tout entier : son âme, son esprit, ses mains et son corps.",
      "Notre vision est de voir des communautés togolaises vivantes, instruites, autonomes et soignées — où la foi se traduit en actes concrets de transformation.",
    ],
  },
  {
    key: "mission",
    label: "Notre mission",
    heading: "Faire de chaque disciple un pêcheur d'hommes",
    body: [
      "Notre mission est de répondre à l'appel de Matthieu 4:19 en formant des disciples qui, à leur tour, transforment leurs communautés.",
      "Nous le faisons à travers cinq départements interconnectés : Églises, Formation, Éducation, Centre de Formation et Médical — chacun une expression vivante de l'Évangile en action.",
    ],
  },
  {
    key: "valeurs",
    label: "Nos valeurs",
    heading: "Ce qui nous anime et nous guide",
    body: [],
    bullets: [
      "Fidélité à l'Écriture et à l'appel du Christ",
      "Dignité de toute personne humaine",
      "Intégrité et transparence dans la gestion",
      "Ancrage local et respect de la culture togolaise",
      "Excellence et persévérance dans le service",
    ],
  },
  {
    key: "gouvernance",
    label: "Notre gouvernance",
    heading: "Une mission structurée et responsable",
    body: [
      "Vie Nouvelle Togo est dirigée par un conseil de mission composé de pasteurs, de responsables de départements et de laïcs engagés.",
      "Chaque département est dirigé par un responsable qui rend compte au conseil, assurant cohérence, transparence et continuité de la vision à travers le pays.",
    ],
  },
];

export default function Mission() {
  const [tab, setTab] = useState("histoire");
  const active = TABS.find((t) => t.key === tab);

  return (
    <>
      <PageHeader
        eyebrow="La Mission"
        title="Qui sommes-nous, d'où nous venons, où nous allons."
        intro="Vie Nouvelle Togo est une mission chrétienne qui agit sur tout l'être humain, du spirituel au concret, depuis Togoville et Tokoin."
      />

      <section className="bg-background py-20 sm:py-28 grain">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Tab nav */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-32 flex lg:flex-col gap-1 overflow-x-auto scrollbar-hide lg:overflow-visible border-b lg:border-b-0 lg:border-l border-border pb-2 lg:pb-0">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`text-left px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap lg:whitespace-normal lg:border-l-2 -ml-px ${
                      tab === t.key ? "text-accent lg:border-accent" : "text-foreground/55 hover:text-foreground lg:border-transparent"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-8 lg:col-start-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="font-heading text-3xl sm:text-4xl leading-tight text-balance mb-7">{active.heading}</h2>
                  {active.body.map((p, i) => (
                    <p key={i} className="text-lg text-foreground/70 leading-relaxed mb-5">{p}</p>
                  ))}
                  {active.bullets && (
                    <ul className="mt-6 space-y-3">
                      {active.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check size={18} className="text-accent shrink-0 mt-1" />
                          <span className="text-foreground/80">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}