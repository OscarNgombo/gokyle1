import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FileText, LayoutDashboard, LogOut, ShieldCheck, Wrench, UserPlus, Users, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { AdminUserRole } from '@/api/types';

const navigationItems = [
  {
    label: 'Overview',
    to: '/admin',
    end: true,
    icon: LayoutDashboard,
    roles: ['super_admin', 'operations_manager', 'operations_agent', 'content_manager', 'admin'],
  },
  {
    label: 'Operations',
    to: '/admin/operations/bookings',
    icon: Wrench,
    roles: ['super_admin', 'operations_manager', 'operations_agent'],
  },
  {
    label: 'Content',
    to: '/admin/content',
    icon: FileText,
    roles: ['super_admin', 'content_manager'],
  },
  {
    label: 'Register Staff',
    to: '/admin/register',
    icon: UserPlus,
    roles: ['super_admin'],
  },
  {
    label: 'Manage Team',
    to: '/admin/users',
    icon: Users,
    roles: ['super_admin'],
  },
] as const;

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const userRole = user?.role as AdminUserRole;

  const NavContent = () => (
    <>
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map(({ end, icon: Icon, label, to, roles }) => {
          if (!roles.includes(userRole)) return null;

          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t p-4 space-y-4">
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground">{user?.fullName || user?.email || 'Admin'}</p>
          <p className="capitalize">{user?.role?.replace('_', ' ')}</p>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="font-semibold">Gokyle Admin</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-background fixed h-full z-30">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Gokyle Admin</span>
        </div>
        <NavContent />
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-30 pt-16 bg-background flex flex-col">
          <NavContent />
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-20 lg:pt-8 lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
