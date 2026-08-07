import React from "react";
import type { StatItem } from "@/types/formation";

interface StatsSectionProps {
  stats: StatItem[];
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div key={idx} className="space-y-2 p-4">
                <IconComp className="mx-auto text-accent mb-2" size={32} />
                <div className="font-heading text-3xl sm:text-5xl font-bold text-accent">{stat.value}</div>
                <div className="text-sm sm:text-base text-primary-foreground/80 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}