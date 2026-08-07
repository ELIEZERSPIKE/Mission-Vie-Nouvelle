export interface MediaItem {
  image: string;
  name: string;
  description?: string;
  link?: string;
}

export interface MediaGalleryProps {
  items?: MediaItem[];
  itemsPerSlide?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}