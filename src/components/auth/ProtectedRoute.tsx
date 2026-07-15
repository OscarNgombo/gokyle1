import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AlertTriangle, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiErrorMessage } from '@/api/errors';
import { useAuth } from '@/hooks/use-auth';
import type { AdminUserRole } from '@/api/types';


interface ProtectedRouteProps {
  allowedRoles?: AdminUserRole[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Checking admin session...
        </div>
      </div>
    );
  }

  if (auth.authError && auth.hasStoredSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Unable to verify session
            </CardTitle>
            <CardDescription>
              {getApiErrorMessage(auth.authError) || 'Please try again or sign in again.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button className="sm:flex-1" onClick={() => void auth.refreshCurrentUser()}>
              Retry
            </Button>
            <Button className="sm:flex-1" variant="outline" asChild>
              <Link to="/staff/login">Back to login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/staff/login" replace state={{ from: location }} />;
  }

  // Check roles if specified
  if (allowedRoles && auth.user && !allowedRoles.includes(auth.user.role as AdminUserRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
        <Card className="w-full max-w-md border-destructive/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Access Denied</CardTitle>
            <CardDescription className="mt-2">
              You do not have the required permissions to view this section.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link to="/admin">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
