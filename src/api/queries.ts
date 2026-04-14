import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import {
  createAdminBlogPost,
  createAdminContentPage,
  createAdminDestination,
  createAdminSafariPackage,
  createBookingRequest,
  createContactInquiry,
  deleteAdminBlogPost,
  deleteAdminContentPage,
  deleteAdminDestination,
  deleteAdminSafariPackage,
  getAdminBookingRequest,
  getAdminContactInquiry,
  getCurrentAdminUser,
  getPublicBlogPost,
  getPublicPageContent,
  getSafariPackage,
  listAdminBlogPosts,
  listAdminContentPages,
  listAdminDestinations,
  listAdminSafariPackages,
  listAdminBookingRequests,
  listAdminContactInquiries,
  listPublicBlogPosts,
  listPublicDestinations,
  listSafariPackages,
  loginAdminUser,
  updateAdminBlogPost,
  updateAdminBookingRequest,
  updateAdminContentPage,
  updateAdminDestination,
  updateAdminSafariPackage,
  updateAdminContactInquiry,
} from '@/api/services';
import type {
  AdminLoginInput,
  AdminLoginResponse,
  AdminUser,
  BlogPostDetailResponse,
  BlogPostListFilters,
  BlogPostListResponse,
  BlogCategory,
  BlogPostAdminInput,
  BlogPostAdminListResponse,
  BlogPostAdminRecord,
  BookingRequestAdminDetail,
  BookingRequestAdminListFilters,
  BookingRequestAdminListResponse,
  BookingRequestAdminUpdateInput,
  BookingRequestInput,
  BookingRequestResponse,
  ContactInquiryAdminDetail,
  ContactInquiryAdminListFilters,
  ContactInquiryAdminListResponse,
  ContactInquiryAdminUpdateInput,
  ContactInquiryInput,
  ContactInquiryResponse,
  ContentPageAdminCreateInput,
  PageContentResponse,
  ContentPageAdminListResponse,
  ContentPageAdminRecord,
  ContentPageAdminUpdateInput,
  ContentStatus,
  DestinationDetailResponse,
  DestinationAdminInput,
  DestinationAdminListResponse,
  DestinationAdminRecord,
  DestinationCountry,
  DestinationExperience,
  DestinationListFilters,
  DestinationListResponse,
  SafariPackageDetailResponse,
  SafariPackageAdminInput,
  SafariPackageAdminListResponse,
  SafariPackageAdminRecord,
  SafariPackageCategory,
  SafariPackageId,
  SafariPackageListFilters,
  SafariPackageListResponse,
} from '@/api/types';

const normalizeSafariPackageFilters = (filters: SafariPackageListFilters = {}) => ({
  locale: filters.locale || 'en',
  category: filters.category || null,
  featured: filters.featured ?? null,
});

const normalizeBlogPostFilters = (filters: BlogPostListFilters = {}) => ({
  locale: filters.locale || 'en',
  category: filters.category || null,
  featured: filters.featured ?? null,
});

const normalizeDestinationFilters = (filters: DestinationListFilters = {}) => ({
  locale: filters.locale || 'en',
  country: filters.country || null,
  experience: filters.experience || null,
  featured: filters.featured ?? null,
});

const normalizeAdminBookingFilters = (filters: BookingRequestAdminListFilters = {}) => ({
  assigned: filters.assigned || 'all',
  search: filters.search?.trim() || null,
  status: filters.status || null,
});

const normalizeAdminInquiryFilters = (filters: ContactInquiryAdminListFilters = {}) => ({
  assigned: filters.assigned || 'all',
  search: filters.search?.trim() || null,
  status: filters.status || null,
});

const normalizeAdminSafariFilters = (filters: { category?: SafariPackageCategory; active?: boolean } = {}) => ({
  active: filters.active ?? null,
  category: filters.category || null,
});

const normalizeAdminBlogFilters = (filters: { status?: ContentStatus; category?: BlogCategory } = {}) => ({
  category: filters.category || null,
  status: filters.status || null,
});

const normalizeAdminDestinationFilters = (filters: { status?: ContentStatus; country?: DestinationCountry } = {}) => ({
  country: filters.country || null,
  status: filters.status || null,
});

const normalizeAdminPageFilters = (filters: { status?: ContentStatus } = {}) => ({
  status: filters.status || null,
});

export const authQueryKeys = {
  all: ['auth'] as const,
  me: (accessToken: string | null = null) => [...authQueryKeys.all, 'me', accessToken ?? 'anonymous'] as const,
};

export const safariPackageQueryKeys = {
  all: ['safari-packages'] as const,
  lists: () => [...safariPackageQueryKeys.all, 'list'] as const,
  list: (filters: SafariPackageListFilters = {}) =>
    [...safariPackageQueryKeys.lists(), normalizeSafariPackageFilters(filters)] as const,
  details: () => [...safariPackageQueryKeys.all, 'detail'] as const,
  detail: (packageId: SafariPackageId, locale: SafariPackageListFilters['locale'] = 'en') =>
    [...safariPackageQueryKeys.details(), String(packageId), locale] as const,
};

export const blogPostQueryKeys = {
  all: ['blog-posts'] as const,
  lists: () => [...blogPostQueryKeys.all, 'list'] as const,
  list: (filters: BlogPostListFilters = {}) => [...blogPostQueryKeys.lists(), normalizeBlogPostFilters(filters)] as const,
  details: () => [...blogPostQueryKeys.all, 'detail'] as const,
  detail: (lookup: string, locale: BlogPostListFilters['locale'] = 'en') =>
    [...blogPostQueryKeys.details(), lookup, locale] as const,
};

export const destinationQueryKeys = {
  all: ['destinations'] as const,
  lists: () => [...destinationQueryKeys.all, 'list'] as const,
  list: (filters: DestinationListFilters = {}) => [...destinationQueryKeys.lists(), normalizeDestinationFilters(filters)] as const,
  details: () => [...destinationQueryKeys.all, 'detail'] as const,
  detail: (slug: string, locale: DestinationListFilters['locale'] = 'en') =>
    [...destinationQueryKeys.details(), slug, locale] as const,
};

export const pageContentQueryKeys = {
  all: ['page-content'] as const,
  detail: (pageKey: string, locale: BlogPostListFilters['locale'] = 'en') =>
    [...pageContentQueryKeys.all, pageKey, locale] as const,
};

export const adminOperationsQueryKeys = {
  all: ['admin-operations'] as const,
  bookings: () => [...adminOperationsQueryKeys.all, 'bookings'] as const,
  bookingLists: () => [...adminOperationsQueryKeys.bookings(), 'list'] as const,
  bookingList: (accessToken: string | null | undefined, filters: BookingRequestAdminListFilters = {}) =>
    [...adminOperationsQueryKeys.bookingLists(), accessToken ?? 'anonymous', normalizeAdminBookingFilters(filters)] as const,
  bookingDetails: () => [...adminOperationsQueryKeys.bookings(), 'detail'] as const,
  bookingDetail: (accessToken: string | null | undefined, bookingRequestId: string | null | undefined) =>
    [...adminOperationsQueryKeys.bookingDetails(), accessToken ?? 'anonymous', bookingRequestId ?? 'none'] as const,
  inquiries: () => [...adminOperationsQueryKeys.all, 'inquiries'] as const,
  inquiryLists: () => [...adminOperationsQueryKeys.inquiries(), 'list'] as const,
  inquiryList: (accessToken: string | null | undefined, filters: ContactInquiryAdminListFilters = {}) =>
    [...adminOperationsQueryKeys.inquiryLists(), accessToken ?? 'anonymous', normalizeAdminInquiryFilters(filters)] as const,
  inquiryDetails: () => [...adminOperationsQueryKeys.inquiries(), 'detail'] as const,
  inquiryDetail: (accessToken: string | null | undefined, inquiryId: string | null | undefined) =>
    [...adminOperationsQueryKeys.inquiryDetails(), accessToken ?? 'anonymous', inquiryId ?? 'none'] as const,
};

export const adminContentQueryKeys = {
  all: ['admin-content'] as const,
  safariPackages: () => [...adminContentQueryKeys.all, 'safari-packages'] as const,
  safariPackageList: (accessToken: string | null | undefined, filters: { category?: SafariPackageCategory; active?: boolean } = {}) =>
    [...adminContentQueryKeys.safariPackages(), accessToken ?? 'anonymous', normalizeAdminSafariFilters(filters)] as const,
  blogPosts: () => [...adminContentQueryKeys.all, 'blog-posts'] as const,
  blogPostList: (accessToken: string | null | undefined, filters: { status?: ContentStatus; category?: BlogCategory } = {}) =>
    [...adminContentQueryKeys.blogPosts(), accessToken ?? 'anonymous', normalizeAdminBlogFilters(filters)] as const,
  destinations: () => [...adminContentQueryKeys.all, 'destinations'] as const,
  destinationList: (
    accessToken: string | null | undefined,
    filters: { status?: ContentStatus; country?: DestinationCountry } = {},
  ) => [...adminContentQueryKeys.destinations(), accessToken ?? 'anonymous', normalizeAdminDestinationFilters(filters)] as const,
  pages: () => [...adminContentQueryKeys.all, 'pages'] as const,
  pageList: (accessToken: string | null | undefined, filters: { status?: ContentStatus } = {}) =>
    [...adminContentQueryKeys.pages(), accessToken ?? 'anonymous', normalizeAdminPageFilters(filters)] as const,
};

export const adminMeQueryOptions = (accessToken: string) =>
  queryOptions({
    queryKey: authQueryKeys.me(accessToken),
    queryFn: () => getCurrentAdminUser(accessToken),
    staleTime: 5 * 60 * 1000,
  });

export const adminLoginMutationOptions = () =>
  mutationOptions({
    mutationKey: [...authQueryKeys.all, 'login'] as const,
    mutationFn: (input: AdminLoginInput) => loginAdminUser(input),
  });

export const safariPackagesQueryOptions = (filters: SafariPackageListFilters = {}) =>
  queryOptions({
    queryKey: safariPackageQueryKeys.list(filters),
    queryFn: () => listSafariPackages(filters),
  });

export const safariPackageDetailQueryOptions = (
  packageId: SafariPackageId,
  locale?: SafariPackageListFilters['locale'],
) =>
  queryOptions({
    queryKey: safariPackageQueryKeys.detail(packageId, locale),
    queryFn: () => getSafariPackage(packageId, locale),
  });

export const publicBlogPostsQueryOptions = (filters: BlogPostListFilters = {}) =>
  queryOptions({
    queryKey: blogPostQueryKeys.list(filters),
    queryFn: () => listPublicBlogPosts(filters),
  });

export const publicBlogPostDetailQueryOptions = (lookup: string, locale?: BlogPostListFilters['locale']) =>
  queryOptions({
    queryKey: blogPostQueryKeys.detail(lookup, locale),
    queryFn: () => getPublicBlogPost(lookup, locale),
  });

export const publicDestinationsQueryOptions = (filters: DestinationListFilters = {}) =>
  queryOptions({
    queryKey: destinationQueryKeys.list(filters),
    queryFn: () => listPublicDestinations(filters),
  });

export const publicDestinationDetailQueryOptions = (slug: string, locale?: DestinationListFilters['locale']) =>
  queryOptions({
    queryKey: destinationQueryKeys.detail(slug, locale),
    queryFn: () => getPublicDestination(slug, locale),
  });

export const publicPageContentQueryOptions = (pageKey: string, locale?: BlogPostListFilters['locale']) =>
  queryOptions({
    queryKey: pageContentQueryKeys.detail(pageKey, locale),
    queryFn: () => getPublicPageContent(pageKey, locale),
  });

export const bookingRequestMutationOptions = () =>
  mutationOptions({
    mutationKey: ['booking-requests'] as const,
    mutationFn: (input: BookingRequestInput) => createBookingRequest(input),
  });

export const contactInquiryMutationOptions = () =>
  mutationOptions({
    mutationKey: ['contact-inquiries'] as const,
    mutationFn: (input: ContactInquiryInput) => createContactInquiry(input),
  });

export const adminSafariPackagesQueryOptions = (
  accessToken: string,
  filters: { category?: SafariPackageCategory; active?: boolean } = {},
) =>
  queryOptions({
    queryKey: adminContentQueryKeys.safariPackageList(accessToken, filters),
    queryFn: () => listAdminSafariPackages(accessToken, filters),
  });

export const adminBlogPostsQueryOptions = (
  accessToken: string,
  filters: { status?: ContentStatus; category?: BlogCategory } = {},
) =>
  queryOptions({
    queryKey: adminContentQueryKeys.blogPostList(accessToken, filters),
    queryFn: () => listAdminBlogPosts(accessToken, filters),
  });

export const adminDestinationsQueryOptions = (
  accessToken: string,
  filters: { status?: ContentStatus; country?: DestinationCountry } = {},
) =>
  queryOptions({
    queryKey: adminContentQueryKeys.destinationList(accessToken, filters),
    queryFn: () => listAdminDestinations(accessToken, filters),
  });

export const adminPagesQueryOptions = (accessToken: string, filters: { status?: ContentStatus } = {}) =>
  queryOptions({
    queryKey: adminContentQueryKeys.pageList(accessToken, filters),
    queryFn: () => listAdminContentPages(accessToken, filters),
  });

export const adminBookingRequestsQueryOptions = (
  accessToken: string,
  filters: BookingRequestAdminListFilters = {},
) =>
  queryOptions({
    queryKey: adminOperationsQueryKeys.bookingList(accessToken, filters),
    queryFn: () => listAdminBookingRequests(accessToken, filters),
  });

export const adminBookingRequestDetailQueryOptions = (accessToken: string, bookingRequestId: string) =>
  queryOptions({
    queryKey: adminOperationsQueryKeys.bookingDetail(accessToken, bookingRequestId),
    queryFn: () => getAdminBookingRequest(accessToken, bookingRequestId),
  });

export const adminBookingRequestUpdateMutationOptions = (accessToken: string) =>
  mutationOptions({
    mutationKey: [...adminOperationsQueryKeys.bookings(), 'update', accessToken] as const,
    mutationFn: ({ bookingRequestId, input }: { bookingRequestId: string; input: BookingRequestAdminUpdateInput }) =>
      updateAdminBookingRequest(accessToken, bookingRequestId, input),
  });

export const adminContactInquiriesQueryOptions = (
  accessToken: string,
  filters: ContactInquiryAdminListFilters = {},
) =>
  queryOptions({
    queryKey: adminOperationsQueryKeys.inquiryList(accessToken, filters),
    queryFn: () => listAdminContactInquiries(accessToken, filters),
  });

export const adminContactInquiryDetailQueryOptions = (accessToken: string, inquiryId: string) =>
  queryOptions({
    queryKey: adminOperationsQueryKeys.inquiryDetail(accessToken, inquiryId),
    queryFn: () => getAdminContactInquiry(accessToken, inquiryId),
  });

export const adminContactInquiryUpdateMutationOptions = (accessToken: string) =>
  mutationOptions({
    mutationKey: [...adminOperationsQueryKeys.inquiries(), 'update', accessToken] as const,
    mutationFn: ({ inquiryId, input }: { inquiryId: string; input: ContactInquiryAdminUpdateInput }) =>
      updateAdminContactInquiry(accessToken, inquiryId, input),
  });

export const useAdminMeQuery = (
  accessToken: string | null | undefined,
  options?: Omit<UseQueryOptions<AdminUser, Error, AdminUser, ReturnType<typeof authQueryKeys.me>>, 'queryKey' | 'queryFn' | 'enabled'>,
) =>
  useQuery({
    ...(accessToken ? adminMeQueryOptions(accessToken) : adminMeQueryOptions('')),
    enabled: Boolean(accessToken),
    retry: false,
    ...options,
  });

export const useAdminLoginMutation = (
  options?: Omit<UseMutationOptions<AdminLoginResponse, Error, AdminLoginInput>, 'mutationKey' | 'mutationFn'>,
) => useMutation({ ...adminLoginMutationOptions(), ...options });

export const useSafariPackagesQuery = (
  filters: SafariPackageListFilters = {},
  options?: Omit<
    UseQueryOptions<SafariPackageListResponse, Error, SafariPackageListResponse, ReturnType<typeof safariPackageQueryKeys.list>>,
    'queryKey' | 'queryFn'
  >,
) => useQuery({ ...safariPackagesQueryOptions(filters), ...options });

export const useSafariPackageDetailQuery = (
  packageId: SafariPackageId | null | undefined,
  locale?: SafariPackageListFilters['locale'],
  options?: Omit<
    UseQueryOptions<
      SafariPackageDetailResponse,
      Error,
      SafariPackageDetailResponse,
      ReturnType<typeof safariPackageQueryKeys.detail>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) =>
  useQuery({
    ...(packageId ? safariPackageDetailQueryOptions(packageId, locale) : safariPackageDetailQueryOptions('', locale)),
    enabled: Boolean(packageId),
    ...options,
  });

export const usePublicBlogPostsQuery = (
  filters: BlogPostListFilters = {},
  options?: Omit<
    UseQueryOptions<BlogPostListResponse, Error, BlogPostListResponse, ReturnType<typeof blogPostQueryKeys.list>>,
    'queryKey' | 'queryFn'
  >,
) => useQuery({ ...publicBlogPostsQueryOptions(filters), ...options });

export const usePublicBlogPostDetailQuery = (
  lookup: string | null | undefined,
  locale?: BlogPostListFilters['locale'],
  options?: Omit<
    UseQueryOptions<
      BlogPostDetailResponse,
      Error,
      BlogPostDetailResponse,
      ReturnType<typeof blogPostQueryKeys.detail>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) =>
  useQuery({
    ...(lookup ? publicBlogPostDetailQueryOptions(lookup, locale) : publicBlogPostDetailQueryOptions('', locale)),
    enabled: Boolean(lookup),
    ...options,
  });

export const usePublicDestinationsQuery = (
  filters: DestinationListFilters = {},
  options?: Omit<
    UseQueryOptions<DestinationListResponse, Error, DestinationListResponse, ReturnType<typeof destinationQueryKeys.list>>,
    'queryKey' | 'queryFn'
  >,
) => useQuery({ ...publicDestinationsQueryOptions(filters), ...options });

export const usePublicDestinationDetailQuery = (
  slug: string | null | undefined,
  locale?: DestinationListFilters['locale'],
  options?: Omit<
    UseQueryOptions<
      DestinationDetailResponse,
      Error,
      DestinationDetailResponse,
      ReturnType<typeof destinationQueryKeys.detail>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) =>
  useQuery({
    ...(slug ? publicDestinationDetailQueryOptions(slug, locale) : publicDestinationDetailQueryOptions('', locale)),
    enabled: Boolean(slug),
    ...options,
  });

export const usePublicPageContentQuery = (
  pageKey: string | null | undefined,
  locale?: BlogPostListFilters['locale'],
  options?: Omit<
    UseQueryOptions<PageContentResponse, Error, PageContentResponse, ReturnType<typeof pageContentQueryKeys.detail>>,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) =>
  useQuery({
    ...(pageKey ? publicPageContentQueryOptions(pageKey, locale) : publicPageContentQueryOptions('', locale)),
    enabled: Boolean(pageKey),
    ...options,
  });

export const useBookingRequestMutation = (
  options?: Omit<
    UseMutationOptions<BookingRequestResponse, Error, BookingRequestInput>,
    'mutationKey' | 'mutationFn'
  >,
) => useMutation({ ...bookingRequestMutationOptions(), ...options });

export const useContactInquiryMutation = (
  options?: Omit<
    UseMutationOptions<ContactInquiryResponse, Error, ContactInquiryInput>,
    'mutationKey' | 'mutationFn'
  >,
) => useMutation({ ...contactInquiryMutationOptions(), ...options });

export const useAdminSafariPackagesQuery = (
  accessToken: string | null | undefined,
  filters: { category?: SafariPackageCategory; active?: boolean } = {},
  options?: Omit<
    UseQueryOptions<
      SafariPackageAdminListResponse,
      Error,
      SafariPackageAdminListResponse,
      ReturnType<typeof adminContentQueryKeys.safariPackageList>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) =>
  useQuery({
    ...(accessToken ? adminSafariPackagesQueryOptions(accessToken, filters) : adminSafariPackagesQueryOptions('', filters)),
    enabled: Boolean(accessToken),
    ...options,
  });

export const useAdminBlogPostsQuery = (
  accessToken: string | null | undefined,
  filters: { status?: ContentStatus; category?: BlogCategory } = {},
  options?: Omit<
    UseQueryOptions<
      BlogPostAdminListResponse,
      Error,
      BlogPostAdminListResponse,
      ReturnType<typeof adminContentQueryKeys.blogPostList>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) =>
  useQuery({
    ...(accessToken ? adminBlogPostsQueryOptions(accessToken, filters) : adminBlogPostsQueryOptions('', filters)),
    enabled: Boolean(accessToken),
    ...options,
  });

export const useAdminDestinationsQuery = (
  accessToken: string | null | undefined,
  filters: { status?: ContentStatus; country?: DestinationCountry } = {},
  options?: Omit<
    UseQueryOptions<
      DestinationAdminListResponse,
      Error,
      DestinationAdminListResponse,
      ReturnType<typeof adminContentQueryKeys.destinationList>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) =>
  useQuery({
    ...(accessToken ? adminDestinationsQueryOptions(accessToken, filters) : adminDestinationsQueryOptions('', filters)),
    enabled: Boolean(accessToken),
    ...options,
  });

export const useAdminPagesQuery = (
  accessToken: string | null | undefined,
  filters: { status?: ContentStatus } = {},
  options?: Omit<
    UseQueryOptions<
      ContentPageAdminListResponse,
      Error,
      ContentPageAdminListResponse,
      ReturnType<typeof adminContentQueryKeys.pageList>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) =>
  useQuery({
    ...(accessToken ? adminPagesQueryOptions(accessToken, filters) : adminPagesQueryOptions('', filters)),
    enabled: Boolean(accessToken),
    ...options,
  });

export const useCreateAdminSafariPackageMutation = (
  accessToken: string,
  options?: Omit<UseMutationOptions<SafariPackageAdminRecord, Error, SafariPackageAdminInput>, 'mutationKey' | 'mutationFn'>,
) =>
  useMutation({
    mutationKey: [...adminContentQueryKeys.safariPackages(), 'create', accessToken] as const,
    mutationFn: (input: SafariPackageAdminInput) => createAdminSafariPackage(accessToken, input),
    ...options,
  });

export const useUpdateAdminSafariPackageMutation = (
  accessToken: string,
  options?: Omit<
    UseMutationOptions<SafariPackageAdminRecord, Error, { packageId: SafariPackageId; input: SafariPackageAdminInput }>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: [...adminContentQueryKeys.safariPackages(), 'update', accessToken] as const,
    mutationFn: ({ packageId, input }) => updateAdminSafariPackage(accessToken, packageId, input),
    ...options,
  });

export const useDeleteAdminSafariPackageMutation = (
  accessToken: string,
  options?: Omit<UseMutationOptions<unknown, Error, SafariPackageId>, 'mutationKey' | 'mutationFn'>,
) =>
  useMutation({
    mutationKey: [...adminContentQueryKeys.safariPackages(), 'delete', accessToken] as const,
    mutationFn: (packageId: SafariPackageId) => deleteAdminSafariPackage(accessToken, packageId),
    ...options,
  });

export const useCreateAdminBlogPostMutation = (
  accessToken: string,
  options?: Omit<UseMutationOptions<BlogPostAdminRecord, Error, BlogPostAdminInput>, 'mutationKey' | 'mutationFn'>,
) =>
  useMutation({
    mutationKey: [...adminContentQueryKeys.blogPosts(), 'create', accessToken] as const,
    mutationFn: (input: BlogPostAdminInput) => createAdminBlogPost(accessToken, input),
    ...options,
  });

export const useUpdateAdminBlogPostMutation = (
  accessToken: string,
  options?: Omit<
    UseMutationOptions<BlogPostAdminRecord, Error, { postId: number; input: BlogPostAdminInput }>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: [...adminContentQueryKeys.blogPosts(), 'update', accessToken] as const,
    mutationFn: ({ postId, input }) => updateAdminBlogPost(accessToken, postId, input),
    ...options,
  });

export const useDeleteAdminBlogPostMutation = (
  accessToken: string,
  options?: Omit<UseMutationOptions<unknown, Error, number>, 'mutationKey' | 'mutationFn'>,
) =>
  useMutation({
    mutationKey: [...adminContentQueryKeys.blogPosts(), 'delete', accessToken] as const,
    mutationFn: (postId: number) => deleteAdminBlogPost(accessToken, postId),
    ...options,
  });

export const useCreateAdminDestinationMutation = (
  accessToken: string,
  options?: Omit<UseMutationOptions<DestinationAdminRecord, Error, DestinationAdminInput>, 'mutationKey' | 'mutationFn'>,
) =>
  useMutation({
    mutationKey: [...adminContentQueryKeys.destinations(), 'create', accessToken] as const,
    mutationFn: (input: DestinationAdminInput) => createAdminDestination(accessToken, input),
    ...options,
  });

export const useUpdateAdminDestinationMutation = (
  accessToken: string,
  options?: Omit<
    UseMutationOptions<DestinationAdminRecord, Error, { destinationId: number; input: DestinationAdminInput }>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: [...adminContentQueryKeys.destinations(), 'update', accessToken] as const,
    mutationFn: ({ destinationId, input }) => updateAdminDestination(accessToken, destinationId, input),
    ...options,
  });

export const useDeleteAdminDestinationMutation = (
  accessToken: string,
  options?: Omit<UseMutationOptions<unknown, Error, number>, 'mutationKey' | 'mutationFn'>,
) =>
  useMutation({
    mutationKey: [...adminContentQueryKeys.destinations(), 'delete', accessToken] as const,
    mutationFn: (destinationId: number) => deleteAdminDestination(accessToken, destinationId),
    ...options,
  });

export const useCreateAdminPageMutation = (
  accessToken: string,
  options?: Omit<
    UseMutationOptions<ContentPageAdminRecord, Error, ContentPageAdminCreateInput>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: [...adminContentQueryKeys.pages(), 'create', accessToken] as const,
    mutationFn: (input: ContentPageAdminCreateInput) => createAdminContentPage(accessToken, input),
    ...options,
  });

export const useUpdateAdminPageMutation = (
  accessToken: string,
  options?: Omit<
    UseMutationOptions<ContentPageAdminRecord, Error, { pageKey: string; input: ContentPageAdminUpdateInput }>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: [...adminContentQueryKeys.pages(), 'update', accessToken] as const,
    mutationFn: ({ pageKey, input }) => updateAdminContentPage(accessToken, pageKey, input),
    ...options,
  });

export const useDeleteAdminPageMutation = (
  accessToken: string,
  options?: Omit<UseMutationOptions<unknown, Error, string>, 'mutationKey' | 'mutationFn'>,
) =>
  useMutation({
    mutationKey: [...adminContentQueryKeys.pages(), 'delete', accessToken] as const,
    mutationFn: (pageKey: string) => deleteAdminContentPage(accessToken, pageKey),
    ...options,
  });

export const useAdminBookingRequestsQuery = (
  accessToken: string | null | undefined,
  filters: BookingRequestAdminListFilters = {},
  options?: Omit<
    UseQueryOptions<
      BookingRequestAdminListResponse,
      Error,
      BookingRequestAdminListResponse,
      ReturnType<typeof adminOperationsQueryKeys.bookingList>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) =>
  useQuery({
    ...(accessToken ? adminBookingRequestsQueryOptions(accessToken, filters) : adminBookingRequestsQueryOptions('', filters)),
    enabled: Boolean(accessToken),
    ...options,
  });

export const useAdminBookingRequestDetailQuery = (
  accessToken: string | null | undefined,
  bookingRequestId: string | null | undefined,
  options?: Omit<
    UseQueryOptions<
      BookingRequestAdminDetail,
      Error,
      BookingRequestAdminDetail,
      ReturnType<typeof adminOperationsQueryKeys.bookingDetail>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) =>
  useQuery({
    ...(accessToken && bookingRequestId
      ? adminBookingRequestDetailQueryOptions(accessToken, bookingRequestId)
      : adminBookingRequestDetailQueryOptions('', '')),
    enabled: Boolean(accessToken && bookingRequestId),
    ...options,
  });

export const useAdminBookingRequestUpdateMutation = (
  accessToken: string | null | undefined,
  options?: Omit<
    UseMutationOptions<
      BookingRequestAdminDetail,
      Error,
      { bookingRequestId: string; input: BookingRequestAdminUpdateInput }
    >,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    ...(accessToken ? adminBookingRequestUpdateMutationOptions(accessToken) : adminBookingRequestUpdateMutationOptions('')),
    ...options,
  });

export const useAdminContactInquiriesQuery = (
  accessToken: string | null | undefined,
  filters: ContactInquiryAdminListFilters = {},
  options?: Omit<
    UseQueryOptions<
      ContactInquiryAdminListResponse,
      Error,
      ContactInquiryAdminListResponse,
      ReturnType<typeof adminOperationsQueryKeys.inquiryList>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) =>
  useQuery({
    ...(accessToken ? adminContactInquiriesQueryOptions(accessToken, filters) : adminContactInquiriesQueryOptions('', filters)),
    enabled: Boolean(accessToken),
    ...options,
  });

export const useAdminContactInquiryDetailQuery = (
  accessToken: string | null | undefined,
  inquiryId: string | null | undefined,
  options?: Omit<
    UseQueryOptions<
      ContactInquiryAdminDetail,
      Error,
      ContactInquiryAdminDetail,
      ReturnType<typeof adminOperationsQueryKeys.inquiryDetail>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) =>
  useQuery({
    ...(accessToken && inquiryId
      ? adminContactInquiryDetailQueryOptions(accessToken, inquiryId)
      : adminContactInquiryDetailQueryOptions('', '')),
    enabled: Boolean(accessToken && inquiryId),
    ...options,
  });

export const useAdminContactInquiryUpdateMutation = (
  accessToken: string | null | undefined,
  options?: Omit<
    UseMutationOptions<
      ContactInquiryAdminDetail,
      Error,
      { inquiryId: string; input: ContactInquiryAdminUpdateInput }
    >,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    ...(accessToken ? adminContactInquiryUpdateMutationOptions(accessToken) : adminContactInquiryUpdateMutationOptions('')),
    ...options,
  });
