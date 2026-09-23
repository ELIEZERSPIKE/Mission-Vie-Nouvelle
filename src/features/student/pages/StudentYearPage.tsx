import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronRight,
  Lock,
  CheckCircle2,
  PlayCircle,
  Clock,
  FileText,
  Video,
  Headphones,
  File as FileIcon,
} from 'lucide-react';
import { catalogApi } from '../../../api/endpoints/catalog';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

const TYPE_META: Record<string, { label: string; Icon: typeof FileText }> = {
  PDF: { label: 'Document PDF', Icon: FileText },
  VIDEO: { label: 'Vidéo', Icon: Video },
  AUDIO: { label: 'Audio', Icon: Headphones },
  DOCUMENT: { label: 'Autre document', Icon: FileIcon },
  ASSESSMENT: { label: 'Évaluation', Icon: FileText },
};

const STATUS_META: Record<
  string,
  { label: string; Icon: typeof Clock; className: string }
> = {
  ACTIVE: {
    label: 'En cours',
    Icon: PlayCircle,
    className: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  },
  UPCOMING: {
    label: 'À venir',
    Icon: Clock,
    className: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  },
  COMPLETED: {
    label: 'Terminé (révision)',
    Icon: CheckCircle2,
    className: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  },
};

function TrimesterStatus({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? {
    label: status,
    Icon: Clock,
    className: 'bg-muted text-muted-foreground border-border',
  };
  const { Icon } = meta;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${meta.className}`}
    >
      <Icon className="size-3" aria-hidden />
      {meta.label}
    </span>
  );
}

export function StudentYearPage() {
  const { yearId } = useParams<{ yearId: string }>();
  const navigate = useNavigate();

  const { data: programs, isLoading, isError } = useQuery({
    queryKey: ['full-catalog'],
    queryFn: catalogApi.getFullCatalog,
  });

  const found = (() => {
    for (const p of programs ?? []) {
      for (const y of p.academic_years) {
        if (String(y.id) === String(yearId)) return { program: p, year: y };
      }
    }
    return null;
  })();

  const initialOpen =
    found?.year.trimesters.find((t) => t.status === 'ACTIVE')?.id ?? null;
  const [openId, setOpenId] = useState<string | null>(initialOpen);

  if (isLoading) return <YearSkeleton />;

  if (isError || !found) {
    return (
      <div
        role="alert"
        className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        Année introuvable.
      </div>
    );
  }

  const { program, year } = found;

  return (
    <div className="space-y-8">
      <nav className="text-sm text-muted-foreground">
        <Link to="/student" className="hover:text-foreground">
          Catalogue
        </Link>
        <span className="mx-2">/</span>
        <span>{program.name}</span>
        <span className="mx-2">/</span>
        <span className="text-foreground">{year.label}</span>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-foreground">
            {year.label}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{program.name}</p>
        </div>

        {year.has_access ? (
          <Badge variant="secondary" className="gap-1.5">
            <CheckCircle2 className="size-3.5" aria-hidden />
            Accès actif
          </Badge>
        ) : (
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
        )}
      </header>

      <div className="space-y-3">
        {year.trimesters.map((trimester) => {
          const isOpen = openId === trimester.id;
          const subjectCount = trimester.subjects.length;
          const supportCount = trimester.subjects.reduce(
            (n, s) => n + s.content_items.length,
            0
          );

          return (
            <div
              key={trimester.id}
              className="rounded-lg border border-border/60 bg-card"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : trimester.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <ChevronRight
                  className={`size-4 shrink-0 transition-transform ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                  aria-hidden
                />
                <span className="font-medium text-foreground">
                  {trimester.label}
                </span>
                <TrimesterStatus status={trimester.status} />
                <span className="ml-auto text-xs text-muted-foreground">
                  {subjectCount} matière{subjectCount > 1 ? 's' : ''}
                  {' · '}
                  {supportCount} support{supportCount > 1 ? 's' : ''}
                </span>
              </button>

              {isOpen && (
                <div className="space-y-5 border-t border-border/40 px-4 py-4">
                  {trimester.subjects.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Aucune matière pour ce trimestre.
                    </p>
                  )}

                  {trimester.subjects.map((subject) => (
                    <div key={subject.id} className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-foreground">
                          {subject.title}
                        </h4>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {subject.content_items.length}{' '}
                          {subject.content_items.length > 1 ? 'supports' : 'support'}
                        </span>
                      </div>

                      {subject.description && (
                        <p className="text-sm leading-6 text-muted-foreground">
                          {subject.description}
                        </p>
                      )}

                      <ul className="divide-y divide-border/30 rounded-md border border-border/40">
                        {subject.content_items.map((ci) => {
                          const meta =
                            TYPE_META[ci.type] ?? { label: ci.type, Icon: FileIcon };
                          const { Icon } = meta;
                          const accessible = year.has_access;

                          return (
                            <li key={ci.id}>
                              {accessible ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(`/content/${ci.id}`, {
                                      state: {
                                        contentTitle: ci.title,
                                        contentType: ci.type,
                                      },
                                    })
                                  }
                                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted/50"
                                >
                                  <Icon
                                    className="size-4 shrink-0 text-muted-foreground"
                                    aria-hidden
                                  />
                                  <span className="truncate text-foreground">
                                    {ci.title}
                                  </span>
                                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                                    {meta.label}
                                  </span>
                                </button>
                              ) : (
                                <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
                                  <Lock className="size-4 shrink-0" aria-hidden />
                                  <span className="truncate">{ci.title}</span>
                                  <span className="ml-auto shrink-0 text-xs">
                                    {meta.label}
                                  </span>
                                </div>
                              )}
                            </li>
                          );
                        })}
                        {subject.content_items.length === 0 && (
                          <li className="px-3 py-2 text-sm text-muted-foreground">
                            Aucun support pour le moment.
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YearSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-48 rounded bg-muted/60" />
      <div className="h-9 w-64 rounded bg-muted" />
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-14 rounded-lg border border-border/60 bg-muted/30"
          />
        ))}
      </div>
    </div>
  );
}