import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { academicYearsApi } from '../../../api/endpoints/academicYears';

function statusLabel(status: string) {
  return { DRAFT: 'En préparation', ACTIVE: 'Ouverte aux inscriptions', CLOSED: 'Fermée' }[status] ?? status;
}

export function GroupResourcesPickerPage() {
  const { data: academicYears, isLoading, isError } = useQuery({
    queryKey: ['academic-years', 'admin', 'group-resources'],
    queryFn: () => academicYearsApi.listAdmin(),
  });

  if (isLoading) {
    return (
      <div className="px-5 py-10 sm:px-8 sm:py-16">
        <p className="text-sm text-muted-foreground">Chargement des années académiques...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-5 py-10 sm:px-8 sm:py-16">
        <div role="alert" className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Erreur lors du chargement des années académiques.
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="border-t border-border/40 pt-8 md:pt-12">
          <p className="mb-3 text-sm font-medium tracking-wide text-primary">Groupes</p>
          <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">Ressources du groupe</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
            Choisissez l'année académique dont vous voulez gérer les ressources partagées entre l'administrateur et les étudiants.
          </p>
        </header>

        {!academicYears || academicYears.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">Aucune année académique pour le moment.</p>
        ) : (
          <div className="mt-10 overflow-x-auto border border-border/60">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Année</th>
                  <th className="px-4 py-3 font-medium">Cursus</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {academicYears.map((year) => (
                  <tr key={year.id} className="border-b border-border/40 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{year.label}</td>
                    <td className="px-4 py-3 text-foreground">{year.program?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{statusLabel(year.status)}</td>
                    <td className="px-4 py-3">
                      <NavLink
                        to={`/admin/group-resources/${year.id}`}
                        className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-muted"
                      >
                        Ouvrir les ressources
                      </NavLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}