import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, LoaderCircle, Phone, X } from 'lucide-react';
import { paymentsApi, type PendingPayment } from '../../../api/endpoints/payments';
import { Button } from '../../../components/ui/button';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const PROVIDER_LABELS: Record<string, string> = {
  FEDAPAY: 'FedaPay (en ligne)',
  CINETPAY: 'CinetPay (en ligne)',
  CASH: 'Espèces',
  BANK_TRANSFER: 'Virement bancaire',
  MANUAL_OTHER: 'Saisie manuelle',
};

function providerLabel(provider: string): string {
  if (PROVIDER_LABELS[provider]) return PROVIDER_LABELS[provider];
  return provider
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Traitement « sceau officiel » (design system, §3 et §5) pour les statuts de paiement.
function StatusSeal({ status }: { status: PendingPayment['status'] }) {
  if (status === 'AGGREGATOR_CONFIRMED') {
    return (
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-accent"
        >
          <span className="h-2 w-2 rounded-full bg-accent" />
        </span>
        <div>
          <p className="text-foreground">Confirmé en ligne</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Prêt à valider</p>
        </div>
      </div>
    );
  }

  if (status === 'VALIDATED') {
    return (
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-accent"
        >
          <Check className="h-3.5 w-3.5 text-accent-foreground" strokeWidth={2.5} />
        </span>
        <div>
          <p className="text-foreground">Validé</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Inscription activée</p>
        </div>
      </div>
    );
  }

  // PENDING (ou statut inattendu) : cercle pointillé sauge, vide.
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="h-8 w-8 shrink-0 rounded-full border border-dashed border-border" />
      <div>
        <p className="text-foreground">En attente</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Paiement non confirmé</p>
      </div>
    </div>
  );
}

function errorMessage(error: unknown): string {
  const message = (error as { response?: { data?: { message?: string } } } | null)?.response?.data?.message;
  return message ?? 'L\'opération a échoué. Réessayez.';
}

export function PaymentsValidationPage() {
  const queryClient = useQueryClient();
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const { data: payments, isLoading, isError } = useQuery({
    queryKey: ['payments', 'pending'],
    queryFn: paymentsApi.listPending,
  });

  const validateMutation = useMutation({
    mutationFn: paymentsApi.validate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'admin'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => paymentsApi.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'pending'] });
      setRejectingId(null);
    },
  });

  const pendingCount = payments?.length ?? 0;
  const mutationError = validateMutation.isError
    ? validateMutation.error
    : rejectMutation.isError
      ? rejectMutation.error
      : null;

  return (
    <div className="space-y-10">
      <header className="border-t border-border/40 pt-8 md:pt-12">
        <p className="mb-3 text-sm font-medium tracking-wide text-primary">Finances</p>
        <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">
          Paiements à valider
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
          {pendingCount > 0
            ? `${pendingCount} paiement${pendingCount > 1 ? 's' : ''} en attente. La validation confirme le règlement et inscrit l'étudiant.`
            : 'Les paiements confirmés en ligne ou enregistrés au guichet apparaissent ici.'}
        </p>
      </header>

      {mutationError && (
        <div
          role="alert"
          className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {errorMessage(mutationError)}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement des paiements...</p>
      ) : isError ? (
        <div
          role="alert"
          className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          Impossible de charger les paiements.
        </div>
      ) : !payments || payments.length === 0 ? (
        <div className="rounded-md border border-dashed border-border/40 px-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">Aucun paiement en attente de validation.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border/60">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="px-4 py-3 font-medium">Étudiant</th>
                <th className="px-4 py-3 font-medium">Programme</th>
                <th className="px-4 py-3 font-medium">Montant</th>
                <th className="px-4 py-3 font-medium">Moyen de paiement</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
        <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">
                      {p.order?.user ? `${p.order.user.first_name} ${p.order.user.last_name}` : '—'}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3 shrink-0" aria-hidden="true" />
                      {p.order?.user?.phone ?? '—'}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">
                      {p.order?.academic_year?.program?.name ??
                        (p.order as any)?.academicYear?.program?.name ??
                        p.order?.description ??
                        '—'}
                    </p>
                    {(p.order?.academic_year?.label || (p.order as any)?.academicYear?.label) && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {p.order?.academic_year?.label ?? (p.order as any)?.academicYear?.label}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium tabular-nums text-foreground">
                    {new Intl.NumberFormat('fr-FR').format(p.amount)} {p.currency}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-foreground">{providerLabel(p.payment_provider)}</p>
                    {p.provider_reference && (
                      <p className="mt-0.5 break-all font-mono text-xs text-muted-foreground">
                        Réf. {p.provider_reference}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusSeal status={p.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{formatDate(p.created_at)}</td>
                  <td className="px-4 py-3">
                    {p.status === 'VALIDATED' ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        Validé
                      </span>
                    ) : rejectingId === p.id ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectMutation.mutate({ id: p.id })}
                          disabled={rejectMutation.isPending}
                          className="h-8"
                        >
                          {rejectMutation.isPending && rejectMutation.variables?.id === p.id ? (
                            <LoaderCircle className="animate-spin" aria-hidden="true" />
                          ) : (
                            'Confirmer'
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setRejectingId(null)}
                          disabled={rejectMutation.isPending}
                          className="h-8"
                        >
                          Annuler
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => validateMutation.mutate(p.id)}
                          disabled={validateMutation.isPending}
                          className="h-8"
                        >
                          {validateMutation.isPending && validateMutation.variables === p.id ? (
                            <>
                              <LoaderCircle className="animate-spin" aria-hidden="true" />
                              Validation...
                            </>
                          ) : (
                            'Valider'
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRejectingId(p.id)}
                          disabled={validateMutation.isPending}
                          className="h-8 w-8 p-0"
                          aria-label="Rejeter ce paiement"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}