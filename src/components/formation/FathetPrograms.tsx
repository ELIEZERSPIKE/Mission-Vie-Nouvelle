// FathetPrograms.tsx - Version épurée et naturelle
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

type ProgramLevel = "licence" | "master" | "certification";
type ProgramAccent = "amber" | "indigo" | "emerald" | "rose" | "sky";

interface Program {
  title: string;
  subtitle: string;
  duration: string;
  desc: string;
  level: ProgramLevel;
  accent: ProgramAccent;
}

const programs: Program[] = [
  {
    title: "PDLM",
    subtitle: "Préparation aux Diplômes de Licence & Master",
    duration: "03 ans",
    desc: "Formation pour tous les pasteurs et ceux qui n'ont pas le BAC. Permet de faire son BAC et continuer en Licence de Théologie.",
    level: "licence",
    accent: "amber",
  },
  {
    title: "Licence 1 - 2 - 3",
    subtitle: "Licence en Théologie",
    duration: "03 ans",
    desc: "Formation en 1ère, 2ème et 3ème année de licence avec soutenance de mémoire en fin de cycle.",
    level: "licence",
    accent: "indigo",
  },
  {
    title: "Master 1 - 2",
    subtitle: "Master en Théologie",
    duration: "02 ans",
    desc: "Pour la poursuite en profondeur conduisant aux recherches et à la spécialisation avec soutenance de thèses.",
    level: "master",
    accent: "emerald",
  },
  {
    title: "Bachelor 1 - 2 - 3",
    subtitle: "Bachelor en Théologie",
    duration: "06 mois/niveau",
    desc: "Cours spécifiques pour le Bac CITAF (Bac Théologique) équivalent au Bac académique.",
    level: "licence",
    accent: "rose",
  },
  {
    title: "Certification",
    subtitle: "Épouses de Serviteurs",
    duration: "01 an",
    desc: "Séminaires périodiques pour la formation des femmes de Pasteurs avec attestations de participation.",
    level: "certification",
    accent: "sky",
  },
];

const programAccentClasses: Record<ProgramAccent, {
  text: string;
  border: string;
  bg: string;
  bgHover: string;
  ring: string;
}> = {
  amber: {
    text: "text-amber-600",
    border: "border-amber-200",
    bg: "bg-amber-50",
    bgHover: "hover:bg-amber-50/70",
    ring: "hover:ring-amber-200/50",
  },
  indigo: {
    text: "text-indigo-600",
    border: "border-indigo-200",
    bg: "bg-indigo-50",
    bgHover: "hover:bg-indigo-50/70",
    ring: "hover:ring-indigo-200/50",
  },
  emerald: {
    text: "text-emerald-600",
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    bgHover: "hover:bg-emerald-50/70",
    ring: "hover:ring-emerald-200/50",
  },
  rose: {
    text: "text-rose-600",
    border: "border-rose-200",
    bg: "bg-rose-50",
    bgHover: "hover:bg-rose-50/70",
    ring: "hover:ring-rose-200/50",
  },
  sky: {
    text: "text-sky-600",
    border: "border-sky-200",
    bg: "bg-sky-50",
    bgHover: "hover:bg-sky-50/70",
    ring: "hover:ring-sky-200/50",
  },
};

const FilterBadge = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
        active
          ? "bg-foreground text-background border-foreground shadow-sm"
          : "bg-background/40 hover:bg-foreground/5 border-border/40 text-foreground/60 hover:text-foreground"
      }`}
    >
      {label}
    </motion.button>
  );
};

const ProgramCard = ({ program, index }: { program: Program; index: number }) => {
  const accent = programAccentClasses[program.accent];

  return (
    <Link to={`/contact?programme=${encodeURIComponent(program.title)}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.5,
            delay: index * 0.06,
            ease: [0.25, 0.1, 0.25, 1]
          }
        }}
        whileHover={{ 
          y: -4,
          transition: { duration: 0.2 }
        }}
        className={`group relative p-5 rounded-xl bg-white border ${accent.border}/30 hover:${accent.border} shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`}
      >
        <div className="flex flex-col gap-2.5">
          {/* En-tête */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground text-base tracking-tight">
                {program.title}
              </h3>
              <p className="text-xs text-foreground/50 font-light">
                {program.subtitle}
              </p>
            </div>
            <span className={`text-[10px] ${accent.bg} ${accent.text} font-medium px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 border ${accent.border}/30`}>
              {program.duration}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-foreground/60 leading-relaxed line-clamp-2">
            {program.desc}
          </p>

          {/* Séparateur et CTA */}
          <div className="flex items-center justify-between pt-2.5 border-t border-border/40">
            <span className={`text-[10px] font-medium ${accent.text}`}>
              {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
            </span>
            <span className="text-[11px] text-foreground/40 group-hover:text-foreground/70 transition-colors duration-300">
              S'inscrire →
            </span>
          </div>
        </div>

        {/* Petit indicateur coloré */}
        <div 
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full transition-all duration-300 ${accent.bg} group-hover:h-10`}
        />
      </motion.div>
    </Link>
  );
};

export default function FathetPrograms() {
  const [filterLevel, setFilterLevel] = useState<"all" | ProgramLevel>("all");

  const filteredPrograms = programs.filter(
    (prog) => filterLevel === "all" || prog.level === filterLevel
  );

  return (
    <div>
      {/* Procédure d'Admission */}
      <div className="mb-6">
        <div className="p-5 rounded-xl bg-white border border-border/40 shadow-sm">
          <h4 className="text-sm font-medium text-foreground/70 tracking-wide mb-3">
            Procédure d'Admission
          </h4>

          <p className="text-sm text-foreground/60 leading-relaxed mb-4">
            Téléchargez le dossier d'inscription, remplissez-le, et joignez les pièces suivantes :
          </p>

          <ul className="space-y-2 mb-4">
            {[
              "Curriculum Vitae (CV)",
              "Copies des diplômes",
              "Lettre de recommandation",
              "Pièces complémentaires",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/70">
                <span className="text-foreground/30 text-xs mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="p-3 rounded-lg bg-foreground/5 border border-border/30">
            <p className="text-xs text-foreground/60 leading-relaxed">
              <span className="font-medium text-foreground/80">Important :</span> Tous les documents doivent être réunis en un seul fichier PDF à transmettre à la faculté.
            </p>
          </div>
        </div>
      </div>

      {/* En-tête */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground/70 tracking-wide mb-3">
          Niveaux & Diplômes
        </h4>

        <div className="flex gap-2 flex-wrap">
          {(["all", "licence", "master", "certification"] as const).map((filter) => (
            <FilterBadge
              key={filter}
              label={filter === "all" ? "Tous" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              active={filterLevel === filter}
              onClick={() => setFilterLevel(filter)}
            />
          ))}
        </div>
      </div>

      {/* Grille */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={filterLevel}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.6 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {filteredPrograms.map((prog, i) => (
            <ProgramCard key={`${prog.title}-${i}`} program={prog} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Message vide */}
      {filteredPrograms.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-sm text-foreground/40">Aucun programme disponible</p>
        </motion.div>
      )}
    </div>
  );
}