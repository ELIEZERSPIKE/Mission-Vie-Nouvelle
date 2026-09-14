import { useState } from 'react';
import { FileText, Link } from 'lucide-react';
import {
  useGroupResources,
  useDeleteGroupResource,
  useUpdateGroupResource,
  downloadGroupResource,
  resolveGroupResourceLink,
} from './api';
import type { GroupResource } from './types';
import { useAuth } from '../../auth/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';

function formatSize(kb: number | null): string {
  if (!kb) return '';
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} Mo` : `${kb} Ko`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface EditFormProps {
  resource: GroupResource;
  academicYearId: string;
  onDone: () => void;
}

function GroupResourceEditForm({ resource, academicYearId, onDone }: EditFormProps) {
  const [title, setTitle] = useState(resource.title);
  const [description, setDescription] = useState(resource.description ?? '');
  const [externalUrl, setExternalUrl] = useState(resource.external_url ?? '');
  const [file, setFile] = useState<File | null>(null);

  const { mutate: updateResource, isPending, error } = useUpdateGroupResource(academicYearId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateResource(
      {
        id: resource.id,
        payload: {
          title,
          description: description || null,
          ...(resource.type === 'LINK' ? { external_url: externalUrl } : {}),
          ...(file ? { file } : {}),
        },
      },
      { onSuccess: onDone }
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border-t border-border/30 bg-muted/20 px-4 py-5 sm:px-6"
    >
      <div className="space-y-2">
        <Label htmlFor={`group-resource-edit-title-${resource.id}`}>Titre</Label>
        <Input
          id={`group-resource-edit-title-${resource.id}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`group-resource-edit-description-${resource.id}`}>Description</Label>
        <Textarea
          id={`group-resource-edit-description-${resource.id}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      {resource.type === 'LINK' && (
        <div className="space-y-2">
          <Label htmlFor={`group-resource-edit-url-${resource.id}`}>URL</Label>
          <Input
            id={`group-resource-edit-url-${resource.id}`}
            type="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            required
          />
        </div>
      )}

      {resource.type === 'FILE' && (
        <div className="space-y-2">
          <Label htmlFor={`group-resource-edit-file-${resource.id}`}>
            Remplacer le fichier (optionnel)
          </Label>
          <Input
            id={`group-resource-edit-file-${resource.id}`}
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-muted-foreground">
            Fichier actuel : {resource.original_filename}
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          Échec de la mise à jour.
        </p>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onDone}>
          Annuler
        </Button>
      </div>
    </form>
  );
}

interface ItemProps {
  resource: GroupResource;
  academicYearId: string;
}

function GroupResourceItem({ resource, academicYearId }: ItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: deleteResource, isPending: isDeleting } = useDeleteGroupResource(academicYearId);

  const canManage =
    user?.id === resource.uploaded_by.id ||
    user?.roles.includes('ADMIN') ||
    user?.roles.includes('SUPER_ADMIN');

  const isFile = resource.type === 'FILE';

  async function handleOpen() {
    if (isFile) {
      await downloadGroupResource(resource);
    } else {
      const url = await resolveGroupResourceLink(resource.id);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  function handleDelete() {
    if (confirm(`Supprimer "${resource.title}" ?`)) {
      deleteResource(resource.id);
    }
  }

  return (
    <li className="border-b border-border/30 last:border-0">
      <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            {isFile ? (
              <FileText className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Link className="h-4 w-4" aria-hidden="true" />
            )}
          </span>

          <div className="min-w-0">
            <p className="font-medium leading-6 text-foreground">{resource.title}</p>
            {resource.description && (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{resource.description}</p>
            )}
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{isFile ? 'Fichier' : 'Lien externe'}</span>
              {isFile && resource.file_size_kb ? (
                <span>{formatSize(resource.file_size_kb)}</span>
              ) : null}
              <span>{formatDate(resource.created_at)}</span>
              <span>
                par {resource.uploaded_by.first_name} {resource.uploaded_by.last_name}
              </span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button size="sm" onClick={handleOpen}>
            {isFile ? 'Télécharger' : 'Ouvrir'}
          </Button>
          {canManage && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing((v) => !v)}>
              {isEditing ? 'Fermer' : 'Modifier'}
            </Button>
          )}
          {canManage && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </Button>
          )}
        </div>
      </div>

      {isEditing && (
        <GroupResourceEditForm
          resource={resource}
          academicYearId={academicYearId}
          onDone={() => setIsEditing(false)}
        />
      )}
    </li>
  );
}

interface ListProps {
  academicYearId: string;
}

export function GroupResourceList({ academicYearId }: ListProps) {
  const { data, isLoading, isError } = useGroupResources(academicYearId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Chargement des ressources...</p>;
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        Impossible de charger les ressources.
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border/40 px-4 py-12 text-center">
        <p className="text-sm text-muted-foreground">
          Aucune ressource partagée pour le moment.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border/30 border-t border-border/30">
      {data.data.map((resource) => (
        <GroupResourceItem key={resource.id} resource={resource} academicYearId={academicYearId} />
      ))}
    </ul>
  );
}