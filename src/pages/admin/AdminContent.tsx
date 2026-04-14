import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  BookOpenText,
  FileStack,
  Globe2,
  Layers3,
  MapPinned,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { getApiErrorMessage } from '@/api/errors';
import {
  adminContentQueryKeys,
  useAdminBlogPostsQuery,
  useAdminDestinationsQuery,
  useAdminPagesQuery,
  useAdminSafariPackagesQuery,
  useCreateAdminBlogPostMutation,
  useCreateAdminDestinationMutation,
  useCreateAdminPageMutation,
  useCreateAdminSafariPackageMutation,
  useDeleteAdminBlogPostMutation,
  useDeleteAdminDestinationMutation,
  useDeleteAdminPageMutation,
  useDeleteAdminSafariPackageMutation,
  useUpdateAdminBlogPostMutation,
  useUpdateAdminDestinationMutation,
  useUpdateAdminPageMutation,
  useUpdateAdminSafariPackageMutation,
} from '@/api/queries';
import type {
  ApiLocale,
  BlogCategory,
  BlogPostAdminInput,
  BlogPostAdminRecord,
  ContentPageAdminCreateInput,
  ContentPageAdminRecord,
  ContentPageAdminUpdateInput,
  ContentSectionAdminInput,
  ContentStatus,
  DestinationAdminInput,
  DestinationAdminRecord,
  DestinationCountry,
  DestinationExperience,
  SafariPackageAdminInput,
  SafariPackageAdminRecord,
  SafariPackageCategory,
} from '@/api/types';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const locales: ApiLocale[] = ['en', 'de', 'it'];
const contentTabs = ['safaris', 'blog', 'destinations', 'pages'] as const;
type ContentTab = (typeof contentTabs)[number];

const statusOptions: Array<{ value: ContentStatus; label: string }> = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const safariCategoryOptions: Array<{ value: SafariPackageCategory; label: string }> = [
  { value: 'excursion', label: 'Excursion' },
  { value: 'jeep-safari', label: 'Jeep safari' },
  { value: 'fly-in-safari', label: 'Fly-in safari' },
];

const blogCategoryOptions: Array<{ value: BlogCategory; label: string }> = [
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'travel-tips', label: 'Travel tips' },
  { value: 'destinations', label: 'Destinations' },
  { value: 'photography', label: 'Photography' },
  { value: 'culture', label: 'Culture' },
  { value: 'beach', label: 'Beach' },
  { value: 'conservation', label: 'Conservation' },
];

const destinationCountryOptions: Array<{ value: DestinationCountry; label: string }> = [
  { value: 'kenya', label: 'Kenya' },
  { value: 'tanzania', label: 'Tanzania' },
];

const destinationExperienceOptions: Array<{ value: DestinationExperience; label: string }> = [
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'coast', label: 'Coast & islands' },
  { value: 'culture', label: 'Culture & cities' },
  { value: 'mountains', label: 'Mountains & trails' },
];

interface BlogFormState extends Omit<BlogPostAdminInput, 'publishedAt'> {
  publishedAt: string;
}

interface PageSectionFormState extends Omit<ContentSectionAdminInput, 'payloadTranslations'> {
  payloadTranslationsText: Record<ApiLocale, string>;
}

interface PageFormState {
  key: string;
  routePath: string;
  status: ContentStatus;
  titleTranslations: Record<ApiLocale, string>;
  sections: PageSectionFormState[];
}

const createEmptyLocaleStrings = (): Record<ApiLocale, string> => ({
  en: '',
  de: '',
  it: '',
});

const createEmptySafariForm = (): SafariPackageAdminInput => ({
  slug: '',
  category: 'excursion',
  featured: false,
  active: true,
  sortOrder: 0,
  titleTranslations: createEmptyLocaleStrings(),
  descriptionTranslations: createEmptyLocaleStrings(),
  highlightsTranslations: { en: [], de: [], it: [] },
  priceNoteTranslations: {},
  durationDays: 1,
  durationLabelEn: '1 Day',
  minGroupSize: 2,
  groupSizeLabelEn: '2+ People',
  location: '',
  priceAmount: 0,
  priceCurrency: 'EUR',
  rating: 4.5,
  reviewsCount: 0,
  imageKey: '',
  imageUrl: '',
});

const createEmptyBlogForm = (): BlogFormState => ({
  slug: '',
  status: 'draft',
  featured: false,
  sortOrder: 0,
  categoryKey: 'wildlife',
  authorName: '',
  imageKey: '',
  publishedAt: '',
  readTimeMinutes: 5,
  titleTranslations: createEmptyLocaleStrings(),
  excerptTranslations: createEmptyLocaleStrings(),
  contentTranslations: createEmptyLocaleStrings(),
});

const createEmptyDestinationForm = (): DestinationAdminInput => ({
  slug: '',
  status: 'draft',
  featured: false,
  sortOrder: 0,
  country: 'kenya',
  experienceKeys: [],
  imageKey: '',
  nameTranslations: createEmptyLocaleStrings(),
  descriptionTranslations: createEmptyLocaleStrings(),
});

const createEmptySectionForm = (): PageSectionFormState => ({
  key: '',
  type: '',
  status: 'draft',
  sortOrder: 0,
  payloadTranslationsText: {
    en: '{}',
    de: '{}',
    it: '{}',
  },
});

const createEmptyPageForm = (): PageFormState => ({
  key: '',
  routePath: '',
  status: 'draft',
  titleTranslations: createEmptyLocaleStrings(),
  sections: [createEmptySectionForm()],
});

const joinLines = (value: string[]) => value.join('\n');
const splitLines = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const toDateTimeLocalInput = (value?: string | null) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 16);
};

const toIsoDateTime = (value: string) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

const formatTimestamp = (value?: string | null) =>
  value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';

const statusBadgeVariant = (status: ContentStatus) => {
  if (status === 'published') {
    return 'default';
  }

  if (status === 'archived') {
    return 'secondary';
  }

  return 'outline';
};

const activeBadgeVariant = (active: boolean) => (active ? 'default' : 'secondary');

const badgeLabelForStatus = (status: ContentStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const toSafariForm = (record: SafariPackageAdminRecord): SafariPackageAdminInput => ({
  slug: record.slug,
  category: record.category,
  featured: record.featured,
  active: record.active,
  sortOrder: record.sortOrder,
  titleTranslations: { ...record.titleTranslations },
  descriptionTranslations: { ...record.descriptionTranslations },
  highlightsTranslations: {
    en: [...record.highlightsTranslations.en],
    de: [...record.highlightsTranslations.de],
    it: [...record.highlightsTranslations.it],
  },
  priceNoteTranslations: { ...record.priceNoteTranslations },
  durationDays: record.durationDays,
  durationLabelEn: record.durationLabelEn,
  minGroupSize: record.minGroupSize,
  groupSizeLabelEn: record.groupSizeLabelEn,
  location: record.location,
  priceAmount: record.priceAmount,
  priceCurrency: record.priceCurrency,
  rating: record.rating,
  reviewsCount: record.reviewsCount,
  imageKey: record.imageKey,
  imageUrl: record.imageUrl,
});

const toBlogForm = (record: BlogPostAdminRecord): BlogFormState => ({
  slug: record.slug,
  status: record.status,
  featured: record.featured,
  sortOrder: record.sortOrder,
  categoryKey: record.categoryKey,
  authorName: record.authorName,
  imageKey: record.imageKey,
  publishedAt: toDateTimeLocalInput(record.publishedAt),
  readTimeMinutes: record.readTimeMinutes,
  titleTranslations: { ...record.titleTranslations },
  excerptTranslations: { ...record.excerptTranslations },
  contentTranslations: { ...record.contentTranslations },
});

const toDestinationForm = (record: DestinationAdminRecord): DestinationAdminInput => ({
  slug: record.slug,
  status: record.status,
  featured: record.featured,
  sortOrder: record.sortOrder,
  country: record.country,
  experienceKeys: [...record.experienceKeys],
  imageKey: record.imageKey,
  nameTranslations: { ...record.nameTranslations },
  descriptionTranslations: { ...record.descriptionTranslations },
});

const toPageForm = (record: ContentPageAdminRecord): PageFormState => ({
  key: record.key,
  routePath: record.routePath,
  status: record.status,
  titleTranslations: { ...record.titleTranslations },
  sections: record.sections.map((section) => ({
    key: section.key,
    type: section.type,
    status: section.status,
    sortOrder: section.sortOrder,
    payloadTranslationsText: {
      en: JSON.stringify(section.payloadTranslations.en ?? {}, null, 2),
      de: JSON.stringify(section.payloadTranslations.de ?? {}, null, 2),
      it: JSON.stringify(section.payloadTranslations.it ?? {}, null, 2),
    },
  })),
});

const toBlogPayload = (form: BlogFormState): BlogPostAdminInput => ({
  ...form,
  publishedAt: toIsoDateTime(form.publishedAt),
});

const toPagePayload = (
  form: PageFormState,
): ContentPageAdminCreateInput | ContentPageAdminUpdateInput => ({
  key: form.key,
  routePath: form.routePath,
  status: form.status,
  titleTranslations: form.titleTranslations,
  sections: form.sections.map((section) => ({
    key: section.key,
    type: section.type,
    status: section.status,
    sortOrder: section.sortOrder,
    payloadTranslations: locales.reduce<Record<ApiLocale, Record<string, unknown>>>((accumulator, locale) => {
      accumulator[locale] = JSON.parse(section.payloadTranslationsText[locale] || '{}') as Record<string, unknown>;
      return accumulator;
    }, { en: {}, de: {}, it: {} }),
  })),
});

const ManagementShell = ({
  title,
  description,
  filters,
  list,
  editor,
}: {
  title: string;
  description: string;
  filters: ReactNode;
  list: ReactNode;
  editor: ReactNode;
}) => (
  <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{filters}</CardContent>
      </Card>
      {list}
    </div>
    {editor}
  </div>
);

const LocaleFieldset = ({
  label,
  values,
  onChange,
  textarea = false,
  rows = 5,
  placeholder,
}: {
  label: string;
  values: Record<ApiLocale, string>;
  onChange: (locale: ApiLocale, nextValue: string) => void;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
}) => (
  <div className="space-y-3">
    <div>
      <h4 className="text-sm font-medium text-foreground">{label}</h4>
      <p className="text-xs text-muted-foreground">English is required. German and Italian are optional.</p>
    </div>
    <div className="grid gap-3 md:grid-cols-3">
      {locales.map((locale) => (
        <div key={locale} className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {locale}
          </label>
          {textarea ? (
            <Textarea
              rows={rows}
              value={values[locale]}
              placeholder={placeholder}
              onChange={(event) => onChange(locale, event.target.value)}
            />
          ) : (
            <Input
              value={values[locale]}
              placeholder={placeholder}
              onChange={(event) => onChange(locale, event.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

const LocaleLinesFieldset = ({
  label,
  values,
  onChange,
}: {
  label: string;
  values: Record<ApiLocale, string[]>;
  onChange: (locale: ApiLocale, nextValue: string[]) => void;
}) => (
  <div className="space-y-3">
    <div>
      <h4 className="text-sm font-medium text-foreground">{label}</h4>
      <p className="text-xs text-muted-foreground">One line per item.</p>
    </div>
    <div className="grid gap-3 md:grid-cols-3">
      {locales.map((locale) => (
        <div key={locale} className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {locale}
          </label>
          <Textarea
            rows={5}
            value={joinLines(values[locale] ?? [])}
            onChange={(event) => onChange(locale, splitLines(event.target.value))}
          />
        </div>
      ))}
    </div>
  </div>
);

const BooleanToggle = ({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}) => (
  <label className="flex items-start gap-3 rounded-md border px-3 py-3 text-sm">
    <input
      type="checkbox"
      className="mt-0.5 h-4 w-4 rounded border"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span className="space-y-1">
      <span className="block font-medium text-foreground">{label}</span>
      {description ? <span className="block text-muted-foreground">{description}</span> : null}
    </span>
  </label>
);

const ListStateCard = ({
  title,
  count,
  action,
  children,
}: {
  title: string;
  count: number;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-start justify-between space-y-0">
      <div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{count} items</CardDescription>
      </div>
      {action}
    </CardHeader>
    <CardContent className="space-y-3">{children}</CardContent>
  </Card>
);

const EmptyListState = ({ label }: { label: string }) => (
  <div className="rounded-md border border-dashed px-4 py-6 text-sm text-muted-foreground">{label}</div>
);

const AdminContentPage = () => {
  const { accessToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = useMemo<ContentTab>(() => {
    const requestedTab = searchParams.get('tab');
    return contentTabs.includes(requestedTab as ContentTab) ? (requestedTab as ContentTab) : 'safaris';
  }, [searchParams]);

  if (!accessToken) {
    return null;
  }

  const invalidateAdminContent = () =>
    queryClient.invalidateQueries({
      queryKey: adminContentQueryKeys.all,
    });

  const showSuccess = (title: string, description: string) => {
    toast({ title, description });
    void invalidateAdminContent();
  };

  const showError = (title: string, error: unknown) => {
    toast({
      title,
      description: getApiErrorMessage(error) || 'Please review the entered data and try again.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Layers3 className="h-6 w-6 text-primary" />
              Content management
            </CardTitle>
            <CardDescription>
              Staff can manage safari packages, editorial content, destinations, and reusable homepage/services sections
              from one workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-md border px-3 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Safari packages</p>
              <p className="mt-1 text-sm text-muted-foreground">Create, update, and retire package inventory.</p>
            </div>
            <div className="rounded-md border px-3 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Blog posts</p>
              <p className="mt-1 text-sm text-muted-foreground">Plan editorial status, authorship, and translations.</p>
            </div>
            <div className="rounded-md border px-3 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Destinations</p>
              <p className="mt-1 text-sm text-muted-foreground">Organize featured regions, countries, and experiences.</p>
            </div>
            <div className="rounded-md border px-3 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Page sections</p>
              <p className="mt-1 text-sm text-muted-foreground">Edit homepage and services section payloads without hacks.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Workflow notes</CardTitle>
            <CardDescription>Use list filters on the left and edit the selected record on the right.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Safari packages currently use active/inactive state, while blog, destinations, and pages use draft/published/archived.</p>
            <p>Page section payloads are JSON per locale so staff can work against the reusable backend page/section model.</p>
          </CardContent>
        </Card>
      </section>

      <Tabs
        value={tab}
        onValueChange={(nextValue) => setSearchParams({ tab: nextValue })}
        className="space-y-4"
      >
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 md:grid-cols-4">
          <TabsTrigger value="safaris" className="gap-2">
            <MapPinned className="h-4 w-4" />
            Safaris
          </TabsTrigger>
          <TabsTrigger value="blog" className="gap-2">
            <BookOpenText className="h-4 w-4" />
            Blog
          </TabsTrigger>
          <TabsTrigger value="destinations" className="gap-2">
            <Globe2 className="h-4 w-4" />
            Destinations
          </TabsTrigger>
          <TabsTrigger value="pages" className="gap-2">
            <FileStack className="h-4 w-4" />
            Homepage & services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="safaris">
          <SafariPackageManager accessToken={accessToken} onError={showError} onSuccess={showSuccess} />
        </TabsContent>

        <TabsContent value="blog">
          <BlogPostManager accessToken={accessToken} onError={showError} onSuccess={showSuccess} />
        </TabsContent>

        <TabsContent value="destinations">
          <DestinationManager accessToken={accessToken} onError={showError} onSuccess={showSuccess} />
        </TabsContent>

        <TabsContent value="pages">
          <PageContentManager accessToken={accessToken} onError={showError} onSuccess={showSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const SafariPackageManager = ({
  accessToken,
  onError,
  onSuccess,
}: {
  accessToken: string;
  onError: (title: string, error: unknown) => void;
  onSuccess: (title: string, description: string) => void;
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | SafariPackageCategory>('all');
  const [form, setForm] = useState<SafariPackageAdminInput>(createEmptySafariForm());

  const filters = useMemo(
    () => ({
      category: categoryFilter === 'all' ? undefined : categoryFilter,
      active: activeFilter === 'all' ? undefined : activeFilter === 'active',
    }),
    [activeFilter, categoryFilter],
  );

  const query = useAdminSafariPackagesQuery(accessToken, filters);
  const createMutation = useCreateAdminSafariPackageMutation(accessToken, {
    onSuccess: (record) => {
      setSelectedId(record.id);
      setForm(toSafariForm(record));
      onSuccess('Safari package created', 'The package is ready for further edits or publishing.');
    },
    onError: (error) => onError('Unable to create safari package', error),
  });
  const updateMutation = useUpdateAdminSafariPackageMutation(accessToken, {
    onSuccess: (record) => {
      setSelectedId(record.id);
      setForm(toSafariForm(record));
      onSuccess('Safari package updated', 'Changes were saved successfully.');
    },
    onError: (error) => onError('Unable to update safari package', error),
  });
  const deleteMutation = useDeleteAdminSafariPackageMutation(accessToken, {
    onSuccess: () => {
      setSelectedId(null);
      setForm(createEmptySafariForm());
      onSuccess('Safari package deleted', 'The package was removed from admin inventory.');
    },
    onError: (error) => onError('Unable to delete safari package', error),
  });

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const selectedRecord = query.data?.items.find((item) => item.id === selectedId);
    if (selectedRecord) {
      setForm(toSafariForm(selectedRecord));
    }
  }, [query.data?.items, selectedId]);

  const isEditing = selectedId !== null;

  const handleSave = async () => {
    if (isEditing && selectedId) {
      await updateMutation.mutateAsync({ packageId: selectedId, input: form });
      return;
    }

    await createMutation.mutateAsync(form);
  };

  const handleDelete = async () => {
    if (!selectedId) {
      return;
    }

    if (!window.confirm('Delete this safari package? This cannot be undone.')) {
      return;
    }

    await deleteMutation.mutateAsync(selectedId);
  };

  return (
    <ManagementShell
      title="Safari packages"
      description="Manage package inventory, ordering, translations, pricing, and active status."
      filters={
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Active state</label>
            <Select value={activeFilter} onValueChange={(value) => setActiveFilter(value as typeof activeFilter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All packages</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as typeof categoryFilter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {safariCategoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      list={
        <ListStateCard
          title="Packages"
          count={query.data?.total ?? 0}
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedId(null);
                  setForm(createEmptySafariForm());
                }}
              >
                <Plus className="h-4 w-4" />
                New
              </Button>
            </div>
          }
        >
          {query.isPending ? (
            <p className="text-sm text-muted-foreground">Loading safari packages...</p>
          ) : query.data?.items.length ? (
            query.data.items.map((item) => (
              <button
                type="button"
                key={item.id}
                className="w-full rounded-md border px-4 py-3 text-left transition hover:border-primary"
                onClick={() => {
                  setSelectedId(item.id);
                  setForm(toSafariForm(item));
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{item.titleTranslations.en || item.slug}</p>
                  <div className="flex gap-2">
                    <Badge variant={activeBadgeVariant(item.active)}>{item.active ? 'Active' : 'Inactive'}</Badge>
                    {item.featured ? <Badge variant="outline">Featured</Badge> : null}
                  </div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.location} · {item.priceCurrency} {item.priceAmount}
                </p>
              </button>
            ))
          ) : (
            <EmptyListState label="No safari packages match the selected filters." />
          )}
        </ListStateCard>
      }
      editor={
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit safari package' : 'Create safari package'}</CardTitle>
            <CardDescription>
              Keep translations, pricing, and availability aligned with the backend package model.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input value={form.slug || ''} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm({ ...form, category: value as SafariPackageCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {safariCategoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort order</label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Min group size</label>
                <Input
                  type="number"
                  value={form.minGroupSize}
                  onChange={(event) => setForm({ ...form, minGroupSize: Number(event.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <BooleanToggle
                label="Featured package"
                description="Marks the package as featured in admin-managed content."
                checked={form.featured}
                onChange={(checked) => setForm({ ...form, featured: checked })}
              />
              <BooleanToggle
                label="Active package"
                description="Inactive packages remain in admin history but are hidden from public package endpoints."
                checked={form.active}
                onChange={(checked) => setForm({ ...form, active: checked })}
              />
            </div>

            <LocaleFieldset
              label="Title translations"
              values={form.titleTranslations}
              onChange={(locale, nextValue) =>
                setForm({
                  ...form,
                  titleTranslations: { ...form.titleTranslations, [locale]: nextValue },
                })
              }
            />

            <LocaleFieldset
              label="Description translations"
              values={form.descriptionTranslations}
              textarea
              rows={4}
              onChange={(locale, nextValue) =>
                setForm({
                  ...form,
                  descriptionTranslations: { ...form.descriptionTranslations, [locale]: nextValue },
                })
              }
            />

            <LocaleLinesFieldset
              label="Highlights translations"
              values={form.highlightsTranslations}
              onChange={(locale, nextValue) =>
                setForm({
                  ...form,
                  highlightsTranslations: { ...form.highlightsTranslations, [locale]: nextValue },
                })
              }
            />

            <LocaleFieldset
              label="Price note translations"
              values={{
                en: form.priceNoteTranslations.en || '',
                de: form.priceNoteTranslations.de || '',
                it: form.priceNoteTranslations.it || '',
              }}
              onChange={(locale, nextValue) =>
                setForm({
                  ...form,
                  priceNoteTranslations: { ...form.priceNoteTranslations, [locale]: nextValue },
                })
              }
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration days</label>
                <Input
                  type="number"
                  step="0.5"
                  value={form.durationDays}
                  onChange={(event) => setForm({ ...form, durationDays: Number(event.target.value) || 0.5 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration label (EN)</label>
                <Input
                  value={form.durationLabelEn}
                  onChange={(event) => setForm({ ...form, durationLabelEn: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Group size label (EN)</label>
                <Input
                  value={form.groupSizeLabelEn}
                  onChange={(event) => setForm({ ...form, groupSizeLabelEn: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price currency</label>
                <Input
                  value={form.priceCurrency}
                  onChange={(event) => setForm({ ...form, priceCurrency: event.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price amount</label>
                <Input
                  type="number"
                  value={form.priceAmount}
                  onChange={(event) => setForm({ ...form, priceAmount: Number(event.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.rating}
                  onChange={(event) => setForm({ ...form, rating: Number(event.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reviews count</label>
                <Input
                  type="number"
                  value={form.reviewsCount}
                  onChange={(event) => setForm({ ...form, reviewsCount: Number(event.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Image key</label>
                <Input value={form.imageKey} onChange={(event) => setForm({ ...form, imageKey: event.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <Input value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-3 border-t pt-4">
              <div className="text-xs text-muted-foreground">
                {isEditing ? `Last updated ${formatTimestamp(query.data?.items.find((item) => item.id === selectedId)?.updatedAt)}` : 'Create a new safari package record.'}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <Button variant="outline" onClick={() => void handleDelete()} disabled={deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                ) : null}
                <Button onClick={() => void handleSave()} disabled={createMutation.isPending || updateMutation.isPending}>
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Save package' : 'Create package'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    />
  );
};

const BlogPostManager = ({
  accessToken,
  onError,
  onSuccess,
}: {
  accessToken: string;
  onError: (title: string, error: unknown) => void;
  onSuccess: (title: string, description: string) => void;
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | ContentStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | BlogCategory>('all');
  const [form, setForm] = useState<BlogFormState>(createEmptyBlogForm());

  const filters = useMemo(
    () => ({
      status: statusFilter === 'all' ? undefined : statusFilter,
      category: categoryFilter === 'all' ? undefined : categoryFilter,
    }),
    [categoryFilter, statusFilter],
  );

  const query = useAdminBlogPostsQuery(accessToken, filters);
  const createMutation = useCreateAdminBlogPostMutation(accessToken, {
    onSuccess: (record) => {
      setSelectedId(record.id);
      setForm(toBlogForm(record));
      onSuccess('Blog post created', 'The draft is ready for editorial review.');
    },
    onError: (error) => onError('Unable to create blog post', error),
  });
  const updateMutation = useUpdateAdminBlogPostMutation(accessToken, {
    onSuccess: (record) => {
      setSelectedId(record.id);
      setForm(toBlogForm(record));
      onSuccess('Blog post updated', 'Editorial changes were saved.');
    },
    onError: (error) => onError('Unable to update blog post', error),
  });
  const deleteMutation = useDeleteAdminBlogPostMutation(accessToken, {
    onSuccess: () => {
      setSelectedId(null);
      setForm(createEmptyBlogForm());
      onSuccess('Blog post deleted', 'The post was removed from admin content.');
    },
    onError: (error) => onError('Unable to delete blog post', error),
  });

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const selectedRecord = query.data?.items.find((item) => item.id === selectedId);
    if (selectedRecord) {
      setForm(toBlogForm(selectedRecord));
    }
  }, [query.data?.items, selectedId]);

  const isEditing = selectedId !== null;

  const handleSave = async () => {
    const payload = toBlogPayload(form);

    if (isEditing && selectedId) {
      await updateMutation.mutateAsync({ postId: selectedId, input: payload });
      return;
    }

    await createMutation.mutateAsync(payload);
  };

  const handleDelete = async () => {
    if (!selectedId) {
      return;
    }

    if (!window.confirm('Delete this blog post? This cannot be undone.')) {
      return;
    }

    await deleteMutation.mutateAsync(selectedId);
  };

  return (
    <ManagementShell
      title="Blog posts"
      description="Track editorial status, localized copy, authors, and publishing metadata."
      filters={
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as typeof categoryFilter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {blogCategoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      list={
        <ListStateCard
          title="Posts"
          count={query.data?.total ?? 0}
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedId(null);
                  setForm(createEmptyBlogForm());
                }}
              >
                <Plus className="h-4 w-4" />
                New
              </Button>
            </div>
          }
        >
          {query.isPending ? (
            <p className="text-sm text-muted-foreground">Loading blog posts...</p>
          ) : query.data?.items.length ? (
            query.data.items.map((item) => (
              <button
                type="button"
                key={item.id}
                className="w-full rounded-md border px-4 py-3 text-left transition hover:border-primary"
                onClick={() => {
                  setSelectedId(item.id);
                  setForm(toBlogForm(item));
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{item.titleTranslations.en || item.slug}</p>
                  <div className="flex gap-2">
                    <Badge variant={statusBadgeVariant(item.status)}>{badgeLabelForStatus(item.status)}</Badge>
                    {item.featured ? <Badge variant="outline">Featured</Badge> : null}
                  </div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.authorName} · {item.categoryKey} · {formatTimestamp(item.publishedAt)}
                </p>
              </button>
            ))
          ) : (
            <EmptyListState label="No blog posts match the selected filters." />
          )}
        </ListStateCard>
      }
      editor={
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit blog post' : 'Create blog post'}</CardTitle>
            <CardDescription>Draft, publish, or archive localized editorial content.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input value={form.slug || ''} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as ContentStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={form.categoryKey}
                  onValueChange={(value) => setForm({ ...form, categoryKey: value as BlogCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {blogCategoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort order</label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Author</label>
                <Input
                  value={form.authorName}
                  onChange={(event) => setForm({ ...form, authorName: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image key</label>
                <Input value={form.imageKey} onChange={(event) => setForm({ ...form, imageKey: event.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Read time (minutes)</label>
                <Input
                  type="number"
                  value={form.readTimeMinutes}
                  onChange={(event) => setForm({ ...form, readTimeMinutes: Number(event.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Published at</label>
                <Input
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(event) => setForm({ ...form, publishedAt: event.target.value })}
                />
              </div>
            </div>

            <BooleanToggle
              label="Featured story"
              description="Highlights this post in featured editorial surfaces."
              checked={form.featured}
              onChange={(checked) => setForm({ ...form, featured: checked })}
            />

            <LocaleFieldset
              label="Title translations"
              values={form.titleTranslations}
              onChange={(locale, nextValue) =>
                setForm({ ...form, titleTranslations: { ...form.titleTranslations, [locale]: nextValue } })
              }
            />

            <LocaleFieldset
              label="Excerpt translations"
              values={form.excerptTranslations}
              textarea
              rows={4}
              onChange={(locale, nextValue) =>
                setForm({ ...form, excerptTranslations: { ...form.excerptTranslations, [locale]: nextValue } })
              }
            />

            <LocaleFieldset
              label="Body translations"
              values={form.contentTranslations}
              textarea
              rows={12}
              onChange={(locale, nextValue) =>
                setForm({ ...form, contentTranslations: { ...form.contentTranslations, [locale]: nextValue } })
              }
            />

            <div className="flex flex-wrap justify-between gap-3 border-t pt-4">
              <div className="text-xs text-muted-foreground">
                {isEditing
                  ? `Last updated ${formatTimestamp(query.data?.items.find((item) => item.id === selectedId)?.updatedAt)}`
                  : 'Create a new editorial record.'}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <Button variant="outline" onClick={() => void handleDelete()} disabled={deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                ) : null}
                <Button onClick={() => void handleSave()} disabled={createMutation.isPending || updateMutation.isPending}>
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Save post' : 'Create post'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    />
  );
};

const DestinationManager = ({
  accessToken,
  onError,
  onSuccess,
}: {
  accessToken: string;
  onError: (title: string, error: unknown) => void;
  onSuccess: (title: string, description: string) => void;
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | ContentStatus>('all');
  const [countryFilter, setCountryFilter] = useState<'all' | DestinationCountry>('all');
  const [form, setForm] = useState<DestinationAdminInput>(createEmptyDestinationForm());

  const filters = useMemo(
    () => ({
      status: statusFilter === 'all' ? undefined : statusFilter,
      country: countryFilter === 'all' ? undefined : countryFilter,
    }),
    [countryFilter, statusFilter],
  );

  const query = useAdminDestinationsQuery(accessToken, filters);
  const createMutation = useCreateAdminDestinationMutation(accessToken, {
    onSuccess: (record) => {
      setSelectedId(record.id);
      setForm(toDestinationForm(record));
      onSuccess('Destination created', 'The destination is ready for editorial review.');
    },
    onError: (error) => onError('Unable to create destination', error),
  });
  const updateMutation = useUpdateAdminDestinationMutation(accessToken, {
    onSuccess: (record) => {
      setSelectedId(record.id);
      setForm(toDestinationForm(record));
      onSuccess('Destination updated', 'Destination changes were saved.');
    },
    onError: (error) => onError('Unable to update destination', error),
  });
  const deleteMutation = useDeleteAdminDestinationMutation(accessToken, {
    onSuccess: () => {
      setSelectedId(null);
      setForm(createEmptyDestinationForm());
      onSuccess('Destination deleted', 'The destination was removed from admin content.');
    },
    onError: (error) => onError('Unable to delete destination', error),
  });

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const selectedRecord = query.data?.items.find((item) => item.id === selectedId);
    if (selectedRecord) {
      setForm(toDestinationForm(selectedRecord));
    }
  }, [query.data?.items, selectedId]);

  const isEditing = selectedId !== null;

  const handleSave = async () => {
    if (isEditing && selectedId) {
      await updateMutation.mutateAsync({ destinationId: selectedId, input: form });
      return;
    }

    await createMutation.mutateAsync(form);
  };

  const handleDelete = async () => {
    if (!selectedId) {
      return;
    }

    if (!window.confirm('Delete this destination? This cannot be undone.')) {
      return;
    }

    await deleteMutation.mutateAsync(selectedId);
  };

  return (
    <ManagementShell
      title="Destinations"
      description="Manage destination copy, ordering, featured status, and experience tags."
      filters={
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Select value={countryFilter} onValueChange={(value) => setCountryFilter(value as typeof countryFilter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                {destinationCountryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      list={
        <ListStateCard
          title="Destinations"
          count={query.data?.total ?? 0}
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedId(null);
                  setForm(createEmptyDestinationForm());
                }}
              >
                <Plus className="h-4 w-4" />
                New
              </Button>
            </div>
          }
        >
          {query.isPending ? (
            <p className="text-sm text-muted-foreground">Loading destinations...</p>
          ) : query.data?.items.length ? (
            query.data.items.map((item) => (
              <button
                type="button"
                key={item.id}
                className="w-full rounded-md border px-4 py-3 text-left transition hover:border-primary"
                onClick={() => {
                  setSelectedId(item.id);
                  setForm(toDestinationForm(item));
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{item.nameTranslations.en || item.slug}</p>
                  <div className="flex gap-2">
                    <Badge variant={statusBadgeVariant(item.status)}>{badgeLabelForStatus(item.status)}</Badge>
                    {item.featured ? <Badge variant="outline">Featured</Badge> : null}
                  </div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.country} · {item.experienceKeys.join(', ') || 'No experiences tagged'}
                </p>
              </button>
            ))
          ) : (
            <EmptyListState label="No destinations match the selected filters." />
          )}
        </ListStateCard>
      }
      editor={
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit destination' : 'Create destination'}</CardTitle>
            <CardDescription>Control destination lifecycle, featured placement, and localized summaries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input value={form.slug || ''} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as ContentStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Select
                  value={form.country}
                  onValueChange={(value) => setForm({ ...form, country: value as DestinationCountry })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {destinationCountryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort order</label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) || 0 })}
                />
              </div>
            </div>

            <BooleanToggle
              label="Featured destination"
              description="Marks the destination for featured destination placements."
              checked={form.featured}
              onChange={(checked) => setForm({ ...form, featured: checked })}
            />

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-foreground">Experience tags</h4>
                <p className="text-xs text-muted-foreground">Select the experiences that apply to this destination.</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {destinationExperienceOptions.map((option) => (
                  <BooleanToggle
                    key={option.value}
                    label={option.label}
                    checked={form.experienceKeys.includes(option.value)}
                    onChange={(checked) =>
                      setForm({
                        ...form,
                        experienceKeys: checked
                          ? [...form.experienceKeys, option.value]
                          : form.experienceKeys.filter((value) => value !== option.value),
                      })
                    }
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image key</label>
              <Input value={form.imageKey} onChange={(event) => setForm({ ...form, imageKey: event.target.value })} />
            </div>

            <LocaleFieldset
              label="Name translations"
              values={form.nameTranslations}
              onChange={(locale, nextValue) =>
                setForm({ ...form, nameTranslations: { ...form.nameTranslations, [locale]: nextValue } })
              }
            />

            <LocaleFieldset
              label="Description translations"
              values={form.descriptionTranslations}
              textarea
              rows={5}
              onChange={(locale, nextValue) =>
                setForm({
                  ...form,
                  descriptionTranslations: { ...form.descriptionTranslations, [locale]: nextValue },
                })
              }
            />

            <div className="flex flex-wrap justify-between gap-3 border-t pt-4">
              <div className="text-xs text-muted-foreground">
                {isEditing
                  ? `Last updated ${formatTimestamp(query.data?.items.find((item) => item.id === selectedId)?.updatedAt)}`
                  : 'Create a new destination record.'}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <Button variant="outline" onClick={() => void handleDelete()} disabled={deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                ) : null}
                <Button onClick={() => void handleSave()} disabled={createMutation.isPending || updateMutation.isPending}>
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Save destination' : 'Create destination'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    />
  );
};

const PageContentManager = ({
  accessToken,
  onError,
  onSuccess,
}: {
  accessToken: string;
  onError: (title: string, error: unknown) => void;
  onSuccess: (title: string, description: string) => void;
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | ContentStatus>('all');
  const [form, setForm] = useState<PageFormState>(createEmptyPageForm());

  const filters = useMemo(
    () => ({
      status: statusFilter === 'all' ? undefined : statusFilter,
    }),
    [statusFilter],
  );

  const query = useAdminPagesQuery(accessToken, filters);
  const createMutation = useCreateAdminPageMutation(accessToken, {
    onSuccess: (record) => {
      setSelectedKey(record.key);
      setForm(toPageForm(record));
      onSuccess('Content page created', 'The reusable page shell and sections were saved.');
    },
    onError: (error) => onError('Unable to create content page', error),
  });
  const updateMutation = useUpdateAdminPageMutation(accessToken, {
    onSuccess: (record) => {
      setSelectedKey(record.key);
      setForm(toPageForm(record));
      onSuccess('Content page updated', 'Page metadata and sections were saved.');
    },
    onError: (error) => onError('Unable to update content page', error),
  });
  const deleteMutation = useDeleteAdminPageMutation(accessToken, {
    onSuccess: () => {
      setSelectedKey(null);
      setForm(createEmptyPageForm());
      onSuccess('Content page deleted', 'The reusable content page was removed.');
    },
    onError: (error) => onError('Unable to delete content page', error),
  });

  useEffect(() => {
    if (!selectedKey) {
      return;
    }

    const selectedRecord = query.data?.items.find((item) => item.key === selectedKey);
    if (selectedRecord) {
      setForm(toPageForm(selectedRecord));
    }
  }, [query.data?.items, selectedKey]);

  const isEditing = selectedKey !== null;

  const handleSave = async () => {
    try {
      const payload = toPagePayload(form);

      if (isEditing && selectedKey) {
        const { key: _ignored, ...updatePayload } = payload;
        await updateMutation.mutateAsync({
          pageKey: selectedKey,
          input: updatePayload,
        });
        return;
      }

      await createMutation.mutateAsync(payload);
    } catch (error) {
      onError('Unable to parse section JSON', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedKey) {
      return;
    }

    if (!window.confirm('Delete this content page and all of its sections?')) {
      return;
    }

    await deleteMutation.mutateAsync(selectedKey);
  };

  return (
    <ManagementShell
      title="Homepage & services content"
      description="Manage reusable page shells and ordered content sections backed by the page/section API model."
      filters={
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      list={
        <ListStateCard
          title="Pages"
          count={query.data?.total ?? 0}
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedKey(null);
                  setForm(createEmptyPageForm());
                }}
              >
                <Plus className="h-4 w-4" />
                New
              </Button>
            </div>
          }
        >
          {query.isPending ? (
            <p className="text-sm text-muted-foreground">Loading content pages...</p>
          ) : query.data?.items.length ? (
            query.data.items.map((item) => (
              <button
                type="button"
                key={item.key}
                className="w-full rounded-md border px-4 py-3 text-left transition hover:border-primary"
                onClick={() => {
                  setSelectedKey(item.key);
                  setForm(toPageForm(item));
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{item.titleTranslations.en || item.key}</p>
                  <Badge variant={statusBadgeVariant(item.status)}>{badgeLabelForStatus(item.status)}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.routePath} · {item.sections.length} sections
                </p>
              </button>
            ))
          ) : (
            <EmptyListState label="No reusable content pages match the selected filters." />
          )}
        </ListStateCard>
      }
      editor={
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit reusable page' : 'Create reusable page'}</CardTitle>
            <CardDescription>
              Best for homepage and services marketing content that should stay on the shared page/section model.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Page key</label>
                <Input
                  value={form.key}
                  disabled={isEditing}
                  onChange={(event) => setForm({ ...form, key: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Route path</label>
                <Input
                  value={form.routePath}
                  onChange={(event) => setForm({ ...form, routePath: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as ContentStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <LocaleFieldset
              label="Page title translations"
              values={form.titleTranslations}
              onChange={(locale, nextValue) =>
                setForm({ ...form, titleTranslations: { ...form.titleTranslations, [locale]: nextValue } })
              }
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Sections</h4>
                  <p className="text-xs text-muted-foreground">
                    Each section stores a type, status, sort order, and locale-specific JSON payload.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setForm({ ...form, sections: [...form.sections, createEmptySectionForm()] })}
                >
                  <Plus className="h-4 w-4" />
                  Add section
                </Button>
              </div>

              <div className="space-y-4">
                {form.sections.map((section, index) => (
                  <div key={`${section.key}-${index}`} className="rounded-lg border p-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">
                          Section {index + 1} {section.key ? `· ${section.key}` : ''}
                        </p>
                        <p className="text-xs text-muted-foreground">Use structured JSON that matches backend consumers.</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setForm({
                            ...form,
                            sections: form.sections.filter((_, sectionIndex) => sectionIndex !== index),
                          })
                        }
                        disabled={form.sections.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Section key</label>
                        <Input
                          value={section.key}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              sections: form.sections.map((item, sectionIndex) =>
                                sectionIndex === index ? { ...item, key: event.target.value } : item,
                              ),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Section type</label>
                        <Input
                          value={section.type}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              sections: form.sections.map((item, sectionIndex) =>
                                sectionIndex === index ? { ...item, type: event.target.value } : item,
                              ),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select
                          value={section.status}
                          onValueChange={(value) =>
                            setForm({
                              ...form,
                              sections: form.sections.map((item, sectionIndex) =>
                                sectionIndex === index ? { ...item, status: value as ContentStatus } : item,
                              ),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Sort order</label>
                        <Input
                          type="number"
                          value={section.sortOrder}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              sections: form.sections.map((item, sectionIndex) =>
                                sectionIndex === index
                                  ? { ...item, sortOrder: Number(event.target.value) || 0 }
                                  : item,
                              ),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {locales.map((locale) => (
                        <div key={locale} className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {locale} JSON
                          </label>
                          <Textarea
                            rows={12}
                            value={section.payloadTranslationsText[locale]}
                            onChange={(event) =>
                              setForm({
                                ...form,
                                sections: form.sections.map((item, sectionIndex) =>
                                  sectionIndex === index
                                    ? {
                                        ...item,
                                        payloadTranslationsText: {
                                          ...item.payloadTranslationsText,
                                          [locale]: event.target.value,
                                        },
                                      }
                                    : item,
                                ),
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-3 border-t pt-4">
              <div className="text-xs text-muted-foreground">
                {isEditing
                  ? `Last updated ${formatTimestamp(query.data?.items.find((item) => item.key === selectedKey)?.updatedAt)}`
                  : 'Create a reusable page record for homepage/services content.'}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <Button variant="outline" onClick={() => void handleDelete()} disabled={deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                ) : null}
                <Button onClick={() => void handleSave()} disabled={createMutation.isPending || updateMutation.isPending}>
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Save page' : 'Create page'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    />
  );
};

export default AdminContentPage;
