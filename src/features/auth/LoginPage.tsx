import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { resolveHomeRoute } from '../../auth/resolveHomeRoute';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AuthToastViewport } from './components/AuthToast';
import { authToast } from './lib/authToast';
import { AUTH_GLOW_BUTTON_CLASS } from './lib/authGlow';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await login(identifier, password);
      authToast.success('Connexion réussie.');

      if (user.must_change_password) {
        navigate('/change-password');
        return;
      }

      navigate(resolveHomeRoute(user.roles));
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
          <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl">Content de vous revoir</h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-muted-foreground">
            Connectez-vous pour retrouver vos cours, vos ressources et le suivi de votre parcours.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="w-full max-w-xl md:justify-self-end" noValidate>
          <div className="space-y-2">
            <Label htmlFor="identifier">Email ou téléphone</Label>
            <Input
              id="identifier"
              value={identifier}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              className="h-11"
            />
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="h-11"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`mt-8 h-11 w-full px-6 ${AUTH_GLOW_BUTTON_CLASS}`}
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
              Créer un compte
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}