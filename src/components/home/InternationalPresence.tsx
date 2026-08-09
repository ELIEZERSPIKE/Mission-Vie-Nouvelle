// InternationalPresence.tsx - Section "Présence internationale" en miroir de Intro
// Utilise InfiniteSlider pour le défilement continu des drapeaux
import React from "react";
import { motion } from "framer-motion";
import { InfiniteSlider } from "@/components/core/infinite-slider";
interface Country {
  name: string;
  flag: string; // chemin vers /public/images/flags/...
}

// Ajustez si vos fichiers ont d'autres noms/extensions dans public/images/flags/
const countries: Country[] = [
  { name: "Allemagne", flag: "/images/flags/allemagne.jpg" },
  { name: "Ghana", flag: "/images/flags/ghana.jpg" },
  { name: "Togo", flag: "/images/flags/togo.jpg" },
  { name: "Burkina Faso", flag: "/images/flags/burkina.jpg" },
  { name: "Mali", flag: "/images/flags/mali.jpg" },
  { name: "Congo Kinshasa", flag: "/images/flags/congo.jpg" },
  { name: "Bénin", flag: "/images/flags/benin.jpg" },
  { name: "Nigeria", flag: "/images/flags/nigeria.jpg" },
  { name: "Côte d'Ivoire", flag: "/images/flags/cotedivoire.jpg" },
  { name: "Burundi", flag: "/images/flags/burundi.jpg" },
  // Liste à compléter — ajoute les prochains pays au même format
];

export default function InternationalPresence() {
  return (
    <section className="relative bg-background py-24 sm:py-36 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Texte - Gauche (comme le titre dans Intro) */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="sticky top-32"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-5">Notre rayonnement</p>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-balance">
                Une présence internationale.
              </h2>
              <p className="mt-6 text-foreground/70 leading-relaxed">
                Au-delà du Togo, la mission Vie Nouvelle s'étend à travers plusieurs nations, portée par des équipes locales unies par une même vision.
              </p>
            </motion.div>
          </div>

          {/* Drapeaux - Droite (effet miroir : slider visuel au lieu de texte) */}
          <div className="lg:col-span-7 lg:col-start-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <InfiniteSlider gap={40} reverse>
                {countries.map((country) => (
                  <div
                    key={country.name}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden border border-border/40 shadow-sm">
                      <img
                        src={country.flag}
                        alt={`Drapeau ${country.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground/60 whitespace-nowrap">
                      {country.name}
                    </span>
                  </div>
                ))}
              </InfiniteSlider>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}