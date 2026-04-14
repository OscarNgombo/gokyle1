import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminSectionPlaceholderProps {
  description: string;
  title: string;
}

const AdminSectionPlaceholder = ({ description, title }: AdminSectionPlaceholderProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      This area is intentionally lightweight for now so future admin tools can plug into the shared protected
      layout.
    </CardContent>
  </Card>
);

export default AdminSectionPlaceholder;
