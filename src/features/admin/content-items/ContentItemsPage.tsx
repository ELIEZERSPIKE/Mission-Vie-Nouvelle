import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentItemsApi } from '../../../api/endpoints/contentItems';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      {type}
    </span>
  );
}

export function ContentItemsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['content-items', 'all'],
    queryFn: contentItemsApi.listAll,
  });

  // Deux refs séparées par item : un input caché pour "remplacer",
  // un autre pour "nouvelle version" — chacun déclenché par son propre bouton.
  const replaceInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const versionInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const replaceMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => contentItemsApi.replaceFile(id, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content-items', 'all'] }),
  });

  const versionMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => contentItemsApi.newVersion(id, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content-items', 'all'] }),
  });

  if (isLoading) {
    return (
      <div className="px-5 py-10 sm:px-8 sm:py-16">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="border-t border-border/40 pt-8 md:pt-12">
          <p className="mb-3 text-sm font-medium tracking-wide text-primary">Contenu pédagogique</p>
          <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">Tous les supports ajoutés</h1>
        </header>

        {!items || items.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">Aucun support pour le moment.</p>
        ) : (
          <div className="mt-8 overflow-x-auto border border-border/60">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Matière</th>
                  <th className="px-4 py-3 font-medium">Position</th>
                  <th className="px-4 py-3 font-medium">Support</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Taille</th>
                  <th className="px-4 py-3 font-medium">Ajouté le</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border/40 last:border-0 align-top">
                    <td className="px-4 py-3 text-foreground">{item.subject?.title ?? '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.subject
                        ? `${item.subject.program?.name ?? '—'} — Année ${item.subject.year_order_index} — Trimestre ${item.subject.trimester_order_index}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{item.title}</td>
                    <td className="px-4 py-3">
                      <TypeBadge type={item.type} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.files[0] ? formatSize(item.files[0].size_bytes) : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(item.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {item.files[0] && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => navigate(`/admin/content-items/${item.id}/preview`)}
                          >
                            Ouvrir
                          </Button>
                        )}

                        <input
                          type="file"
                          accept=".pdf"
                          ref={(el) => {
                            replaceInputRefs.current[item.id] = el;
                          }}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) replaceMutation.mutate({ id: item.id, file });
                            e.target.value = ''; // permet de re-sélectionner le même fichier plus tard
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => replaceInputRefs.current[item.id]?.click()}
                          disabled={replaceMutation.isPending}
                          title="Corrige une erreur d'ajout de fichier — écrase l'ancien fichier définitivement"
                        >
                          {replaceMutation.isPending ? '...' : 'Remplacer'}
                        </Button>

                        <input
                          type="file"
                          accept=".pdf"
                          ref={(el) => {
                            versionInputRefs.current[item.id] = el;
                          }}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) versionMutation.mutate({ id: item.id, file });
                            e.target.value = '';
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => versionInputRefs.current[item.id]?.click()}
                          disabled={versionMutation.isPending}
                          title="Publie une nouvelle version — l'ancien fichier est conservé en historique"
                        >
                          {versionMutation.isPending ? '...' : 'Nouvelle version'}
                        </Button>
                      </div>
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