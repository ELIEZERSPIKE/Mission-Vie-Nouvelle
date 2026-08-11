import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PageHeader({ eyebrow, title, intro, image }) {
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('page-header');
      if (header) {
        const headerTop = header.getBoundingClientRect().top;
        setHeaderScrolled(headerTop < 80);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="page-header"
      className={`relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden transition-all duration-700 ${
        headerScrolled
          ? 'bg-primary/95 backdrop-blur-sm'
          : 'bg-primary'
      } text-primary-foreground`}
    >
      {image && (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/60" />
        </>
      )}

      {!image && (
        <div className="absolute inset-0 pottery-pattern opacity-50" />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />

      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-accent transition-all duration-300 hover:gap-3 hover:translate-x-[-4px] mb-8 group"
          >
            <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Accueil
          </Link>
        </motion.div>

        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-5"
          >
            {eyebrow}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-heading text-4xl sm:text-5xl lg:text-7xl leading-[1.02] text-balance max-w-4xl"
        >
          {title}
        </motion.h1>

        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-7 text-lg sm:text-xl text-primary-foreground/70 max-w-2xl leading-relaxed font-light"
          >
            {intro}
          </motion.p>
        )}
      </div>
    </header>
  );
}