import React from "react";
import { motion } from "framer-motion";
import { STATS } from "@/lib/content";

export default function ImpactStats() {
  return (
    <section className="bg-background py-24 sm:py-32 grain">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-background p-8 sm:p-10 text-center"
            >
              <p className="font-heading text-5xl sm:text-6xl text-primary leading-none">
                {stat.value}
                <span className="text-accent">{stat.suffix}</span>
              </p>
              <p className="mt-4 text-sm text-foreground/60 leading-snug">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
