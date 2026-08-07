import React from "react";
import type { Teacher } from "@/types/formation";

interface TeacherSectionProps {
  teachers: Teacher[];
  activeBranch: "fatt" | "fathet";
  onBranchChange: (branch: "fatt" | "fathet") => void;
  onSelectTeacher: (teacher: Teacher) => void;
}

export default function TeacherSection({
  teachers,
  activeBranch,
  onBranchChange,
  onSelectTeacher,
}: TeacherSectionProps) {
  return (
    <section id="enseignants" className="py-20 bg-secondary/30 border-b border-border">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Mentors & Formateurs</span>
          <h2 className="font-heading text-3xl sm:text-4xl">Notre corps enseignant</h2>
          <p className="text-foreground/70">
            Des enseignants expérimentés engagés dans la transmission du savoir théologique et pastoral.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-background border border-border rounded-xl">
            <button
              onClick={() => onBranchChange("fathet")}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeBranch === "fathet"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Équipe FATHET

            </button>
            <button
              onClick={() => onBranchChange("fatt")}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeBranch === "fatt"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Équipe FATT
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers
            .filter((t) => t.branch === activeBranch)
            .map((teacher) => (
              <div
                key={teacher.id}
                className="bg-background border border-border rounded-xl overflow-hidden p-6 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-secondary border-2 border-accent/20">
                  <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-heading text-lg font-bold">{teacher.name}</h3>
                <p className="text-xs font-semibold text-accent mb-1">{teacher.role}</p>
                <p className="text-xs text-foreground/70 leading-relaxed mb-4 line-clamp-3">
                  {teacher.bio}
                </p>
                <button
                  onClick={() => onSelectTeacher(teacher)}
                  className="mt-auto text-xs font-semibold text-primary underline hover:text-accent"
                >
                  Lire la biographie
                </button>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}