import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectsApi, type Subject } from '../../../api/endpoints/subjects';
import { contentItemsApi, type ContentItemType } from '../../../api/endpoints/contentItems';
import { programsApi } from '../../../api/endpoints/programs';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

const TYPE_LABELS: Record<ContentItemType, string> = {
  PDF: 'Document PDF', VIDEO: 'Vidéo', AUDIO: 'Audio', DOCUMENT: 'Autre document', ASSESSMENT: 'Évaluation',
};
const TYPE_ACCEPT: Record<ContentItemType, string> = {
  PDF: 'application/pdf', VIDEO: 'video/*', AUDIO: 'audio/*', DOCUMENT: '*/*', ASSESSMENT: '*/*',
};
const STATUS_LABELS: Record<Subject['status'], string> = {
  DRAFT: 'Brouillon',
  ACTIVE: 'Active',
  ARCHIVED: 'Archivée',
};

const selectClass =
  'h-11 w-full border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR');

function SubjectRow({ subject, onNotice }: { subject: Subject; onNotice: (message: string) => void }) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [itemType, setItemType] = useState<ContentItemType>('PDF');
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [moveYear, setMoveYear] = useState(subject.year_order_index);
  const [moveTrimester, setMoveTrimester] = useState(subject.trimester_order_index);

  const invalidateSubjects = () => queryClient.invalidateQueries({ queryKey: ['subjects', 'admin'] });

  const { data: items } = useQuery({
    queryKey: ['content-items', subject.id],
    queryFn: () => contentItemsApi.listBySubject(subject.id),
    enabled: expanded,
  });

  const { data: sessions } = useQuery({
    queryKey: ['subject-sessions', subject.id],
    queryFn: () => subjectsApi.sessions(subject.id),
    enabled: expanded,
  });

  const uploadMutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error('Aucun fichier sélectionné.');
      return contentItemsApi.createWithFile(subject.id, subject.title, file, itemType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items', subject.id] });
      setFile(null);
      setUploadError(null);
    },
    onError: (err: any) => setUploadError(err.response?.data?.message ?? "Erreur lors de l'upload."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => subjectsApi.remove(subject.id),
    onSuccess: () => {
      onNotice(`« ${subject.title} » a été supprimée.`);
      invalidateSubjects();
    },
    onError: (err: any) => setActionError(err.response?.data?.message ?? 'Erreur lors de la suppression.'),
  });

  const archiveMutation = useMutation({
    mutationFn: () => subjectsApi.update(subject.id, { status: 'ARCHIVED' }),
    onSuccess: () => {
      setActionError(null);
      invalidateSubjects();
    },
    onError: (err: any) => setActionError(err.response?.data?.message ?? "Erreur lors de l'archivage."),
  });

  const moveMutation = useMutation({
    mutationFn: () =>
      subjectsApi.move(subject.id, { year_order_index: moveYear, trimester_order_index: moveTrimester }),
    onSuccess: () => {
      onNotice(`« ${subject.title} » a été déplacée en année ${moveYear}, trimestre ${moveTrimester}.`);
      invalidateSubjects();
    },
    onError: (err: any) => setActionError(err.response?.data?.message ?? 'Erreur lors du déplacement.'),
  });

  const attachMutation = useMutation({
    mutationFn: (trimesterId: string) => subjectsApi.attach(subject.id, { trimester_id: trimesterId }),
    onSuccess: () => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ['subject-sessions', subject.id] });
    },
    onError: (err: any) => setActionError(err.response?.data?.message ?? 'Erreur lors du rattachement.'),
  });

  const handleDelete = () => {
    if (window.confirm(`Supprimer définitivement « ${subject.title} » ? Cette action est irréversible.`)) {
      setActionError(null);
      deleteMutation.mutate();
    }
  };

  const positionUnchanged =
    moveYear === subject.year_order_index && moveTrimester === subject.trimester_order_index;

  return (
    <>
      <tr className="border-b border-border/40 last:border-0">
        <td className="w-10 px-4 py-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground"
            aria-label={expanded ? 'Replier' : 'Déplier'}
          >
            {expanded ? '▾' : '▸'}
          </button>
        </td>
        <td className="px-4 py-3 font-medium text-foreground">{subject.title}</td>
        <td className="px-4 py-3 text-muted-foreground">{STATUS_LABELS[subject.status]}</td>
        <td className="px-4 py-3">
          <div className="flex justify-end gap-2">
            {subject.status !== 'ARCHIVED' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={archiveMutation.isPending}
                onClick={() => archiveMutation.mutate()}
              >
                Archiver
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
              className="text-destructive"
            >
              {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        </td>
      </tr>

      {actionError && (
        <tr className="border-b border-border/40">
          <td></td>
          <td colSpan={3} className="px-4 py-2">
            <div role="alert" className="border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {actionError}
            </div>
          </td>
        </tr>
      )}

      {expanded && (
        <tr className="border-b border-border/40 last:border-0 bg-muted/30">
          <td></td>
          <td colSpan={3} className="px-4 py-4">
            {items && items.length > 0 && (
              <ul className="mb-4 space-y-1.5 text-sm text-foreground">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-2">
                    <span>{item.title}</span>
                    <span className="text-muted-foreground">
                      ({TYPE_LABELS[item.type]}) — {item.files[0] ? `${(item.files[0].size_bytes / 1024 / 1024).toFixed(1)} Mo` : 'aucun fichier'}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                uploadMutation.mutate();
              }}
              className="flex flex-wrap items-end gap-3"
            >
              {uploadError && (
                <div role="alert" className="w-full border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                  {uploadError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor={`type-${subject.id}`}>Type</Label>
                <select
                  id={`type-${subject.id}`}
                  className={`${selectClass} min-w-[180px]`}
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value as ContentItemType)}
                >
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`file-${subject.id}`}>Fichier</Label>
                <input
                  id={`file-${subject.id}`}
                  type="file"
                  accept={TYPE_ACCEPT[itemType]}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  required
                  className="h-11 text-sm text-foreground file:mr-3 file:h-11 file:border-0 file:bg-muted file:px-3 file:text-sm file:font-medium file:text-foreground"
                />
              </div>

              <Button type="submit" size="sm" disabled={uploadMutation.isPending} className="h-11">
                {uploadMutation.isPending ? 'Envoi...' : 'Ajouter le fichier'}
              </Button>
            </form>

            <div className="mt-5 border-t border-border/40 pt-4">
              <p className="mb-2 text-sm font-medium text-foreground">Sessions rattachées</p>
              {!sessions || sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune session n'existe encore pour cette position. La matière sera rattachée automatiquement à la création de la prochaine session.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {sessions.map((s) => (
                    <li key={s.trimester_id} className="flex flex-wrap items-center gap-3">
                      <span className="text-foreground">
                        {s.label ?? 'Trimestre'} ({formatDate(s.starts_at)} → {formatDate(s.ends_at)})
                      </span>
                      {s.attached ? (
                        <span className="text-muted-foreground">Rattachée</span>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={attachMutation.isPending}
                          onClick={() => attachMutation.mutate(s.trimester_id)}
                        >
                          Rattacher
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-5 border-t border-border/40 pt-4">
              <p className="mb-2 text-sm font-medium text-foreground">Corriger la position</p>
              <p className="mb-3 max-w-md text-sm text-muted-foreground">
                Utile si la matière a été créée dans la mauvaise année ou le mauvais trimestre. Elle est détachée des anciennes sessions et rattachée aux bonnes.
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`move-year-${subject.id}`}>Année</Label>
                  <select
                    id={`move-year-${subject.id}`}
                    className={`${selectClass} min-w-[140px]`}
                    value={moveYear}
                    onChange={(e) => setMoveYear(Number(e.target.value))}
                  >
                    <option value={1}>Année 1</option>
                    <option value={2}>Année 2</option>
                    <option value={3}>Année 3</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`move-trimester-${subject.id}`}>Trimestre</Label>
                  <select
                    id={`move-trimester-${subject.id}`}
                    className={`${selectClass} min-w-[140px]`}
                    value={moveTrimester}
                    onChange={(e) => setMoveTrimester(Number(e.target.value))}
                  >
                    <option value={1}>Trimestre 1</option>
                    <option value={2}>Trimestre 2</option>
                    <option value={3}>Trimestre 3</option>
                  </select>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="h-11"
                  disabled={positionUnchanged || moveMutation.isPending}
                  onClick={() => {
                    setActionError(null);
                    moveMutation.mutate();
                  }}
                >
                  {moveMutation.isPending ? 'Déplacement...' : 'Déplacer la matière'}
                </Button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function SubjectsPage() {
  const queryClient = useQueryClient();
  const [programId, setProgramId] = useState('');
  const [yearOrderIndex, setYearOrderIndex] = useState(1);
  const [trimesterOrderIndex, setTrimesterOrderIndex] = useState(1);
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const { data: programs } = useQuery({ queryKey: ['programs', 'admin'], queryFn: programsApi.listAdmin });

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects', 'admin', programId, yearOrderIndex, trimesterOrderIndex],
    queryFn: () => subjectsApi.listAdmin(programId, yearOrderIndex, trimesterOrderIndex),
    enabled: !!programId,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      subjectsApi.create({
        program_id: programId,
        year_order_index: yearOrderIndex,
        trimester_order_index: trimesterOrderIndex,
        title: newSubjectTitle,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects', 'admin', programId, yearOrderIndex, trimesterOrderIndex] });
      setNewSubjectTitle('');
      setFormError(null);
    },
    onError: (err: any) => setFormError(err.response?.data?.message ?? 'Erreur lors de la création.'),
  });

  return (
    <div className="px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <header className="border-t border-border/40 pt-8 md:pt-12">
          <p className="mb-3 text-sm font-medium tracking-wide text-primary">Programme de cours</p>
          <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">Matières par cursus</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
            Défini une seule fois par cursus — se réplique automatiquement sur chaque nouvelle session créée.
          </p>
        </header>

        <div className="mt-8 space-y-2 sm:max-w-xs">
          <Label htmlFor="program">Cursus</Label>
          <select id="program" className={selectClass} value={programId} onChange={(e) => setProgramId(e.target.value)}>
            <option value="">— Choisir —</option>
            {programs?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {programId && (
          <>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 sm:max-w-md">
              <div className="space-y-2">
                <Label htmlFor="year">Année</Label>
                <select
                  id="year"
                  className={selectClass}
                  value={yearOrderIndex}
                  onChange={(e) => setYearOrderIndex(Number(e.target.value))}
                >
                  <option value={1}>Année 1</option>
                  <option value={2}>Année 2</option>
                  <option value={3}>Année 3</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trimester">Trimestre</Label>
                <select
                  id="trimester"
                  className={selectClass}
                  value={trimesterOrderIndex}
                  onChange={(e) => setTrimesterOrderIndex(Number(e.target.value))}
                >
                  <option value={1}>Trimestre 1</option>
                  <option value={2}>Trimestre 2</option>
                  <option value={3}>Trimestre 3</option>
                </select>
              </div>
            </div>

            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                setNotice(null);
                createMutation.mutate();
              }}
              className="mt-6 flex flex-wrap items-end gap-3"
            >
              {formError && (
                <div role="alert" className="w-full border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {formError}
                </div>
              )}
              <div className="flex-1 space-y-2 sm:max-w-sm">
                <Label htmlFor="new-subject">Nouvelle matière</Label>
                <Input
                  id="new-subject"
                  placeholder="Ex : Connaissance de Dieu"
                  value={newSubjectTitle}
                  onChange={(e) => setNewSubjectTitle(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button type="submit" disabled={createMutation.isPending} className="h-11">
                {createMutation.isPending ? 'Création...' : 'Ajouter cette matière'}
              </Button>
            </form>

            {notice && (
              <div role="status" className="mt-6 border border-border/60 bg-muted/40 px-4 py-3 text-sm text-foreground">
                {notice}
              </div>
            )}

            <div className="mt-8">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Chargement...</p>
              ) : !subjects || subjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune matière pour cette sélection.</p>
              ) : (
                <div className="overflow-x-auto border border-border/60">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground">
                        <th className="w-10 px-4 py-3"></th>
                        <th className="px-4 py-3 font-medium">Matière</th>
                        <th className="px-4 py-3 font-medium">Statut</th>
                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject) => (
                        <SubjectRow key={subject.id} subject={subject} onNotice={setNotice} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}