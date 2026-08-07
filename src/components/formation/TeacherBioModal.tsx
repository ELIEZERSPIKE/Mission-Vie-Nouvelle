import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Teacher } from "@/types/formation";

interface TeacherBioModalProps {
  teacher: Teacher | null;
  onClose: () => void;
}

export default function TeacherBioModal({ teacher, onClose }: TeacherBioModalProps) {
  return (
    <AnimatePresence>
      {teacher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background border border-border p-6 rounded-2xl max-w-md w-full space-y-4"
          >
            <h3 className="font-heading text-xl font-bold">{teacher.name}</h3>
            <p className="text-sm text-foreground/75 leading-relaxed">{teacher.bio}</p>
            <button 
              onClick={onClose}
              className="w-full bg-secondary py-2 rounded-lg text-xs font-semibold hover:bg-secondary/80 transition-colors"
            >
              Fermer
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}