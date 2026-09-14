import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { catalogApi } from '../../../api/endpoints/catalog';
import { Badge } from '../../../components/ui/badge';
import {
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  Clock,
  ExternalLink,
  File,
  FileText,
  Music,
  Video,
} from 'lucide-react';

type CourseContentItem = {
  id: string;
  title: string;
  type: string;
  duration?: string | null;
};

type CourseSubject = {
  id: string;
  title: string;
  description?: string | null;
  content_items: CourseContentItem[];
};

type CourseTrimester = {
  id: string;
  label: string;
  status: string;
  subjects: CourseSubject[];
};

type CourseYear = {
  id: string;
  label: string;
  program?: { name?: string };
  trimesters: CourseTrimester[];
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  PDF: <FileText className="h-4 w-4" />,
  VIDEO: <Video className="h-4 w-4" />,
  AUDIO: <Music className="h-4 w-4" />,
  DOCUMENT: <File className="h-4 w-4" />,
  ASSESSMENT: <ClipboardCheck className="h-4 w-4" />,
};

const TYPE_LABELS: Record<string, string> = {
  PDF: 'Document PDF',
  VIDEO: 'Vidéo',
  AUDIO: 'Audio',
  DOCUMENT: 'Autre document',
  ASSESSMENT: 'Évaluation',
};

const TYPE_COLORS: Record<string, string> = {
  PDF: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  VIDEO: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  AUDIO: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
  DOCUMENT: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
  ASSESSMENT: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
};

const TRIMESTER_LABELS: Record<string, string> = {
  UPCOMING: 'À venir',
  ACTIVE: 'En cours',
  COMPLETED: 'Terminé (révision)',
};

function TypeBadge({ type }: { type: string }) {
  const Icon = TYPE_ICONS[type] || <File className="h-4 w-4" />;
  const colorClass = TYPE_COLORS[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {Icon}
      {TYPE_LABELS[type] ?? type}
    </span>
  );
}

function TrimesterStatus({ status }: { status: string }) {
  const label = TRIMESTER_LABELS[status] ?? status;
  if (status === 'ACTIVE') {
    return (
      <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
        </span>
        {label}
      </Badge>
    );
  }
  if (status === 'COMPLETED') {
    return <Badge variant="secondary" className="bg-muted/60">{label}</Badge>;
  }
  return <Badge variant="outline" className="text-muted-foreground">{label}</Badge>;
}

function ContentItemCard({
  item,
  subject,
  trimester,
  year,
}: {
  item: CourseContentItem;
  subject: CourseSubject;
  trimester: CourseTrimester;
  year: CourseYear;
}) {
  const navigate = useNavigate();
  const isPDF = item.type === 'PDF';
  
  return (
    <div 
      className={`group relative rounded-lg border transition-all duration-200 ${
        isPDF 
          ? 'border-primary/20 bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/40 hover:shadow-md hover:shadow-primary/5' 
          : 'border-border/40 hover:border-border/60 hover:bg-muted/30'
      }`}
    >
      <button
        onClick={() =>
          navigate(`/content/${item.id}`, {
            state: {
              contentTitle: item.title,
              contentType: item.type,
              programName: year.program?.name,
              yearLabel: year.label,
              trimesterLabel: trimester.label,
              subjectTitle: subject.title,
            },
          })
        }
        className="w-full text-left px-4 py-3"
      >
        <div className="flex items-start gap-3">
          {/* Icone avec effet de survol */}
          <div className={`flex-shrink-0 rounded-lg p-2.5 transition-all duration-200 ${
            isPDF 
              ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' 
              : 'bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground'
          }`}>
            {TYPE_ICONS[item.type] || <File className="h-5 w-5" />}
          </div>
          
          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-medium transition-colors ${
                    isPDF 
                      ? 'text-primary group-hover:text-primary/80' 
                      : 'text-foreground group-hover:text-foreground/80'
                  }`}>
                    {item.title}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <TypeBadge type={item.type} />
                  {item.duration && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {item.duration}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Flèche d'action - plus visible pour les PDF */}
              <div className={`flex-shrink-0 transition-all duration-200 ${
                isPDF 
                  ? 'text-primary opacity-100 group-hover:translate-x-1 group-hover:scale-110' 
                  : 'text-muted-foreground/30 opacity-0 group-hover:opacity-100'
              }`}>
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </button>
      
      {/* Indicateur visuel pour les PDF */}
      {isPDF && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block">
          <div className="flex items-center gap-1 text-xs text-primary/50 group-hover:text-primary transition-colors">
            <ExternalLink className="h-3 w-3" />
            <span>Ouvrir</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function MyCoursesPage() {
  const { data: years, isLoading, isError } = useQuery({
    queryKey: ['my-courses'],
    queryFn: catalogApi.getMyCourses,
  });

  const totalCourseCount = years?.reduce(
    (acc, year) =>
      acc +
      year.trimesters.reduce(
        (sum, trimester) =>
          sum + trimester.subjects.reduce((subjectSum, subject) => subjectSum + subject.content_items.length, 0),
        0,
      ),
    0,
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 animate-pulse">
          <div className="h-9 w-64 bg-muted rounded-lg" />
          <div className="h-5 w-96 bg-muted/60 rounded-lg" />
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card p-6 animate-pulse">
              <div className="h-8 w-48 bg-muted rounded-lg" />
              <div className="mt-6 space-y-4">
                {[1, 2].map((j) => (
                  <div key={j} className="h-20 bg-muted/40 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 px-6 py-4 text-destructive">
        <p className="font-medium">Erreur de chargement</p>
        <p className="text-sm opacity-90">Impossible de charger vos cours. Veuillez réessayer.</p>
      </div>
    );
  }

  const hasAnyCourse = years && years.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-10 px-4 py-6">
      {/* Header avec illustration */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/5 to-transparent border border-primary/10 px-8 py-10">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-4xl leading-tight text-foreground">Mes cours</h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Les années d'études auxquelles vous êtes inscrit, avec l'ensemble des matières et supports à votre disposition.
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              En cours
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
              PDF disponibles
            </span>
          </div>
        </div>
        {/* Décorations */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-blue-500/5 blur-3xl" />
      </header>

      {!hasAnyCourse && (
        <div className="rounded-xl border border-dashed border-border/60 bg-card/50 px-8 py-16 text-center">
          <div className="mx-auto max-w-md">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-lg font-medium text-foreground">Aucun cours pour le moment</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Découvrez le parcours complet proposé par l'institut et choisissez votre année d'études.
            </p>
            <Link
              to="/student"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
            >
              Voir le parcours complet
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {years?.map((year) => {
        const yearContentCount = year.trimesters.reduce(
          (acc, trimester) =>
            acc +
            trimester.subjects.reduce((subjectSum, subject) => subjectSum + subject.content_items.length, 0),
          0,
        );

        return (
        <section key={year.id} className="space-y-4">
          {/* Année */}
          <div className="flex flex-wrap items-baseline gap-3 border-b border-border/40 pb-3">
            <h2 className="font-serif text-2xl text-foreground">{year.program?.name}</h2>
            <span className="rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              {year.label}
            </span>
            {yearContentCount > 0 && (
              <span className="ml-auto text-sm text-muted-foreground">
                {yearContentCount} supports disponibles
              </span>
            )}
          </div>

          {/* Trimestres */}
          <div className="grid gap-6">
            {year.trimesters.map((trimester) => (
              <div 
                key={trimester.id} 
                className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm transition-shadow hover:shadow-md"
              >
                {/* En-tête du trimestre */}
                <div className="border-b border-border/40 bg-muted/20 px-6 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-serif text-xl leading-tight text-foreground">
                      {trimester.label}
                    </h3>
                    <TrimesterStatus status={trimester.status} />
                    <span className="ml-auto text-sm text-muted-foreground">
                      {trimester.subjects.reduce((acc, s) => acc + s.content_items.length, 0)} supports
                    </span>
                  </div>
                </div>

                {/* Matières */}
                <div className="divide-y divide-border/20">
                  {trimester.subjects.map((subject) => (
                    <div key={subject.id} className="px-6 py-5">
                      <div className="mb-4">
                        <h4 className="text-base font-semibold text-foreground">
                          {subject.title}
                        </h4>
                        {subject.description && (
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {subject.description}
                          </p>
                        )}
                      </div>

                      {/* Liste des supports - version améliorée avec cartes */}
                      <div className="space-y-2">
                        {subject.content_items.map((item) => (
                          <ContentItemCard
                            key={item.id}
                            item={item}
                            subject={subject}
                            trimester={trimester}
                            year={year}
                          />
                        ))}
                        {subject.content_items.length === 0 && (
                          <div className="rounded-lg border border-dashed border-border/40 px-4 py-6 text-center">
                            <p className="text-sm text-muted-foreground">Aucun support disponible pour le moment.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        );
      })}

      {/* Pied de page avec statistiques */}
      {hasAnyCourse && (
        <div className="border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <p>
            {totalCourseCount ?? 0} supports disponibles dans votre parcours
          </p>
        </div>
      )}
    </div>
  );
}