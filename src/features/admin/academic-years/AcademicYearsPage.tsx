import { useState, type FormEvent, Fragment } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicYearsApi } from '../../../api/endpoints/academicYears';
import { programsApi } from '../../../api/endpoints/programs';
import { useAuth } from '../../../auth/useAuth';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { authToast } from '../../auth/lib/authToast';

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
}

function statusBadge(status: string) {
  const styles = {
    DRAFT: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    ACTIVE: 'bg-green-50 text-green-700 border-green-200',
    CLOSED: 'bg-gray-100 text-gray-500 border-gray-200'
  };
  return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-500';
}

function statusLabel(status: string) {
  return { 
    DRAFT: 'Veuillez activer l’année académique', 
    ACTIVE: 'Active', 
    CLOSED: 'Archivée' 
  }[status] ?? status;
}

function trimesterStatusLabel(status: string) {
  return { 
    UPCOMING: 'À venir', 
    ACTIVE: 'En cours', 
    COMPLETED: 'Terminée' 
  }[status] ?? status;
}

function trimesterStatusBadge(status: string) {
  const styles = {
    UPCOMING: 'bg-blue-50 text-blue-600 border-blue-200',
    ACTIVE: 'bg-green-50 text-green-600 border-green-200',
    COMPLETED: 'bg-purple-50 text-purple-600 border-purple-200'
  };
  return styles[status as keyof typeof styles] || 'bg-gray-50 text-gray-500';
}

function AddPeriodForm({ academicYearId }: { academicYearId: string }) {
  const queryClient = useQueryClient();
  const [label, setLabel] = useState('');
  const [starts, setStarts] = useState('');
  const [ends, setEnds] = useState('');

  const addMutation = useMutation({
    mutationFn: () => academicYearsApi.addPeriod(academicYearId, { 
      label, 
      starts_at: starts, 
      ends_at: ends 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-years', 'admin'] });
      authToast.success('Période ajoutée');
      setLabel('');
      setStarts('');
      setEnds('');
    },
    onError: (err: any) => {
      authToast.error(err.response?.data?.message ?? "Erreur lors de l'ajout");
    },
  });

  return (
    <div className="mt-4 rounded border border-dashed border-gray-300 bg-gray-50 p-4">
      <p className="mb-3 text-xs font-medium text-gray-600">Ajouter une période</p>
      <div className="flex flex-wrap items-end gap-3">
        <Input
          placeholder="Libellé"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="h-9 w-48 text-sm"
        />
        <Input 
          type="date" 
          value={starts} 
          onChange={(e) => setStarts(e.target.value)} 
          className="h-9 w-36 text-sm"
        />
        <Input 
          type="date" 
          value={ends} 
          onChange={(e) => setEnds(e.target.value)} 
          className="h-9 w-36 text-sm"
        />
        <Button
          size="sm"
          onClick={() => addMutation.mutate()}
          disabled={addMutation.isPending || !label || !starts || !ends}
          className="h-9"
        >
          {addMutation.isPending ? 'Ajout...' : 'Ajouter'}
        </Button>
      </div>
    </div>
  );
}

function AcademicYearItem({ 
  year, 
  canManage, 
  onActivate, 
  onDelete, 
  onPriceUpdate,
  isActivating,
  isDeleting,
  isUpdatingPrice
}: { 
  year: any; 
  canManage: boolean;
  onActivate: (id: string) => void;
  onDelete: (id: string) => void;
  onPriceUpdate: (id: string, price: number) => void;
  isActivating: boolean;
  isDeleting: boolean;
  isUpdatingPrice: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [priceValue, setPriceValue] = useState(year.price?.toString() || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePriceUpdate = () => {
    const price = Number(priceValue);
    if (price > 0) {
      onPriceUpdate(year.id, price);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* En-tête */}
      <div 
        className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="text-gray-400 text-sm">
            {expanded ? '▾' : '▸'}
          </span>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-medium text-gray-900">{year.label}</span>
              <span className="text-sm text-gray-500">{year.program?.name}</span>
            </div>
            <div className="flex items-center gap-4 mt-1 flex-wrap text-sm text-gray-500">
              <span>
                {formatDate(year.starts_at)} — {formatDate(year.ends_at)}
              </span>
              <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${statusBadge(year.status)}`}>
                {statusLabel(year.status)}
              </span>
              {year.price && (
                <span>
                  {year.price} {year.currency}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {canManage && year.status === 'DRAFT' && (
            <Button
              size="sm"
              onClick={() => onActivate(year.id)}
              disabled={isActivating}
              className="h-8"
            >
              {isActivating ? 'Ouverture...' : 'Activer'}
            </Button>
          )}
          
          {canManage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Archiver
            </Button>
          )}
        </div>
      </div>

      {/* Détails */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          {/* Tarif */}
          {canManage && (
            <div className="bg-gray-50 rounded p-4">
              <p className="text-xs font-medium text-gray-600 mb-3">Tarif</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">{year.currency}</span>
                  <Input
                    type="number"
                    value={priceValue}
                    onChange={(e) => setPriceValue(e.target.value)}
                    className="h-9 w-32 text-sm"
                    placeholder="0"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handlePriceUpdate}
                  disabled={isUpdatingPrice || !priceValue}
                  className="h-9"
                >
                  {isUpdatingPrice ? 'Mise à jour...' : 'Mettre à jour'}
                </Button>
              </div>
            </div>
          )}

          {/* Périodes */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-3">
              Périodes ({year.trimesters?.length || 0})
            </p>
            {year.trimesters && year.trimesters.length > 0 ? (
              <div className="space-y-2">
                {year.trimesters
                  ?.sort((a: any, b: any) => a.order_index - b.order_index)
                  .map((t: any) => (
                    <div 
                      key={t.id} 
                      className="flex items-center justify-between rounded border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-gray-900">{t.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">
                          {formatDate(t.starts_at)} — {formatDate(t.ends_at)}
                        </span>
                        <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${trimesterStatusBadge(t.status)}`}>
                          {trimesterStatusLabel(t.status)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucune période définie</p>
            )}
            
            {canManage && <AddPeriodForm academicYearId={year.id} />}
          </div>
        </div>
      )}

      {/* Confirmation suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Archiver l'année</h3>
            <p className="text-sm text-gray-600">
              Voulez-vous archiver l'année <span className="font-medium">{year.label}</span> du programme <span className="font-medium">{year.program?.name}</span> ?
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Les données seront conservées mais l'année ne sera plus visible dans les listes actives.
            </p>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="h-9"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(year.id);
                  setShowDeleteConfirm(false);
                }}
                disabled={isDeleting}
                className="h-9"
              >
                {isDeleting ? 'Archivage...' : 'Archiver'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AcademicYearsPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('program.manage');

  const queryClient = useQueryClient();
  const [programId, setProgramId] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [customLabel, setCustomLabel] = useState('');
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [periodMode, setPeriodMode] = useState<'TRIMESTRE' | 'SEMESTRE'>('TRIMESTRE');
  const [showForm, setShowForm] = useState(false);

  const { data: programs } = useQuery({
    queryKey: ['programs', 'admin'],
    queryFn: programsApi.listAdmin,
  });

  const { data: academicYears, isLoading } = useQuery({
    queryKey: ['academic-years', 'admin'],
    queryFn: () => academicYearsApi.listAdmin(),
  });

  const intakeYear = academicYears?.find(
    (y) => y.program?.id === programId && y.order_index === 1
  );

  const createMutation = useMutation({
    mutationFn: academicYearsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-years', 'admin'] });
      authToast.success('Année académique créée');
      setStartsAt('');
      setCustomLabel('');
      setFormError(null);
      setShowForm(false);
    },
    onError: (err: any) => {
      const message = err.response?.data?.message ?? 'Erreur lors de la création';
      setFormError(message);
      authToast.error(message);
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => academicYearsApi.update(id, { status: 'ACTIVE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-years', 'admin'] });
      authToast.success('Année activée');
    },
    onError: (err: any) => {
      authToast.error(err.response?.data?.message ?? "Erreur lors de l'activation");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => academicYearsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-years', 'admin'] });
      authToast.success('Année archivée');
    },
    onError: (err: any) => {
      authToast.error(err.response?.data?.message ?? "Erreur lors de l'archivage");
    },
  });

  const priceMutation = useMutation({
    mutationFn: ({ id, price }: { id: string; price: number }) =>
      academicYearsApi.update(id, { price, currency: 'XOF' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-years', 'admin'] });
      authToast.success('Tarif mis à jour');
    },
    onError: (err: any) => {
      authToast.error(err.response?.data?.message ?? 'Erreur lors de la mise à jour');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      program_id: programId,
      starts_at: intakeYear ? intakeYear.starts_at.slice(0, 10) : startsAt,
      label: customLabel || undefined,
      auto_generate_periods: autoGenerate,
      period_mode: autoGenerate ? periodMode : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  const activeYears = academicYears?.filter(y => y.status !== 'CLOSED') || [];
  const archivedYears = academicYears?.filter(y => y.status === 'CLOSED') || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Années académiques</h1>
          <p className="text-sm text-gray-500 mt-1">
            {academicYears?.length || 0} année{academicYears?.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        
        {canManage && (
          <Button 
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? "outline" : "default"}
            className="h-9"
          >
            {showForm ? 'Fermer' : 'Nouvelle année'}
          </Button>
        )}
      </div>

      {/* Formulaire */}
      {canManage && showForm && (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Créer une année</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="program" className="text-sm">Cursus</Label>
                <select
                  id="program"
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  required
                  className="w-full h-9 rounded border border-gray-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Sélectionner</option>
                  {programs?.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="starts-at" className="text-sm">Date de rentrée</Label>
                <Input
                  id="starts-at"
                  type="date"
                  value={intakeYear ? intakeYear.starts_at.slice(0, 10) : startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  disabled={!!intakeYear}
                  required
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="custom-label" className="text-sm">
                Libellé personnalisé <span className="text-gray-400 font-normal">(optionnel)</span>
              </Label>
              <Input
                id="custom-label"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="ex: Bachelor 1, Master 1"
                className="h-9"
              />
            </div>

            <div className="space-y-3 rounded border border-gray-200 bg-white p-4">
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={autoGenerate}
                  onChange={(e) => setAutoGenerate(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  Générer automatiquement les périodes
                  <span className="block text-xs text-gray-500">
                    Décoché pour un programme modulaire (ajout manuel)
                  </span>
                </span>
              </label>

              {autoGenerate && (
                <div className="ml-6 space-y-2">
                  <Label className="text-sm">Découpage</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        value="TRIMESTRE"
                        checked={periodMode === 'TRIMESTRE'}
                        onChange={(e) => setPeriodMode(e.target.value as 'TRIMESTRE' | 'SEMESTRE')}
                        className="h-4 w-4 text-blue-600"
                      />
                      Trimestres (3)
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        value="SEMESTRE"
                        checked={periodMode === 'SEMESTRE'}
                        onChange={(e) => setPeriodMode(e.target.value as 'TRIMESTRE' | 'SEMESTRE')}
                        className="h-4 w-4 text-blue-600"
                      />
                      Semestres (2)
                    </label>
                  </div>
                </div>
              )}
            </div>

            {intakeYear && (
              <div className="rounded bg-blue-50 px-4 py-3 text-sm text-blue-700 border border-blue-100">
                La rentrée est déjà fixée au {formatDate(intakeYear.starts_at)} pour ce cursus.
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={createMutation.isPending} className="h-9">
                {createMutation.isPending ? 'Création...' : 'Créer'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
                className="h-9"
              >
                Annuler
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Liste */}
      <div className="space-y-4">
        {academicYears && academicYears.length > 0 ? (
          <>
            {/* Actives */}
            {activeYears.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Actives ({activeYears.length})
                </h3>
                <div className="space-y-3">
                  {activeYears.map((year) => (
                    <AcademicYearItem
                      key={year.id}
                      year={year}
                      canManage={canManage}
                      onActivate={(id) => activateMutation.mutate(id)}
                      onDelete={(id) => deleteMutation.mutate(id)}
                      onPriceUpdate={(id, price) => priceMutation.mutate({ id, price })}
                      isActivating={activateMutation.isPending && activateMutation.variables === year.id}
                      isDeleting={deleteMutation.isPending && deleteMutation.variables === year.id}
                      isUpdatingPrice={priceMutation.isPending}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Archivées */}
            {archivedYears.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Archivées ({archivedYears.length})
                </h3>
                <div className="space-y-3">
                  {archivedYears.map((year) => (
                    <AcademicYearItem
                      key={year.id}
                      year={year}
                      canManage={canManage}
                      onActivate={(id) => activateMutation.mutate(id)}
                      onDelete={(id) => deleteMutation.mutate(id)}
                      onPriceUpdate={(id, price) => priceMutation.mutate({ id, price })}
                      isActivating={activateMutation.isPending && activateMutation.variables === year.id}
                      isDeleting={deleteMutation.isPending && deleteMutation.variables === year.id}
                      isUpdatingPrice={priceMutation.isPending}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">Aucune année académique</p>
            {canManage && (
              <p className="text-sm text-gray-400 mt-1">Créez votre première année</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}