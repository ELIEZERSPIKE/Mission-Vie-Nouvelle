import React from "react";
import { AlertCircle, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function MaintenancePage() {
  const MAINTENANCE_EMAIL = "infos@missionvienouvelle.net";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 flex flex-col items-center justify-center px-4 py-12">
      
      {/* Fond décoratif subtil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md w-full">
        
        {/* Logo / Branding */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-6">
            <AlertCircle size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Maintenance
          </h1>
          <p className="text-foreground/60">Institut Biblique</p>
        </div>

        {/* Contenu principal */}
        <div className="bg-background border border-border/70 rounded-2xl shadow-lg p-8 space-y-6">
          
          {/* Message */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Nous serons bientôt de retour
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              La plateforme <span className="font-medium">Institut Biblique</span> subit une maintenance programmée pour vous offrir une meilleure expérience.
            </p>
            <p className="text-sm text-foreground/60">
              Nous nous excusons pour le désagrément et serons opérationnels très prochainement.
            </p>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 rounded-xl p-6">
            <p className="text-xs text-foreground/60 mb-3 font-medium tracking-wide">BESOIN D'AIDE ?</p>
            <a
              href={`mailto:infos@missionvienouvelle.net`}
              className="inline-flex items-center gap-2 px-4 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Mail size={18} />
              Nous contacter
            </a>
            <p className="text-xs text-foreground/50 mt-3">
              {MAINTENANCE_EMAIL}
            </p>
          </div>

          {/* Détails supplémentaires */}
          <div className="pt-4 space-y-3 border-t border-border/40">
            <div className="flex items-start gap-3">
              <span className="text-accent mt-0.5">✓</span>
              <p className="text-sm text-foreground/70">
                <span className="font-medium">Calendrier de formation</span> et ressources accessibles bientôt
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent mt-0.5">✓</span>
              <p className="text-sm text-foreground/70">
                <span className="font-medium">Gestionnaire de cours</span> amélioré et performant
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent mt-0.5">✓</span>
              <p className="text-sm text-foreground/70">
                <span className="font-medium">Support utilisateur</span> renforcé et réactif
              </p>
            </div>
          </div>
        </div>

        {/* Footer avec lien retour */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>
        </div>

        {/* Infos complémentaires */}
        <div className="mt-12 pt-8 border-t border-border/40 text-center">
          <p className="text-xs text-foreground/50 mb-3">
            Mission Vie Nouvelle Togo
          </p>
          <p className="text-xs text-foreground/40">
            Merci de votre patience et de votre soutien
          </p>
        </div>
      </div>
    </div>
  );
}