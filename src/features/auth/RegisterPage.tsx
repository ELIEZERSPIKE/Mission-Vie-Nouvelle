import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AuthToastViewport } from './components/AuthToast';
import { authToast } from './lib/authToast';
import { AUTH_GLOW_BUTTON_CLASS } from './lib/authGlow';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      authToast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password_confirmation: passwordConfirmation,
        phone: phone || undefined,
      });
      authToast.success('Compte créé avec succès.');
      // register() assigne toujours le rôle STUDENT via StudentAccountService,
      // donc pas besoin de resolveHomeRoute ici — direction fixe.
      navigate('/student');
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
          <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl">Créer un compte</h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-muted-foreground">
            Rejoignez votre espace d'apprentissage et commencez votre parcours de formation.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="w-full max-w-xl md:justify-self-end">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">Prénom</Label>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                autoComplete="given-name"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Nom</Label>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                autoComplete="family-name"
                required
                className="h-11"
              />
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="h-11"
            />
          </div>

          <div className="mt-5 space-y-2">
            <Label htmlFor="phone">Téléphone (optionnel)</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              autoComplete="tel"
              className="h-11"
            />
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="h-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-confirmation">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="password-confirmation"
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordConfirmation(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="h-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation((v) => !v)}
                  aria-label={
                    showPasswordConfirmation ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                  }
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
                >
                  {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`mt-8 h-11 w-full px-6 ${AUTH_GLOW_BUTTON_CLASS}`}
          >
            {isSubmitting ? 'Création...' : 'Créer mon compte'}
          </Button>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}