import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  { to: '/admin/programs', label: 'Programmes', permission: 'program.manage' },
  { to: '/admin/academic-years', label: 'Années académiques', permission: 'academic_year.manage' },
  { to: '/admin/subjects', label: 'Matières', permission: 'subject.manage' },
  { to: '/admin/content-items', label: 'Tous les supports', permission: 'content.manage' },
  { to: '/admin/grant-manual', label: 'Enregistrement Étudiant', permission: 'enrollment.grant_manual' },
  { to: '/admin/students', label: 'Étudiants', permission: 'student.manage' },
  { to: '/admin/payments', label: 'Paiements à valider', permission: 'student.manage' },
  { to: '/admin/inquiries', label: 'Demandes d\'inscription', permission: 'student.manage' },
  { to: '/admin/group-resources', label: 'Ressources du groupe', permission: 'student.manage' },
] as const;

export function AdminLayout() {
  const { user, logout, hasPermission } = useAuth();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="flex w-64 shrink-0 flex-col border-r border-border">
        <div className="px-6 py-6">
          <p className="text-sm font-medium tracking-wide text-primary">Institut Vie Nouvelle</p>
          <p className="mt-1 text-xs text-muted-foreground">Espace administrateur</p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map(
            (item) =>
              hasPermission(item.permission) && (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-muted font-medium text-primary'
                        : 'text-foreground hover:bg-muted'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              )
          )}
        </nav>

        <div className="border-t border-border px-6 py-5">
          <p className="truncate text-sm">{user?.full_name}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="mt-2 w-full justify-start px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            Déconnexion
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}