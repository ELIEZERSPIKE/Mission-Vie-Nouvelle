import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import TextRoll from "@/components/ui/TextRoll";
import { MapPin, Search, MessageCircle } from "lucide-react";

const REGIONS = ["Toutes", "Maritime", "Plateaux", "Centrale", "Kara", "Savanes"];

const REGIONS_EN_IMPLEMENTATION = ["Centrale"];

const CHURCHES = [
  { name: "Église Vie Nouvelle Lomé", region: "Maritime", phone: "+228 92-61-90-72" },
  { name: "Église Vie Nouvelle Tsikplonou", region: "Maritime", phone: "+228 90-79-49-92" },
  { name: "Église Vie Nouvelle Vogan", region: "Plateaux", phone: "+228 93-98-90-61" },
  { name: "Église Vie Nouvelle Togoville Tokoin", region: "Maritime", phone: "+228 99-48-54-55" },
  { name: "Église Vie Nouvelle Togoville 2", region: "Maritime", phone: "+228 93-74-71-92" },
  { name: "Église Vie Nouvelle Kpélé", region: "Plateaux", phone: "+228 90-88-81-07" },
  { name: "Église Vie Nouvelle Edocope", region: "Maritime", phone: "+228 98-07-75-92" },
  { name: "Église Vie Nouvelle Kpalimé", region: "Plateaux", phone: "+228 92-77-29-70" },
  { name: "Église Vie Nouvelle Kara", region: "Kara", phone: "+228 90-31-81-86" },
  { name: "Église Vie Nouvelle Gnangbade", region: "Savanes", phone: "+228 93-59-27-82" },
  { name: "Église Vie Nouvelle Ouake", region: "Département de la Donga (Bénin)", phone: "+229 51-762-490" },
  { name: "Église Vie Nouvelle Deve", region: "Département de Couffo (Bénin)", phone: "+229 95-685-858" },
  { name: "Église Vie Nouvelle Segbohoue", region: "Département de l'Atlantique (Bénin)", phone: "+229 01-966-40969" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

export default function Eglises(): React.JSX.Element {
  const [region, setRegion] = useState("Toutes");
  const [query, setQuery] = useState("");
  const prefersReducedMotion = useReducedMotion();

  const filtered = useMemo(() => {
    return CHURCHES.filter((c) => {
      const matchRegion = region === "Toutes" || c.region === region;
      const matchQuery =
        query.trim() === "" ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.region.toLowerCase().includes(query.toLowerCase());
      return matchRegion && matchQuery;
    });
  }, [region, query]);

  const isImplementationRegion = REGIONS_EN_IMPLEMENTATION.includes(region);

  return (
    <>
      <PageHeader
        eyebrow="Vie Spirituelle"
        title="Cultivez votre foi."
        intro="Rejoignez nos communautés et grandissez ensemble dans la foi."
        image="/images/eglises-hero.jpg"
      />

      <section className="bg-background py-16 sm:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">

          {/* === Recherche compacte + Filtres === */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10">

            {/* Filtres par région */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex flex-wrap gap-2 order-2 lg:order-1"
            >
              {REGIONS.map((r) => {
                const isActive = region === r;
                return (
                  <motion.button
                    key={r}
                    variants={cardVariants}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setRegion(r)}
                    className={`relative px-4 py-2 text-xs sm:text-sm rounded-full border transition-colors duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-foreground/60 hover:border-accent/60 hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeRegionPill"
                        className="absolute inset-0 bg-primary rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{r}</span>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Recherche compacte */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full lg:w-64 order-1 lg:order-2 group"
            >
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-accent transition-colors"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher…"
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-full text-xs sm:text-sm
                           placeholder:text-foreground/40
                           focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20
                           transition-all duration-200"
              />
            </motion.div>
          </div>

          {/* === Compteur discret === */}
          <AnimatePresence mode="wait">
            {!isImplementationRegion && filtered.length > 0 && (
              <motion.p
                key={`${region}-${query}-${filtered.length}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[11px] uppercase tracking-[0.2em] text-foreground/40 mb-6"
              >
                {filtered.length} église{filtered.length > 1 ? "s" : ""}
              </motion.p>
            )}
          </AnimatePresence>

          {/* === Grille classique espacée === */}
          {!isImplementationRegion && (
            <motion.div
              layout
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((c) => {
                  const whatsappHref = `https://wa.me/${c.phone.replace(
                    /\D/g,
                    ""
                  )}?text=${encodeURIComponent(
                    `Bonjour, je souhaite avoir des informations sur ${c.name}.`
                  )}`;

                  return (
                    <motion.article
                      key={c.name}
                      layout
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="group relative bg-background border border-border/70 rounded-2xl p-6 sm:p-7
                                 hover:border-accent/60 transition-colors"
                    >
                      {/* Badge région discret */}
                      <p className="text-[10px] uppercase tracking-[0.2em] text-accent/80 mb-2.5 flex items-center gap-1.5">
                        <MapPin size={10} />
                        {c.region}
                      </p>

                      {/* Nom */}
                      <h3 className="font-heading text-lg leading-snug mb-5 text-foreground">
                        <TextRoll>{c.name}</TextRoll>
                      </h3>

                      {/* Téléphone WhatsApp */}
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-foreground/60
                                   hover:text-accent transition-colors"
                      >
                        <MessageCircle size={13} />
                        <span>{c.phone}</span>
                      </a>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {/* === État "En implémentation" épuré === */}
          <AnimatePresence mode="wait">
            {isImplementationRegion && (
              <motion.div
                key="implementation"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-center py-20 px-6 max-w-lg mx-auto"
              >
                {/* Badge discret */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                                bg-accent/10 text-accent
                                text-[10px] uppercase tracking-[0.25em] font-medium mb-6">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-accent"
                    animate={prefersReducedMotion ? {} : { opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  En implémentation
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl mb-3 text-balance">
                  La région <span className="text-accent">Centrale</span> arrive bientôt.
                </h3>

                <p className="text-foreground/60 text-sm sm:text-base leading-relaxed">
                  Une nouvelle communauté Vie Nouvelle est en cours d'implantation.
                  Restez connectés, la famille s'agrandit.
                </p>

                <button
                  onClick={() => {
                    setRegion("Toutes");
                    setQuery("");
                  }}
                  className="mt-10 inline-flex items-center gap-2 px-6 py-2.5 rounded-full
                             border border-border text-sm text-foreground/70
                             hover:border-accent/60 hover:text-accent transition-colors"
                >
                  Voir toutes les églises
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* === État vide (recherche) === */}
          <AnimatePresence>
            {!isImplementationRegion && filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <p className="text-foreground/50 text-base">
                  Aucune église ne correspond à votre recherche.
                </p>
                <button
                  onClick={() => {
                    setRegion("Toutes");
                    setQuery("");
                  }}
                  className="mt-5 text-sm text-accent underline underline-offset-4 hover:opacity-80"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* === Section Adoration épurée === */}
      <section className="relative py-24 sm:py-32 bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-primary/80" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-[1400px] mx-auto px-5 sm:px-8 text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-5">
            Communion
          </p>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-balance max-w-3xl mx-auto">
            Adorez là où votre cœur se sent chez lui.
          </h2>

          <p className="mt-6 text-base sm:text-lg text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Chaque église de la mission Vie Nouvelle est un lieu d'accueil où la foi se vit
            ensemble. Rejoignez une communauté proche de vous et adorez aux côtés de croyants
            qui partagent le même chemin.
          </p>

          <div className="mt-10">
            <a
              href="#top"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary rounded-full
                         text-sm font-medium hover:gap-3 transition-all duration-300"
            >
              Trouver une église
              <MapPin size={14} />
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
}