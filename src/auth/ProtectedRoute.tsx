import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';
import { Loader } from '@/components/ui/loader';

interface ProtectedRouteProps {
  requiredPermission?: string | string[];
  requiredRole?: string;
}

export function ProtectedRoute({ requiredPermission, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.must_change_password) {
    return <Navigate to="/change-password" replace />;
  }

  if (requiredPermission) {
    const required = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    const hasAny = required.some((perm) => hasPermission(perm));
    if (!hasAny) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (requiredRole && !user.roles.includes(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}