import type {
  BookingRequestAdminStatus,
  ContactInquiryAdminStatus,
} from '@/api/types';

export const bookingRequestStatusOptions: Array<{
  label: string;
  value: BookingRequestAdminStatus;
}> = [
  { value: 'received', label: 'Received' },
  { value: 'in_review', label: 'In review' },
  { value: 'responded', label: 'Responded' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'spam', label: 'Spam' },
];

export const contactInquiryStatusOptions: Array<{
  label: string;
  value: ContactInquiryAdminStatus;
}> = [
  { value: 'received', label: 'Received' },
  { value: 'in_review', label: 'In review' },
  { value: 'responded', label: 'Responded' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'spam', label: 'Spam' },
];

const statusToneClasses: Record<string, string> = {
  received: 'border-slate-300 bg-slate-100 text-slate-800',
  in_review: 'border-amber-300 bg-amber-100 text-amber-900',
  responded: 'border-blue-300 bg-blue-100 text-blue-900',
  confirmed: 'border-emerald-300 bg-emerald-100 text-emerald-900',
  completed: 'border-emerald-300 bg-emerald-100 text-emerald-900',
  resolved: 'border-emerald-300 bg-emerald-100 text-emerald-900',
  cancelled: 'border-rose-300 bg-rose-100 text-rose-900',
  spam: 'border-zinc-300 bg-zinc-100 text-zinc-900',
};

export const getAdminOperationStatusClassName = (status: string) =>
  statusToneClasses[status] ?? 'border-border bg-muted text-foreground';

export const formatAdminDateTime = (value: string | null | undefined) => {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const truncateAdminText = (value: string | null | undefined, maxLength = 96) => {
  if (!value) {
    return '—';
  }

  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
};
