import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import { catalogApi } from '../../../api/endpoints/catalog';
import { useAuth } from '../../../auth/useAuth';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { getYearStats } from '../catalogStats';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount);
}

function AccessBadge({ hasAccess }: { hasAccess: boolean }) {
  if (hasAccess) {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <CheckCircle2 className="size-3.5" aria-hidden />
        Accès actif
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1.5 text-muted-foreground">
      <Lock className="size-3.5" aria-hidden />
      Non inscrit
    </Badge>
  );
}

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: programs, isLoading, isError } = useQuery({
    queryKey: ['full-catalog'],
    queryFn: catalogApi.getFullCatalog,
  });

  if (isLoading) return <CatalogSkeleton />;

  if (isError) {
    return (
      <div
        role="alert"
        className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        Erreur lors du chargement du parcours.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-serif text-3xl tracking-tight text-foreground">
          Bonjour, {user?.full_name?.split(' ')[0] ?? 'cher étudiant'}
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
          Découvrez les cursus proposés par l'institut et les supports pédagogiques associés.
        </p>
      </header>

      {programs?.map((program) => (
        <section key={program.id} className="space-y-6">
          <div className="border-b border-border/40 pb-2">
            <h2 className="font-serif text-2xl text-foreground">{program.name}</h2>
          </div>

          <div className="grid gap-4">
            {program.academic_years.map((year) => {
              const stats = getYearStats(year);
              return (
                <article
                  key={year.id}
                  className="rounded-lg border border-border/60 bg-card p-5 text-card-foreground transition-colors hover:border-border"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 space-y-2">
                      <h3 className="font-serif text-xl leading-tight text-foreground">
                        {year.label}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {stats.trimesterCount} trimestre{stats.trimesterCount > 1 ? 's' : ''}
                        {' · '}
                        {stats.subjectCount} matière{stats.subjectCount > 1 ? 's' : ''}
                        {' · '}
                        {stats.supportCount} support{stats.supportCount > 1 ? 's' : ''}
                      </p>

                      {year.has_access ? (
                        stats.activeTrimester ? (
                          <p className="text-sm text-foreground">
                            <span className="font-medium">En cours :</span>{' '}
                            {stats.activeTrimester.label}
                            {stats.nextTrimester && (
                              <span className="text-muted-foreground">
                                {' · '}Prochain : {stats.nextTrimester.label}
                              </span>
                            )}
                          </p>
                        ) : null
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Contenu disponible dès l'inscription.
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <AccessBadge hasAccess={year.has_access} />

                      {year.has_access ? (
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/student/year/${year.id}`)}
                          className="gap-1.5"
                        >
                          Voir le programme
                          <ChevronRight className="size-4" aria-hidden />
                        </Button>
                      ) : (
                        <div className="flex items-center gap-4">
                          {year.price ? (
                            <div className="text-right">
                              <div className="font-serif text-lg leading-none text-foreground">
                                {formatPrice(year.price)}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {year.currency}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Tarif non défini
                            </span>
                          )}
                          <Button
                            disabled={!year.price}
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
                          >
                            S'inscrire
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {(!programs || programs.length === 0) && (
        <p className="text-sm text-muted-foreground">Le catalogue n'est pas encore publié.</p>
      )}
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="animate-pulse space-y-12">
      <div className="space-y-2">
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="h-4 w-96 rounded bg-muted/60" />
      </div>
      <div className="space-y-4">
        {[0, 1].map((i) => (
          <div key={i} className="h-32 rounded-lg border border-border/60 bg-muted/30" />
        ))}
      </div>
    </div>
  );
}