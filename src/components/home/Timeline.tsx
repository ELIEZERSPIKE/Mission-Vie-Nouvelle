import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedGroup } from "@/components/core/animated-group";
import { TIMELINE } from "@/lib/content";

export default function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <section className="relative bg-primary text-primary-foreground py-24 sm:py-36 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-16 sm:mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-5">
            Notre histoire
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-balance">
            Trois décennies de fidélité, du premier pas à aujourd'hui.
          </h2>
        </div>

        <div ref={ref} className="relative max-w-5xl">
          <div className="absolute left-0 right-0 top-0 h-px bg-white/10 origin-left">
            <motion.div
              style={{ scaleX: lineScale }}
              className="h-full bg-accent origin-left"
            />
          </div>

          <AnimatedGroup
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-8"
            variants={{
              container: {
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 },
                },
              },
              item: {
                hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: 1.2,
                    type: "spring",
                    bounce: 0.3,
                  },
                },
              },
            }}
          >
            {TIMELINE.map((item) => (
              <div
                key={item.year}
                className="group flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="inline-flex items-center justify-center h-11 w-11 rounded-lg bg-accent/10 text-accent font-heading text-sm font-medium shrink-0">
                  {item.year}
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-base sm:text-lg mb-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-primary-foreground/60 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </AnimatedGroup>
        </div>
      </div>
    </section>
  );
}