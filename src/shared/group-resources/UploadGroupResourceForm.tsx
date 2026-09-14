import { useState } from 'react';
import { useCreateGroupResource } from './api';
import type { GroupResourceType } from './types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { cn } from '../../lib/utils';

interface Props {
  academicYearId: string;
  onSuccess?: () => void;
}

const TYPE_OPTIONS: { value: GroupResourceType; label: string }[] = [
  { value: 'FILE', label: 'Fichier (PDF / image)' },
  { value: 'LINK', label: 'Lien externe' },
];

export function UploadGroupResourceForm({ academicYearId, onSuccess }: Props) {
  const [type, setType] = useState<GroupResourceType>('FILE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useCreateGroupResource(academicYearId);

  function resetForm() {
    setTitle('');
    setDescription('');
    setFile(null);
    setExternalUrl('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Le titre est requis.');
      return;
    }

    if (type === 'FILE') {
      if (!file) {
        setError('Sélectionnez un fichier.');
        return;
      }
      mutate(
        { type: 'FILE', title, description, file },
        {
          onSuccess: () => {
            resetForm();
            onSuccess?.();
          },
          onError: () => setError("Échec de l'envoi. Vérifiez le type et la taille du fichier."),
        }
      );
    } else {
      if (!externalUrl.trim()) {
        setError('Le lien est requis.');
        return;
      }
      mutate(
        { type: 'LINK', title, description, external_url: externalUrl },
        {
          onSuccess: () => {
            resetForm();
            onSuccess?.();
          },
          onError: () => setError('Échec de l\'ajout du lien.'),
        }
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-md border border-border/60 bg-card p-5 text-card-foreground sm:p-6"
    >
      <div>
        <p className="text-xs font-medium text-muted-foreground">Type de support</p>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Type de support">
          {TYPE_OPTIONS.map((option) => {
            const isSelected = type === option.value;
            return (
              <label
                key={option.value}
                className={cn(
                  'cursor-pointer rounded-md border px-3 py-2 text-sm transition-colors has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring',
                  isSelected
                    ? 'border-primary bg-primary/10 font-medium text-foreground'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                )}
              >
                <input
                  type="radio"
                  name="resource-type"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => setType(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="group-resource-title">Titre</Label>
        <Input
          id="group-resource-title"
          placeholder="Ex : Épître aux Romains, cours 1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="group-resource-description">Description (optionnel)</Label>
        <Textarea
          id="group-resource-description"
          placeholder="Quelques mots sur le contenu du support..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      {type === 'FILE' ? (
        <div className="space-y-2">
          <Label htmlFor="group-resource-file">Fichier</Label>
          <Input
            id="group-resource-file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs leading-5 text-muted-foreground">
            Formats acceptés : PDF, JPG, JPEG, PNG, WebP.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="group-resource-url">Adresse du lien</Label>
          <Input
            id="group-resource-url"
            type="url"
            placeholder="https://..."
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            className="h-11"
          />
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={isPending} className="h-10 px-6">
          {isPending ? 'Ajout en cours...' : 'Ajouter la ressource'}
        </Button>
      </div>
    </form>
  );
}