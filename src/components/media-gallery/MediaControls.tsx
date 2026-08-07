import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

export function MediaControls({ onPrevious, onNext, className = "" }: MediaControlsProps) {
  return (
    <>
      <button
        onClick={onPrevious}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all ${className}`}
        aria-label="Slide précédent"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={onNext}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all ${className}`}
        aria-label="Slide suivant"
      >
        <ChevronRight size={24} />
      </button>
    </>
  );
}