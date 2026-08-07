import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import type { BranchImage, BranchCarouselProps } from './types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

// Import styles personnalisés
import styles from './BranchCarousel.module.css';

export default function BranchCarousel({ 
  images, 
  className = "",
  autoPlaySpeed = 4,
  radius = 260,
  activeBranch,
  onSelectImage,
  onSelectBranch
}: BranchCarouselProps) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Synchronisation lorsque activeBranch change depuis le composant parent
  useEffect(() => {
    if (!activeBranch || !swiperRef.current || images.length === 0) return;

    const currentImg = images[currentIndex];
    const isCurrentFatt = currentImg?.id.startsWith('fatt') || currentImg?.branch === 'fatt';
    const currentBranch = isCurrentFatt ? 'fatt' : 'fathet';

    if (currentBranch !== activeBranch) {
      const targetIndex = images.findIndex((img) => {
        const isImgFatt = img.id.startsWith('fatt') || img.branch === 'fatt';
        return activeBranch === 'fatt' ? isImgFatt : !isImgFatt;
      });

      if (targetIndex !== -1 && swiperRef.current) {
        swiperRef.current.slideToLoop(targetIndex);
      }
    }
  }, [activeBranch, images, currentIndex]);

  if (!images || images.length === 0) {
    return <div className="text-center p-8 text-foreground/50">Aucune image disponible</div>;
  }

  // Configuration de l'effet Coverflow pour créer l'effet Arc 3D
  const coverflowEffect = {
    rotate: 26,          // Angle de rotation 3D pour l'arc
    stretch: -15,        // Rapprochement horizontal des éléments en arc
    depth: radius,       // Profondeur 3D de la courbe
    modifier: 1.2,       // Facteur d'échelle
    slideShadows: true,  // Ombrages 3D sur les bords
  };

  const handleSlideChange = (swiper: SwiperClass) => {
    const realIdx = swiper.realIndex;
    setCurrentIndex(realIdx);
    const selectedImg = images[realIdx];

    if (!selectedImg) return;

    if (onSelectImage) {
      onSelectImage(selectedImg);
    }

    if (onSelectBranch) {
      const isFatt = selectedImg.id.startsWith('fatt') || selectedImg.branch === 'fatt';
      onSelectBranch(isFatt ? 'fatt' : 'fathet');
    }
  };

  const toggleAutoplay = () => {
    if (!swiperRef.current) return;
    if (isPlaying) {
      swiperRef.current.autoplay.stop();
      setIsPlaying(false);
    } else {
      swiperRef.current.autoplay.start();
      setIsPlaying(true);
    }
  };

  return (
    <div className={`relative ${styles.carouselContainer} ${className}`}>
      
      {/* Lumière d'ambiance 3D au sol */}
      <div className={styles.arcFloorLight} />
      <div className={styles.arcRingLine} />

      {/* Swiper Carousel 3D */}
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        effect="coverflow"
        coverflowEffect={coverflowEffect}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        loop={images.length > 2}
        autoplay={
          autoPlaySpeed > 0 ? {
            delay: autoPlaySpeed * 1000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          } : false
        }
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        onSlideChange={handleSlideChange}
        className="w-full py-4"
        breakpoints={{
          320: {
            slidesPerView: 1.3,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 'auto',
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 'auto',
            spaceBetween: 30,
          },
        }}
      >
        {images.map((image, index) => {
          const isFatt = image.id.startsWith('fatt') || image.branch === 'fatt';
          
          return (
            <SwiperSlide 
              key={image.id}
              className={styles.customSlide}
            >
              {({ isActive }) => (
                <motion.div
                  className={`
                    relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer
                    w-56 h-72 sm:w-64 sm:h-88 lg:w-72 lg:h-96
                    transition-all duration-500 transform-3d
                    ${isActive 
                      ? isFatt
                        ? 'ring-4 ring-amber-500/80 shadow-2xl shadow-amber-500/30 scale-105 z-20 ' + styles.glowActiveFatt
                        : 'ring-4 ring-indigo-500/80 shadow-2xl shadow-indigo-500/30 scale-105 z-20 ' + styles.glowActiveFathet
                      : 'ring-1 ring-white/20 opacity-80 hover:opacity-100 hover:scale-102 hover:ring-white/40'
                    }
                  `}
                  whileHover={{ 
                    scale: isActive ? 1.07 : 1.03,
                    transition: { duration: 0.3 }
                  }}
                  onClick={() => {
                    if (swiperRef.current) {
                      swiperRef.current.slideToLoop(index);
                    }
                  }}
                >
                  {/* Image de fond */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                    loading="lazy"
                  />
                  
                  {/* Surbrillance et dégradé d'ambiance */}
                  <div className={`
                    absolute inset-0 transition-opacity duration-300
                    ${isFatt 
                      ? 'bg-gradient-to-t from-black/90 via-black/30 to-amber-500/10' 
                      : 'bg-gradient-to-t from-black/90 via-black/30 to-indigo-500/10'
                    }
                    ${isActive ? 'opacity-85' : 'opacity-90'}
                  `} />
                  
                  {/* Badge & Titre de l'image */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-center flex flex-col items-center gap-2">

                    {image.label && (
                      <motion.span
                        className={`
                          block text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md px-3.5 py-1.5 rounded-xl border
                          ${isActive 
                            ? isFatt 
                              ? 'bg-amber-500/20 text-white border-amber-500/50 shadow-md shadow-amber-500/20 font-bold' 
                              : 'bg-indigo-500/20 text-white border-indigo-500/50 shadow-md shadow-indigo-500/20 font-bold'
                            : 'bg-black/60 text-white/80 border-white/10'
                          }
                        `}
                        animate={{
                          scale: isActive ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {image.label}
                      </motion.span>
                    )}
                  </div>

                  {/* Contour brillant actif */}
                 
                </motion.div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Navigation Boutons G / D */}
      {images.length > 1 && (
        <div className="flex items-center justify-between pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 z-30 px-2">
          <button
            type="button"
            className="pointer-events-auto p-3 sm:p-3.5 rounded-full bg-background/80 border border-white/20 text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-110 active:scale-95 transition-all duration-300 shadow-2xl backdrop-blur-md"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Diapositive précédente"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <button
            type="button"
            className="pointer-events-auto p-3 sm:p-3.5 rounded-full bg-background/80 border border-white/20 text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-110 active:scale-95 transition-all duration-300 shadow-2xl backdrop-blur-md"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Diapositive suivante"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}

    </div>
  );
}