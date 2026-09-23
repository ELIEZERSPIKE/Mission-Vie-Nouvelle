// src/auth/RequireAuthOnly.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';
import { Loader } from '@/components/ui/loader';

export function RequireAuthOnly() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Pas de check must_change_password ici, sinon boucle infinie
  // avec /change-password qui redirige vers lui-même

  return <Outlet />;
}