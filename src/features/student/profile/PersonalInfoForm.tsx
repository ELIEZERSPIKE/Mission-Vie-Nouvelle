import { useState, type FormEvent } from 'react';
import { useAuth } from '../../../auth/useAuth';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';

export function PersonalInfoForm() {
  const { user, updatePersonalInfo } = useAuth();

  const [dateOfBirth, setDateOfBirth] = useState(user?.date_of_birth ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await updatePersonalInfo({
        date_of_birth: dateOfBirth || null,
        address: address || null,
        bio: bio || null,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasUnsavedChanges =
    (dateOfBirth ?? '') !== (user?.date_of_birth ?? '') ||
    (address ?? '') !== (user?.address ?? '') ||
    (bio ?? '') !== (user?.bio ?? '');

  const handleReset = () => {
    setDateOfBirth(user?.date_of_birth ?? '');
    setAddress(user?.address ?? '');
    setBio(user?.bio ?? '');
    setError(null);
    setSuccess(false);
  };

  return (
    <section className="border border-border/60 bg-card p-6 sm:p-8">
      <h2 className="font-serif text-xl text-foreground">Informations personnelles</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
        Ces informations complètent votre dossier auprès de l&apos;institut.
      </p>

      {error && (
        <div role="alert" className="mt-4 border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div role="status" className="mt-4 border border-primary/50 bg-primary/10 px-4 py-3 text-sm text-primary">
          Vos informations ont été mises à jour.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date de naissance</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={dateOfBirth ?? ''}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={address ?? ''}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={255}
              placeholder="Ville, quartier, numéro..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio ?? ''}
            onChange={(e) => setBio(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Présentez-vous en quelques mots..."
          />
          <p className="text-right text-xs text-muted-foreground">{bio.length}/2000 caractères</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting || !hasUnsavedChanges}>
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
          {hasUnsavedChanges && !isSubmitting && (
            <Button type="button" variant="ghost" onClick={handleReset}>
              Réinitialiser
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}