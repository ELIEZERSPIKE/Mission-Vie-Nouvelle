import React from "react";
import DepartmentDetail from "@/components/departements/DepartmentDetail";

export default function Education() {
  return (
    <DepartmentDetail
      eyebrow="Éducation"
      title="Former les esprits, bâtir l'avenir."
      intro="De l'école primaire au lycée, un accompagnement exigeant qui allie savoirs, valeurs et préparation à la vie."
      image="/images/education-hero.jpg"
      subPillars={[
        { tag: "Primaire", name: "École primaire", desc: "Les fondations de la lecture, du calcul et du caractère." },
        { tag: "Secondaire", name: "Collège & Lycée", desc: "Préparation aux examens et à la vie d'adulte responsable." },
        { tag: "Valeurs", name: "Éducation au caractère", desc: "Intégrité, respect et sens du service au cœur du parcours." },
        { tag: "Encadrement", name: "Suivi individualisé", desc: "Des volontaires dévoués et un encadrement de proximité." },
      ]}
      sections={[
        {
          eyebrow: "Primaire",
          heading: "Les premières années, les plus importantes",
          body: [
            "L'école primaire accueille les enfants dès le CP,l'attention portée à chaque élève favorise des fondations solides.",
            "Au-delà des savoirs, on y apprend le respect, la discipline et le goût de l'effort — des valeurs qui accompagnent toute une vie.",
          ],
          bullets: ["Alphabétisation et numératie solides", "Petits effectifs par classe", "Activités culturelles et sportives"],
          image: "/images/education-primaire.jpg",
        },
        {
          eyebrow: "Secondaire",
          heading: "Préparer l'avenir avec exigence",
          body: [
            "Le collège et le lycée préparent aux examens nationaux tout en cultivant l'esprit critique et le sens des responsabilités.",
            "Chaque jeune est accompagné dans son orientation, qu'elle mène vers les études supérieures ou vers un métier au Centre de Formation.",
          ],
          bullets: ["Préparation au BEPC et au BAC", "Orientation personnalisée", "Pont vers le Centre de Formation professionnelle"],
          image: "/images/education-secondaire.jpg",
          reverse: true,
        },
      ]}
    />
  );
}