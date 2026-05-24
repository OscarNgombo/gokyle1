import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, Search } from 'lucide-react';
import {
  adminOperationsQueryKeys,
  useAdminBookingRequestDetailQuery,
  useAdminBookingRequestsQuery,
  useAdminBookingRequestUpdateMutation,
} from '@/api/queries';
import type { AdminAssignmentFilter, BookingRequestAdminStatus } from '@/api/types';
import OperationStatusBadge from '@/components/admin/OperationStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import {
  bookingRequestStatusOptions,
  formatAdminDateTime,
  truncateAdminText,
} from '@/lib/admin-operations';
import { cn } from '@/lib/utils';

const assignmentFilterOptions: Array<{ label: string; value: AdminAssignmentFilter }> = [
  { value: 'all', label: 'All assignments' },
  { value: 'me', label: 'Assigned to me' },
  { value: 'unassigned', label: 'Unassigned' },
];

const allStatusesValue = 'all';

const AdminBookingsPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { accessToken, user } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<typeof allStatusesValue | BookingRequestAdminStatus>('all');
  const [assignedFilter, setAssignedFilter] = useState<AdminAssignmentFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(searchInput);

  const filters = useMemo(
    () => ({
      assigned: assignedFilter,
      search: deferredSearch.trim() || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
    }),
    [assignedFilter, deferredSearch, statusFilter],
  );

  const listQuery = useAdminBookingRequestsQuery(accessToken, filters);
  const items = useMemo(() => listQuery.data?.items ?? [], [listQuery.data?.items]);
  const statusCounts = useMemo(() => listQuery.data?.statusCounts ?? {}, [listQuery.data?.statusCounts]);
  const totalBookings = listQuery.data?.total ?? 0;

  const detailQuery = useAdminBookingRequestDetailQuery(accessToken, selectedId);
  const detail = detailQuery.data;

  const [draftStatus, setDraftStatus] = useState<BookingRequestAdminStatus>('received');
  const [draftAssigneeId, setDraftAssigneeId] = useState<string>('unassigned');
  const [draftNotes, setDraftNotes] = useState('');

  useEffect(() => {
    if (!detail) {
      return;
    }
    setDraftStatus(detail.status);
    setDraftAssigneeId(detail.assignedAdmin?.id ?? 'unassigned');
    setDraftNotes(detail.internalNotes ?? '');
  }, [detail]);

  useEffect(() => {
    if (!items.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !items.some((item) => item.id === selectedId)) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

  const assigneeOptions = useMemo(() => {
    const options = [{ label: 'Unassigned', value: 'unassigned' }];
    if (detail?.assignedAdmin && detail.assignedAdmin.id !== user?.id) {
      options.push({
        label: detail.assignedAdmin.fullName || detail.assignedAdmin.email,
        value: detail.assignedAdmin.id,
      });
    }
    if (user) {
      options.push({ label: `Assign to me (${user.fullName || user.email})`, value: user.id });
    }
    return options;
  }, [detail?.assignedAdmin, user]);

  const normalizedNotes = draftNotes.trim();
  const isDirty = Boolean(
    detail &&
      (draftStatus !== detail.status ||
        draftAssigneeId !== (detail.assignedAdmin?.id ?? 'unassigned') ||
        normalizedNotes !== (detail.internalNotes ?? '')),
  );

  const updateMutation = useAdminBookingRequestUpdateMutation(accessToken, {
    onSuccess: async (updated) => {
      toast({
        title: 'Booking updated',
        description: `${updated.customerName} is now marked as ${updated.status.replace('_', ' ')}.`,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminOperationsQueryKeys.bookings() }),
        queryClient.invalidateQueries({ queryKey: adminOperationsQueryKeys.bookingDetail(accessToken, updated.id) }),
      ]);
    },
    onError: (error) => {
      toast({
        title: 'Unable to save booking changes',
        description: error.message,
      });
    },
  });

  const handleSave = () => {
    if (!selectedId) return;
    updateMutation.mutate({
      bookingRequestId: selectedId,
      input: {
        status: draftStatus,
        assignedAdminUserId: draftAssigneeId === 'unassigned' ? null : draftAssigneeId,
        internalNotes: normalizedNotes || null,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-2xl font-bold">{totalBookings}</CardContent>
        </Card>
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status}>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground capitalize">{status}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-2xl font-bold">{count}</CardContent>
          </Card>
        ))}
      </div>

      {/* Status Chips */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
          className="rounded-full"
        >
          All
        </Button>
        {bookingRequestStatusOptions.map((option) => (
          <Button
            key={option.value}
            variant={statusFilter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(option.value as BookingRequestAdminStatus)}
            className="rounded-full"
          >
            {option.label}
          </Button>
        ))}
      </div>
      
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Booking requests</CardTitle>
            <CardDescription>Search by guest, package, nationality, email, or phone.</CardDescription>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1.5fr)_200px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search bookings"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                />
              </div>
              <Select value={assignedFilter} onValueChange={(value) => setAssignedFilter(value as AdminAssignmentFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="Assignment" />
                </SelectTrigger>
                <SelectContent>
                  {assignmentFilterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {listQuery.isPending ? (
              <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-muted-foreground">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Loading booking requests...
              </div>
            ) : items.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const statusLabel =
                      bookingRequestStatusOptions.find((option) => option.value === item.status)?.label ?? item.status;
                    return (
                      <TableRow
                        key={item.id}
                        className={cn('cursor-pointer', selectedId === item.id && 'bg-muted')}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">{item.customerName}</p>
                            <p className="text-xs text-muted-foreground">{item.customerEmail}</p>
                            <p className="text-xs text-muted-foreground">{item.customerPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">{item.packageTitleEn}</p>
                            <p className="text-xs text-muted-foreground">{item.customerNationality}</p>
                            <p className="text-xs text-muted-foreground">{truncateAdminText(item.internalNotes, 48)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <OperationStatusBadge label={statusLabel} status={item.status} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.assignedAdmin?.fullName || item.assignedAdmin?.email || 'Unassigned'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatAdminDateTime(item.updatedAt)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-lg border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
                No booking requests match the current filters.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking detail</CardTitle>
            <CardDescription>Select a booking to update status, assignment, and notes.</CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedId ? (
              <div className="rounded-lg border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
                Choose a booking request from the list to begin.
              </div>
            ) : detailQuery.isPending ? (
              <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-muted-foreground">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Loading booking detail...
              </div>
            ) : detail ? (
              <div className="space-y-6">
                <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                      {detail.customerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{detail.customerName}</p>
                      <p className="text-sm text-muted-foreground">{detail.customerEmail}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">Phone</p>
                      <p className="text-sm text-foreground">{detail.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">Nationality</p>
                      <p className="text-sm text-foreground">{detail.customerNationality}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">Trip</p>
                      <p className="text-sm text-foreground">{detail.packageTitleEn}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">Group Size</p>
                      <p className="text-sm text-foreground">{detail.adultsCount} adults · {detail.childrenCount} kids</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Status</label>
                    <Select value={draftStatus} onValueChange={(value) => setDraftStatus(value as BookingRequestAdminStatus)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bookingRequestStatusOptions.map((statusOption) => (
                          <SelectItem key={statusOption.value} value={statusOption.value}>
                            {statusOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Assignee</label>
                    <Select value={draftAssigneeId} onValueChange={setDraftAssigneeId}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {assigneeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Internal notes</label>
                    <Textarea
                      placeholder="Capture outreach progress, next steps, or supplier follow-up."
                      value={draftNotes}
                      onChange={(event) => setDraftNotes(event.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button disabled={!isDirty || updateMutation.isPending} onClick={handleSave}>
                    {updateMutation.isPending ? 'Saving...' : 'Save changes'}
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={!detail || updateMutation.isPending}
                    onClick={() => {
                      if (!detail) return;
                      setDraftStatus(detail.status);
                      setDraftAssigneeId(detail.assignedAdmin?.id ?? 'unassigned');
                      setDraftNotes(detail.internalNotes ?? '');
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
                Unable to load this booking request.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminBookingsPage;
