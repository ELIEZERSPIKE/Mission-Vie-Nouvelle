import { useRef, useState, type ChangeEvent } from 'react';
import { Download, Eye, FileText, RefreshCw, Trash2, Upload } from 'lucide-react';
import { useAuth } from '../../../auth/useAuth';
import { Button } from '../../../components/ui/button';

export function CvUploader() {
  const { user, uploadCv, deleteCv, downloadCv, viewCv } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.type !== 'application/pdf') {
      setError('Le CV doit être un fichier PDF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Fichier trop lourd (5 Mo maximum).');
      return;
    }

    setIsUploading(true);
    try {
      await uploadCv(file);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Échec de l\'envoi.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteCv();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Échec de la suppression.');
    }
  };

  const handleDownload = async () => {
    setError(null);
    setIsDownloading(true);
    try {
      await downloadCv();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Échec du téléchargement.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleView = async () => {
    setError(null);
    setIsViewing(true);
    try {
      await viewCv();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Échec de l\'ouverture.');
    } finally {
      setIsViewing(false);
    }
  };

  return (
    <section className="border border-border/60 bg-card p-6 sm:p-8">
      <h2 className="font-serif text-xl text-foreground">Curriculum vitae</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
        Votre CV est transmis à l&apos;institut pour l&apos;examen de votre dossier de candidature.
      </p>

      {error && (
        <div role="alert" className="mt-4 border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-6">
        {user?.has_cv ? (
          <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  cv-{user.full_name ?? 'utilisateur'}.pdf
                </p>
                <p className="text-xs text-muted-foreground">Un CV est enregistré sur votre profil.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" size="sm" onClick={handleView} disabled={isViewing}>
                <Eye className="h-4 w-4" />
                {isViewing ? 'Ouverture...' : 'Consulter'}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={handleDownload} disabled={isDownloading}>
                <Download className="h-4 w-4" />
                {isDownloading ? 'Téléchargement...' : 'Télécharger'}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()} disabled={isUploading}>
                <RefreshCw className="h-4 w-4" />
                Remplacer
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-border/60 px-6 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Aucun CV enregistré</p>
              <p className="mt-1 text-xs text-muted-foreground">Ajoutez votre CV au format PDF, 5 Mo maximum.</p>
            </div>
            <Button type="button" onClick={() => inputRef.current?.click()} disabled={isUploading}>
              <Upload className="h-4 w-4" />
              {isUploading ? 'Envoi en cours...' : 'Ajouter mon CV (PDF)'}
            </Button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </section>
  );
}