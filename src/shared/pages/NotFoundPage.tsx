import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export function NotFoundPage() {
  const error = useRouteError();

  let title = 'Page introuvable';
  let message = "L'adresse que vous avez saisie n'existe pas.";

  if (error) {
    if (isRouteErrorResponse(error)) {
      if (error.status === 404) {
        title = 'Page introuvable';
        message = "L'adresse que vous avez saisie n'existe pas.";
      } else {
        title = `Erreur ${error.status}`;
        message = error.statusText || 'Une erreur inattendue est survenue.';
      }
    } else if (error instanceof Error) {
      title = 'Une erreur est survenue';
      message = error.message || "Quelque chose s'est mal passé.";
    } else {
      title = 'Une erreur est survenue';
      message = "Quelque chose s'est mal passé.";
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '1rem',
        textAlign: 'center',
        padding: '1rem',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h1>
      <p style={{ color: '#666', maxWidth: '400px' }}>{message}</p>
      <Link
        to="/login"
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
