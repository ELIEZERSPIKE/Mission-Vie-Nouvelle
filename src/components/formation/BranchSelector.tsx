// BranchSelector.tsx - Version avec numéros corrigés + programmes cliquables
// FattAdmission et FathetPrograms ont été extraits dans leurs propres composants
import React from "react"
import { motion } from "framer-motion";
import {
  ChevronDown,
  Target,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import BranchCarousel from "@/components/BranchCarousel";
import InstitutAdmission from "@/components/formation/InstitutAdmission";
import FathetPrograms from "@/components/formation/FathetPrograms";
import { trainingLocations, TrainingLocation } from "@/data/trainingLocations";
import { branchImages } from "@/data/branchImages";

export type BranchType = "institut-biblique" | "fathet";

interface BranchSelectorProps {
  activeBranch: BranchType;
  onSelectBranch: (branch: BranchType) => void;
}

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
        </div>
      </div>
    </motion.div>
  );
};

export default function BranchSelector({ activeBranch, onSelectBranch }: BranchSelectorProps) {
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
          <div id="fatt" className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Texte - Gauche */}
            <motion.div
              className="order-2 lg:order-1 lg:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div
                onClick={() => onSelectBranch("institut-biblique")}
                className="cursor-pointer mb-6 space-y-2"
              >
                <span className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em]">
                  <Target className="w-3.5 h-3.5" />
                  Institut biblique Neues Leben
                </span>
                <h4 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight pt-1">
                  Etablissement d'Enseignement Théologique Interconfessionnel
                </h4>
              </div>

              <p className="text-foreground/70 leading-relaxed text-base mb-6 max-w-xl">
                Former des serviteurs de Dieu à être des héros de grand calibre, capables d'arracher des âmes qui jusqu'ici sont tenues captives dans les ténèbres.
              </p>

              <InstitutAdmission />

              <div className="pt-2 border-t border-border/20 max-w-xl">
                {/* <a
                  href="#enseignants"
                  onClick={() => onSelectBranch("institut-biblique")}
                  className="inline-flex items-center gap-2 font-medium text-accent hover:gap-3 transition-all duration-300 text-sm group"
                >
                  Voir l'équipe &amp; les modules Institut biblique
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-x-1 -rotate-90" />
                </a> */}
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
                onClick={() => onSelectBranch("institut-biblique")}
                className={`relative aspect-[4/5] rounded-2xl overflow-hidden border shadow-2xl cursor-pointer group transition-all duration-500 ${
                  activeBranch === "institut-biblique" ? "border-accent/60 shadow-accent/20" : "border-border hover:border-accent/40"
                }`}
              >
                <img
                  src="/images/institut-biblique/learning2.jpg"
                  alt="Formation Institut biblique - Formation d'Action & Terrain Théologique"
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

              {/* Localisation Institut biblique */}
             
            </motion.div>
          </div>

          {/* ---------- CURSUS 2 : FATHET ---------- */}
          <div id="fathet" className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">

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

              <FathetPrograms />

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
              if (img.id.startsWith('fatt') || img.branch?.toLowerCase().includes('institut')) {
                onSelectBranch('institut-biblique');
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