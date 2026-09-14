import { useState } from 'react';
import { UploadGroupResourceForm } from './UploadGroupResourceForm';
import { GroupResourceList } from './GroupResourceList';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../auth/useAuth';

interface Props {
  academicYearId: string;
}

export function GroupResourcesPanel({ academicYearId }: Props) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const canShare =
    user?.roles.includes('ADMIN') ||
    user?.roles.includes('SUPER_ADMIN') ||
    user?.roles.includes('TEACHER');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Supports partagés</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {showForm
              ? 'Renseignez les informations du fichier ou du lien à partager.'
              : 'Consultez les documents transmis à la promotion.'}
          </p>
        </div>

        {canShare && (
          <Button
            variant={showForm ? 'outline' : 'default'}
            size="sm"
            onClick={() => setShowForm((v) => !v)}
            className="w-full sm:w-auto"
          >
            {showForm ? 'Fermer le formulaire' : 'Ajouter un support'}
          </Button>
        )}
      </div>

      {showForm && (
        <UploadGroupResourceForm
          academicYearId={academicYearId}
          onSuccess={() => setShowForm(false)}
        />
      )}

      <GroupResourceList academicYearId={academicYearId} />
    </div>
  );
}