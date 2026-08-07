import React from "react";
import { Link } from "react-router-dom";
import { PhoneCall } from "lucide-react";

export default function FormationCTA() {
  return (
    <section id="contact" className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 text-center space-y-6">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
          Votre appel mérite une formation à la hauteur de votre mission.
        </h2>
        <p className="text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
          Contactez le secrétariat de l'Institut et du FATT pour obtenir le dossier d'information et les modalités d'inscription.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3.5 rounded-lg font-medium hover:bg-accent/90 transition-colors text-sm"
          >
            Demander des informations <PhoneCall size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}