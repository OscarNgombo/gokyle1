import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AdminUserRole } from '@/api/types';
import { useRegisterAdminUserMutation } from '@/api/queries';

export const AdminRegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<AdminUserRole>('operations_agent');
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const registerMutation = useRegisterAdminUserMutation(accessToken);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    try {
      await registerMutation.mutateAsync({
        email,
        password,
        full_name: fullName,
        role,
      });
      toast({ title: 'Staff registered successfully' });
      navigate('/admin/users');
    } catch (error) {
      toast({ title: 'Registration failed', variant: 'destructive' });
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader><CardTitle>Register Staff</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          <div className="relative">
            <Input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <Input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />

          <Select value={role} onValueChange={(val: AdminUserRole) => setRole(val)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="operations_agent">Operations Agent</SelectItem>
              <SelectItem value="operations_manager">Operations Manager</SelectItem>
              <SelectItem value="content_manager">Content Manager</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">Register Staff</Button>
        </form>
      </CardContent>
    </Card>
  );
};
