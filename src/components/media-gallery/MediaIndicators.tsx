interface MediaIndicatorsProps {
  total: number;
  current: number;
  onChange: (index: number) => void;
}

export function MediaIndicators({ total, current, onChange }: MediaIndicatorsProps) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`h-2 rounded-full transition-all ${
            i === current 
              ? "w-8 bg-accent" 
              : "w-2 bg-accent/30 hover:bg-accent/50"
          }`}
          aria-label={`Aller à la page ${i + 1}`}
        />
      ))}
    </div>
  );
}