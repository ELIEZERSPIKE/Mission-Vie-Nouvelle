import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { catalogApi } from '../../../api/endpoints/catalog';
import { useAuth } from '../../../auth/useAuth';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

const TYPE_LABELS: Record<string, string> = {
  PDF: 'Document PDF',
  VIDEO: 'Vidéo',
  AUDIO: 'Audio',
  DOCUMENT: 'Autre document',
  ASSESSMENT: 'Évaluation',
};

const TRIMESTER_LABELS: Record<string, string> = {
  UPCOMING: 'À venir',
  ACTIVE: 'En cours',
  COMPLETED: 'Terminé (révision)',
};

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount);
}

function TypeLabel({ type }: { type: string }) {
  return (
    <span className="text-xs text-muted-foreground">
      {TYPE_LABELS[type] ?? type}
    </span>
  );
}

function AccessBadge({ hasAccess }: { hasAccess: boolean }) {
  if (hasAccess) {
    return (
      <Badge variant="secondary" className="gap-1">
        <span aria-hidden="true">✓</span> Accès actif
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1 text-muted-foreground">
      <span aria-hidden="true">🔒</span> Non inscrit
    </Badge>
  );
}

function TrimesterStatus({ status }: { status: string }) {
  const label = TRIMESTER_LABELS[status] ?? status;
  if (status === 'ACTIVE') {
    return <Badge variant="default">{label}</Badge>;
  }
  if (status === 'COMPLETED') {
    return <Badge variant="secondary">{label}</Badge>;
  }
  return <Badge variant="outline" className="text-muted-foreground">{label}</Badge>;
}

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: programs, isLoading, isError } = useQuery({
    queryKey: ['full-catalog'],
    queryFn: catalogApi.getFullCatalog,
  });

  if (isLoading) {
    return (
      <div className="space-y-1.5 animate-pulse rounded-xl border border-border/60 px-5 py-10">
        <div className="h-8 w-64 bg-muted rounded" />
        <div className="h-4 w-96 bg-muted/60 rounded" />
        <div className="mt-8 h-40 w-full bg-muted/40 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Erreur lors du chargement du parcours.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <p className="font-serif text-xl leading-tight text-foreground">
          Bienvenue, {user?.full_name?.split(' ')[0] ?? 'cher étudiant'}
        </p>
        <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
          Découvrez les cursus proposés par l'institut, les années d'études et les supports pédagogiques
          associés à chaque matière.
        </p>
      </header>

      {programs?.map((program) => (
        <section key={program.id}>
          <div className="border-b border-border/40 pb-2">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="font-serif text-2xl text-foreground">{program.name}</h2>
              {program.code && (
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {program.code}
                </span>
              )}
            </div>
          </div>

          {program.academic_years.map((year) => (
            <article
              key={year.id}
              className="mt-6 rounded-md border border-border/60 bg-card text-card-foreground"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
                <div>
                  <h3 className="font-serif text-lg leading-tight text-foreground">{year.label}</h3>
                  {!year.has_access && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {year.price
                        ? `${formatPrice(year.price)} ${year.currency}`
                        : 'Tarif non défini pour cette année'}
                    </p>
                  )}
                </div>

                {year.has_access ? (
                  <AccessBadge hasAccess />
                ) : (
                  <Button
                    onClick={() =>
                      navigate(`/student/enroll/${year.id}`, {
                        state: {
                          yearLabel: year.label,
                          programName: program.name,
                          price: year.price,
                          currency: year.currency,
                        },
                      })
                    }
                    disabled={!year.price}
                  >
                    S'inscrire
                  </Button>
                )}
              </div>
{year.trimesters.map((trimester) => (
                <div key={trimester.id} className="mt-5 px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">{trimester.label}</h4>
                    <TrimesterStatus status={trimester.status} />
                  </div>

                  {trimester.subjects.map((subject) => (
                    <div key={subject.id} className="mt-4 border-t border-border/30">
                      <div className="flex items-start justify-between gap-2 py-1">
                        <h5 className="font-medium text-foreground">{subject.title}</h5>
                        <span className="text-xs text-muted-foreground">
                          {subject.content_items.length}{' '}
                          {subject.content_items.length > 1 ? 'supports' : 'support'}
                        </span>
                      </div>

                      {subject.description && (
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {subject.description}
                        </p>
                      )}

                      <ul className="mt-2 space-y-1">
                        {subject.content_items.map((ci) => (
                          <li key={ci.id} className="flex items-center gap-2">
                            {year.has_access ? (
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() =>
                                  navigate(`/content/${ci.id}`, {
                                    state: {
                                      contentTitle: ci.title,
                                      contentType: ci.type,
                                    },
                                  })
                                }
                                className="h-auto px-0"
                              >
                                {ci.title}
                              </Button>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                <span aria-hidden="true">🔒</span> {ci.title}
                              </span>
                            )}
                            <TypeLabel type={ci.type} />
                          </li>
                        ))}
                        {subject.content_items.length === 0 && (
                          <li className="text-sm text-muted-foreground">Aucun support pour le moment.</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </article>
          ))}
        </section>
      ))}

      {(!programs || programs.length === 0) && (
        <p className="text-sm text-muted-foreground">Le catalogue n'est pas encore publié.</p>
      )}
    </div>
  );
}