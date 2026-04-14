import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  adminBookingRequestUpdateMutationOptions,
  adminBookingRequestsQueryOptions,
  adminBlogPostsQueryOptions,
  adminContactInquiriesQueryOptions,
  adminContactInquiryUpdateMutationOptions,
  adminDestinationsQueryOptions,
  adminPagesQueryOptions,
  adminSafariPackagesQueryOptions,
  adminLoginMutationOptions,
  adminMeQueryOptions,
  bookingRequestMutationOptions,
  contactInquiryMutationOptions,
  publicBlogPostDetailQueryOptions,
  publicBlogPostsQueryOptions,
  publicDestinationsQueryOptions,
  publicPageContentQueryOptions,
  safariPackageDetailQueryOptions,
  safariPackagesQueryOptions,
} from '@/api/queries';
import { ApiError, apiClient } from '@/api/client';
import {
  createAdminContentPage,
  updateAdminBlogPost,
  updateAdminSafariPackage,
} from '@/api/services';
import { findSafariPackageMatch, toSafariPackageCardData } from '@/lib/safariPackageUtils';

const fetchMock = vi.fn<typeof fetch>();

const createJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });

const adminUserPayload = {
  id: 'admin-1',
  email: 'admin@example.com',
  fullName: 'Admin User',
  role: 'admin',
  isActive: true,
  lastLoginAt: '2025-01-01T00:00:00Z',
  createdAt: '2024-12-31T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
} as const;

const safariPackagePayload = {
  id: 7,
  slug: 'tsavo-east',
  category: 'jeep-safari',
  featured: true,
  active: true,
  sortOrder: 1,
  title: 'Tsavo East',
  titleEn: 'Tsavo East',
  description: 'Short safari',
  highlights: ['Game drive'],
  duration: '1 Day',
  durationDays: 1,
  durationLabelEn: '1 Day',
  groupSize: '2-8 People',
  minGroupSize: 2,
  groupSizeLabelEn: '2-8 People',
  location: 'Tsavo East, Kenya',
  price: 'EUR 350',
  priceNote: 'per person',
  priceAmount: 350,
  priceCurrency: 'EUR',
  rating: 4.9,
  reviewsCount: 156,
  imageKey: 'strip-7',
  imageUrl: '/images/tsavo.jpg',
} as const;

describe('frontend api layer', () => {
  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it('logs in admin users with normalized credentials', async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        accessToken: 'jwt-token',
        tokenType: 'bearer',
        expiresIn: 1800,
        user: adminUserPayload,
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await adminLoginMutationOptions().mutationFn({
      email: ' ADMIN@Example.com ',
      password: 'password123',
    });

    const [requestUrl, init] = fetchMock.mock.calls[0];

    expect(new URL(requestUrl as string).pathname).toBe('/api/v1/auth/login');
    expect(init?.method).toBe('POST');
    expect(JSON.parse(String(init?.body))).toEqual({
      email: 'admin@example.com',
      password: 'password123',
    });
    expect(result.user.role).toBe('admin');
  });

  it('requests the current admin user with a bearer token', async () => {
    fetchMock.mockResolvedValue(createJsonResponse(adminUserPayload));
    vi.stubGlobal('fetch', fetchMock);

    const result = await adminMeQueryOptions('jwt-token').queryFn();

    const [requestUrl, init] = fetchMock.mock.calls[0];

    expect(new URL(requestUrl as string).pathname).toBe('/api/v1/auth/me');
    expect(init?.headers).toMatchObject({
      Accept: 'application/json',
      Authorization: 'Bearer jwt-token',
    });
    expect(result.email).toBe('admin@example.com');
  });

  it('requests safari packages with locale and filters', async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        items: [safariPackagePayload],
        total: 1,
        locale: 'de',
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await safariPackagesQueryOptions({
      locale: 'de',
      category: 'jeep-safari',
      featured: true,
    }).queryFn();

    const [requestUrl] = fetchMock.mock.calls[0];
    const url = new URL(requestUrl as string);

    expect(url.pathname).toBe('/api/v1/safari-packages');
    expect(url.searchParams.get('locale')).toBe('de');
    expect(url.searchParams.get('category')).toBe('jeep-safari');
    expect(url.searchParams.get('featured')).toBe('true');
    expect(result.total).toBe(1);
    expect(result.items[0].reviewsCount).toBe(156);
  });

  it('requests safari package details with locale', async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        item: safariPackagePayload,
        locale: 'it',
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await safariPackageDetailQueryOptions(11, 'it').queryFn();

    const [requestUrl] = fetchMock.mock.calls[0];
    const url = new URL(requestUrl as string);

    expect(url.pathname).toBe('/api/v1/safari-packages/11');
    expect(url.searchParams.get('locale')).toBe('it');
    expect(result.item.id).toBe(7);
  });

  it('requests published blog content with public filters', async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        items: [],
        total: 0,
        locale: 'it',
        categories: [{ value: 'all', label: 'Tutte', count: 0 }],
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await publicBlogPostsQueryOptions({
      locale: 'it',
      category: 'wildlife',
      featured: true,
    }).queryFn();

    const [requestUrl] = fetchMock.mock.calls[0];
    const url = new URL(requestUrl as string);

    expect(url.pathname).toBe('/api/v1/blog-posts');
    expect(url.searchParams.get('locale')).toBe('it');
    expect(url.searchParams.get('category')).toBe('wildlife');
    expect(url.searchParams.get('featured')).toBe('true');
  });

  it('requests published blog detail and reusable page content', async () => {
    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse({
          item: {
            id: 1,
            slug: 'great-migration',
            title: 'The Great Migration',
            excerpt: 'Excerpt',
            content: 'Body',
            categoryKey: 'wildlife',
            categoryLabel: 'Wildlife',
            authorName: 'Lucky',
            publishedAt: '2025-01-01T00:00:00Z',
            dateLabel: 'January 1, 2025',
            readTime: '5 min read',
            readTimeMinutes: 5,
            featured: true,
            imageKey: 'strip-1',
          },
          locale: 'en',
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          key: 'home',
          routePath: '/',
          title: 'Homepage',
          locale: 'en',
          sections: [],
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    await publicBlogPostDetailQueryOptions('great-migration', 'en').queryFn();
    await publicPageContentQueryOptions('home', 'en').queryFn();

    expect(new URL(fetchMock.mock.calls[0][0] as string).pathname).toBe('/api/v1/blog-posts/great-migration');
    expect(new URL(fetchMock.mock.calls[1][0] as string).pathname).toBe('/api/v1/pages/home');
  });

  it('requests published destinations with locale and experience filters', async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        items: [],
        total: 0,
        locale: 'de',
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await publicDestinationsQueryOptions({
      locale: 'de',
      country: 'kenya',
      experience: 'wildlife',
      featured: true,
    }).queryFn();

    const [requestUrl] = fetchMock.mock.calls[0];
    const url = new URL(requestUrl as string);

    expect(url.pathname).toBe('/api/v1/destinations');
    expect(url.searchParams.get('locale')).toBe('de');
    expect(url.searchParams.get('country')).toBe('kenya');
    expect(url.searchParams.get('experience')).toBe('wildlife');
    expect(url.searchParams.get('featured')).toBe('true');
  });

  it('submits booking requests with backend camelCase payload keys', async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse(
        {
          id: 'booking-1',
          status: 'received',
          createdAt: '2025-01-01T00:00:00Z',
          packageId: 7,
          packageTitle: 'Tsavo East',
          packageTitleEn: 'Tsavo East',
        },
        201,
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await bookingRequestMutationOptions().mutationFn({
      locale: 'en',
      packageId: 7,
      customerName: 'Lucky',
      customerEmail: 'lucky@example.com',
      customerPhone: '+254700000000',
      customerNationality: 'Kenya',
      adultsCount: 2,
      childrenCount: 1,
      accommodationPreference: 'luxury',
      specialRequests: 'Window seat',
    });

    const [, init] = fetchMock.mock.calls[0];

    expect(init?.method).toBe('POST');
    expect(JSON.parse(String(init?.body))).toEqual({
      locale: 'en',
      packageId: 7,
      customerName: 'Lucky',
      customerEmail: 'lucky@example.com',
      customerPhone: '+254700000000',
      customerNationality: 'Kenya',
      adultsCount: 2,
      childrenCount: 1,
      accommodationPreference: 'luxury',
      specialRequests: 'Window seat',
    });
    expect(result.packageTitleEn).toBe('Tsavo East');
  });

  it('submits contact inquiries', async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse(
        {
          id: 'contact-1',
          status: 'received',
          createdAt: '2025-01-01T00:00:00Z',
        },
        201,
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await contactInquiryMutationOptions().mutationFn({
      locale: 'de',
      name: 'Amina',
      email: 'amina@example.com',
      phone: '+254711111111',
      subject: 'Safari',
      message: 'I would like more details.',
    });

    const [, init] = fetchMock.mock.calls[0];

    expect(JSON.parse(String(init?.body))).toEqual({
      locale: 'de',
      name: 'Amina',
      email: 'amina@example.com',
      phone: '+254711111111',
      subject: 'Safari',
      message: 'I would like more details.',
    });
    expect(result.id).toBe('contact-1');
  });

  it('requests protected booking operations data with filters and bearer auth', async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        items: [],
        total: 0,
        statusCounts: {
          received: 0,
          inReview: 0,
          responded: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
          spam: 0,
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await adminBookingRequestsQueryOptions('jwt-token', {
      status: 'in_review',
      assigned: 'me',
      search: 'Lucky',
    }).queryFn();

    const [requestUrl, init] = fetchMock.mock.calls[0];
    const url = new URL(requestUrl as string);

    expect(url.pathname).toBe('/api/v1/admin/booking-requests');
    expect(url.searchParams.get('status')).toBe('in_review');
    expect(url.searchParams.get('assigned')).toBe('me');
    expect(url.searchParams.get('search')).toBe('Lucky');
    expect(init?.headers).toMatchObject({
      Authorization: 'Bearer jwt-token',
    });
  });

  it('patches booking operations updates through protected endpoints', async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        id: 'booking-1',
        packageId: 7,
        packageTitle: 'Tsavo East',
        packageTitleEn: 'Tsavo East',
        customerName: 'Lucky',
        customerEmail: 'lucky@example.com',
        customerPhone: '+254700000000',
        customerNationality: 'Kenya',
        adultsCount: 2,
        childrenCount: 1,
        locale: 'en',
        status: 'responded',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T03:00:00Z',
        assignedAdmin: adminUserPayload,
        internalNotes: 'Sent proposal',
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await adminBookingRequestUpdateMutationOptions('jwt-token').mutationFn({
      bookingRequestId: 'booking-1',
      input: {
        status: 'responded',
        assignedAdminUserId: 'admin-1',
        internalNotes: 'Sent proposal',
      },
    });

    const [requestUrl, init] = fetchMock.mock.calls[0];

    expect(new URL(requestUrl as string).pathname).toBe('/api/v1/admin/booking-requests/booking-1');
    expect(init?.method).toBe('PATCH');
    expect(JSON.parse(String(init?.body))).toEqual({
      status: 'responded',
      assignedAdminUserId: 'admin-1',
      internalNotes: 'Sent proposal',
    });
  });

  it('requests and updates protected inquiry operations endpoints', async () => {
    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse({
          items: [],
          total: 0,
          statusCounts: {
            received: 0,
            inReview: 0,
            responded: 0,
            resolved: 0,
            spam: 0,
          },
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          id: 'inquiry-1',
          name: 'Amina',
          email: 'amina@example.com',
          phone: '+254711111111',
          subject: 'Safari',
          locale: 'en',
          status: 'resolved',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T02:00:00Z',
          assignedAdmin: adminUserPayload,
          internalNotes: 'Resolved by email',
          message: 'Need August itinerary',
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    await adminContactInquiriesQueryOptions('jwt-token', {
      status: 'resolved',
      assigned: 'unassigned',
      search: 'August',
    }).queryFn();
    await adminContactInquiryUpdateMutationOptions('jwt-token').mutationFn({
      inquiryId: 'inquiry-1',
      input: {
        status: 'resolved',
        assignedAdminUserId: null,
        internalNotes: 'Resolved by email',
      },
    });

    expect(new URL(fetchMock.mock.calls[0][0] as string).pathname).toBe('/api/v1/admin/contact-inquiries');
    expect(new URL(fetchMock.mock.calls[1][0] as string).pathname).toBe('/api/v1/admin/contact-inquiries/inquiry-1');
    expect(fetchMock.mock.calls[1][1]?.method).toBe('PATCH');
  });

  it('requests admin safari packages with bearer auth and filters', async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        items: [],
        total: 0,
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await adminSafariPackagesQueryOptions('jwt-token', {
      category: 'excursion',
      active: false,
    }).queryFn();

    const [requestUrl, init] = fetchMock.mock.calls[0];
    const url = new URL(requestUrl as string);

    expect(url.pathname).toBe('/api/v1/admin/safari-packages');
    expect(url.searchParams.get('category')).toBe('excursion');
    expect(url.searchParams.get('active')).toBe('false');
    expect(init?.headers).toMatchObject({
      Authorization: 'Bearer jwt-token',
    });
  });

  it('requests admin blog posts, destinations, and pages through protected endpoints', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(createJsonResponse({ items: [], total: 0 })));
    vi.stubGlobal('fetch', fetchMock);

    await adminBlogPostsQueryOptions('jwt-token', {
      status: 'draft',
      category: 'wildlife',
    }).queryFn();
    await adminDestinationsQueryOptions('jwt-token', {
      status: 'published',
      country: 'kenya',
    }).queryFn();
    await adminPagesQueryOptions('jwt-token', {
      status: 'archived',
    }).queryFn();

    expect(new URL(fetchMock.mock.calls[0][0] as string).pathname).toBe('/api/v1/admin/blog-posts');
    expect(new URL(fetchMock.mock.calls[1][0] as string).pathname).toBe('/api/v1/admin/destinations');
    expect(new URL(fetchMock.mock.calls[2][0] as string).pathname).toBe('/api/v1/admin/pages');
  });

  it('submits protected admin content mutations with correct verbs', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(createJsonResponse({}, 200)));
    vi.stubGlobal('fetch', fetchMock);

    await updateAdminSafariPackage('jwt-token', 9, {
      slug: 'tsavo-east',
      category: 'jeep-safari',
      featured: true,
      active: true,
      sortOrder: 4,
      titleTranslations: { en: 'Tsavo East', de: 'Tsavo Ost', it: 'Tsavo East' },
      descriptionTranslations: { en: 'Desc', de: 'Beschreibung', it: 'Descrizione' },
      highlightsTranslations: { en: ['Game drive'], de: ['Pirschfahrt'], it: ['Game drive'] },
      priceNoteTranslations: { en: 'per person' },
      durationDays: 1,
      durationLabelEn: '1 Day',
      minGroupSize: 2,
      groupSizeLabelEn: '2-8 People',
      location: 'Kenya',
      priceAmount: 300,
      priceCurrency: 'EUR',
      rating: 4.7,
      reviewsCount: 20,
      imageKey: 'strip-1',
      imageUrl: '/images/test.jpg',
    });
    await updateAdminBlogPost('jwt-token', 4, {
      slug: 'story',
      status: 'published',
      featured: false,
      sortOrder: 0,
      categoryKey: 'wildlife',
      authorName: 'Admin',
      imageKey: 'hero',
      publishedAt: '2025-01-01T00:00:00Z',
      readTimeMinutes: 6,
      titleTranslations: { en: 'Title', de: 'Titel', it: 'Titolo' },
      excerptTranslations: { en: 'Excerpt', de: 'Auszug', it: 'Estratto' },
      contentTranslations: { en: 'Body', de: 'Inhalt', it: 'Corpo' },
    });
    await createAdminContentPage('jwt-token', {
      key: 'services',
      routePath: '/services',
      status: 'draft',
      titleTranslations: { en: 'Services', de: 'Services', it: 'Servizi' },
      sections: [
        {
          key: 'hero',
          type: 'hero_slider',
          status: 'draft',
          sortOrder: 1,
          payloadTranslations: {
            en: { title: 'Hello' },
            de: { title: 'Hallo' },
            it: { title: 'Ciao' },
          },
        },
      ],
    });

    expect((fetchMock.mock.calls[0][1] as RequestInit)?.method).toBe('PUT');
    expect(new URL(fetchMock.mock.calls[0][0] as string).pathname).toBe('/api/v1/admin/safari-packages/9');
    expect((fetchMock.mock.calls[1][1] as RequestInit)?.method).toBe('PUT');
    expect(new URL(fetchMock.mock.calls[1][0] as string).pathname).toBe('/api/v1/admin/blog-posts/4');
    expect((fetchMock.mock.calls[2][1] as RequestInit)?.method).toBe('POST');
    expect(new URL(fetchMock.mock.calls[2][0] as string).pathname).toBe('/api/v1/admin/pages');
  });

  it('maps backend safari packages for card rendering and query matching', () => {
    const cardData = toSafariPackageCardData(safariPackagePayload);

    expect(cardData.image).toMatch(/strip-7/i);
    expect(cardData.reviews).toBe(156);
    expect(findSafariPackageMatch([safariPackagePayload], 'Tsavo East')?.id).toBe(7);
    expect(findSafariPackageMatch([safariPackagePayload], '7')?.id).toBe(7);
  });

  it('throws an ApiError for failed requests', async () => {
    fetchMock.mockResolvedValue(createJsonResponse({ detail: 'Bad request' }, 400));
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiClient.get('/safari-packages')).rejects.toBeInstanceOf(ApiError);
  });
});
