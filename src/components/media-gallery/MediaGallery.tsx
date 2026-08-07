import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { MediaCarousel } from "./MediaCarousel";
import { DEFAULT_MEDIA_ITEMS } from "./constants";
import { MediaGalleryProps } from "./types";

export function MediaGallery({
  items = DEFAULT_MEDIA_ITEMS, // Utilise les images par défaut si non spécifiées
  itemsPerSlide = 3,
  autoplay = false,
  autoplayDelay = 5000,
  showControls = true,
  showIndicators = true,
  title = "La mission Vie Nouvelle en images",
  subtitle = "Médiathèque",
  ctaLink = "/actualites",
  className = "",
}: MediaGalleryProps) {
  return (
    <section id="mediatheque" className={`bg-background py-24 sm:py-36 ${className}`}>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">{subtitle}</p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-balance">{title}</h2>
          </div>
        </div>

        <MediaCarousel
          items={items}
          itemsPerSlide={itemsPerSlide}
          autoplay={autoplay}
          autoplayDelay={autoplayDelay}
          showControls={showControls}
          showIndicators={showIndicators}
        />
      </div>
    </section>
  );
}