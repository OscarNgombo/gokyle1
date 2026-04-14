import { Link, NavLink, Outlet } from 'react-router-dom';
import { FileText, LayoutDashboard, LogOut, ShieldCheck, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    label: 'Overview',
    to: '/admin',
    end: true,
    icon: LayoutDashboard,
  },
  {
    label: 'Operations',
    to: '/admin/operations/bookings',
    icon: Wrench,
  },
  {
    label: 'Content',
    to: '/admin/content',
    icon: FileText,
  },
] as const;

const AdminLayout = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Gokyle Admin
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              Signed in as {user?.fullName || user?.email || 'Admin'}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <nav className="flex flex-wrap gap-2" aria-label="Admin">
              {navigationItems.map(({ end, icon: Icon, label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
