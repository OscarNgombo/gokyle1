import { apiClient } from '@/api/client';
import type {
  AdminLoginInput,
  AdminLoginPayload,
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
  BookingRequestPayload,
  BookingRequestResponse,
  ContactInquiryAdminDetail,
  ContactInquiryAdminListFilters,
  ContactInquiryAdminListResponse,
  ContactInquiryAdminUpdateInput,
  ContactInquiryInput,
  ContactInquiryPayload,
  ContactInquiryResponse,
  ContentPageAdminCreateInput,
  PageContentResponse,
  ContentPageAdminRecord,
  ContentPageAdminListResponse,
  ContentPageAdminUpdateInput,
  ContentStatus,
  DestinationDetailResponse,
  DestinationAdminInput,
  DestinationAdminRecord,
  DestinationAdminListResponse,
  DestinationCountry,
  DestinationExperience,
  DestinationListFilters,
  DestinationListResponse,
  SafariPackageDetailResponse,
  SafariPackageAdminInput,
  SafariPackageAdminRecord,
  SafariPackageAdminListResponse,
  SafariPackageCategory,
  SafariPackageId,
  SafariPackageListFilters,
  SafariPackageListResponse,
} from '@/api/types';

const toAdminLoginPayload = (input: AdminLoginInput): AdminLoginPayload => ({
  email: input.email.trim().toLowerCase(),
  password: input.password,
});

const toBookingRequestPayload = (input: BookingRequestInput): BookingRequestPayload => ({
  ...input,
  childrenCount: input.childrenCount ?? 0,
});

const toContactInquiryPayload = (input: ContactInquiryInput): ContactInquiryPayload => ({
  ...input,
});

export const loginAdminUser = (input: AdminLoginInput) =>
  apiClient.post<AdminLoginResponse, AdminLoginPayload>('/auth/login', toAdminLoginPayload(input));

export const getCurrentAdminUser = (accessToken: string) =>
  apiClient.get<AdminUser>('/auth/me', {
    authToken: accessToken,
  });

export const listSafariPackages = (filters: SafariPackageListFilters = {}) =>
  apiClient.get<SafariPackageListResponse>('/safari-packages', { query: filters });

export const getSafariPackage = (packageId: SafariPackageId, locale?: SafariPackageListFilters['locale']) =>
  apiClient.get<SafariPackageDetailResponse>(`/safari-packages/${packageId}`, {
    query: { locale },
  });

export const listPublicBlogPosts = (filters: BlogPostListFilters = {}) =>
  apiClient.get<BlogPostListResponse>('/blog-posts', { query: filters });

export const getPublicBlogPost = (lookup: string, locale?: BlogPostListFilters['locale']) =>
  apiClient.get<BlogPostDetailResponse>(`/blog-posts/${lookup}`, {
    query: { locale },
  });

export const listPublicDestinations = (filters: DestinationListFilters = {}) =>
  apiClient.get<DestinationListResponse>('/destinations', { query: filters });

export const getPublicDestination = (slug: string, locale?: DestinationListFilters['locale']) =>
  apiClient.get<DestinationDetailResponse>(`/destinations/${slug}`, {
    query: { locale },
  });

export const getPublicPageContent = (pageKey: string, locale?: BlogPostListFilters['locale']) =>
  apiClient.get<PageContentResponse>(`/pages/${pageKey}`, {
    query: { locale },
  });

export const createBookingRequest = (input: BookingRequestInput) =>
  apiClient.post<BookingRequestResponse, BookingRequestPayload>(
    '/booking-requests',
    toBookingRequestPayload(input),
  );

export const createContactInquiry = (input: ContactInquiryInput) =>
  apiClient.post<ContactInquiryResponse, ContactInquiryPayload>(
    '/contact-inquiries',
    toContactInquiryPayload(input),
  );

export const listAdminBookingRequests = (accessToken: string, filters: BookingRequestAdminListFilters = {}) =>
  apiClient.get<BookingRequestAdminListResponse>('/admin/booking-requests', {
    authToken: accessToken,
    query: filters,
  });

export const getAdminBookingRequest = (accessToken: string, bookingRequestId: string) =>
  apiClient.get<BookingRequestAdminDetail>(`/admin/booking-requests/${bookingRequestId}`, {
    authToken: accessToken,
  });

export const updateAdminBookingRequest = (
  accessToken: string,
  bookingRequestId: string,
  input: BookingRequestAdminUpdateInput,
) =>
  apiClient.patch<BookingRequestAdminDetail, BookingRequestAdminUpdateInput>(
    `/admin/booking-requests/${bookingRequestId}`,
    input,
    {
      authToken: accessToken,
    },
  );

export const listAdminContactInquiries = (accessToken: string, filters: ContactInquiryAdminListFilters = {}) =>
  apiClient.get<ContactInquiryAdminListResponse>('/admin/contact-inquiries', {
    authToken: accessToken,
    query: filters,
  });

export const getAdminContactInquiry = (accessToken: string, inquiryId: string) =>
  apiClient.get<ContactInquiryAdminDetail>(`/admin/contact-inquiries/${inquiryId}`, {
    authToken: accessToken,
  });

export const updateAdminContactInquiry = (
  accessToken: string,
  inquiryId: string,
  input: ContactInquiryAdminUpdateInput,
) =>
  apiClient.patch<ContactInquiryAdminDetail, ContactInquiryAdminUpdateInput>(
    `/admin/contact-inquiries/${inquiryId}`,
    input,
    {
      authToken: accessToken,
    },
  );

export const listAdminSafariPackages = (
  accessToken: string,
  filters: {
    category?: SafariPackageCategory;
    active?: boolean;
  } = {},
) =>
  apiClient.get<SafariPackageAdminListResponse>('/admin/safari-packages', {
    authToken: accessToken,
    query: filters,
  });

export const createAdminSafariPackage = (accessToken: string, input: SafariPackageAdminInput) =>
  apiClient.post<SafariPackageAdminRecord, SafariPackageAdminInput>('/admin/safari-packages', input, {
    authToken: accessToken,
  });

export const updateAdminSafariPackage = (
  accessToken: string,
  packageId: SafariPackageId,
  input: SafariPackageAdminInput,
) =>
  apiClient.put<SafariPackageAdminRecord, SafariPackageAdminInput>(`/admin/safari-packages/${packageId}`, input, {
    authToken: accessToken,
  });

export const deleteAdminSafariPackage = (accessToken: string, packageId: SafariPackageId) =>
  apiClient.delete(`/admin/safari-packages/${packageId}`, {
    authToken: accessToken,
  });

export const listAdminBlogPosts = (
  accessToken: string,
  filters: {
    status?: ContentStatus;
    category?: BlogCategory;
  } = {},
) =>
  apiClient.get<BlogPostAdminListResponse>('/admin/blog-posts', {
    authToken: accessToken,
    query: filters,
  });

export const createAdminBlogPost = (accessToken: string, input: BlogPostAdminInput) =>
  apiClient.post<BlogPostAdminRecord, BlogPostAdminInput>('/admin/blog-posts', input, {
    authToken: accessToken,
  });

export const updateAdminBlogPost = (accessToken: string, postId: number, input: BlogPostAdminInput) =>
  apiClient.put<BlogPostAdminRecord, BlogPostAdminInput>(`/admin/blog-posts/${postId}`, input, {
    authToken: accessToken,
  });

export const deleteAdminBlogPost = (accessToken: string, postId: number) =>
  apiClient.delete(`/admin/blog-posts/${postId}`, {
    authToken: accessToken,
  });

export const listAdminDestinations = (
  accessToken: string,
  filters: {
    status?: ContentStatus;
    country?: DestinationCountry;
  } = {},
) =>
  apiClient.get<DestinationAdminListResponse>('/admin/destinations', {
    authToken: accessToken,
    query: filters,
  });

export const createAdminDestination = (accessToken: string, input: DestinationAdminInput) =>
  apiClient.post<DestinationAdminRecord, DestinationAdminInput>('/admin/destinations', input, {
    authToken: accessToken,
  });

export const updateAdminDestination = (accessToken: string, destinationId: number, input: DestinationAdminInput) =>
  apiClient.put<DestinationAdminRecord, DestinationAdminInput>(`/admin/destinations/${destinationId}`, input, {
    authToken: accessToken,
  });

export const deleteAdminDestination = (accessToken: string, destinationId: number) =>
  apiClient.delete(`/admin/destinations/${destinationId}`, {
    authToken: accessToken,
  });

export const listAdminContentPages = (
  accessToken: string,
  filters: {
    status?: ContentStatus;
  } = {},
) =>
  apiClient.get<ContentPageAdminListResponse>('/admin/pages', {
    authToken: accessToken,
    query: filters,
  });

export const createAdminContentPage = (accessToken: string, input: ContentPageAdminCreateInput) =>
  apiClient.post<ContentPageAdminRecord, ContentPageAdminCreateInput>('/admin/pages', input, {
    authToken: accessToken,
  });

export const updateAdminContentPage = (
  accessToken: string,
  pageKey: string,
  input: ContentPageAdminUpdateInput,
) =>
  apiClient.put<ContentPageAdminRecord, ContentPageAdminUpdateInput>(`/admin/pages/${pageKey}`, input, {
    authToken: accessToken,
  });

export const deleteAdminContentPage = (accessToken: string, pageKey: string) =>
  apiClient.delete(`/admin/pages/${pageKey}`, {
    authToken: accessToken,
  });
