// src/features/shared/notepad/NotepadWidget.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import axiosClient from '../../../api/axiosClient';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../../auth/useAuth';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'pending-local';

const AUTOSAVE_DELAY_MS = 1200;

interface LocalDraft {
  content: string;
  savedAt: string; // ISO
}

function draftKey(userId: string) {
  return `notepad_draft_${userId}`;
}

export function NotepadWidget() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [recoverableDraft, setRecoverableDraft] = useState<LocalDraft | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef(''); // valeur à jour, accessible depuis le handler clavier

  useEffect(() => {
    if (!user) return;

    axiosClient
      .get('/me/note')
      .then(({ data }) => {
        const serverContent: string = data.content ?? '';
        const serverUpdatedAt: string | null = data.updated_at ?? null;

        setContent(serverContent);
        contentRef.current = serverContent;

        // Un brouillon local plus récent que la dernière sauvegarde serveur
        // signale une perte de connexion passée — on propose de le restaurer
        // plutôt que de l'écraser silencieusement.
        const raw = localStorage.getItem(draftKey(user.id));
        if (raw) {
          const draft: LocalDraft = JSON.parse(raw);
          const isDraftNewer = !serverUpdatedAt || new Date(draft.savedAt) > new Date(serverUpdatedAt);
          if (isDraftNewer && draft.content !== serverContent) {
            setRecoverableDraft(draft);
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  const persist = useCallback(async (value: string) => {
    if (!user) return;
    setSaveStatus('saving');
    try {
      await axiosClient.put('/me/note', { content: value });
      setSaveStatus('saved');
      localStorage.removeItem(draftKey(user.id));
    } catch {
      // Le texte reste dans le textarea ET dans localStorage : rien n'est perdu,
      // on retentera au prochain changement ou au prochain Ctrl+S.
      setSaveStatus('pending-local');
    }
  }, [user]);

  const handleChange = (value: string) => {
    setContent(value);
    contentRef.current = value;

    if (user) {
      localStorage.setItem(draftKey(user.id), JSON.stringify({
        content: value,
        savedAt: new Date().toISOString(),
      } satisfies LocalDraft));
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => persist(value), AUTOSAVE_DELAY_MS);
  };

  // Ctrl+S / Cmd+S : sauvegarde immédiate, sans attendre le debounce.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (debounceRef.current) clearTimeout(debounceRef.current);
        persist(contentRef.current);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [persist]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `notes-${date}.txt`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const restoreDraft = () => {
    if (!recoverableDraft) return;
    handleChange(recoverableDraft.content);
    setRecoverableDraft(null);
  };

  const dismissDraft = () => {
    if (user) localStorage.removeItem(draftKey(user.id));
    setRecoverableDraft(null);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-card p-8">
        <p className="font-body text-sm text-muted-foreground">Ouverture du carnet...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-card">
      <header className="px-6 pt-6">
        <div className="flex items-baseline justify-between">
          <h3 className="font-heading text-2xl text-foreground">Mes notes</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={!content}
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Télécharger
          </Button>
        </div>
        <div className="mt-3 h-px w-12 bg-primary" />
      </header>

      {recoverableDraft && (
        <div className="mx-6 mt-4 flex items-center justify-between gap-3 border border-border bg-secondary px-4 py-2.5">
          <p className="font-body text-xs text-secondary-foreground">
            Une version plus récente de cet appareil n'a pas été sauvegardée.
          </p>
          <div className="flex shrink-0 gap-2">
            <button onClick={restoreDraft} className="font-body text-xs font-medium text-primary underline-offset-2 hover:underline">
              Restaurer
            </button>
            <button onClick={dismissDraft} className="font-body text-xs text-muted-foreground underline-offset-2 hover:underline">
              Ignorer
            </button>
          </div>
        </div>
      )}

      <Textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Écris librement ici — sauvegardé automatiquement."
        className={cn(
          'mt-4 flex-1 resize-none rounded-none border-0 bg-transparent px-6 py-2',
          'font-body text-[15px] leading-7 text-foreground placeholder:text-muted-foreground/70',
          'shadow-none focus-visible:ring-0'
        )}
      />

      <footer className="flex items-center justify-between border-t border-border px-6 py-3">
        <span className="font-body text-xs text-muted-foreground">
          {wordCount > 0 ? `${wordCount} mot${wordCount > 1 ? 's' : ''}` : ''}
        </span>
        <SaveIndicator status={saveStatus} />
      </footer>
    </div>
  );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'saving') {
    return (
      <span className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        Sauvegarde...
      </span>
    );
  }
  if (status === 'saved') {
    return (
      <span className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        Enregistré
      </span>
    );
  }
  if (status === 'pending-local') {
    return (
      <span className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-border" />
        Conservé sur cet appareil, en attente de connexion
      </span>
    );
  }
  return <span />;
}