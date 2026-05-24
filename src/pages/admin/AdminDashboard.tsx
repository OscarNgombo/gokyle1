import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowRight, FileText, ShieldCheck, Wrench } from 'lucide-react';
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

  const filteredAdminAreas = useMemo(() => {
    if (!user) return [];

    return adminAreas.filter((area) => {
      if (area.title === 'Operations') {
        return ['super_admin', 'operations_manager', 'operations_agent'].includes(user.role);
      }
      if (area.title === 'Content') {
        return ['super_admin', 'content_manager'].includes(user.role);
      }
      return false;
    });
  }, [user]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {user?.fullName?.split(' ')[0] || user?.email.split('@')[0] || 'Admin'}!
        </h1>
        <p className="text-muted-foreground">Here's what's happening with your workspace today.</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Quick Access
            </CardTitle>
            <CardDescription>
              Jump straight into your most frequent tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {filteredAdminAreas.map((area) => (
              <Button key={area.title} variant="outline" asChild>
                <Link to={area.href}>Open {area.title.toLowerCase()}</Link>
              </Button>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Access summary</CardTitle>
            <CardDescription>Your current authorization level.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-md border bg-background px-3 py-2">
              <p className="font-medium text-foreground">Role</p>
              <p className="capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <div className="rounded-md border bg-background px-3 py-2">
              <p className="font-medium text-foreground">Account Status</p>
              <p>{user?.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {filteredAdminAreas.map(({ description, href, icon: Icon, title }) => (
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
    </div>
  );
};

export default AdminDashboardPage;
