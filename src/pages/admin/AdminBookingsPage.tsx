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

  useEffect(() => {
    if (!items.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !items.some((item) => item.id === selectedId)) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

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
        variant: 'destructive',
      });
    },
  });

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

  const handleSave = () => {
    if (!selectedId) {
      return;
    }

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
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total matching</CardDescription>
            <CardTitle>{listQuery.data?.total ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        {bookingRequestStatusOptions.slice(0, 3).map((statusOption) => (
          <Card key={statusOption.value}>
            <CardHeader className="pb-2">
              <CardDescription>{statusOption.label}</CardDescription>
              <CardTitle>{listQuery.data?.statusCounts?.[statusOption.value] ?? 0}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Booking requests</CardTitle>
            <CardDescription>Search by guest, package, nationality, email, or phone.</CardDescription>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1.5fr)_200px_200px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search bookings"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={allStatusesValue}>All statuses</SelectItem>
                  {bookingRequestStatusOptions.map((statusOption) => (
                    <SelectItem key={statusOption.value} value={statusOption.value}>
                      {statusOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                        data-state={selectedId === item.id ? 'selected' : undefined}
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
                <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <OperationStatusBadge
                      label={bookingRequestStatusOptions.find((option) => option.value === detail.status)?.label ?? detail.status}
                      status={detail.status}
                    />
                    <span className="text-sm text-muted-foreground">Created {formatAdminDateTime(detail.createdAt)}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">Guest</p>
                      <p className="text-sm text-muted-foreground">{detail.customerName}</p>
                      <p className="text-sm text-muted-foreground">{detail.customerEmail}</p>
                      <p className="text-sm text-muted-foreground">{detail.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Trip</p>
                      <p className="text-sm text-muted-foreground">{detail.packageTitleEn}</p>
                      <p className="text-sm text-muted-foreground">
                        {detail.adultsCount ?? '—'} adults · {detail.childrenCount} children
                      </p>
                      <p className="text-sm text-muted-foreground">Nationality: {detail.customerNationality}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Accommodation:</span>{' '}
                      {detail.accommodationPreference || 'Not specified'}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Special requests:</span>{' '}
                      {detail.specialRequests || 'None shared yet'}
                    </p>
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
                    {updateMutation.isPending ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save changes'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!detail || updateMutation.isPending}
                    onClick={() => {
                      if (!detail) {
                        return;
                      }
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
