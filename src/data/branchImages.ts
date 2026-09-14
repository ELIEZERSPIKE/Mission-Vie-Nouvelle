// data/branchImages.ts - 8 images avec les vrais chemins dans public/images/Branches
import type { BranchImage } from '@/components/BranchCarousel/types';

export const branchImages: BranchImage[] = [
  // FATT (4 images)
  {
    id: 'fatt-1',
    src: '/images/Branches/fatt-1.jpg',
    alt: 'Formation FATT - Action et Terrain Théologique',
    branch: 'institut-biblique',
  },
  {
    id: 'fatt-2',
    src: '/images/Branches/institut-biblique2.jpg',
    alt: 'FATT - Formation Pratique',
    branch: 'institut-biblique',
  },
  {
    id: 'fatt-3',
    src: '/images/Branches/institut-biblique3.jpg',
    alt: 'FATT - Leadership Chrétien',
    branch: 'institut-biblique',
  },
  {
    id: 'fatt-4',
    src: '/images/Branches/institut-biblique4.jpg',
    alt: 'FATT - Mission et Évangélisation',
    branch: 'institut-biblique',
  },
  
  // FATHET (4 images)
  {
    id: 'fathet-1',
    src: '/images/Branches/fathet1.jpg',
    alt: 'FATHET - Institut Biblique Vie Nouvelle',
    branch: 'fathet',
  },
  {
    id: 'fathet-2',
    src: '/images/Branches/fathet-2.jpg',
    alt: 'FATHET - Licence et Master',
    branch: 'fathet',
  },
  {
    id: 'fathet-3',
    src: '/images/Branches/fathet-3.jpg',
    alt: 'FATHET - Études Bibliques',
    branch: 'fathet',
  },
  {
    id: 'fathet-4',
    src: '/images/Branches/fathet-4.jpg',
    alt: 'FATHET - Théologie Approfondie',
    branch: 'fathet',
  },
];
