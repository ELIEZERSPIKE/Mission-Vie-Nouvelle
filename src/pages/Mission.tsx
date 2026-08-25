import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import { Check, ArrowRight } from "lucide-react";

const TABS = [
  {
    key: "histoire",
    label: "Notre histoire",
    heading: "D'un petit groupe à un écosystème de mission",
    body: [
      "Tout a commencé, lorsqu'un petit groupe de croyants s'est rassemblé autour de l'appel du Christ : « Suivez-moi, et je vous ferai pêcheurs d'hommes. »",
      "De cette obéissance simple sont nées, au fil des décennies, des églises, des écoles, des ateliers de formation et des centres de soins — chacun répondant à un besoin concret.",
      "Aujourd'hui, la mission Vie Nouvelle Togo est une mission interconnectée, présente à Togoville (Petit Paradis), et rayonnant à travers tout le pays.",
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
      "Vie Nouvelle Togo est dirigée par un conseil de mission composé de pasteurs, de responsables de départements engagés.",
      "Chaque département est dirigé par un responsable qui rend compte au conseil, assurant cohérence, transparence et continuité de la vision à travers le pays.",
    ],
  },
];

export default function Mission() {
  const [tab, setTab] = useState("histoire");
  const active = TABS.find((t) => t.key === tab) ?? TABS[0];

  return (
    <>
      <PageHeader
        eyebrow="La Mission"
        title="Qui sommes-nous, d'où nous venons, où nous allons."
        intro="Vie Nouvelle Togo est une mission chrétienne qui agit sur tout l'être humain, du spirituel au concret. Découvrez notre histoire, notre vision et nos valeurs."
        image="/images/soutenir-hero.jpg"
      />

      <section className="bg-background py-20 sm:py-28 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Tab nav */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-32 flex lg:flex-col gap-1 overflow-x-auto scrollbar-hide lg:overflow-visible border-b lg:border-b-0 lg:border-l border-border/50 pb-2 lg:pb-0">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`group flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all duration-300 whitespace-nowrap lg:whitespace-normal lg:border-l-2 -ml-px relative ${
                      tab === t.key 
                        ? "text-accent lg:border-accent bg-accent/5 rounded-lg lg:rounded-none lg:bg-transparent" 
                        : "text-foreground/55 hover:text-foreground hover:bg-accent/5 rounded-lg lg:rounded-none lg:bg-transparent lg:border-transparent"
                    }`}
                  >
                    <span className="hidden lg:inline">{t.label}</span>
                    <span className="lg:hidden">{t.label}</span>
                    {tab === t.key && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-accent/10 rounded-lg lg:hidden"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-8 lg:col-start-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* Heading with icon */}
                  <div className="flex items-start gap-4 mb-7">
                    <h2 className="font-heading text-3xl sm:text-4xl leading-tight text-balance">
                      {active.heading}
                    </h2>
                  </div>

                  {/* Body text */}
                  {active.body.map((p, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.2 }}
                      className="text-lg text-foreground/70 leading-relaxed mb-5"
                    >
                      {p}
                    </motion.p>
                  ))}

                  {/* Bullets */}
                  {active.bullets && (
                    <motion.ul
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 space-y-3"
                    >
                      {active.bullets.map((b, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 + 0.4 }}
                          className="flex items-start gap-3 group"
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5 group-hover:bg-accent/20 transition-colors">
                            <Check size={14} className="text-accent" />
                          </span>
                          <span className="text-foreground/80">{b}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}

                  {/* Footer decoration */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 pt-8 border-t border-border/50"
                  >
                    <p className="text-sm text-foreground/40 flex items-center gap-2">
                      <Link to="/#ecosystem" className="inline-flex items-center gap-2 text-accent hover:underline">
                        Découvrez aussi nos départements
                        <ArrowRight size={14} className="text-accent" />
                      </Link>
                    </p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}