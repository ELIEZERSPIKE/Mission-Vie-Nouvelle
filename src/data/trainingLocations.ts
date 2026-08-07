type BranchType = 'fatt' | 'fathet';

export interface TrainingLocation {
  id: BranchType;
  city: string;
  quartier: string;
  phones: string[];
  images: { url: string; alt: string }[];
  mapEmbedUrl?: string; // URL pb= précise depuis "Partager > Intégrer une carte"
  mapsQuery: string;    // fallback si pas encore d'URL précise
}


export const trainingLocations: TrainingLocation[] = [
  {
    id: 'fatt',
    city: 'Lomé',
    quartier: 'Ablogamé',
    phones: ['+228 91 12 32 45'],
    images: [
      { url: '/images/locations/Ablogame.jpg', alt: 'Centre FATT Ablogamé - vue extérieure' },
    ],
    mapEmbedUrl: 'https://maps.app.goo.gl/bChsrwSRsgg7demx9?g_st=ac',
    mapsQuery: 'Ablogamé, Lomé, Togo',
  },
  {
    id: 'fathet',
    city: 'Togoville',
    quartier: 'Petit Paradis',
    phones: ['+228 92 33 23 33'],
    images: [
      { url: '/images/locations/Petit-Paradis.jpg', alt: 'Centre FATHET Togoville - vue extérieure' },
    ],
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d253834.62605604643!2d1.2645027370830522!3d6.241837129650864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2stg!4v1786014241023!5m2!1sfr!2stg',

    mapsQuery: 'Petit Paradis, Togoville, Togo',
  },
];