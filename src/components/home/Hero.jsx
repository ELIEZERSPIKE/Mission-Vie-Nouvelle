import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Compass, Mail, ChevronLeft, ChevronRight } from "lucide-react";

// ───────────────────────────────────────────────
// Données
// ───────────────────────────────────────────────
const slides = [
  {
    src: "/images/hero/slide-1.jpg",
    alt: "Horizon togolais au lever du jour",
    caption: "L'aube d'une nouvelle mission",
    zoomOrigin: "center",
  },
  {
    src: "/images/hero/slide-2.jpg",
    alt: "Silhouettes sur une plage au lever du soleil",
    caption: "Ensemble sur le même chemin",
    zoomOrigin: "bottom right",
  },
  {
    src: "/images/hero/slide-3.jpg",
    alt: "Groupe contemplant l'horizon",
    caption: "Des vies transformées par la foi",
    zoomOrigin: "top left",
  },
];

const SLIDE_DURATION = 7000; // ms

// ───────────────────────────────────────────────
// Composant
// ───────────────────────────────────────────────
export default function Hero() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(new Set());
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const ref = useRef(null);
  const touchStartX = useRef(0);
  const progressRef = useRef(0);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

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

  // ── Navigation clavier ───────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active]);

  // ── Swipe mobile ─────────────────────────────
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
  };

  // ── Navigation helpers ───────────────────────
  const goNext = useCallback(() => {
    setActive((i) => (i + 1) % slides.length);
    progressRef.current = 0;
    setProgress(0);
  }, []);

  const goPrev = useCallback(() => {
    setActive((i) => (i - 1 + slides.length) % slides.length);
    progressRef.current = 0;
    setProgress(0);
  }, []);

  const goTo = useCallback((index) => {
    setActive(index);
    progressRef.current = 0;
    setProgress(0);
  }, []);

  // ── Carrousel auto avec barre de progression ─
  useEffect(() => {
    if (prefersReducedMotion) return;

    const tick = (now) => {
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (!isPaused) {
        progressRef.current += dt;
        if (progressRef.current >= SLIDE_DURATION) {
          progressRef.current = 0;
          setActive((i) => (i + 1) % slides.length);
        }
        setProgress(progressRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPaused, prefersReducedMotion]);

  // Reset progress quand active change manuellement
  useEffect(() => {
    progressRef.current = 0;
    setProgress(0);
  }, [active]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-primary select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ════════════════════════════════════════
          1. DIAPORAMA D'IMAGES (Ken Burns)
         ════════════════════════════════════════ */}
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        {slides.map((slide, i) => (
          <motion.img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            loading={i === 0 ? "eager" : "lazy"}
            onLoad={() =>
              setLoaded((prev) => new Set(prev).add(slide.src))
            }
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: i === active ? 1.08 : 1,
              opacity: i === active ? 1 : 0,
            }}
            transition={{
              opacity: { duration: 2, ease: "easeInOut" },
              scale: { duration: 8, ease: "easeOut" },
            }}
            style={{ transformOrigin: slide.zoomOrigin }}
            className={`absolute inset-0 h-full w-full object-cover ${
              loaded.has(slide.src) ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
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
          3. FLECHES DE NAVIGATION (desktop)
         ════════════════════════════════════════ */}
      <button
        onClick={goPrev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full text-white/0 hover:text-white/90 hover:bg-black/20 transition-all duration-300 hidden sm:flex items-center justify-center"
        aria-label="Diapositive précédente"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full text-white/0 hover:text-white/90 hover:bg-black/20 transition-all duration-300 hidden sm:flex items-center justify-center"
        aria-label="Diapositive suivante"
      >
        <ChevronRight size={28} />
      </button>

      {/* ════════════════════════════════════════
          4. CONTENU CENTRAL
         ════════════════════════════════════════ */}
      <motion.div
        style={{ y: textY, scale: textScale }}
        className="relative z-10 flex h-full flex-col"
      >
        {/* Spacer navbar */}
        <div className="h-20 sm:h-24 shrink-0" />

        <div className="flex flex-1 flex-col items-center justify-start pt-6 sm:pt-10 px-6 pb-10 text-center">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-[0.7rem] uppercase tracking-[0.35em] text-white/80 backdrop-blur-md sm:text-xs"
          >
            Mission Chrétienne · Togo
          </motion.span>

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="mt-6 max-w-4xl font-heading text-4xl font-light leading-tight text-white sm:text-6xl lg:text-7xl"
          >
            « Suivez-moi, et je ferai de vous des pêcheurs d'hommes{"\u00A0"}»
          </motion.h1>

          {/* ═══ Sous-titre contextuel animé ═══ */}
          <div className="mt-4 h-8 sm:h-10 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-lg sm:text-xl text-white/70 font-light max-w-xl"
              >
                {slides[active].caption}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* CTA Buttons */}
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

          {/* ═══ Barres de progression temporelle ═══ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="mt-12 flex items-center gap-4"
          >
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                onClick={() => goTo(i)}
                aria-label={`Diapositive ${i + 1}`}
                className="group relative h-1.5 overflow-hidden rounded-full bg-white/20 transition-all duration-500"
                style={{ width: i === active ? 48 : 12 }}
              >
                {i === active && !prefersReducedMotion && (
                  <motion.div
                    className="absolute inset-0 bg-amber-400 origin-left"
                    style={{
                      transform: `scaleX(${progress / SLIDE_DURATION})`,
                    }}
                    transition={{ duration: 0 }}
                  />
                )}
                {i === active && prefersReducedMotion && (
                  <div className="absolute inset-0 bg-amber-400" />
                )}
              </button>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}