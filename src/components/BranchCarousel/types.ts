export interface BranchImage {
  id: string;
  src: string;
  alt: string;
  label?: string;
  branch?: 'institut-biblique' | 'fathet';
}

export interface BranchCarouselProps {
  images: BranchImage[];
  className?: string;
  autoPlaySpeed?: number; // secondes entre chaque diapo (0 pour désactiver)
  radius?: number; // profondeur/rayon de l'arc (défaut: 260)
  activeBranch?: 'institut-biblique' | 'fathet';
  onSelectImage?: (image: BranchImage) => void;
  onSelectBranch?: (branch: 'institut-biblique' | 'fathet') => void;
}