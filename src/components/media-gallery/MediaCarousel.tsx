import { Carousel, CarouselContent, CarouselItem } from "../../../components/motion-primitives/carousel";
import { MediaItem as MediaItemComponent } from "./MediaItem";
import { MediaControls } from "./MediaControls";
import { MediaIndicators } from "./MediaIndicators";
import { useMediaGallery } from "./hooks/useMediaGallery";
import { MediaItem, MediaGalleryProps } from "./types";

// Classes Tailwind statiques pour éviter le purging (les classes dynamiques ne sont pas détectées)
const GRID_COLS_MAP: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

interface MediaCarouselProps extends MediaGalleryProps {
  items: MediaItem[];
  itemsPerSlide?: number;
}

export function MediaCarousel({ 
  items, 
  itemsPerSlide = 3,
  autoplay = false,
  autoplayDelay = 5000,
  showControls = true,
  showIndicators = true,
}: MediaCarouselProps) {
  const totalSlides = Math.ceil(items.length / itemsPerSlide);
  const { currentIndex, goToNext, goToPrevious, setCurrentIndex } = useMediaGallery({ totalSlides });

  const gridColsClass = GRID_COLS_MAP[itemsPerSlide] ?? "grid-cols-3";

  return (
    <div className="relative">
      <Carousel index={currentIndex} onIndexChange={setCurrentIndex}>
        <CarouselContent>
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <CarouselItem key={slideIndex}>
              <div className={`grid ${gridColsClass} gap-4 p-2`}>
                {items
                  .slice(slideIndex * itemsPerSlide, slideIndex * itemsPerSlide + itemsPerSlide)
                  .map((item, i) => (
                    <MediaItemComponent 
                      key={i} 
                      item={item} 
                      index={i}
                      className="aspect-square"
                    />
                  ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {showControls && (
        <MediaControls onPrevious={goToPrevious} onNext={goToNext} />
      )}

      {showIndicators && (
        <MediaIndicators 
          total={totalSlides} 
          current={currentIndex} 
          onChange={setCurrentIndex} 
        />
      )}
    </div>
  );
}