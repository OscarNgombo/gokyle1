import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminUser } from '@/api/types';
import { apiClient } from '@/api/client';

export const AdminUserManagementPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const { accessToken } = useAuth();

  useEffect(() => {
    apiClient.get<AdminUser[]>('/admin/users', { authToken: accessToken })
      .then(setUsers);
  }, [accessToken]);

  const updateRole = async (userId: string, role: string) => {
    const updatedUser = await apiClient.patch<AdminUser, { role: string }>(
      `/admin/users/${userId}/role`,
      { role },
      { authToken: accessToken }
    );
    setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
  };

  return (
    <Card>
      <CardHeader><CardTitle>Manage Team</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select value={user.role} onValueChange={(val) => updateRole(user.id, val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operations_agent">Operations Agent</SelectItem>
                      <SelectItem value="operations_manager">Operations Manager</SelectItem>
                      <SelectItem value="content_manager">Content Manager</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
