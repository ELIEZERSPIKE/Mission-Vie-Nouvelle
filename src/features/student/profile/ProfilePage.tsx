import { AvatarUploader } from './AvatarUploader';
import { PersonalInfoForm } from './PersonalInfoForm';
import { CvUploader } from './CvUploader';

export function ProfilePage() {
  return (
    <div className="space-y-10">
      <header className="border-t border-border/40 pt-8 md:pt-12">
        <p className="mb-3 text-sm font-medium tracking-wide text-primary">Espace étudiant</p>
        <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">Mon profil</h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
          Gérez votre photo, vos informations personnelles et votre curriculum vitae.
        </p>
      </header>

      <AvatarUploader />
      <PersonalInfoForm />
      <CvUploader />
    </div>
  );
}