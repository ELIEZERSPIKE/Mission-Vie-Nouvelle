// FattAdmission.tsx - Version épurée et naturelle
import React from "react";
import { Link } from "react-router-dom";

const objectifs = [
  "Former des serviteurs de Dieu à être des héros de grands calibres, capables d'arracher des âmes captives dans les ténèbres",
  "Rétablir les enseignements fondamentaux de Jésus-Christ",
  "Amener les leaders en toute humilité à œuvrer pour la croissance des Églises locales",
];

const dossierDocuments = [
  "02 photos passeport",
  "Copie du certificat de naissance",
  "Carte d'identité en cours",
  "Demande d'inscription",
  "Lettre de recommandation",
  "Certificat médical",
  "Curriculum Vitae",
  "Autorisation du conjoint(e)",
];

export default function InstitutAdmission() {
  return (
    <div className="space-y-6 max-w-xl">
      {/* Objectifs */}
      <div>
        <h4 className="text-sm font-medium text-foreground/70 tracking-wide mb-3">
          Objectifs stratégiques
        </h4>
        <ul className="space-y-3">
          {objectifs.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground/70 leading-relaxed">
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Dossier d'admission */}
      <div className="p-5 rounded-xl bg-white border border-border/40 shadow-sm">
        <h4 className="text-sm font-medium text-foreground/70 tracking-wide mb-3">
          Dossier d'admission
        </h4>
        
        <p className="text-sm text-foreground/60 leading-relaxed mb-4">
          Le candidat désireux de s'inscrire doit présenter sous chemise les documents suivants :
        </p>
        
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
          {dossierDocuments.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-foreground/70">
              <span className="text-foreground/20">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="pt-3 border-t border-border/40">
          <Link
            to="/inscription/institut-biblique"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-300 group"
          >
            Remplir le formulaire d'inscription en ligne
          </Link>
        </div>
      </div>
    </div>
  );
}