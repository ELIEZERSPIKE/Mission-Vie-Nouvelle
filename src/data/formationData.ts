import { BookOpen, Users, GraduationCap, Award } from "lucide-react";
import type { Teacher, Program, Seminar, FaithPoint, StatItem } from "@/types/formation";

export const STATS: StatItem[] = [
  { value: "+450", label: "Élèves formés", icon: Users },
  { value: "+70", label: "Cours dispensés", icon: BookOpen },
  { value: "+250", label: "Réceptions / Diplômés", icon: GraduationCap },
  { value: "+15", label: "Professeurs engagés", icon: Award },
];

export const TEACHERS: Teacher[] = [
  // ---- FATHET ----
  {
    id: "fathet-1",
    name: "Nom Enseignant 1",
    role: "Titre / Matière enseignée",
    bio: "Courte biographie de l'enseignant...",
    image: "/images/Teachers/fathet-1.jpg", // ← remplace par ton vrai nom de fichier
    branch: "fathet",
  },
  {
    id: "fathet-2",
    name: "Nom Enseignant 2",
    role: "Titre / Matière enseignée",
    bio: "Courte biographie de l'enseignant...",
    image: "/images/Teachers/fathet-2.jpg",
    branch: "fathet",
  },
  {
    id: "fathet-3",
    name: "Nom Enseignant 3",
    role: "Titre / Matière enseignée",
    bio: "Courte biographie de l'enseignant...",
    image: "/images/Teachers/fathet-3.jpg",
    branch: "fathet",
  },

  // ---- INSTITUT BIBLIQUE ----
  {
    id: "fatt-1",
    name: "Nom Enseignant 4",
    role: "Titre / Matière enseignée",
    bio: "Courte biographie de l'enseignant...",
    image: "/images/Teachers/fatt-1.jpg",
    branch: "institut-biblique",
  },
  {
    id: "fatt-2",
    name: "Nom Enseignant 5",
    role: "Titre / Matière enseignée",
    bio: "Courte biographie de l'enseignant...",
    image: "/images/Teachers/fatt-2.jpg",
    branch: "institut-biblique",
  },
  {
    id: "fatt-3",
    name: "Nom Enseignant 6",
    role: "Titre / Matière enseignée",
    bio: "Courte biographie de l'enseignant...",
    image: "/images/Teachers/fatt-3.jpg",
    branch: "institut-biblique",
  },
];

export const PROGRAMS: Program[] = [
  {
    id: "prog-1",
    title: "Leadership & Administration",
    description: "Former à une gestion efficace et efficiente en tant que leader et administrateur des biens de Dieu.",
    targetAudience: "Responsables d'églises, diacres, gestionnaires de ministères.",
    objectives: [
      "Gestion administrative des œuvres locales",
      "Gouvernance spirituelle et éthique",
      "Gestion d'équipes et de projets communautaires"
    ],
    duration: "À préciser",
    regime: "Internat / Externat",
  },
  {
    id: "prog-2",
    title: "Évangélisation & Implantation",
    description: "Développer davantage de performance et de zèle dans la mission, ainsi que l'efficacité dans la prédication.",
    targetAudience: "Missionnaires, évangélistes, planteurs d'églises.",
    objectives: [
      "Méthodologies d'évangélisation contemporaines",
      "Stratégies d'implantation d'églises",
      "Homilétique et prédication de l'Évangile"
    ],
    duration: "À préciser",
    regime: "Internat / Externat",
  },
  {
    id: "prog-3",
    title: "Ministère pastoral & Diaconie",
    description: "Développer les compétences nécessaires à l'enseignement, au ministère pastoral, à la diaconie et au travail en équipe.",
    targetAudience: "Futurs pasteurs, anciens, responsables d'action sociale.",
    objectives: [
      "Accompagnement et soin pastoral",
      "Pratique diaconale et secours aux démunis",
      "Travail en équipe et relationnel pastoral"
    ],
    duration: "3 Ans (Institut)",
    regime: "Internat privilégié",
  },
];

export const CONFESSION_POINTS: FaithPoint[] = [
  {
    id: "faith-1",
    title: "Les Écritures Saintes",
    content: "Nous croyons que la Bible est la Parole inspirée de Dieu, la seule règle infaillible de foi et de conduite.",
    scripture: "2 Timothée 3:16-17",
  },
  {
    id: "faith-2",
    title: "La Trinité et le Salut",
    content: "Nous croyons en un seul Dieu en trois personnes et au salut accordé par grâce par la foi en Jésus-Christ.",
    scripture: "Éphésiens 2:8-9",
  },
  {
    id: "faith-3",
    title: "La Mission et l'Église",
    content: "Nous croyons au mandat missionnaire conféré à l'Église pour former des disciples parmi toutes les nations.",
    scripture: "Matthieu 28:19-20",
  },
];

export const SEMINARS: Seminar[] = [
  {
    id: "sem-1",
    title: "Séminaire d'Approfondissement Homilétique",
    audience: "Pasteurs",
    speaker: "[Intervenant Pressenti]",
    description: "Session de perfectionnement sur la préparation et la délivrance de prédications bibliques expositives.",
  },
  {
    id: "sem-2",
    title: "Disciple & Engagement Missionnaire",
    audience: "Jeunes",
    speaker: "[Intervenant Pressenti]",
    description: "Équiper la jeunesse pour faire face aux défis contemporains tout en restant ancrée dans sa foi.",
  },
  {
    id: "sem-3",
    title: "Éthique et Gestion de la Famille Chrétienne",
    audience: "Adultes",
    speaker: "[Intervenant Pressenti]",
    description: "Atelier pratique sur le leadership familial et la maturité spirituelle au quotidien.",
  },
];