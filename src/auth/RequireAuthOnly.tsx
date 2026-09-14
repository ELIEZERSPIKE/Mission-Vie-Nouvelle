// src/auth/RequireAuthOnly.tsx

//RequireAuthOnly fait un contrôle minimal : 
//il vérifie juste que l'utilisateur est connecté, sans rien vérifier d'autre.

//Concrètement, à chaque rendu :

//isLoading est true → affiche "Chargement..." (le temps que l'auth se résolve, ex. requête pour récupérer l'utilisateur).
//user est null/undefined → redirige vers /login (personne n'est connecté).
// Sinon (l'utilisateur est connecté) → rend <Outlet />, 
// c'est-à-dire qu'il laisse passer vers la route enfant (/change-password).

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

export function RequireAuthOnly() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Pas de check must_change_password ici, sinon boucle infinie
  // avec /change-password qui redirige vers lui-même

  return <Outlet />;
}