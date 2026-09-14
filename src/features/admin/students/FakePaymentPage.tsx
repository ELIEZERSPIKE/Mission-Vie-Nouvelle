import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../../../api/endpoints/orders';
import { Button } from '../../../components/ui/button';

export function FakePaymentPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', transactionId],
    queryFn: () => ordersApi.getByTransaction(transactionId!),
    enabled: !!transactionId,
  });

  const handleSimulate = async (outcome: 'ACCEPTED' | 'REFUSED') => {
    if (!transactionId) return;
    setIsProcessing(true);
    await ordersApi.simulate(transactionId, outcome);
    navigate('/student');
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-md border-2 border-dashed border-destructive/50 bg-card p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-destructive">
          Guichet de test — pas un vrai paiement
        </p>
        <h1 className="mt-3 font-serif text-2xl leading-tight text-foreground">Simulateur de paiement</h1>
        <p className="mt-3 text-sm text-muted-foreground">{order?.description}</p>
        <p className="mt-2 text-2xl font-semibold text-foreground">
          {order && new Intl.NumberFormat('fr-FR').format(order.amount)} {order?.currency}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" onClick={() => handleSimulate('ACCEPTED')} disabled={isProcessing} className="h-11">
            Simuler un paiement réussi
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSimulate('REFUSED')}
            disabled={isProcessing}
            className="h-11"
          >
            Simuler un échec
          </Button>
        </div>
      </div>
    </main>
  );
}