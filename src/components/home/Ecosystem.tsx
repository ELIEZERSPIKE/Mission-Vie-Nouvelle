import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { DEPARTMENTS, type AccentColor } from "@/lib/content";

type AccentType = "text" | "bg" | "border" | "light";

// Mapping des couleurs d'accent
const accentColors: Record<AccentColor, string> = {
  ochre: "text-amber-600 border-amber-600",
  indigo: "text-indigo-600 border-indigo-600",
  veridian: "text-emerald-600 border-emerald-600",
};

const accentBgColors: Record<AccentColor, string> = {
  ochre: "bg-amber-50",
  indigo: "bg-indigo-50",
  veridian: "bg-emerald-50",
};

const accentBorderColors: Record<AccentColor, string> = {
  ochre: "border-amber-200",
  indigo: "border-indigo-200",
  veridian: "border-emerald-200",
};

const accentLightColors: Record<AccentColor, string> = {
  ochre: "text-amber-400",
  indigo: "text-indigo-400",
  veridian: "text-emerald-400",
};

export default function Ecosystem() {
  const [activeDept, setActiveDept] = useState<number | null>(null);
  const [hoveredDept, setHoveredDept] = useState<number | null>(null);

  const getAccentClass = (accent: AccentColor, type: AccentType = "text") => {
    if (type === "text") return accentColors[accent] || "text-accent";
    if (type === "bg") return accentBgColors[accent] || "bg-accent/5";
    if (type === "border") return accentBorderColors[accent] || "border-accent/20";
    if (type === "light") return accentLightColors[accent] || "text-accent/60";
    return "";
  };

  return (
    <section className="relative bg-background py-24 sm:py-36 grain overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-accent mb-5"
          >
            Notre mission
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-balance"
          >
            Un écosystème où chaque acte sert l'être humain tout entier.
          </motion.h2>
        </div>

        {/* Woven overlapping diagram */}
        <div className="relative grid md:grid-cols-5 gap-0 max-w-5xl mx-auto">
          {/* Connecting lines between departments */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {DEPARTMENTS.map((_, i) => {
              if (i < DEPARTMENTS.length - 1) {
                const x1 = (i / (DEPARTMENTS.length - 1)) * 100;
                const x2 = ((i + 1) / (DEPARTMENTS.length - 1)) * 100;
                const yOffset = i % 2 === 0 ? 20 : 60;
                return (
                  <motion.line
                    key={`line-${i}`}
                    x1={`${x1}%`}
                    y1={`${yOffset}%`}
                    x2={`${x2}%`}
                    y2={`${(i + 1) % 2 === 0 ? 20 : 60}%`}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-accent/20"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.1, ease: "easeInOut" }}
                  />
                );
              }
              return null;
            })}
          </svg>

          {DEPARTMENTS.map((dept, i) => {
            const accentClass = getAccentClass(dept.accent, "text");
            const bgClass = getAccentClass(dept.accent, "bg");
            const borderClass = getAccentClass(dept.accent, "border");
            const isActive = activeDept === i;
            const isHovered = hoveredDept === i;

            return (
              <motion.div
                key={dept.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative z-10 cursor-pointer"
                style={{ marginTop: i % 2 === 1 ? "2.5rem" : 0 }}
                onMouseEnter={() => setHoveredDept(i)}
                onMouseLeave={() => setHoveredDept(null)}
                onClick={() => setActiveDept(isActive ? null : i)}
              >
                <motion.div
                  className="mx-auto w-px h-16 relative"
                  style={{ marginLeft: "50%", transform: "translateX(-50%)" }}
                  animate={{
                    height: isHovered ? 24 : 64,
                    backgroundColor: isHovered
                      ? `rgba(var(--${dept.accent}), 0.8)`
                      : "rgba(var(--accent), 0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isHovered && (
                    <motion.div
                      className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${accentClass
                        .replace("text-", "bg-")
                        .replace("border-", "bg-")}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>

                <motion.div
                  className="text-center px-3 relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <motion.span
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-2 text-sm font-heading mb-3 relative transition-colors duration-300 ${accentClass}`}
                    animate={{
                      backgroundColor: isHovered
                        ? `rgba(var(--${dept.accent}), 0.1)`
                        : "transparent",
                      scale: isHovered ? 1.1 : 1,
                      borderColor: isHovered
                        ? `rgba(var(--${dept.accent}), 0.8)`
                        : `rgba(var(--${dept.accent}), 0.4)`,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.span animate={{ rotate: isHovered ? 360 : 0 }} transition={{ duration: 0.6 }}>
                      0{i + 1}
                    </motion.span>
                  </motion.span>

                  <motion.p
                    className={`font-heading text-lg leading-tight transition-colors duration-300 ${
                      isHovered ? accentClass : "text-foreground"
                    }`}
                  >
                    {dept.name}
                  </motion.p>

                  <motion.p
                    className="text-xs text-foreground/50 mt-1.5 leading-snug hidden sm:block"
                    animate={{ opacity: isHovered ? 1 : 0.5 }}
                  >
                    {dept.tagline}
                  </motion.p>

                  {/* Expand/collapse indicator */}
                  <motion.button
                    className={`mt-2 transition-colors ${isHovered ? accentClass : "text-foreground/40"}`}
                    animate={{ rotate: isActive ? 180 : 0 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <ChevronDown size={16} />
                  </motion.button>

                  {/* Expanded description */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`mt-4 p-4 rounded-lg border ${bgClass} ${borderClass}`}
                      >
                    
                        <p className="text-sm text-foreground/80 text-left">{dept.description}</p>
                        
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Horizon line connecting them */}
        <motion.div
          className="relative max-w-5xl mx-auto mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="horizon-line h-px w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <motion.p
              className="font-heading italic text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto text-balance"
              animate={{
                scale: hoveredDept !== null ? 0.98 : 1,
                opacity: hoveredDept !== null ? 0.5 : 0.7,
              }}
              transition={{ duration: 0.3 }}
            >
              « L'Évangile n'est pas une parole qu'on écoute — c'est une vie qu'on transmet. »
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          <Link
            to="/mission"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all relative group"
          >
            <span className="relative">
              Lire notre histoire complète
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
            </span>
            <motion.span animate={{ x: 0 }} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
              <ArrowUpRight size={16} />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}