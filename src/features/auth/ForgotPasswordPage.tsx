import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      // Le backend renvoie toujours ce même message (succès ou email inconnu)
      // pour éviter l'énumération de comptes — on affiche donc toujours ceci.
      setIsSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <main className="min-h-screen bg-background px-5 py-10 text-foreground sm:px-8 sm:py-16">
        <div className="mx-auto max-w-md border-t border-border/40 pt-8 md:pt-12">
          <p className="mb-5 text-sm font-medium tracking-wide text-primary">Institut Biblique Vie Nouvelle</p>
          <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl">Vérifiez vos emails</h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Si un compte existe avec cet email, un lien de réinitialisation vient de vous être envoyé.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Retour à la connexion
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground sm:px-8 sm:py-16">
      <div className="mx-auto grid w-full max-w-5xl gap-10 border-t border-border/40 pt-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16 md:pt-12">
        <header className="max-w-md">
          <p className="mb-5 text-sm font-medium tracking-wide text-primary">Institut Biblique Vie Nouvelle</p>
          <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl">Mot de passe oublié</h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-muted-foreground">
            Indiquez votre email, nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="w-full max-w-xl md:justify-self-end" noValidate>
          {error && (
            <div role="alert" className="mb-6 border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              className="h-11"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-8 h-11 w-full px-6">
            {isSubmitting ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Retour à la connexion
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}