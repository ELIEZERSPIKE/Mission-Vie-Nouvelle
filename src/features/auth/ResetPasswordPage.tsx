import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AuthToastViewport } from './components/AuthToast';
import { authToast } from './lib/authToast';
import { AUTH_GLOW_BUTTON_CLASS } from './lib/authGlow';

export function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!token || !email) {
    return (
      <main className="min-h-screen bg-background px-5 py-10 text-foreground sm:px-8 sm:py-16">
        <AuthToastViewport />
        <div className="mx-auto max-w-md border-t border-border/40 pt-8 md:pt-12">
          <p className="mb-5 text-sm font-medium tracking-wide text-primary">Institut Biblique Vie Nouvelle</p>
          <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl">Lien invalide</h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Ce lien de réinitialisation est incomplet ou invalide.
          </p>
          <Link
            to="/forgot-password"
            className="mt-8 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Demander un nouveau lien
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      authToast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token, email, password, passwordConfirmation);
      setIsDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err: any) {
      authToast.error(err.response?.data?.message ?? 'Lien invalide ou expiré.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      <main className="min-h-screen bg-background px-5 py-10 text-foreground sm:px-8 sm:py-16">
        <AuthToastViewport />
        <div className="mx-auto max-w-md border-t border-border/40 pt-8 md:pt-12">
          <p className="mb-5 text-sm font-medium tracking-wide text-primary">Institut Biblique Vie Nouvelle</p>
          <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl">Mot de passe réinitialisé</h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground">Redirection vers la page de connexion...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground sm:px-8 sm:py-16">
      <AuthToastViewport />
      <div className="mx-auto grid w-full max-w-5xl gap-10 border-t border-border/40 pt-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16 md:pt-12">
        <header className="max-w-md">
          <p className="mb-5 text-sm font-medium tracking-wide text-primary">Institut Biblique Vie Nouvelle</p>
          <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl">Réinitialiser le mot de passe</h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-muted-foreground">
            Choisissez un nouveau mot de passe pour {email}.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="w-full max-w-xl md:justify-self-end" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                autoComplete="new-password"
                autoFocus
                required
                minLength={8}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-confirmation">Confirmer le nouveau mot de passe</Label>
              <Input
                id="password-confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
                required
                minLength={8}
                className="h-11"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`mt-8 h-11 w-full px-6 ${AUTH_GLOW_BUTTON_CLASS}`}
          >
            {isSubmitting ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </Button>
        </form>
      </div>
    </main>
  );
}