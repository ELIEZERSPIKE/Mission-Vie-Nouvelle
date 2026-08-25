// Centralized content data for Vie Nouvelle Togo
export type AccentColor = "ochre" | "indigo" | "veridian";

export interface Department {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: AccentColor;
}

export const DEPARTMENTS: Department[] = [
  {
    slug: "eglises",
    name: "Églises",
    tagline: "Des communautés vivantes à travers le Togo",
    description: "Des paroisses établies de ville en village, animées par des pasteurs dévoués et ancrées dans l'Évangile.",
    accent: "ochre",
  },
  {
    slug: "formation",
    name: "Formation",
    tagline: "FATT & Fathet",
    description: "Former des disciples et des serviteurs capables d'enseigner et de conduire avec intégrité.",
    accent: "indigo",
  },
  {
    slug: "education",
    name: "Éducation",
    tagline: "Primaire & Secondaire",
    description: " Accompagner les élèves  pour une génération instruite, intègre et confiante en son avenir.",
    accent: "ochre",
  },
  {
    slug: "centre-de-formation",
    name: "Centre de Formation",
    tagline: "Menuiserie · Carrelage · Plomberie ...",
    description: "Des métiers transmis aux jeunes, restaurant dignité et autonomie par le travail des mains.",
    accent: "indigo",
  },
  {
    slug: "medical",
    name: "Médical",
    tagline: "Petit Paradis — Togoville",
    description: "Des soins de proximité et un lieu de guérison, témoignant de l'amour du Christ en actes.",
    accent: "veridian",
  },
];


const FOUNDING_YEAR = 1996;

const currentMissionYear = new Date().getFullYear() - FOUNDING_YEAR + 1;

export const STATS = [
  { value: String(currentMissionYear), suffix: "", label: "Années de mission" },
  { value: "12", suffix: "+", label: "Églises établies" },
  { value: "125", suffix: "+", label: "Élèves scolarisés" },
  { value: "450", suffix: "+", label: "Pasteurs formés" },
];

export const TESTIMONIALS = [
  {
    quote: "Le Centre de Formation m'a donné un métier et ma dignité. Aujourd'hui je nourris ma famille et je forme à mon tour d'autres jeunes.",
    name: "Kossi",
    role: " Diplômé",
  },
  {
    quote: "L'Institut Biblique a transformé ma compréhension de l'Évangile. Je sers maintenant mon église avec assurance et intégrité.",
    name: "Sœur Afi",
    role: "Ancienne étudiante, FATT",
  },
  {
    quote: "À Petit Paradis, j'ai reçu des soins que je ne pouvais pas payer ailleurs. On m'a traité avec respect, comme une personne.",
    name: "Mama Akossiwa",
    role: "Patiente, Togoville",
  },
];

export const NEWS = [
  { tag: "Formation", date: "12 Juil 2026", title: "Remise des diplômes à la 22e promotion de l'Institut Biblique", excerpt: "Trente-cinq étudiants ont reçu leur diplôme après trois années d'étude et de service." },
  { tag: "Éducation", date: "28 Juin 2026", title: "Rentrée scolaire : 240 nouveaux élèves accueillis", excerpt: "Les écoles primaire et secondaire ouvrent leurs portes à une nouvelle génération." },
  { tag: "Médical", date: "10 Juin 2026", title: "Campagne de soins gratuite à Petit Paradis, Tokoin", excerpt: "Plus de 400 personnes ont reçu une consultation médicale durant la campagne." },
];

export const EVENTS = [
  { date: "2026-08-15", title: "Conférence missionnelle annuelle", location: "Togoville" },
  { date: "2026-09-01", title: "Cérémonie de rentrée — Écoles", location: "Tokoin" },
  { date: "2026-10-12", title: "Portes ouvertes du Centre de Formation", location: "Ateliers, Tokoin" },
];