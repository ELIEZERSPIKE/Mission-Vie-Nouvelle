import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PageHeader({ eyebrow, title, intro, image }) {
  return (
    <header className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden bg-primary text-primary-foreground">
      {image && (
        <>
          <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/60" />
        </>
      )}
      {!image && <div className="absolute inset-0 pottery-pattern opacity-50" />}
      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-accent transition-colors mb-8">
          <ArrowLeft size={15} /> Accueil
        </Link>
        {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-accent mb-5">{eyebrow}</p>}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl leading-[1.02] text-balance max-w-4xl">{title}</h1>
        {intro && <p className="mt-7 text-lg sm:text-xl text-primary-foreground/70 max-w-2xl leading-relaxed">{intro}</p>}
      </div>
    </header>
  );
}