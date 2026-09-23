import React, { useState } from "react";
import { STATS, TEACHERS, PROGRAMS, CONFESSION_POINTS, SEMINARS } from "@/data/formationData";
import type { Teacher } from "@/types/formation";

import FormationHero from "@/components/formation/FormationHero";
import BranchSelector from "@/components/formation/BranchSelector";
import StatsSection from "@/components/formation/StatsSection";
import ProgramGrid from "@/components/formation/ProgramGrid";
import TeacherSection from "@/components/formation/TeacherSection";
import TeacherBioModal from "@/components/formation/TeacherBioModal";
import ConfessionAccordion from "@/components/formation/ConfessionAccordion";
import EnvironmentSection from "@/components/formation/EnvironmentSection";
import SeminarsSection from "@/components/formation/SeminarsSection";
import RegimesSection from "@/components/formation/RegimesSection";
import TrainingJourney from "@/components/formation/TrainingJourney";
import FormationCTA from "@/components/formation/FormationCTA";

export default function Formation(): React.JSX.Element {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [activeBranch, setActiveBranch] = useState<"institut-biblique" | "fathet">("fathet");

  return (
    <main className="bg-background text-foreground antialiased selection:bg-accent selection:text-accent-foreground">
      <FormationHero onSelectBranch={setActiveBranch} />
      <BranchSelector activeBranch={activeBranch} onSelectBranch={setActiveBranch} />
      <RegimesSection />
      <StatsSection stats={STATS} />
      <ProgramGrid programs={PROGRAMS} />
   
      <ConfessionAccordion points={CONFESSION_POINTS} />
      <EnvironmentSection />
      <FormationCTA />



      {/* <SeminarsSection seminars={SEMINARS} /> */}
      {/* <TrainingJourney /> */}
      {/* <TeacherBioModal
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      /> */}
         {/* <TeacherSection
        teachers={TEACHERS}
        activeBranch={activeBranch}
        onBranchChange={setActiveBranch}
        onSelectTeacher={setSelectedTeacher}
      /> */}
    </main>
  );
}