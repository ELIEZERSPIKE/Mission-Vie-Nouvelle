import { useRef, useState, type ChangeEvent } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { useAuth } from '../../../auth/useAuth';
import { Button } from '../../../components/ui/button';

export function AvatarUploader() {
  const { user, uploadAvatar, deleteAvatar } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Format non supporté (JPG, PNG ou WEBP uniquement).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image trop lourde (2 Mo maximum).');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      await uploadAvatar(file);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Échec de l\'envoi.');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteAvatar();
      setPreview(null);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Échec de la suppression.');
    }
  };

  const displayedSrc = preview ?? user?.avatar_url ?? null;

  return (
    <section className="border border-border/60 bg-card p-6 sm:p-8">
      <h2 className="font-serif text-xl text-foreground">Photo de profil</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
        Cette photo permet de vous identifier plus facilement dans vos échanges avec l&apos;institut.
      </p>

      {error && (
        <div role="alert" className="mt-4 border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-muted">
          {displayedSrc ? (
            <img src={displayedSrc} alt="Votre photo de profil" className="h-full w-full object-cover" />
          ) : (
            <span className="font-serif text-4xl text-primary">
              {user?.full_name?.charAt(0).toUpperCase() ?? '?'}
            </span>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 sm:items-start">
          <p className="text-base font-medium text-foreground">{user?.full_name}</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button type="button" onClick={() => inputRef.current?.click()} disabled={isUploading}>
              <Camera className="h-4 w-4" />
              {isUploading ? 'Envoi en cours...' : 'Changer la photo'}
            </Button>
            {user?.avatar_url && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={isUploading}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">JPG, PNG ou WEBP, 2 Mo maximum.</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </section>
  );
}