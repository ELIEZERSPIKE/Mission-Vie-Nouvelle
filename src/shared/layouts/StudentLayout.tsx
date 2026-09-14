import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useActiveEnrollment } from '../../features/student/hooks/useActiveEnrollment';
import { Button } from '../../components/ui/button';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 px-1 py-1 text-sm transition-colors ${
    isActive
      ? 'border-primary font-medium text-foreground'
      : 'border-transparent text-muted-foreground hover:text-foreground'
  }`;

export function StudentLayout() {
  const { user, logout } = useAuth();
  const { activeEnrollment } = useActiveEnrollment();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-8">
            <p className="font-serif text-lg leading-tight text-foreground">Institut Biblique</p>

            <nav className="hidden items-center gap-6 sm:flex">
              <NavLink to="/student" end className={navLinkClass}>
                Accueil
              </NavLink>
              <NavLink to="/student/my-courses" className={navLinkClass}>
                Mes cours
              </NavLink>
              {activeEnrollment && (
                <NavLink to={`/student/group-resources/${activeEnrollment.academic_year_id}`} className={navLinkClass}>
                  Ressources du groupe
                </NavLink>
              )}
              <NavLink to="/student/profile" className={navLinkClass}>
                Mon profil
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <NavLink to="/student/profile" className="flex items-center gap-2">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-foreground">{user?.full_name}</span>
              )}
            </NavLink>
            <Button variant="ghost" size="sm" onClick={() => logout()} className="h-9 px-3">
              Déconnexion
            </Button>
          </div>
        </div>

        <nav className="flex items-center gap-6 overflow-x-auto border-t border-border/40 px-5 py-3 sm:hidden">
          <NavLink to="/student" end className={navLinkClass}>
            Accueil
          </NavLink>
          <NavLink to="/student/my-courses" className={navLinkClass}>
            Mes cours
          </NavLink>
          {activeEnrollment && (
            <NavLink to={`/student/group-resources/${activeEnrollment.academic_year_id}`} className={navLinkClass}>
              Ressources
            </NavLink>
          )}
          <NavLink to="/student/profile" className={navLinkClass}>
            Profil
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        <Outlet />
      </main>
    </div>
  );
}