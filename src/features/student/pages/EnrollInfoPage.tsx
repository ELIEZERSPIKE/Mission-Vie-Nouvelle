import { useParams, useLocation, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { academicYearsApi } from '../../../api/endpoints/academicYears';
import { ordersApi } from '../../../api/endpoints/orders';

interface EnrollLocationState {
  yearLabel?: string;
  programName?: string;
  price?: number | null;
  currency?: string;
}

export function EnrollInfoPage() {
  const { yearId } = useParams<{ yearId: string }>();
  const location = useLocation();
  const state = (location.state ?? {}) as EnrollLocationState;
  const hasState = !!state.yearLabel;
  const [error, setError] = useState<string | null>(null);

  const { data: fetchedYear, isLoading } = useQuery({
    queryKey: ['academic-year', yearId],
    queryFn: () => academicYearsApi.getOne(yearId!),
    enabled: !hasState && !!yearId,
  });

  const initiateMutation = useMutation({
    mutationFn: () => ordersApi.initiate(yearId!),
    onSuccess: (data) => {
      window.location.href = data.payment_url;
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message ?? "Une erreur est survenue, réessaie plus tard.");
    },
  });

  const label = state.yearLabel ?? fetchedYear?.label;
  const programName = state.programName ?? fetchedYear?.program?.name;
  const price = state.price ?? fetchedYear?.price;
  const currency = state.currency ?? fetchedYear?.currency;

  if (!hasState && isLoading) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Chargement...</p>;
  }

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto', textAlign: 'center' }}>
      <h1>Inscription</h1>

      {programName && label ? (
        <p style={{ fontWeight: 600 }}>
          {programName} — {label}
        </p>
      ) : (
        <p style={{ color: '#999' }}>Référence : {yearId}</p>
      )}

      {price != null && (
        <p style={{ fontSize: '1.2rem' }}>
          {new Intl.NumberFormat('fr-FR').format(price)} {currency}
        </p>
      )}

      <button
        onClick={() => {
          setError(null);
          initiateMutation.mutate();
        }}
        disabled={initiateMutation.isPending || !yearId}
        style={{ padding: '0.6rem 1.5rem', fontSize: '1rem' }}
      >
        {initiateMutation.isPending ? 'Redirection en cours...' : 'Payer maintenant'}
      </button>

      {error && <p style={{ color: 'crimson', marginTop: '0.75rem' }}>{error}</p>}

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/student">Retour au tableau de bord</Link>
      </p>
    </div>
  );
}