import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Compass, Mail } from "lucide-react";

// ───────────────────────────────────────────────
// Données
// ───────────────────────────────────────────────
const banner = {
  src: "/images/hero/banner.jpg",
  alt: "Bannière Mission Vie Nouvelle",
};

// Verset
const heroTitle = "« Suivez-moi, et je ferai de vous des pêcheurs d'hommes »";

// ───────────────────────────────────────────────
// Variants d'animation
// ───────────────────────────────────────────────
const contentVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.4 },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const buttonsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

// ───────────────────────────────────────────────
// Composant
// ───────────────────────────────────────────────
export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const ref = useRef(null);

  // ── Parallax au scroll ───────────────────────
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -100]
  );
  const textScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1, 0.85]
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1, 1.15]
  );
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.9]);

  // ── Détection prefers-reduced-motion ─────────
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-primary select-none"
    >
      {/* ════════════════════════════════════════
          1. IMAGE DE FOND (banner statique)
         ════════════════════════════════════════ */}
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        <motion.img
          src={banner.src}
          alt={banner.alt}
          loading="eager"
          onLoad={() => setLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
        />
      </motion.div>

      {/* ════════════════════════════════════════
          2. OVERLAYS VISUELS
         ════════════════════════════════════════ */}
      {/* Grain cinématographique */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none z-[5]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Filtre dégradé */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-[2]"
      />

      {/* ════════════════════════════════════════
          3. CONTENU CENTRAL
         ════════════════════════════════════════ */}
      <motion.div
        style={{ y: textY, scale: textScale }}
        className="relative z-10 flex h-full flex-col"
      >
        {/* Spacer navbar */}
        <div className="h-20 sm:h-24 shrink-0" />

        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-1 flex-col items-center justify-center pt-20 sm:pt-28 px-6 pb-10 text-center"
        >

          {/* Titre — fondu simple */}
          <motion.h1
            variants={titleVariants}
            className="mt-6 max-w-4xl font-heading text-4xl font-light leading-tight text-white sm:text-6xl lg:text-7xl"
          >
            {heroTitle}
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            variants={fadeUpVariants}
            className="mt-4 text-lg sm:text-xl text-white/70 font-light max-w-xl"
          >
            {banner.caption}
          </motion.p>

          {/* CTA Buttons */}
          {/* <motion.div
            variants={buttonsVariants}
            className="mt-10 flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center"
          >
            <Link
              to="/#ecosystem"
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
          </motion.div> */}
        </motion.div>
      </motion.div>
    </section>
  );
}