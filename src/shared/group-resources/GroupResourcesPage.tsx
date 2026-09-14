import { useParams } from 'react-router-dom';
import { GroupResourcesPanel } from './GroupResourcesPanel';

export function GroupResourcesPage() {
  const { yearId } = useParams<{ yearId: string }>();

  if (!yearId) {
    return (
      <div
        role="alert"
        className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        Année académique introuvable.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="border-t border-border/40 pt-8 md:pt-12">
        <p className="mb-3 text-sm font-medium tracking-wide text-primary">Espace partagé</p>
        <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">
          Ressources du groupe
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
          Fichiers et liens mis à disposition par l'administration, accessibles à toute la
          promotion.
        </p>
      </header>

      <GroupResourcesPanel academicYearId={yearId} />
    </div>
  );
}