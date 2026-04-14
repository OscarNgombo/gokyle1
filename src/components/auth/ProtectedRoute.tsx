import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AlertTriangle, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiErrorMessage } from '@/api/errors';
import { useAuth } from '@/hooks/use-auth';

const ProtectedRoute = () => {
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

  return <Outlet />;
};

export default ProtectedRoute;
