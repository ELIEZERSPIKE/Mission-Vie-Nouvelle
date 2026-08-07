import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown, Compass, Mail } from "lucide-react";

// Les 3 images servies directement depuis le dossier public/images/hero/
const slides = [
  {
    src: "/images/hero/slide-1.jpg",
    alt: "Horizon togolais au lever du jour",
  },
  {
    src: "/images/hero/slide-2.jpg",
    alt: "Silhouettes sur une plage au lever du soleil",
  },
  {
    src: "/images/hero/slide-3.jpg",
    alt: "Groupe contemplant l'horizon",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);

  // Parallax au scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const textScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.9]);

  // Carrousel automatique
  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-primary">
      {/* 1. Diaporama d'images de fond */}
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </motion.div>

      {/* 2. Filtre dégradé */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"
      />

      {/* 3. Contenu central */}
      <motion.div
        style={{ y: textY, scale: textScale }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-[0.7rem] uppercase tracking-[0.35em] text-white/80 backdrop-blur-md sm:text-xs"
        >
          Mission Chrétienne · Togo
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mt-6 max-w-4xl font-heading text-4xl font-light leading-tight text-white sm:text-6xl lg:text-7xl"
        >
          « Suivez-moi, et je ferai de vous des pêcheurs d'hommes »
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-amber-400/90 sm:text-sm"
        >
          <span className="h-px w-8 bg-amber-400/50" />
          Matthieu 4:19
          <span className="h-px w-8 bg-amber-400/50" />
        </motion.div>

        {/* 2 Boutons CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-10 flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center"
        >
          <Link
            to="/a-propos"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-sans text-sm font-semibold text-primary shadow-lg transition-all duration-300 hover:scale-[1.03] hover:opacity-90"
          >
            <Compass size={18} />
            Nous découvrir
          </Link>

          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 font-sans text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/50"
          >
            <Mail size={18} />
            Nous contacter
          </Link>
        </motion.div>

        {/* Puces/Dots du diaporama */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-12 flex items-center gap-3"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              onClick={() => setActive(i)}
              aria-label={`Diapositive ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-8 bg-amber-400" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}