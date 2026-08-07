// BranchSelector.tsx - Version avec numéros corrigés
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Target,
  FileText,
  Award,
  GraduationCap,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  Clock,
} from "lucide-react";
import BranchCarousel from "@/components/BranchCarousel";
import { trainingLocations, TrainingLocation } from "@/data/trainingLocations";
import { branchImages } from "@/data/branchImages";

export type BranchType = "fatt" | "fathet";

interface BranchSelectorProps {
  activeBranch: BranchType;
  onSelectBranch: (branch: BranchType) => void;
}

// Composant pour les badges de filtre
const FilterBadge = ({ 
  label, 
  active, 
  onClick, 
  color = "primary" 
}: { 
  label: string; 
  active: boolean; 
  onClick: () => void; 
  color?: "primary" | "accent";
}) => {
  const colorClasses = {
    primary: active ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-background/40 hover:bg-primary/10 border-border/30",
    accent: active ? "bg-accent text-white shadow-lg shadow-accent/30" : "bg-background/40 hover:bg-accent/10 border-border/30",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${
        colorClasses[color]
      }`}
    >
      {label}
    </button>
  );
};

// Composant pour les programmes (réutilisable)
const ProgramCard = ({ 
  program, 
  color = "primary" 
}: { 
  program: any; 
  color?: "primary" | "accent";
}) => {
  const borderColor = color === "primary" ? "hover:border-primary/30" : "hover:border-accent/30";
  const badgeColor = color === "primary" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl bg-background/60 border border-border/30 ${borderColor} transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-foreground">{program.title}</span>
            <span className="text-xs text-foreground/60">— {program.subtitle}</span>
          </div>
          <p className="text-xs text-foreground/60 mt-1 line-clamp-2">{program.desc}</p>
        </div>
        <span className={`text-[10px] ${badgeColor} font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0`}>
          {program.duration}
        </span>
      </div>
    </motion.div>
  );
};

// Composant Localisation avec numéros corrigés
const LocationInfo = ({ 
  location, 
  accentColor = "primary",
  className = "",
}: { 
  location: TrainingLocation; 
  accentColor?: "primary" | "accent";
  className?: string;
}) => {
  if (!location) return null;

  const colorClass = accentColor === "primary" ? "text-primary" : "text-accent";
  const borderClass = accentColor === "primary" ? "border-primary/20" : "border-accent/20";
  const bgClass = accentColor === "primary" ? "bg-primary/5" : "bg-accent/5";
  const hoverBgClass = accentColor === "primary" ? "hover:bg-primary/10" : "hover:bg-accent/10";

  // Emails généraux de l'institut
  const generalEmails = [
    'missionvienouvelle@missionvienouvelle.net',
    'infos@missionvienouvelle.net'
  ];

  // Numéros de téléphone corrigés
  const generalPhones = [
    '+228 92 33 23 33',
    '+228 90 90 02 55',
    '+228 96 05 35 14',
    '+228 99 48 54 55'
  ];

  const getMapsUrl = () => {
    if (location.mapEmbedUrl) {
      if (location.mapEmbedUrl.includes('embed')) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapsQuery || `${location.quartier}, ${location.city}`)}`;
      }
      return location.mapEmbedUrl;
    }
    const query = location.mapsQuery || `${location.quartier}, ${location.city}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const handleOpenMap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getMapsUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/\s/g, '');
  };

  // Déterminer quels numéros afficher (ceux du centre + généraux)
  const displayPhones = location.phones && location.phones.length > 0 
    ? [...location.phones, ...generalPhones.filter(p => !location.phones?.includes(p))]
    : generalPhones;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`mt-4 p-4 rounded-2xl bg-background/80 backdrop-blur-sm border ${borderClass} ${bgClass} ${hoverBgClass} transition-all duration-300 group ${className}`}
    >
      {/* En-tête avec Map */}
      <div className="flex items-center gap-4">
        {/* Icône Map avec effet de glow */}
        <button
          onClick={handleOpenMap}
          className={`flex-shrink-0 p-3 rounded-xl ${bgClass} border ${borderClass} transition-all duration-300 hover:scale-110 ${colorClass} group-hover:shadow-lg relative`}
          aria-label="Ouvrir sur Google Maps"
          title="Ouvrir sur Google Maps"
        >
          <MapPin className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
        </button>

        {/* Infos principales */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">
               {location.quartier}
            </span>
            <span className="text-xs text-foreground/40">•</span>
            <span className="text-xs text-foreground/60">
              {location.city}
            </span>
          </div>
          
          {/* Emails */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {generalEmails.map((email, idx) => (
              <a
                key={idx}
                href={`mailto:${email}`}
                className={`inline-flex items-center gap-1 text-[11px] ${colorClass} hover:underline transition-all duration-300`}
              >
                <Mail className="w-3 h-3" />
                {email}
              </a>
            ))}
          </div>
        </div>

        {/* Bouton d'ouverture Maps */}
        <button
          onClick={handleOpenMap}
          className={`flex-shrink-0 p-2.5 rounded-xl transition-all duration-300 ${colorClass} bg-background/60 border border-border/30 hover:shadow-md hover:scale-105`}
          aria-label="Voir sur Google Maps"
          title="Voir sur Google Maps"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Téléphones - Section dédiée avec les numéros corrigés */}
      <div className="mt-3 pt-3 border-t border-border/20">
        <div className="flex items-center gap-2 mb-2">
          <Phone className="w-3.5 h-3.5 text-foreground/40" />
          <span className="text-[10px] text-foreground/40 uppercase tracking-wider">Contacts téléphoniques</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {generalPhones.map((phone, idx) => (
            <a
              key={idx}
              href={`tel:${formatPhone(phone)}`}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-background/60 border border-border/30 ${colorClass} hover:shadow-md transition-all duration-300 hover:scale-[1.02]`}
            >
              <Phone className="w-3 h-3" />
              {phone}
            </a>
          ))}
        </div>
      </div>

      {/* Pied de carte */}
      <div className="mt-3 pt-2 border-t border-border/20 flex items-center justify-between">
        <span className="text-[10px] text-foreground/40 uppercase tracking-wider">
          {location.id === 'fatt' ? 'Centre de formation FATT' : 'Institut FATHET'}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-foreground/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Disponible
          </span>
          <span className="text-[10px] text-foreground/30 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Lun-Ven
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default function BranchSelector({ activeBranch, onSelectBranch }: BranchSelectorProps) {
  const [filterLevel, setFilterLevel] = useState<'all' | 'licence' | 'master' | 'certification'>('all');

  const programs = [
    {
      title: "PDLM",
      subtitle: "Préparation aux Diplômes de Licence & Master",
      duration: "03 ans",
      desc: "Formation pour tous les pasteurs et ceux qui n'ont pas le BAC. Permet de faire son BAC et continuer en Licence de Théologie.",
      level: 'licence',
    },
    {
      title: "Licence 1 - 2 - 3",
      subtitle: "Licence en Théologie",
      duration: "03 ans",
      desc: "Formation en 1ère, 2ème et 3ème année de licence avec soutenance de mémoire en fin de cycle.",
      level: 'licence',
    },
    {
      title: "Master 1 - 2",
      subtitle: "Master en Théologie",
      duration: "02 ans",
      desc: "Pour la poursuite en profondeur conduisant aux recherches et à la spécialisation avec soutenance de thèses.",
      level: 'master',
    },
    {
      title: "Bachelor 1 - 2 - 3",
      subtitle: "Bachelor en Théologie",
      duration: "06 mois/niveau",
      desc: "Cours spécifiques pour le Bac CITAF (Bac Théologique) équivalent au Bac académique.",
      level: 'licence',
    },
    {
      title: "Certification",
      subtitle: "Épouses de Serviteurs",
      duration: "01 an",
      desc: "Séminaires périodiques pour la formation des femmes de Pasteurs avec attestations de participation.",
      level: 'certification',
    },
  ] as const;

  const filteredPrograms = programs.filter(prog =>
    filterLevel === 'all' || prog.level === filterLevel
  );

  const fattLocation = trainingLocations.find(l => l.id === 'fatt');
  const fathetLocation = trainingLocations.find(l => l.id === 'fathet');

  return (
    <section id="branches" className="py-20 bg-secondary/20 border-b border-border relative overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8">

        {/* ===== HEADER ===== */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest backdrop-blur-sm border border-accent/20">
            Structure & Galerie des Formations
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            Deux grands cursus, <br className="sm:hidden" />
            <span className="text-accent">deux vocations</span>
          </h2>
          <p className="text-foreground/60 text-sm max-w-xl mx-auto">
            Choisissez le parcours qui correspond à votre appel et à vos aspirations
          </p>
        </div>

        {/* ===== CURSUS ===== */}
        <div className="space-y-20 mb-14">

          {/* ---------- CURSUS 1 : FATT ---------- */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Texte - Gauche */}
            <motion.div
              className="order-2 lg:order-1 lg:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div
                onClick={() => onSelectBranch("fatt")}
                className="cursor-pointer mb-6 space-y-2"
              >
                <span className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em]">
                  <Target className="w-3.5 h-3.5" />
                  FATT
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight pt-1">
                  Formation d'Action &amp; Terrain Théologique
                </h3>
              </div>

              <p className="text-foreground/70 leading-relaxed text-base mb-6 max-w-xl">
                Former des serviteurs de Dieu à être des héros de grand calibre, capables d'arracher des âmes qui jusqu'ici sont tenues captives dans les ténèbres.
              </p>

              {/* Objectifs */}
              <div className="mb-6 max-w-xl">
                <h4 className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider mb-3">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  Objectifs stratégiques
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {[
                    "Former des serviteurs de Dieu à être des héros de grands calibres, capables d'arracher des âmes captives dans les ténèbres",
                    "Rétablir les enseignements fondamentaux de Jésus-Christ",
                    "Amener les leaders en toute humilité à œuvrer pour la croissance des Églises locales",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dossier d'admission */}
              <div className="mb-6 max-w-xl p-5 rounded-2xl bg-background/60 border border-border/40">
                <h4 className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider mb-3">
                  <FileText className="w-4 h-4 text-accent" />
                  Dossier d'admission
                </h4>
                <p className="text-sm text-foreground/70 mb-3">
                  Le candidat désireux de s'inscrire doit présenter sous chemise les documents suivants :
                </p>
                <ul className="grid grid-cols-2 gap-1.5 text-sm">
                  {[
                    "02 photos passeport",
                    "Copie du certificat de naissance",
                    "Carte d'identité en cours",
                    "Demande d'inscription",
                    "Lettre de recommandation",
                    "Certificat médical",
                    "Curriculum Vitae",
                    "Autorisation du conjoint(e)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-foreground/70">
                      <div className="w-1 h-1 rounded-full bg-accent/40" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-border/40">
                  <a
                    href="#inscription"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:gap-3 transition-all duration-300"
                  >
                    Remplir le formulaire d'inscription en ligne
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-border/20 max-w-xl">
                <a
                  href="#enseignants"
                  onClick={() => onSelectBranch("fatt")}
                  className="inline-flex items-center gap-2 font-medium text-accent hover:gap-3 transition-all duration-300 text-sm group"
                >
                  Voir l'équipe &amp; les modules FATT
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-x-1 -rotate-90" />
                </a>
              </div>
            </motion.div>

            {/* Image + Localisation - Droite */}
            <motion.div
              className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-28"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {/* Image */}
              <div
                onClick={() => onSelectBranch("fatt")}
                className={`relative aspect-[4/5] rounded-2xl overflow-hidden border shadow-2xl cursor-pointer group transition-all duration-500 ${
                  activeBranch === "fatt" ? "border-accent/60 shadow-accent/20" : "border-border hover:border-accent/40"
                }`}
              >
                <img
                  src="/images/fatt/learning2.jpg"
                  alt="Formation FATT - Formation d'Action & Terrain Théologique"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <div className="flex items-center gap-2 text-accent">
                    <Target size={20} />
                    <span className="text-xs font-semibold uppercase tracking-widest">Action &amp; Terrain</span>
                  </div>
                  <p className="font-heading text-lg leading-snug">
                    Sur le terrain, au service de l'Église locale.
                  </p>
                </div>
              </div>

              {/* Localisation FATT */}
              {fattLocation && (
                <LocationInfo location={fattLocation} accentColor="accent" />
              )}
            </motion.div>
          </div>

          {/* ---------- CURSUS 2 : FATHET ---------- */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            {/* Image + Localisation - Gauche */}
            <motion.div
              className="order-1 lg:col-span-5 lg:sticky lg:top-28"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {/* Image */}
              <div
                onClick={() => onSelectBranch("fathet")}
                className={`relative aspect-[4/5] rounded-2xl overflow-hidden border shadow-2xl cursor-pointer group transition-all duration-500 ${
                  activeBranch === "fathet" ? "border-primary/60 shadow-primary/20" : "border-border hover:border-primary/40"
                }`}
              >
                <img
                  src="/images/fathet/learning.jpg"
                  alt="FATHET - Institut Biblique Vie Nouvelle"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <GraduationCap size={20} />
                    <span className="text-xs font-semibold uppercase tracking-widest">Académique</span>
                  </div>
                  <p className="font-heading text-lg leading-snug">
                    Du niveau préparatoire jusqu'au Master.
                  </p>
                </div>
              </div>

              {/* Localisation FATHET */}
              {fathetLocation && (
                <LocationInfo location={fathetLocation} accentColor="primary" />
              )}
            </motion.div>

            {/* Texte - Droite */}
            <motion.div
              className="order-2 lg:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div
                onClick={() => onSelectBranch("fathet")}
                className="cursor-pointer mb-6 space-y-2"
              >
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em]">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Fathet
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight pt-1">
                  Faculté de Théologie de Togoville
                </h3>
              </div>

              <p className="text-foreground/70 leading-relaxed text-base mb-6 max-w-xl">
                Cursus académiques et théologiques complets allant du niveau préparatoire jusqu'au Master, ainsi que des programmes spécifiques pour le ministère.
              </p>

              {/* Parcours & Diplômes */}
              <div className="mb-6 max-w-xl">
                <h4 className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider mb-3">
                  <Award className="w-4 h-4 text-primary" />
                  Niveaux &amp; Diplômes proposés
                </h4>

                {/* Filtres */}
                <div className="flex gap-2 mb-3 flex-wrap">
                  {(['all', 'licence', 'master', 'certification'] as const).map(filter => (
                    <FilterBadge
                      key={filter}
                      label={filter === 'all' ? 'Tous' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                      active={filterLevel === filter}
                      onClick={() => setFilterLevel(filter)}
                      color="primary"
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <div className="space-y-2.5">
                    {filteredPrograms.map((prog, i) => (
                      <ProgramCard key={i} program={prog} color="primary" />
                    ))}
                  </div>
                </AnimatePresence>
              </div>

              {/* Demande d'admission */}
              <div className="mb-6 max-w-xl p-5 rounded-2xl bg-background/60 border border-border/40">
                <h4 className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider mb-3">
                  <FileText className="w-4 h-4 text-primary" />
                  Procédure de Demande d'Admission
                </h4>
                <p className="text-sm text-foreground/70 mb-3 leading-relaxed">
                  Pour toute demande d'admission, téléchargez le dossier d'inscription, remplissez-le convenablement, et ajoutez votre dossier complet :
                </p>
                <ul className="grid grid-cols-2 gap-1.5 text-sm mb-3">
                  {[
                    "Curriculum Vitae (CV)",
                    "Copies des Diplômes",
                    "Lettre de recommandation",
                    "Pièces complémentaires",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-foreground/70">
                      <div className="w-1 h-1 rounded-full bg-primary/40" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="p-3 rounded-lg bg-secondary/40 border border-border/30">
                  <p className="text-xs text-foreground/60">
                    <span className="font-semibold">📌 Important :</span> Le tout doit être réuni en un <strong>seul document</strong> à transmettre à la faculté ou à soumettre en ligne.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-border/40">
                  <a
                    href="#inscription"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-300"
                  >
                    Soumettre votre dossier d'admission en ligne
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-border/20 max-w-xl">
                <a
                  href="#programmes"
                  onClick={() => onSelectBranch("fathet")}
                  className="inline-flex items-center gap-2 font-medium text-primary hover:gap-3 transition-all duration-300 text-sm group"
                >
                  Explorer les programmes FATHET
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-x-1 -rotate-90" />
                </a>
              </div>
            </motion.div>
          </div>

        </div>

        {/* ===== CARROUSEL ===== */}
        <div className="mb-14">
          <BranchCarousel
            images={branchImages}
            radius={280}
            autoPlaySpeed={0}
            activeBranch={activeBranch}
            className="max-w-6xl mx-auto"
            onSelectBranch={onSelectBranch}
            onSelectImage={(img) => {
              if (img.id.startsWith('fatt') || img.branch === 'fatt') {
                onSelectBranch('fatt');
              } else if (img.id.startsWith('fathet') || img.branch === 'fathet') {
                onSelectBranch('fathet');
              }
            }}
          />
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.2);
        }
        .perspective-3d {
          perspective: 1200px;
        }
        .transform-3d {
          transform-style: preserve-3d;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}