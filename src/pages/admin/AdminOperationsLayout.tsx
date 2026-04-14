import { NavLink, Outlet } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const operationSections = [
  {
    description: 'Track booking requests through review, response, confirmation, and completion.',
    title: 'Bookings',
    to: '/admin/operations/bookings',
  },
  {
    description: 'Work contact inquiries from first review to resolution without leaving admin.',
    title: 'Inquiries',
    to: '/admin/operations/inquiries',
  },
] as const;

const AdminOperationsLayout = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Operations workspace</CardTitle>
        <CardDescription>
          Use the protected admin APIs to triage work, keep internal notes, and move requests through the locked
          phase 1 workflows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <nav aria-label="Operations sections" className="grid gap-3 md:grid-cols-2">
          {operationSections.map(({ description, title, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg border bg-background px-4 py-3 text-left transition-colors',
                  isActive ? 'border-primary bg-primary/5' : 'hover:border-primary/50',
                )
              }
            >
              <p className="font-medium text-foreground">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </NavLink>
          ))}
        </nav>
      </CardContent>
    </Card>

    <Outlet />
  </div>
);

export default AdminOperationsLayout;
