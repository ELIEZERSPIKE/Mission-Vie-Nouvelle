import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

interface SubPillar {
  tag: string;
  name: string;
  desc: string;
  to?: string;
}

interface Section {
  eyebrow: string;
  heading: string;
  body?: string[];
  bullets?: string[];
  image?: string;
  reverse?: boolean;
}

interface DepartmentDetailProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  image?: string;
  sections?: Section[];
  subPillars?: SubPillar[];
}

export default function DepartmentDetail({
  eyebrow = "",
  title = "",
  intro = "",
  image = "",
  sections = [],
  subPillars = [],
}: DepartmentDetailProps) {
  return (
    <>
      {/* 1. En-tête de la page */}
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        intro={intro}
        image={image}
      />


      {/* 2. Cartes des sous-piliers (Optionnel) */}
      {subPillars && subPillars.length > 0 && (
        <section className="bg-background border-b border-border">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subPillars.map((p, i) => (
              <Link
                key={i}
                to={p.to || "#"}
                className="group flex items-start gap-4 p-5 border border-border hover:border-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-1">
                    {p.tag}
                  </p>
                  <h3 className="font-heading text-lg leading-tight">
                    {p.name}
                  </h3>
                  {p.desc && (
                    <p className="text-sm text-foreground/55 mt-1.5 leading-snug">
                      {p.desc}
                    </p>
                  )}
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-foreground/30 group-hover:text-accent transition-colors shrink-0 mt-1"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. Sections narratives alternées */}
      {sections?.map((sec, i) => (
        <section
          key={i}
          className={`py-20 sm:py-28 ${i % 2 === 1 ? "bg-secondary/30 grain" : "bg-background"
            }`}
        >
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
            <div
              className={`grid lg:grid-cols-12 gap-12 items-start ${sec.reverse ? "lg:[direction:rtl]" : ""
                }`}
            >
              {/* Colonne texte */}
              <div
                className={`lg:col-span-5 ${sec.reverse ? "lg:[direction:ltr]" : ""
                  }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
                    {sec.eyebrow}
                  </p>
                  <h2 className="font-heading text-3xl sm:text-4xl leading-tight text-balance mb-6">
                    {sec.heading}
                  </h2>

                  {sec.body?.map((p, j) => (
                    <p
                      key={j}
                      className="text-foreground/70 leading-relaxed mb-4"
                    >
                      {p}
                    </p>
                  ))}

                  {sec.bullets && (
                    <ul className="mt-6 space-y-3">
                      {sec.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <Check
                            size={18}
                            className="text-accent shrink-0 mt-0.5"
                          />
                          <span className="text-foreground/75">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </div>

              {/* Colonne Image */}
              <div
                className={`lg:col-span-6 lg:col-start-7 ${sec.reverse ? "lg:[direction:ltr]" : ""
                  }`}
              >
                {sec.image && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7 }}
                    className="relative overflow-hidden aspect-[4/5]"
                  >
                    <img
                      src={sec.image}
                      alt={sec.heading}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* 4. Section Call To Action (Soutien) */}
      <section className="bg-primary text-primary-foreground py-20 mt-16 sm:mt-24">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl text-balance mb-5">
            Soutenez ce département
          </h2>
          <p className="text-primary-foreground/60 mb-8 max-w-xl mx-auto">
            Votre participation rend ce travail possible, jour après jour.
          </p>
          <Link
            to="/soutenir"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3.5 font-medium hover:bg-accent/90 transition-colors"
          >
            Soutenir <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

    </>
  );
}