
import { motion, useScroll, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, GraduationCap } from "lucide-react";
interface FormationHeroProps {
  onSelectBranch: (branch: "fatt" | "fathet") => void;
}

/* ---------- Variants : cascade du bloc de texte ---------- */
const columnVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/* ---------- Variants : mots du titre, un par un ---------- */
const titleContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function FormationHero({ onSelectBranch }: FormationHeroProps): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax : suit le scroll uniquement pendant que la section traverse l'écran
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 60]);

  const titleWords = ["Former", "pour"];

  return (
    <section
      ref={sectionRef}
      className="relative bg-background border-b border-border overflow-hidden py-16 sm:py-24"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Contenu Texte (7 colonnes sur desktop) — apparition en cascade */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            variants={columnVariants}
            initial="hidden"
            animate="show"
          >
            {/* 1. Badge d'en-tête */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent bg-accent/10 px-3.5 py-1.5 rounded-full"
            >
              <span>Centre de Formation Biblique et Pastorale Mission Vie Nouvelle</span>
            </motion.div>

            {/* 2. Titre H1 — mot par mot */}
            <motion.h1
              variants={titleContainer}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
            >
              {titleWords.map((word, i) => (
                <motion.span key={i} variants={wordVariants} className="inline-block mr-3">
                  {word}
                </motion.span>
              ))}
              <motion.span variants={wordVariants} className="inline-block text-accent">
                transformer.
              </motion.span>
            </motion.h1>

            {/* 3. Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-foreground/75 leading-relaxed max-w-2xl"
            >
              Un investissement dans la maturité spirituelle, le leadership et l'efficacité dans le ministère pour l'Église et la société.
            </motion.p>

            {/* 4. Verset d'ancrage */}
            <motion.div
              variants={itemVariants}
              className="p-4 sm:p-5 border-l-2 border-accent bg-secondary/30 rounded-r-lg max-w-xl"
            >
              <blockquote className="text-sm sm:text-base italic text-foreground/80">
                « Soyez transformés par le renouvellement de l'intelligence, afin que vous discerniez quelle est la volonté de Dieu... »
              </blockquote>
              <cite className="block text-xs font-semibold text-accent mt-2 not-italic">
                — Romains 12:2
              </cite>
            </motion.div>

            {/* 5. Boutons CTA */}
            <motion.div variants={itemVariants} className="pt-2 flex flex-wrap gap-4">
              <a
                href="#fathet"
                onClick={() => onSelectBranch("fathet")}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm text-sm"
              >
                Fatehet (La Faculté de Théologie de Togoville) 
              </a>
              <a
                href="#fatt"
                onClick={() => onSelectBranch("fatt")}
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3 rounded-lg font-medium transition-colors border border-border text-sm"
              >
                le FATT
              </a>
            </motion.div>
          </motion.div>

          {/* Visuel (5 colonnes sur desktop) — apparition + parallax au scroll */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border shadow-2xl">
              <motion.img
                src="/images/formation/hero.jpg"
                alt="Étudiants en formation biblique"
                style={{ y: imageY, scale: 1.15 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Badge flottant sur l'image */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-2 text-accent">
                  <GraduationCap size={20} />
                  <span className="text-xs font-semibold uppercase tracking-widest">Maturité & Service</span>
                </div>
                <p className="font-heading text-lg leading-snug">
                  Deux voies complémentaires pour répondre à votre appel.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}