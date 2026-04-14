import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getAdminOperationStatusClassName } from '@/lib/admin-operations';

interface OperationStatusBadgeProps {
  label: string;
  status: string;
}

const OperationStatusBadge = ({ label, status }: OperationStatusBadgeProps) => (
  <Badge className={cn('border font-medium', getAdminOperationStatusClassName(status))} variant="outline">
    {label}
  </Badge>
);

export default OperationStatusBadge;
