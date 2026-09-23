import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { programsApi } from '../../../api/endpoints/programs';
import { useState, type FormEvent } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

// Type minimal pour le programme
interface Program {
  id: string;
  code: string;
  name: string;
  status: string;
}


function formatProgramCode(code: string): string {
  return code.replace(/_/g, ' ');
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-primary/10 text-primary',
    ARCHIVED: 'bg-muted text-muted-foreground',
    PUBLISHED: 'bg-green-500/10 text-green-600',
  };
  const labels: Record<string, string> = {
    ACTIVE: 'Actif',
    ARCHIVED: 'Archivé',
    PUBLISHED: 'Publié',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${styles[status] ?? 'bg-muted text-muted-foreground'}`}>
      {labels[status] ?? status}
    </span>
  );
}

export function ProgramsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const { data: programs, isLoading, isError } = useQuery<Program[]>({
    queryKey: ['programs', 'admin'],
    queryFn: programsApi.listAdmin,
  });

  // Helper générique pour la mise à jour optimiste du statut
  const useUpdateStatusMutation = (
    mutationFn: (id: string) => Promise<unknown>,
    newStatus: string
  ) => {
    return useMutation({
      mutationFn,
      onMutate: async (programId: string) => {
        // 1. Annuler les requêtes en cours pour éviter d'écraser notre mise à jour
        await queryClient.cancelQueries({ queryKey: ['programs', 'admin'] });

        // 2. Sauvegarder le cache précédent pour le rollback si erreur
        const previousPrograms = queryClient.getQueryData<Program[]>(['programs', 'admin']);

        // 3. Mettre à jour le cache instantanément
        queryClient.setQueryData<Program[]>(['programs', 'admin'], (old = []) =>
          old.map((p) => (p.id === programId ? { ...p, status: newStatus } : p))
        );

        return { previousPrograms };
      },
      onError: (_err, _variables, context) => {
        // En cas d'erreur, restaurer la valeur précédente
        if (context?.previousPrograms) {
          queryClient.setQueryData(['programs', 'admin'], context.previousPrograms);
        }
      },
      onSettled: () => {
        // Resynchroniser avec le serveur une fois terminé
        queryClient.invalidateQueries({ queryKey: ['programs', 'admin'] });
      },
    });
  };

  const createMutation = useMutation({
    mutationFn: programsApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['programs', 'admin'] });
      setName('');
      setFormError(null);
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message ?? 'Erreur lors de la création.');
    },
  });

  const archiveMutation = useUpdateStatusMutation(programsApi.archive, 'ARCHIVED');
  const unarchiveMutation = useUpdateStatusMutation(programsApi.unarchive, 'ACTIVE');
  const publishMutation = useUpdateStatusMutation(programsApi.publish, 'PUBLISHED');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ name });
  };

  if (isLoading) {
    return (
      <div className="px-5 py-10 sm:px-8 sm:py-16">
        <p className="text-sm text-muted-foreground">Chargement des programmes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-5 py-10 sm:px-8 sm:py-16">
        <div role="alert" className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Erreur lors du chargement des programmes.
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="border-t border-border/40 pt-8 md:pt-12">
          <p className="mb-3 text-sm font-medium tracking-wide text-primary">Gestion des cursus</p>
          <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">Programmes</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
            Créez et gérez les cursus proposés par l'institut.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mt-10 border border-border/60 bg-card p-6 sm:p-8">
          <h2 className="font-serif text-xl text-foreground">Créer un programme</h2>

          {formError && (
            <div role="alert" className="mt-4 border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {formError}
            </div>
          )}

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="program-name">Nom</Label>
              <Input
                id="program-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11"
              />
            </div>
          </div>

          <Button type="submit" disabled={createMutation.isPending} className="mt-6 h-11 px-6">
            {createMutation.isPending ? 'Création...' : 'Créer le programme'}
          </Button>
        </form>

        <div className="mt-10">
          <h2 className="font-serif text-xl text-foreground">Tous les programmes</h2>

          {!programs || programs.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Aucun programme pour le moment.</p>
          ) : (
            <div className="mt-4 overflow-x-auto border border-border/60">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Code</th>
                    <th className="px-4 py-3 font-medium">Nom</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => {
                    // On vérifie si une mutation est en cours spécifiquement pour CE programme
                    const isArchiving = archiveMutation.isPending && archiveMutation.variables === program.id;
                    const isUnarchiving = unarchiveMutation.isPending && unarchiveMutation.variables === program.id;
                    const isPublishing = publishMutation.isPending && publishMutation.variables === program.id;
                    const isItemPending = isArchiving || isUnarchiving || isPublishing;

                    return (
                      <tr key={program.id} className="border-b border-border/40 last:border-0">
                        <td className="px-4 py-3 font-medium text-foreground">{formatProgramCode(program.code)}</td>
                        <td className="px-4 py-3 text-foreground">{program.name}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={program.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {program.status === 'ACTIVE' && (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => archiveMutation.mutate(program.id)}
                                  disabled={isItemPending}
                                >
                                  {isArchiving ? 'Archivage...' : 'Archiver'}
                                </Button>

                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => publishMutation.mutate(program.id)}
                                  disabled={isItemPending}
                                >
                                  {isPublishing ? 'Publication...' : 'Publier'}
                                </Button>
                              </>
                            )}

                            {program.status === 'ARCHIVED' && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => unarchiveMutation.mutate(program.id)}
                                disabled={isItemPending}
                              >
                                {isUnarchiving ? 'Désarchivage...' : 'Désarchiver'}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}