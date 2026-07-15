import { FormEvent, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LoaderCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getApiErrorMessage } from '@/api/errors';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface LoginLocationState {
  from?: {
    hash?: string;
    pathname?: string;
    search?: string;
  };
}

const AdminLoginPage = () => {
  const { toast } = useToast();
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = useMemo(() => {
    const state = location.state as LoginLocationState | null;
    const pathname = state?.from?.pathname;

    if (!pathname) {
      return '/admin';
    }

    return `${pathname}${state.from?.search || ''}${state.from?.hash || ''}`;
  }, [location.state]);

  if (auth.isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Checking saved session...
        </div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await auth.login({ email, password });
      toast({
        title: 'Signed in',
        description: 'Welcome back to the admin workspace.',
      });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast({
        title: 'Unable to sign in',
        description: getApiErrorMessage(error) || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await auth.loginWithGoogle();
      toast({
        title: 'Signed in with Google',
        description: 'Welcome back to the admin workspace.',
      });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast({
        title: 'Google sign in failed',
        description: getApiErrorMessage(error) || 'Please check that your email is registered as an administrator and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <Card className="w-full max-w-md border-border/80 shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <CardTitle>Staff login</CardTitle>
            <CardDescription>
              Sign in with your admin account to access operations and content tools.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="gokyletours@gmail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button className="w-full font-medium" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-border/80 hover:bg-muted/50 transition-colors"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.354 0 3.373 2.736 1.545 6.727l3.72 3.038z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.275c0-.825-.075-1.62-.213-2.385H12v4.567h6.471a5.617 5.617 0 0 1-2.425 3.666l3.759 2.917c2.2-2.029 3.685-5.012 3.685-8.765z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 14.235 1.545 17.27C3.373 21.264 7.354 24 12 24c3.055 0 5.864-1.018 7.964-2.764l-3.76-2.917a4.298 4.298 0 0 1-4.204 1.118 4.407 4.407 0 0 1-3.264-3.264 4.316 4.316 0 0 1-1.118-4.204L1.545 17.27a7.08 7.08 0 0 1 3.72-3.035z"
              />
              <path
                fill="#34A853"
                d="M12 24c4.645 0 8.627-2.736 10.455-6.727l-3.76-2.917a7.077 7.077 0 0 1-6.695 4.827c-1.69 0-3.218-.6-4.418-1.582L3.818 21C5.945 22.855 8.673 24 12 24z"
              />
            </svg>
            Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};


export default AdminLoginPage;
