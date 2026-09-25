import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown } from "lucide-react";

// ───────────────────────────────────────────────
// Données
// ───────────────────────────────────────────────
const banner = {
  src: "/images/hero/banner.jpg",
  alt: "Bannière Mission Vie Nouvelle",
};

const verse = "« Suivez-moi, et je ferai de vous des pêcheurs d'hommes. »";
const verseRef = "Matthieu 4:19";

// ───────────────────────────────────────────────
// Variants
// ───────────────────────────────────────────────
const contentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.4 } },
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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -80]
  );
  const textScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1, 0.9]
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1, 1.12]
  );
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.9]);

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
      className="relative min-h-[100svh] w-full overflow-hidden bg-primary select-none"
    >
      {/* ═══ 1. Image de fond ═══ */}
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        <motion.img
          src={banner.src}
          alt={banner.alt}
          loading="eager"
          onLoad={() => setLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
        />
      </motion.div>

      {/* ═══ 2. Grain cinématographique ═══ */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none z-[5]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* ═══ 3. Overlay dégradé ═══ */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/85 z-[2]"
      />

      {/* ═══ 4. Contenu ═══ */}
      <motion.div
        style={{ y: textY, scale: textScale }}
        className="relative z-10 flex min-h-[100svh] flex-col"
      >
        {/* Spacer navbar */}
        <div className="h-20 sm:h-24 shrink-0" />

        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-1 flex-col items-center justify-center px-5 sm:px-8 pt-8 sm:pt-16 pb-24 sm:pb-28 text-center"
        >
          {/* ── Eyebrow doré ── */}
       

          {/* ── Verset principal ── */}
          <motion.h1
            variants={titleVariants}
            className="mt-6 sm:mt-8 max-w-4xl font-heading text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.15] text-white text-balance"
          >
            {verse}
          </motion.h1>

          {/* ── Attribution ── */}
          <motion.p
            variants={fadeUpVariants}
            className="mt-4 sm:mt-5 font-heading italic text-sm sm:text-base text-or-clair/90"
          >
            — {verseRef}
          </motion.p>

          {/* ── Double CTA ── */}
          <motion.div
            variants={buttonsVariants}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-4 sm:px-0"
          >
            <Link
              to="/eglises"
              className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-accent text-accent-foreground px-6 sm:px-7 py-3.5 text-sm font-medium rounded-full hover:bg-or-clair hover:text-foreground transition-all hover:shadow-lg hover:shadow-or-clair/25"
            >
              Découvrir nos églises
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              to="/soutenir"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto border border-white/40 text-white px-6 sm:px-7 py-3.5 text-sm font-medium rounded-full hover:bg-white hover:text-foreground transition-colors backdrop-blur-sm"
            >
              Nous soutenir
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}