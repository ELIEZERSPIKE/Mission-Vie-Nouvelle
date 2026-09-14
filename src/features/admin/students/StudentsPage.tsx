import { useMutation } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { studentsApi } from '../../../api/endpoints/students.ts';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

export function StudentsPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const createStudentMutation = useMutation({
    mutationFn: studentsApi.store,
    onSuccess: () => {
      setFormError(null);
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message ?? "Erreur lors de la création du compte étudiant.");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createStudentMutation.mutate({
      first_name: firstName,
      last_name: lastName,
      phone,
      email: email || undefined,
    });
  };

  const handleReset = () => {
    createStudentMutation.reset();
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setFormError(null);
  };

  const result = createStudentMutation.data;

  return (
    <div className="px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <header className="border-t border-border/40 pt-8 md:pt-12">
          <p className="mb-3 text-sm font-medium tracking-wide text-primary">Guichet</p>
          <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">Étudiants</h1>
        </header>

        {result ? (
          <div
            role="status"
            className={`mt-8 border px-6 py-6 ${
              result.already_exists ? 'border-border/60 bg-muted/40' : 'border-primary/30 bg-primary/5'
            }`}
          >
            <h2 className="font-serif text-xl text-foreground">
              {result.already_exists ? 'Compte existant' : 'Compte créé'}
            </h2>
            <p className="mt-2 text-sm text-foreground">
              {result.user.full_name} — {result.user.phone}
              {result.user.email ? ` — ${result.user.email}` : ''}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Statut : {result.user.status}</p>

            {result.temporary_password && (
              <p className="mt-3 text-sm text-foreground">
                Mot de passe temporaire : <strong className="font-mono">{result.temporary_password}</strong>{' '}
                <span className="text-muted-foreground">(à communiquer à l'étudiant)</span>
              </p>
            )}

            <Button type="button" variant="outline" onClick={handleReset} className="mt-5 h-11">
              Nouvel étudiant
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 border border-border/60 bg-card p-6 sm:p-8">
            <h2 className="font-serif text-xl text-foreground">Créer / retrouver un étudiant (guichet)</h2>

            {formError && (
              <div role="alert" className="mt-4 border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {formError}
              </div>
            )}

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">Prénom</Label>
                <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Nom</Label>
                <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (optionnel)</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
              </div>
            </div>

            <Button type="submit" disabled={createStudentMutation.isPending} className="mt-6 h-11 w-full sm:w-auto sm:px-8">
              {createStudentMutation.isPending ? 'Recherche...' : 'Valider'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}