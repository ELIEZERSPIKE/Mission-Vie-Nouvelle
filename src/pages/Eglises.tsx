import React, { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import TextRoll from "@/components/ui/TextRoll";
import { MapPin, Phone } from "lucide-react";

const REGIONS = ["Toutes", "Maritime", "Plateaux", "Centrale", "Kara", "Savanes"];

const CHURCHES = [
  { name: "Église Vie Nouvelle — Togoville", region: "Maritime", pastor: "Pasteur Koffi A.", founded: 1994, members: 320, phone: "+22890363653" },
  { name: "Église Vie Nouvelle — Tokoin", region: "Maritime", pastor: "Pasteur Yao M.", founded: 1996, members: 540, phone: "+22890363653" },
  { name: "Église Vie Nouvelle — Kpalimé", region: "Plateaux", pastor: "Pasteur Komla D.", founded: 2001, members: 210, phone: "+22890363653" },
  { name: "Église Vie Nouvelle — Atakpamé", region: "Plateaux", pastor: "Pasteur Kwami S.", founded: 2003, members: 180, phone: "+22890363653" },
  { name: "Église Vie Nouvelle — Sokodé", region: "Centrale", pastor: "Pasteur Akossiwa B.", founded: 2005, members: 260, phone: "+22890363653" },
  { name: "Église Vie Nouvelle — Kara", region: "Kara", pastor: "Pasteur Dzifa K.", founded: 2008, members: 150, phone: "+22890363653" },
  { name: "Église Vie Nouvelle — Dapaong", region: "Savanes", pastor: "Pasteur Adjovi P.", founded: 2012, members: 110, phone: "+22890363653" },
];

export default function Eglises(): React.JSX.Element {
  const [region, setRegion] = useState("Toutes");
  const filtered = region === "Toutes" ? CHURCHES : CHURCHES.filter((c) => c.region === region);

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
          {/* Region filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-4 py-2 text-sm border transition-colors ${region === r ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground/60 hover:border-accent/50"
                  }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Church list */}
          {/* Church list */}
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
  {filtered.map((c, i) => {
    const whatsappHref = `https://wa.me/${c.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
      `Bonjour ${c.pastor}, je souhaite avoir des informations sur ${c.name}.`
    )}`;

    return (
      <motion.article
        key={c.name}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: i * 0.05 }}
        className="bg-background border border-border/70 rounded-2xl p-7 hover:border-accent/50 transition-colors"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-2">{c.region}</p>
        <h3 className="font-heading text-xl leading-tight mb-3">
          <TextRoll>{c.name}</TextRoll>
        </h3>
        <p className="text-sm text-foreground/60 mb-1">{c.pastor}</p>
        <div className="flex items-center gap-4 text-xs text-foreground/45 mt-4">
          <span>Depuis {c.founded}</span>
          <span>·</span>
          <span>{c.members} membres</span>
        </div>
        
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm text-accent hover:gap-3 transition-all"
        >
          <Phone size={14} /> +228 90 36 36 53
        </a>
      </motion.article>
    );
  })}
</div>
        </div>
      </section>

      {/* Section Adoration */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/85 to-primary/70" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative max-w-[1400px] mx-auto px-5 sm:px-8 text-center"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-5">Communion</p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-balance max-w-3xl mx-auto">
            Adorez là où votre cœur se sent chez lui.
          </h2>
          <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Chaque église de la mission Vie Nouvelle est un lieu d'accueil où la foi se vit ensemble.
            Rejoignez une communauté proche de vous et adorez aux côtés de croyants qui
            partagent le même chemin.
          </p>
        </motion.div>
      </section>
    </>
  );
}