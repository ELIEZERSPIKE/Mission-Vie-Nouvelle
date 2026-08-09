import React from "react";
import { motion } from "framer-motion";

export default function Intro() {
  return (
    <section className="relative bg-background pottery-pattern py-24 sm:py-36">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="sticky top-32"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-5">Qui sommes-nous ?</p>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-balance">
                Une mission, non une simple église.
              </h2>
            </motion.div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-7 text-lg leading-relaxed text-foreground/80"
            >
              <p className="font-heading text-2xl sm:text-3xl leading-snug text-foreground text-balance">
                Vie Nouvelle Togo est une mission chrétienne qui agit sur tout l'être humain: le corps , l'âme et l'esprit.
              </p>
              <p>
                Sur tout le territoire togolais, nous répondons à l'appel du Christ en bâtissant un écosystème où la foi, l'éducation, la formation professionnelle et les soins convergent vers une même fin : restaurer l'homme dans sa dignité entière.
              </p>
              <p>
                Nous ne séparons pas le spirituel du concret. Chaque département(Églises, Formation, Éducation, Centre de Formation, Médical) est une expression vivante de l'Évangile mis en action.
              </p>
              <div className="pt-6 flex items-center gap-4">
                <span className="block h-px flex-1 bg-border max-w-[120px]" />
                <span className="font-heading italic text-accent text-lg">Mission Vie Nouvelle TOGO</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}