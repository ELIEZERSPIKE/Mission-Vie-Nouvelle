import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function SupportCTA() {
  return (
    <section className="relative bg-accent text-accent-foreground py-24 sm:py-36 overflow-hidden">
      <div className="absolute inset-0 pottery-pattern opacity-30" />
      <div className="relative max-w-[1100px] mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-accent-foreground/70 mb-5">Comment puis-je participer ?</p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-balance mb-7">
            Investissez dans la transformation d'une vie, d'un village, d'une génération.
          </h2>
          <p className="text-lg text-accent-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Chaque contribution soutient un pilier concret de la mission : une apprentissage de menuiserie, une place d'élève, une consultation médicale, une paroisse locale.
          </p>
          <Link
            to="/soutenir"
            className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-base font-medium hover:bg-primary/90 transition-all"
          >
            Soutenir la Mission
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
          <p className="mt-5 text-sm text-accent-foreground/60">Choisissez votre pilier d'impact. Don respectueux et transparent.</p>
        </motion.div>
      </div>
    </section>
  );
}