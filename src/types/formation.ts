import type { ComponentType } from "react";

export interface Teacher {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  branch: "fatt" | "fathet";
}

export interface Program {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  objectives: string[];
  duration?: string;
  regime: string;
}

export interface Seminar {
  id: string;
  title: string;
  audience: "Pasteurs" | "Jeunes" | "Adultes";
  speaker: string;
  date?: string;
  location?: string;
  description: string;
}

export interface FaithPoint {
  id: string;
  title: string;
  content: string;
  scripture?: string;
}

export interface StatItem {
  value: string;
  label: string;
  icon: ComponentType<{ className?: string; size?: number }>;
}