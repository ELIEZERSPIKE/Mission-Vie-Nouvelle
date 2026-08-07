import React from "react";
import DepartmentDetail from "@/components/departements/DepartmentDetail";

const IMG = "https://media.base44.com/images/public/6a6fb98e9833fce37a50447a/5d982dc53_generated_9b696b2c.png";

export default function Medical() {
  return (
    <DepartmentDetail
      eyebrow="Médical"
      title="Soigner le corps, témoigner de l'amour."
      intro="Le site Petit Paradis, à Togoville(Tokoin), offre des soins de proximité à ceux qui en sont le plus éloignés — un acte concret de l'Évangile."
      image={IMG}
      subPillars={[
        { tag: "Site", name: "Petit Paradis — Togoville", desc: "Soins de proximité en milieu urbain." },
        { tag: "Campagnes", name: "Campagnes de soins", desc: "Consultations gratuites itinérantes." },
        { tag: "Prévention", name: "Éducation à la santé", desc: "Sensibilisation, maternité et hygiène." },
      ]}
      sections={[
        {
          eyebrow: "Petit Paradis",
          heading: "Un lieu où l'on soigne la personne entière",
          body: [
            "Petit Paradis n'est pas seulement un dispensaire : c'est un lieu où chaque patient est accueilli, écouté et traité avec respect, indépendamment de sa capacité à payer.",
            "Les équipes soignantes travaillent main dans la main avec les communautés locales pour apporter des soins durables, de la consultation courante à la prévention.",
          ],
          bullets: ["Consultations médicales abordables", "Suivi des mères et des enfants", "Campagnes de soins gratuites"],
          image: IMG,
        },
        {
          eyebrow: "Notre approche",
          heading: "La santé comme justice, pas comme privilège",
          body: [
            "Dans une région où l'accès aux soins reste un défi, Petit Paradis rend tangible l'amour du Christ en actes avant les paroles.",
            "Chaque soin offert est une affirmation : toute vie a une valeur égale et mérite d'être protégée.",
          ],
          bullets: ["Soins accessibles aux plus vulnérables", "Éducation à l'hygiène et à la prévention", "Partenariats avec les structures locales"],
          image: IMG,
          reverse: true,
        },
      ]}
    />
  );
}