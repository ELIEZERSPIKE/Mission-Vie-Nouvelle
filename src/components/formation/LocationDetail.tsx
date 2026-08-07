import type { TrainingLocation } from "@/data/trainingLocations";

interface LocationDetailProps {
  location: TrainingLocation;
  accentColor: "accent" | "primary";
}

const accentStyles = {
  accent: {
    panel: "bg-accent-100 border-accent-300 text-accent-900",
    heading: "text-accent-700",
    button: "bg-accent/10 text-accent hover:bg-accent/20 border-accent/50",
  },
  primary: {
    panel: "bg-primary-100 border-primary-300 text-primary-900",
    heading: "text-primary-700",
    button: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/50",
  },
} as const;

function getMapSrc(location: TrainingLocation) {
  if (location.mapEmbedUrl && location.mapEmbedUrl.includes("/embed")) {
    return location.mapEmbedUrl;
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(location.mapsQuery)}&output=embed`;
}

export default function LocationDetail({ location, accentColor }: LocationDetailProps) {
  const styles = accentStyles[accentColor];
  const mapSrc = getMapSrc(location);
  const googleMapsUrl = location.mapEmbedUrl
    ? location.mapEmbedUrl
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapsQuery)}`;

  return (
    <div className={`border rounded-3xl overflow-hidden shadow-sm ${styles.panel}`}>
      <div className="p-5 space-y-4">
        <div>
          <h3 className={`text-xl font-bold ${styles.heading}`}>{location.city}</h3>
          <p className="text-sm text-foreground/70 mt-1">{location.quartier}</p>
        </div>

        <div className="space-y-2 text-sm text-foreground/80">
          <div>
            <span className="font-semibold">Téléphone</span>
            <div className="mt-1 space-y-1">
              {location.phones.map((phone, index) => (
                <p key={index}>{phone}</p>
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold">Localisation</span>
            <p className="mt-1 text-xs text-foreground/60">{location.mapsQuery}</p>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 bg-slate-100">
        <iframe
          title={`Carte de ${location.city}`}
          src={mapSrc}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="p-5 border-t border-border/60 bg-background">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center justify-center w-full rounded-full px-4 py-2 text-sm font-semibold transition ${styles.button} border`}
        >
          Voir sur Google Maps
        </a>
      </div>
    </div>
  );
}
