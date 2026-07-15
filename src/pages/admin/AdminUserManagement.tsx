import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  useAdminUsersQuery, 
  useUpdateAdminUserRoleMutation, 
  useUpdateAdminUserStatusMutation,
  useDeleteAdminUserMutation 
} from '@/api/queries';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Loader2, Search, UserPlus, Trash2, ShieldCheck, Mail, Calendar, Key } from 'lucide-react';
import { format } from 'date-fns';

export const AdminUserManagementPage = () => {
  const { accessToken, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const { data: users = [], isLoading, refetch } = useAdminUsersQuery(accessToken);
  const updateRoleMutation = useUpdateAdminUserRoleMutation(accessToken);
  const updateStatusMutation = useUpdateAdminUserStatusMutation(accessToken);
  const deleteUserMutation = useDeleteAdminUserMutation(accessToken);

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateRoleMutation.mutateAsync({ userId, role });
      toast({ title: 'Role updated successfully' });
      refetch();
    } catch (err) {
      toast({ title: 'Failed to update role', variant: 'destructive' });
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    if (userId === currentUser?.id) {
      toast({ 
        title: 'Operation restricted', 
        description: 'You cannot deactivate your own account.', 
        variant: 'destructive' 
      });
      return;
    }
    try {
      await updateStatusMutation.mutateAsync({ userId, isActive: !currentStatus });
      toast({ title: `Staff account ${!currentStatus ? 'activated' : 'deactivated'} successfully` });
      refetch();
    } catch (err) {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUserId) return;
    if (deletingUserId === currentUser?.id) {
      toast({ 
        title: 'Operation restricted', 
        description: 'You cannot delete your own account.', 
        variant: 'destructive' 
      });
      setDeletingUserId(null);
      return;
    }

    try {
      await deleteUserMutation.mutateAsync(deletingUserId);
      toast({ title: 'Staff account deleted successfully' });
      refetch();
    } catch (err) {
      toast({ title: 'Failed to delete staff member', variant: 'destructive' });
    } finally {
      setDeletingUserId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'active' && user.isActive) || 
        (statusFilter === 'inactive' && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const formatDateLabel = (dateString?: string | null) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'PPP p');
    } catch {
      return 'Invalid date';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/10 border border-red-500/20';
      case 'operations_manager':
        return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/10 border border-purple-500/20';
      case 'content_manager':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 border border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/10 border border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Directory</h1>
          <p className="text-muted-foreground">Manage administrative roles, permissions, and team access.</p>
        </div>
        <Button onClick={() => navigate('/admin/register')} className="gap-2 self-start sm:self-auto">
          <UserPlus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter through the administrative team.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="operations_agent">Operations Agent</SelectItem>
                <SelectItem value="operations_manager">Operations Manager</SelectItem>
                <SelectItem value="content_manager">Content Manager</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-md overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
              <ShieldCheck className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="font-semibold text-lg">No staff members found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mt-1">
                Try adjusting your search criteria or register a new team member.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>System Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id} className="transition-colors hover:bg-muted/30">
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground flex items-center gap-1.5">
                            {user.fullName || 'Unnamed User'}
                            {user.id === currentUser?.id && (
                              <Badge variant="outline" className="text-[10px] font-medium py-0 px-1.5 uppercase bg-primary/5 text-primary">
                                You
                              </Badge>
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.id === currentUser?.id ? (
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role.replace('_', ' ')}
                          </Badge>
                        ) : (
                          <Select 
                            value={user.role} 
                            onValueChange={(val) => handleRoleChange(user.id, val)}
                          >
                            <SelectTrigger className="w-[180px] h-8 text-xs font-medium">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="operations_agent">Operations Agent</SelectItem>
                              <SelectItem value="operations_manager">Operations Manager</SelectItem>
                              <SelectItem value="content_manager">Content Manager</SelectItem>
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={() => handleStatusToggle(user.id, user.isActive)}
                            disabled={user.id === currentUser?.id}
                          />
                          <span className="text-xs font-medium text-muted-foreground min-w-[50px]">
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDateLabel(user.lastLoginAt)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDateLabel(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              disabled={user.id === currentUser?.id}
                              onClick={() => setDeletingUserId(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove staff member?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete <strong>{user.fullName || user.email}</strong>? 
                                This administrative account will immediately lose all system access. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeletingUserId(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={handleDeleteUser}
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
