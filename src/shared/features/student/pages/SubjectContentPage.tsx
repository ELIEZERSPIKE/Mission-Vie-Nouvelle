import { useParams, useLocation, Link } from 'react-router-dom';
import { tokenService } from '@/auth/tokenService';
import { ProtectedPdfViewer } from '@/shared/components/ProtectedPdfViewer';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, FileText, FileSearch, Video, Headphones, ClipboardList, BookOpen, CalendarDays, Library, Lock } from 'lucide-react';
import type { ComponentType } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

interface LocationState {
  contentTitle?: string;
  contentType?: string;
  programName?: string;
  yearLabel?: string;
  trimesterLabel?: string;
  subjectTitle?: string;
}

const TYPE_META: Record<string, { label: string; Icon: ComponentType<{ className?: string }> }> = {
  PDF: { label: 'Document PDF', Icon: FileText },
  DOCUMENT: { label: 'Autre document', Icon: FileSearch },
  VIDEO: { label: 'Vidéo', Icon: Video },
  AUDIO: { label: 'Audio', Icon: Headphones },
  ASSESSMENT: { label: 'Évaluation', Icon: ClipboardList },
};

export default function SubjectContentPage() {
  const { contentItemId } = useParams<{ contentItemId: string }>();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;
  const token = tokenService.getAccessToken();

  const typeMeta = state.contentType ? TYPE_META[state.contentType] : undefined;
  const TypeIcon = typeMeta?.Icon ?? FileText;

  if (!contentItemId || !token) {
    return <p>Accès impossible.</p>;
  }

  const breadcrumb = [
    { label: 'Mes cours', to: '/student/my-courses' },
    ...(state.programName ? [{ label: state.programName }] : []),
    ...(state.yearLabel ? [{ label: state.yearLabel }] : []),
    ...(state.trimesterLabel ? [{ label: state.trimesterLabel }] : []),
    ...(state.subjectTitle ? [{ label: state.subjectTitle }] : []),
  ];

  return (
    <div>
      {/* Fil d'Ariane */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm" aria-label="Fil d'Ariane">
        {breadcrumb.map((crumb, i) => {
          const isLast = i === breadcrumb.length - 1;
          return (
            <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" aria-hidden="true" />}
              {crumb.to && !isLast ? (
                <Link to={crumb.to} className="text-muted-foreground transition-colors hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-foreground' : 'text-muted-foreground'}>{crumb.label}</span>
              )}
            </span>
          );
        })}
      </nav>

      {/* Carte d'identité du support */}
      <div className="mt-6 rounded-md border border-border/60 bg-card p-5 text-card-foreground sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <TypeIcon className="h-7 w-7" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-2xl leading-tight text-foreground">
                {state.contentTitle ?? 'Document'}
              </h1>
              {typeMeta && <Badge variant="secondary">{typeMeta.label}</Badge>}
            </div>

            {state.subjectTitle && (
              <>
                <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
                    {state.subjectTitle}
                  </span>
                  {state.trimesterLabel && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
                      {state.trimesterLabel}
                    </span>
                  )}
                  {state.yearLabel && (
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
                      {state.yearLabel}
                    </span>
                  )}
                  {state.programName && (
                    <span className="flex items-center gap-1.5">
                      <Library className="h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
                      {state.programName}
                    </span>
                  )}
                </p>
              </>
            )}

            <p className="mt-3 flex items-start gap-2 border-t border-border/40 pt-3 text-xs leading-5 text-muted-foreground">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Ce document est protégé : il est marqué à votre nom et la copie est bloquée.
            </p>
          </div>
        </div>
      </div>

      {/* Lecteur encadré */}
      <div className="mt-6 rounded-md border border-border/60 bg-muted/30 px-3 py-6 sm:px-6">
        <ProtectedPdfViewer
          fileUrl={`${API_URL}/content/${contentItemId}`}
          authToken={token}
        />
      </div>
    </div>
  );
}