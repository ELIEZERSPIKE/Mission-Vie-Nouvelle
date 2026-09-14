import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { resolveHomeRoute } from '../../auth/resolveHomeRoute';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AuthToastViewport } from './components/AuthToast';
import { authToast } from './lib/authToast';
import { AUTH_GLOW_BUTTON_CLASS } from './lib/authGlow';

export function ChangePasswordPage() {
  const { changePassword, user } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      authToast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsSubmitting(true);

    try {
      await changePassword({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });
      authToast.success('Mot de passe changé avec succès.');
      navigate(resolveHomeRoute(user?.roles ?? []), { replace: true });
    } catch (err: any) {
      authToast.error(err.response?.data?.message ?? 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground sm:px-8 sm:py-16">
      <AuthToastViewport />
      <div className="mx-auto grid w-full max-w-5xl gap-10 border-t border-border/40 pt-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16 md:pt-12">
        <header className="max-w-md">
          <p className="mb-5 text-sm font-medium tracking-wide text-primary">Institut Biblique Vie Nouvelle</p>
          <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl">Changer le mot de passe</h1>
          {user?.must_change_password ? (
            <p className="mt-5 max-w-sm text-base leading-7 text-muted-foreground">
              Pour des raisons de sécurité, vous devez choisir un nouveau mot de passe avant de continuer.
            </p>
          ) : (
            <p className="mt-5 max-w-sm text-base leading-7 text-muted-foreground">
              Choisissez un nouveau mot de passe pour votre compte.
            </p>
          )}
        </header>

        <form onSubmit={handleSubmit} className="w-full max-w-xl md:justify-self-end" noValidate>
          <div className="space-y-2">
            <Label htmlFor="current-password">Mot de passe actuel</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              autoFocus
              required
              className="h-11"
            />
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={8}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password-confirmation">Confirmer le nouveau mot de passe</Label>
              <Input
                id="new-password-confirmation"
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
            {isSubmitting ? 'Changement...' : 'Changer le mot de passe'}
          </Button>
        </form>
      </div>
    </main>
  );
}