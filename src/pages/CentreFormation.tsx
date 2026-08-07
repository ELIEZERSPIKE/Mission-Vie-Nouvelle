import React from "react";
import DepartmentDetail from "@/components/departements/DepartmentDetail";

export default function CentreFormation() {
  return (
    <DepartmentDetail
      eyebrow="Centre de Formation"
      title="Transmettre un métier, restaurer une dignité."
      intro="Des ateliers où les jeunes apprennent un métier de leurs mains — menuiserie, carrelage, plomberie et autres — et retrouvent le chemin de l'autonomie."
      subPillars={[
        { tag: "Métier 01", name: "Menuiserie", desc: "Le bois, du meuble à la charpente, transmis de maître à apprenti." },
        { tag: "Métier 02", name: "Carrelage", desc: "Le travail de la pose, de la précision et de la finition." },
        { tag: "Métier 03", name: "Plomberie", desc: "L'eau, le sanitaire et l'installation au service des foyers." },
        { tag: "Autres", name: "Autres métiers", desc: "Maçonnerie, couture et formations émergentes selon les besoins." },
      ]}
      sections={[
        {
          eyebrow: "L'esprit des ateliers",
          heading: "La dignité retrouvée par le travail des mains",
          body: [
            "Le Centre de Formation accueille des jeunes souvent laissés en marge, et leur transmet un métier complet, du geste de base à la gestion d'une petite activité.",
            "La relation maître-apprenti, héritée du savoir-faire africain, est au cœur de la pédagogie : on apprend en faisant, en observant, en se trompant et en recommençant.",
          ],
          bullets: ["Formation pratique en atelier", "Accompagnement à l'insertion professionnelle", "Possibilité de micro-crédit à la sortie"],
          image: "/images/tool-1.jpg",
        },
        {
          eyebrow: "Les métiers",
          heading: "Des savoir-faire qui répondent aux besoins réels",
          body: [
            "Chaque métier enseigné répond à un besoin concret de la communauté : construire, aménager, réparer — autant d'actes qui rendent un service et créent un revenu.",
            "Les diplômés deviennent à leur tour des artisans qui peuvent former la génération suivante.",
          ],
          bullets: ["Menuiserie et ébénisterie", "Carrelage et finitions", "Plomberie et sanitaire", "Maçonnerie et autres métiers"],
          image: "/images/tool-2.jpg",
          reverse: true,
        },
      ]}
    />
  );
}