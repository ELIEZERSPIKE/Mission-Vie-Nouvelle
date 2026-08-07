import { useState, useCallback } from "react";

interface UseMediaGalleryProps {
  totalSlides: number;
  initialIndex?: number;
}

export function useMediaGallery({ totalSlides, initialIndex = 0 }: UseMediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goTo = useCallback((index: number) => {
    setCurrentIndex((index + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  return {
    currentIndex,
    setCurrentIndex,
    goTo,
    goToNext,
    goToPrevious,
  };
}