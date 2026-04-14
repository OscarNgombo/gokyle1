import { Link } from 'react-router-dom';
import { ArrowRight, FileText, FolderCog, ShieldCheck, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

const adminAreas = [
  {
    title: 'Operations',
    description: 'Review bookings, answer inquiries, manage statuses, and keep internal notes in one place.',
    href: '/admin/operations/bookings',
    icon: Wrench,
  },
  {
    title: 'Content',
    description: 'Manage safari packages, blog posts, destinations, and reusable homepage/services content.',
    href: '/admin/content',
    icon: FileText,
  },
] as const;

const AdminDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Admin workspace
            </CardTitle>
            <CardDescription>
              Auth, protected routing, content tools, and the operations workspace are live for day-to-day staff use.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Signed in as <span className="font-medium text-foreground">{user?.fullName || user?.email}</span>.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/admin/operations/bookings">
                  Open operations
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/content">Open content</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Access summary</CardTitle>
            <CardDescription>Phase 1 uses a single admin role.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-md border bg-background px-3 py-2">
              <p className="font-medium text-foreground">Role</p>
              <p>{user?.role || 'admin'}</p>
            </div>
            <div className="rounded-md border bg-background px-3 py-2">
              <p className="font-medium text-foreground">Status</p>
              <p>{user?.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {adminAreas.map(({ description, href, icon: Icon, title }) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon className="h-5 w-5 text-primary" />
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link to={href}>
                  Visit {title.toLowerCase()}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FolderCog className="h-5 w-5 text-primary" />
            Ready for expansion
          </CardTitle>
          <CardDescription>
            The protected <code>/admin</code> shell now supports live operations work and is ready for more tools.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
