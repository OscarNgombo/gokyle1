import { ApiError } from '@/api/client';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { ref, get, set, push, remove, update } from 'firebase/database';
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
  ContentPageAdminRecord,
  ContentPageAdminListResponse,
  ContentPageAdminUpdateInput,
  ContentStatus,
  DestinationDetailResponse,
  DestinationAdminInput,
  DestinationAdminRecord,
  DestinationAdminListResponse,
  DestinationCountry,
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

// Helper utilities for local database translations and serialization

const translateDuration = (durationLabelEn: string, locale: string) => {
  if (locale === 'en') return durationLabelEn;
  const deReplacements = [
    ["Half Day", "Halber Tag"],
    ["Days", "Tage"],
    ["Day", "Tag"],
    ["Nights", "Nächte"],
    ["Night", "Nacht"],
  ];
  const itReplacements = [
    ["Half Day", "Mezza giornata"],
    ["Days", "giorni"],
    ["Day", "giorno"],
    ["Nights", "notti"],
    ["Night", "notte"],
  ];
  const replacements = locale === 'de' ? deReplacements : (locale === 'it' ? itReplacements : []);
  let translated = durationLabelEn;
  for (const [source, target] of replacements) {
    translated = translated.replace(source, target);
  }
  return translated;
};

const translateGroupSize = (groupSizeLabelEn: string, locale: string) => {
  if (locale === 'en') return groupSizeLabelEn;
  const replacement = locale === 'de' ? 'Personen' : 'persone';
  return groupSizeLabelEn.replace('People', replacement);
};

const formatPrice = (amount: number, currency: string) => {
  return `${currency} ${amount.toLocaleString()}`;
};

const getTranslation = (translations: any, locale: string) => {
  if (!translations) return '';
  return translations[locale] || translations['en'] || Object.values(translations)[0] || '';
};

const serializePackage = (pkg: any, locale: string) => {
  const titleEn = getTranslation(pkg.titleTranslations || pkg.title_translations, 'en');
  const priceNote = getTranslation(pkg.priceNoteTranslations || pkg.price_note_translations, locale);

  return {
    id: pkg.id,
    slug: pkg.slug,
    category: pkg.category,
    featured: pkg.featured,
    active: pkg.active,
    sortOrder: pkg.sortOrder ?? pkg.sort_order,
    title: getTranslation(pkg.titleTranslations || pkg.title_translations, locale),
    titleEn: titleEn,
    description: getTranslation(pkg.descriptionTranslations || pkg.description_translations, locale),
    highlights: getTranslation(pkg.highlightsTranslations || pkg.highlights_translations, locale) || [],
    duration: translateDuration(pkg.durationLabelEn || pkg.duration_label_en, locale),
    durationDays: pkg.durationDays ?? pkg.duration_days,
    durationLabelEn: pkg.durationLabelEn || pkg.duration_label_en,
    groupSize: translateGroupSize(pkg.groupSizeLabelEn || pkg.group_size_label_en, locale),
    minGroupSize: pkg.minGroupSize ?? pkg.min_group_size,
    groupSizeLabelEn: pkg.groupSizeLabelEn || pkg.group_size_label_en,
    location: pkg.location,
    price: formatPrice(pkg.priceAmount ?? pkg.price_amount, pkg.priceCurrency ?? pkg.price_currency),
    priceNote: priceNote,
    priceAmount: pkg.priceAmount ?? pkg.price_amount,
    priceCurrency: pkg.priceCurrency ?? pkg.price_currency,
    rating: pkg.rating,
    reviewsCount: pkg.reviewsCount ?? pkg.reviews_count,
    imageKey: pkg.imageKey ?? pkg.image_key,
    imageUrl: pkg.imageUrl ?? pkg.image_url,
  };
};

const MONTHS: Record<string, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  de: ["Januar", "Februar", "Maerz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  it: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
};

const formatBlogDate = (dateStr: string | null | undefined, locale: string) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const month = MONTHS[locale]?.[d.getMonth()] || MONTHS['en'][d.getMonth()];
  if (locale === 'en') {
    return `${month} ${d.getDate()}, ${d.getFullYear()}`;
  }
  if (locale === 'de') {
    return `${d.getDate()}. ${month} ${d.getFullYear()}`;
  }
  return `${d.getDate()} ${month} ${d.getFullYear()}`;
};

const formatReadTime = (minutes: number, locale: string) => {
  if (locale === 'de') return `${minutes} Min. Lesezeit`;
  if (locale === 'it') return `${minutes} min di lettura`;
  return `${minutes} min read`;
};

const serializeBlogSummary = (post: any, locale: string) => {
  return {
    id: post.id,
    slug: post.slug,
    title: getTranslation(post.titleTranslations || post.title_translations, locale),
    excerpt: getTranslation(post.excerptTranslations || post.excerpt_translations, locale),
    category_key: post.categoryKey ?? post.category_key,
    category_label: getBlogCategoryLabel(post.categoryKey ?? post.category_key, locale),
    author_name: post.authorName ?? post.author_name,
    published_at: post.publishedAt ?? post.published_at ?? post.published_on,
    date_label: formatBlogDate(post.publishedAt ?? post.published_at ?? post.published_on, locale),
    read_time: formatReadTime(post.readTimeMinutes ?? post.read_time_minutes, locale),
    read_time_minutes: post.readTimeMinutes ?? post.read_time_minutes,
    featured: post.featured,
    image_key: post.imageKey ?? post.image_key,
  };
};

const getBlogCategoryLabel = (cat: string, locale: string) => {
  const labels: Record<string, Record<string, string>> = {
    en: {
      "all": "All",
      "wildlife": "Wildlife",
      "travel-tips": "Travel Tips",
      "destinations": "Destinations",
      "photography": "Photography",
      "culture": "Culture",
      "beach": "Beach",
      "conservation": "Conservation",
    },
    de: {
      "all": "Alle",
      "wildlife": "Wildlife",
      "travel-tips": "Reisetipps",
      "destinations": "Reiseziele",
      "photography": "Fotografie",
      "culture": "Kultur",
      "beach": "Strand",
      "conservation": "Naturschutz",
    },
    it: {
      "all": "Tutte",
      "wildlife": "Fauna selvatica",
      "travel-tips": "Consigli di viaggio",
      "destinations": "Destinazioni",
      "photography": "Fotografia",
      "culture": "Cultura",
      "beach": "Mare",
      "conservation": "Conservazione",
    }
  };
  return labels[locale]?.[cat] || labels['en'][cat] || cat;
};

const getCountryLabel = (country: string, locale: string) => {
  const labels: Record<string, Record<string, string>> = {
    en: {"kenya": "Kenya", "tanzania": "Tanzania"},
    de: {"kenya": "Kenia", "tanzania": "Tansania"},
    it: {"kenya": "Kenya", "tanzania": "Tanzania"}
  };
  return labels[locale]?.[country] || labels['en'][country] || country;
};

const getExperienceLabel = (exp: string, locale: string) => {
  const labels: Record<string, Record<string, string>> = {
    en: {
      "wildlife": "Wildlife",
      "coast": "Coast & Islands",
      "culture": "Culture & Cities",
      "mountains": "Mountains & Trails",
    },
    de: {
      "wildlife": "Wildlife",
      "coast": "Kueste & Inseln",
      "culture": "Kultur & Staedte",
      "mountains": "Berge & Trails",
    },
    it: {
      "wildlife": "Fauna selvatica",
      "coast": "Costa e isole",
      "culture": "Cultura e citta",
      "mountains": "Montagne e trekking",
    }
  };
  return labels[locale]?.[exp] || labels['en'][exp] || exp;
};

const serializeDestination = (dest: any, locale: string) => {
  const experiences = dest.experienceKeys ?? dest.experience_keys ?? [];
  return {
    id: dest.id,
    slug: dest.slug,
    name: getTranslation(dest.nameTranslations || dest.name_translations, locale),
    description: getTranslation(dest.descriptionTranslations || dest.description_translations, locale),
    country: dest.country,
    country_label: getCountryLabel(dest.country, locale),
    experience_keys: experiences,
    experience_labels: experiences.map((exp: string) => getExperienceLabel(exp, locale)),
    featured: dest.featured,
    sort_order: dest.sortOrder ?? dest.sort_order,
    image_key: dest.imageKey ?? dest.image_key,
  };
};

// Authentication & User Management Services

export const loginAdminUser = async (input: AdminLoginInput): Promise<AdminLoginResponse> => {
  const email = input.email.trim().toLowerCase();
  
  try {
    const snapshot = await get(ref(db, 'admin_users'));
    let dbUser: any = null;
    let isDbEmpty = true;
    
    if (snapshot.exists()) {
      const users = Object.values(snapshot.val()) as any[];
      isDbEmpty = users.length === 0;
      dbUser = users.find(u => u.email.toLowerCase() === email);
    }
    
    // Auto-bootstrap default credentials if database is empty or matches admin@example.com
    if (isDbEmpty || (!dbUser && email === 'admin@example.com')) {
      const bootstrapEmail = 'admin@example.com';
      const bootstrapPassword = 'password123';
      
      if (email === bootstrapEmail && input.password === bootstrapPassword) {
        let userCredential;
        try {
          userCredential = await signInWithEmailAndPassword(auth, bootstrapEmail, bootstrapPassword);
        } catch (e: any) {
          if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential' || String(e).includes('EMAIL_NOT_FOUND')) {
            const { createUserWithEmailAndPassword } = await import('firebase/auth');
            userCredential = await createUserWithEmailAndPassword(auth, bootstrapEmail, bootstrapPassword);
          } else {
            throw e;
          }
        }
        
        const idToken = await userCredential.user.getIdToken();
        const createdAt = new Date().toISOString();
        dbUser = {
          id: userCredential.user.uid,
          email: bootstrapEmail,
          fullName: 'Gokyle Admin',
          role: 'super_admin',
          isActive: true,
          createdAt,
          updatedAt: createdAt,
        };
        await set(ref(db, `admin_users/${userCredential.user.uid}`), dbUser);
        
        return {
          accessToken: idToken,
          tokenType: 'bearer',
          expiresIn: 3600,
          user: dbUser,
        };
      }
    }
    
    if (!dbUser || !dbUser.isActive) {
      throw new ApiError('Access denied. Your email is not registered as an administrator.', 403, null);
    }
    
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, input.password);
    } catch (e: any) {
      if ((e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential' || String(e).includes('EMAIL_NOT_FOUND')) && dbUser.tempPassword === input.password) {
        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        userCredential = await createUserWithEmailAndPassword(auth, email, input.password);
        
        const userRef = ref(db, `admin_users/${dbUser.id}`);
        await update(userRef, { tempPassword: null });
      } else {
        throw e;
      }
    }
    
    const idToken = await userCredential.user.getIdToken();
    
    await set(ref(db, `admin_users/${dbUser.id}/lastLoginAt`), new Date().toISOString());

    const adminUser: AdminUser = {
      id: dbUser.id,
      email: dbUser.email,
      fullName: dbUser.fullName || dbUser.full_name || 'Admin User',
      role: dbUser.role || 'operations_agent',
      isActive: dbUser.isActive,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
      lastLoginAt: new Date().toISOString(),
    };

    return {
      accessToken: idToken,
      tokenType: 'bearer',
      expiresIn: 3600,
      user: adminUser,
    };
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Login failed', 401, null);
  }
};

export const loginAdminUserWithGoogle = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
};

export const handleGoogleRedirect = async (): Promise<AdminLoginResponse | null> => {
  try {
    const userCredential = await getRedirectResult(auth);
    if (!userCredential) {
      return null;
    }
    const idToken = await userCredential.user.getIdToken();
    const email = userCredential.user.email || '';
    
    const snapshot = await get(ref(db, 'admin_users'));
    let dbUser: any = null;
    
    if (snapshot.exists()) {
      const users = Object.values(snapshot.val()) as any[];
      dbUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }
    
    if (!dbUser && (!snapshot.exists() || Object.keys(snapshot.val()).length === 0)) {
      const nextId = userCredential.user.uid;
      const createdAt = new Date().toISOString();
      dbUser = {
        id: nextId,
        email: email,
        fullName: userCredential.user.displayName || 'Gokyle Admin',
        role: 'super_admin',
        isActive: true,
        createdAt,
        updatedAt: createdAt,
      };
      await set(ref(db, `admin_users/${nextId}`), dbUser);
    }
    
    if (!dbUser || !dbUser.isActive) {
      await auth.signOut();
      throw new ApiError('Access denied. Your email is not registered as an administrator.', 403, null);
    }
    
    await set(ref(db, `admin_users/${dbUser.id}/lastLoginAt`), new Date().toISOString());

    const adminUser: AdminUser = {
      id: dbUser.id,
      email: dbUser.email,
      fullName: dbUser.fullName || dbUser.full_name || 'Admin User',
      role: dbUser.role || 'operations_agent',
      isActive: dbUser.isActive,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
      lastLoginAt: new Date().toISOString(),
    };

    return {
      accessToken: idToken,
      tokenType: 'bearer',
      expiresIn: 3600,
      user: adminUser,
    };
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Google login failed', 401, null);
  }
};


export const getCurrentAdminUser = async (accessToken: string): Promise<AdminUser> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        // Fetch full profile from DB
        get(ref(db, `admin_users/${user.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.val();
            resolve({
              id: val.id,
              email: val.email,
              fullName: val.fullName || val.full_name || 'Admin User',
              role: val.role || 'operations_agent',
              isActive: val.isActive ?? true,
              createdAt: val.createdAt,
              updatedAt: val.updatedAt,
              lastLoginAt: val.lastLoginAt || null,
            });
          } else {
            resolve({
              id: user.uid,
              email: user.email || '',
              fullName: user.displayName || 'Admin User',
              role: 'super_admin',
              isActive: true,
              createdAt: user.metadata.creationTime || new Date().toISOString(),
              updatedAt: user.metadata.lastSignInTime || new Date().toISOString(),
            });
          }
        }).catch(() => {
          reject(new ApiError('Unauthorized', 401, null));
        });
      } else {
        reject(new ApiError('Unauthorized', 401, null));
      }
    });
  });
};

export const listAdminUsers = async (accessToken: string): Promise<AdminUser[]> => {
  const snapshot = await get(ref(db, 'admin_users'));
  if (!snapshot.exists()) {
    return [];
  }
  const users = Object.values(snapshot.val()) as any[];
  return users.map(u => ({
    id: u.id,
    email: u.email,
    fullName: u.fullName || u.full_name || 'Admin User',
    role: u.role,
    isActive: u.isActive ?? true,
    createdAt: u.createdAt || new Date().toISOString(),
    updatedAt: u.updatedAt || new Date().toISOString(),
    lastLoginAt: u.lastLoginAt || null,
  }));
};

export const updateAdminUserRole = async (accessToken: string, userId: string, role: string): Promise<AdminUser> => {
  const userRef = ref(db, `admin_users/${userId}`);
  const snap = await get(userRef);
  if (!snap.exists()) {
    throw new Error('User not found');
  }
  const current = snap.val();
  const updated = {
    ...current,
    role,
    updatedAt: new Date().toISOString(),
  };
  await set(userRef, updated);
  return {
    id: updated.id,
    email: updated.email,
    fullName: updated.fullName || updated.full_name || 'Admin User',
    role: updated.role,
    isActive: updated.isActive ?? true,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
    lastLoginAt: updated.lastLoginAt || null,
  };
};

export const updateAdminUserStatus = async (accessToken: string, userId: string, isActive: boolean): Promise<AdminUser> => {
  const userRef = ref(db, `admin_users/${userId}`);
  const snap = await get(userRef);
  if (!snap.exists()) {
    throw new Error('User not found');
  }
  const current = snap.val();
  const updated = {
    ...current,
    isActive,
    updatedAt: new Date().toISOString(),
  };
  await set(userRef, updated);
  return {
    id: updated.id,
    email: updated.email,
    fullName: updated.fullName || updated.full_name || 'Admin User',
    role: updated.role,
    isActive: updated.isActive ?? true,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
    lastLoginAt: updated.lastLoginAt || null,
  };
};

export const deleteAdminUser = async (accessToken: string, userId: string): Promise<void> => {
  const userRef = ref(db, `admin_users/${userId}`);
  await remove(userRef);
};


export const registerAdminUser = async (accessToken: string, input: any): Promise<AdminUser> => {
  const snapshot = await get(ref(db, 'admin_users'));
  const email = input.email.trim().toLowerCase();
  
  if (snapshot.exists()) {
    const users = Object.values(snapshot.val()) as any[];
    if (users.some(u => u.email.toLowerCase() === email)) {
      throw new ApiError('Admin user with this email already exists', 400, null);
    }
  }

  const userRef = push(ref(db, 'admin_users'));
  const id = userRef.key as string;
  const createdAt = new Date().toISOString();
  
  const record = {
    id,
    email,
    fullName: input.full_name || input.fullName,
    role: input.role,
    isActive: true,
    tempPassword: input.password,
    createdAt,
    updatedAt: createdAt,
  };
  
  await set(userRef, record);
  
  return {
    id,
    email,
    fullName: record.fullName,
    role: record.role,
    isActive: true,
    createdAt,
    updatedAt: createdAt,
  };
};

// Safari Package Services

export const listSafariPackages = async (filters: SafariPackageListFilters = {}): Promise<SafariPackageListResponse> => {
  const snapshot = await get(ref(db, 'safari_packages'));
  if (!snapshot.exists()) {
    return { items: [], total: 0 };
  }
  
  const locale = filters.locale || 'en';
  let packages = Object.values(snapshot.val()) as any[];
  
  packages = packages.filter(p => p.active);
  
  if (filters.category) {
    packages = packages.filter(p => p.category === filters.category);
  }
  if (filters.featured !== undefined && filters.featured !== null) {
    packages = packages.filter(p => p.featured === filters.featured);
  }
  
  packages.sort((a, b) => {
    const sortA = a.sortOrder ?? a.sort_order ?? 0;
    const sortB = b.sortOrder ?? b.sort_order ?? 0;
    if (sortA !== sortB) return sortA - sortB;
    return a.id - b.id;
  });
  
  const items = packages.map(p => serializePackage(p, locale));
  return {
    items,
    total: items.length,
    locale: locale as any,
  };
};

export const getSafariPackage = async (packageId: SafariPackageId, locale: any = 'en'): Promise<SafariPackageDetailResponse> => {
  const snapshot = await get(ref(db, `safari_packages/${packageId}`));
  if (!snapshot.exists() || !snapshot.val().active) {
    throw new Error('Safari package not found');
  }
  return {
    item: serializePackage(snapshot.val(), locale),
    locale,
  };
};

// Blog Services

export const listPublicBlogPosts = async (filters: BlogPostListFilters = {}): Promise<BlogPostListResponse> => {
  const snapshot = await get(ref(db, 'blog_posts'));
  if (!snapshot.exists()) {
    return { items: [], total: 0 };
  }
  
  const locale = filters.locale || 'en';
  let posts = Object.values(snapshot.val()) as any[];
  
  posts = posts.filter(p => (p.status === 'published' || p.status === 'publish'));
  
  if (filters.category) {
    posts = posts.filter(p => (p.categoryKey ?? p.category_key) === filters.category);
  }
  if (filters.featured !== undefined && filters.featured !== null) {
    posts = posts.filter(p => p.featured === filters.featured);
  }
  
  posts.sort((a, b) => {
    const sortA = a.sortOrder ?? a.sort_order ?? 0;
    const sortB = b.sortOrder ?? b.sort_order ?? 0;
    if (sortA !== sortB) return sortA - sortB;
    return a.id - b.id;
  });
  
  const items = posts.map(p => serializeBlogSummary(p, locale));
  return {
    items,
    total: items.length,
  };
};

export const getPublicBlogPost = async (lookup: string, locale: any = 'en'): Promise<BlogPostDetailResponse> => {
  const snapshot = await get(ref(db, 'blog_posts'));
  if (!snapshot.exists()) {
    throw new Error('Blog post not found');
  }
  
  const posts = Object.values(snapshot.val()) as any[];
  const post = posts.find(p => String(p.id) === lookup || p.slug === lookup);
  if (!post || (post.status !== 'published' && post.status !== 'publish')) {
    throw new Error('Blog post not found');
  }
  
  const summary = serializeBlogSummary(post, locale);
  return {
    ...summary,
    content: getTranslation(post.contentTranslations || post.content_translations, locale),
    locale,
  };
};

// Destination Services

export const listPublicDestinations = async (filters: DestinationListFilters = {}): Promise<DestinationListResponse> => {
  const snapshot = await get(ref(db, 'destinations'));
  if (!snapshot.exists()) {
    return { items: [], total: 0 };
  }
  
  const locale = filters.locale || 'en';
  let destinations = Object.values(snapshot.val()) as any[];
  
  destinations = destinations.filter(d => d.status === 'published');
  
  if (filters.country) {
    destinations = destinations.filter(d => d.country === filters.country);
  }
  if (filters.featured !== undefined && filters.featured !== null) {
    destinations = destinations.filter(d => d.featured === filters.featured);
  }
  if (filters.experience) {
    destinations = destinations.filter(d => (d.experienceKeys ?? d.experience_keys ?? []).includes(filters.experience));
  }
  
  destinations.sort((a, b) => {
    const sortA = a.sortOrder ?? a.sort_order ?? 0;
    const sortB = b.sortOrder ?? b.sort_order ?? 0;
    if (sortA !== sortB) return sortA - sortB;
    return a.id - b.id;
  });
  
  const items = destinations.map(d => serializeDestination(d, locale));
  return {
    items,
    total: items.length,
  };
};

export const getPublicDestination = async (slug: string, locale: any = 'en'): Promise<DestinationDetailResponse> => {
  const snapshot = await get(ref(db, 'destinations'));
  if (!snapshot.exists()) {
    throw new Error('Destination not found');
  }
  
  const destinations = Object.values(snapshot.val()) as any[];
  const dest = destinations.find(d => d.slug === slug);
  if (!dest || dest.status !== 'published') {
    throw new Error('Destination not found');
  }
  
  return {
    item: serializeDestination(dest, locale),
    locale,
  };
};

// Content Page Services

export const getPublicPageContent = async (pageKey: string, locale: any = 'en'): Promise<PageContentResponse> => {
  const snapshot = await get(ref(db, `pages/${pageKey}`));
  if (!snapshot.exists()) {
    throw new Error('Page not found');
  }
  
  const page = snapshot.val();
  if (page.status !== 'published') {
    throw new Error('Page not found');
  }
  
  const rawSections = page.sections || [];
  const sections = Object.values(rawSections)
    .filter((sec: any) => sec.status === 'published')
    .map((sec: any) => ({
      key: sec.key,
      type: sec.type,
      sort_order: sec.sortOrder ?? sec.sort_order ?? 0,
      payload: getTranslation(sec.payloadTranslations || sec.payload_translations, locale),
    }));
    
  sections.sort((a: any, b: any) => a.sort_order - b.sort_order);
  
  return {
    key: page.key,
    routePath: page.routePath ?? page.route_path,
    title: getTranslation(page.titleTranslations || page.title_translations, locale),
    locale,
    sections,
  };
};

// Booking Request Services

export const createBookingRequest = async (input: BookingRequestInput): Promise<BookingRequestResponse> => {
  const bookingRef = push(ref(db, 'booking_requests'));
  const id = bookingRef.key as string;
  
  let packageTitle = '';
  let packageTitleEn = '';
  try {
    const pkgSnap = await get(ref(db, `safari_packages/${input.packageId}`));
    if (pkgSnap.exists()) {
      const pkg = pkgSnap.val();
      packageTitle = getTranslation(pkg.titleTranslations || pkg.title_translations, input.locale || 'en');
      packageTitleEn = getTranslation(pkg.titleTranslations || pkg.title_translations, 'en');
    }
  } catch (err) {
    console.error('Error fetching package details for booking request', err);
  }

  const createdAt = new Date().toISOString();
  const newBooking = {
    id,
    packageId: input.packageId,
    packageTitle,
    packageTitleEn,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    customerNationality: input.customerNationality,
    adultsCount: input.adultsCount ?? 1,
    childrenCount: input.childrenCount ?? 0,
    accommodationPreference: input.accommodationPreference || '',
    specialRequests: input.specialRequests || '',
    locale: input.locale || 'en',
    status: 'received',
    createdAt,
    updatedAt: createdAt,
    assignedAdmin: null,
    internalNotes: '',
  };
  
  await set(bookingRef, newBooking);
  
  return {
    id,
    status: 'received',
    createdAt,
    packageId: input.packageId,
    packageTitle,
    packageTitleEn,
  };
};

// Contact Inquiry Services

export const createContactInquiry = async (input: ContactInquiryInput): Promise<ContactInquiryResponse> => {
  const inquiryRef = push(ref(db, 'contact_inquiries'));
  const id = inquiryRef.key as string;
  const createdAt = new Date().toISOString();
  
  const newInquiry = {
    id,
    locale: input.locale || 'en',
    name: input.name,
    email: input.email,
    phone: input.phone || '',
    subject: input.subject || 'Inquiry',
    message: input.message,
    status: 'received',
    createdAt,
    updatedAt: createdAt,
    assignedAdmin: null,
    internalNotes: '',
  };
  
  await set(inquiryRef, newInquiry);
  
  return {
    id,
    status: 'received',
    createdAt,
  };
};

// Admin Booking Request Services

export const listAdminBookingRequests = async (
  accessToken: string,
  filters: BookingRequestAdminListFilters = {},
): Promise<BookingRequestAdminListResponse> => {
  const snapshot = await get(ref(db, 'booking_requests'));
  if (!snapshot.exists()) {
    return { items: [], total: 0, statusCounts: {} as any };
  }
  
  let items = Object.values(snapshot.val()) as any[];
  
  const statusCounts: any = {
    received: 0,
    in_review: 0,
    responded: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    spam: 0,
  };
  items.forEach(item => {
    if (statusCounts[item.status] !== undefined) {
      statusCounts[item.status]++;
    }
  });

  if (filters.status) {
    items = items.filter(item => item.status === filters.status);
  }
  if (filters.assigned) {
    if (filters.assigned === 'me') {
      const currentUser = auth.currentUser;
      items = items.filter(item => item.assignedAdmin?.id === currentUser?.uid);
    } else if (filters.assigned === 'unassigned') {
      items = items.filter(item => !item.assignedAdmin);
    }
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    items = items.filter(item => 
      item.customerName?.toLowerCase().includes(searchLower) ||
      item.customerEmail?.toLowerCase().includes(searchLower) ||
      item.packageTitle?.toLowerCase().includes(searchLower) ||
      item.packageTitleEn?.toLowerCase().includes(searchLower)
    );
  }
  
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return {
    items,
    total: items.length,
    statusCounts,
  };
};

export const getAdminBookingRequest = async (
  accessToken: string,
  bookingRequestId: string,
): Promise<BookingRequestAdminDetail> => {
  const snapshot = await get(ref(db, `booking_requests/${bookingRequestId}`));
  if (!snapshot.exists()) {
    throw new Error('Booking request not found');
  }
  return snapshot.val();
};

export const updateAdminBookingRequest = async (
  accessToken: string,
  bookingRequestId: string,
  input: BookingRequestAdminUpdateInput,
): Promise<BookingRequestAdminDetail> => {
  const bookingRef = ref(db, `booking_requests/${bookingRequestId}`);
  const snapshot = await get(bookingRef);
  if (!snapshot.exists()) {
    throw new Error('Booking request not found');
  }
  
  const current = snapshot.val();
  const updates: any = {
    ...current,
    updatedAt: new Date().toISOString(),
  };
  
  if (input.status !== undefined) updates.status = input.status;
  if (input.internalNotes !== undefined) updates.internalNotes = input.internalNotes;
  if (input.assignedAdminUserId !== undefined) {
    if (input.assignedAdminUserId === null) {
      updates.assignedAdmin = null;
    } else {
      const currentUser = auth.currentUser;
      updates.assignedAdmin = {
        id: input.assignedAdminUserId,
        email: currentUser?.email || 'admin@gokyle.com',
        fullName: currentUser?.displayName || 'Admin User',
      };
    }
  }
  
  await set(bookingRef, updates);
  return updates;
};

// Admin Contact Inquiry Services

export const listAdminContactInquiries = async (
  accessToken: string,
  filters: ContactInquiryAdminListFilters = {},
): Promise<ContactInquiryAdminListResponse> => {
  const snapshot = await get(ref(db, 'contact_inquiries'));
  if (!snapshot.exists()) {
    return { items: [], total: 0, statusCounts: {} as any };
  }
  
  let items = Object.values(snapshot.val()) as any[];
  
  const statusCounts: any = {
    received: 0,
    in_review: 0,
    responded: 0,
    resolved: 0,
    spam: 0,
  };
  items.forEach(item => {
    if (statusCounts[item.status] !== undefined) {
      statusCounts[item.status]++;
    }
  });

  if (filters.status) {
    items = items.filter(item => item.status === filters.status);
  }
  if (filters.assigned) {
    if (filters.assigned === 'me') {
      const currentUser = auth.currentUser;
      items = items.filter(item => item.assignedAdmin?.id === currentUser?.uid);
    } else if (filters.assigned === 'unassigned') {
      items = items.filter(item => !item.assignedAdmin);
    }
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    items = items.filter(item => 
      item.name?.toLowerCase().includes(searchLower) ||
      item.email?.toLowerCase().includes(searchLower) ||
      item.subject?.toLowerCase().includes(searchLower)
    );
  }
  
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return {
    items,
    total: items.length,
    statusCounts,
  };
};

export const getAdminContactInquiry = async (
  accessToken: string,
  inquiryId: string,
): Promise<ContactInquiryAdminDetail> => {
  const snapshot = await get(ref(db, `contact_inquiries/${inquiryId}`));
  if (!snapshot.exists()) {
    throw new Error('Contact inquiry not found');
  }
  return snapshot.val();
};

export const updateAdminContactInquiry = async (
  accessToken: string,
  inquiryId: string,
  input: ContactInquiryAdminUpdateInput,
): Promise<ContactInquiryAdminDetail> => {
  const inquiryRef = ref(db, `contact_inquiries/${inquiryId}`);
  const snapshot = await get(inquiryRef);
  if (!snapshot.exists()) {
    throw new Error('Contact inquiry not found');
  }
  
  const current = snapshot.val();
  const updates: any = {
    ...current,
    updatedAt: new Date().toISOString(),
  };
  
  if (input.status !== undefined) updates.status = input.status;
  if (input.internalNotes !== undefined) updates.internalNotes = input.internalNotes;
  if (input.assignedAdminUserId !== undefined) {
    if (input.assignedAdminUserId === null) {
      updates.assignedAdmin = null;
    } else {
      const currentUser = auth.currentUser;
      updates.assignedAdmin = {
        id: input.assignedAdminUserId,
        email: currentUser?.email || 'admin@gokyle.com',
        fullName: currentUser?.displayName || 'Admin User',
      };
    }
  }
  
  await set(inquiryRef, updates);
  return updates;
};

// Admin Safari Package Operations

export const listAdminSafariPackages = async (
  accessToken: string,
  filters: {
    category?: SafariPackageCategory;
    active?: boolean;
  } = {},
): Promise<SafariPackageAdminListResponse> => {
  const snapshot = await get(ref(db, 'safari_packages'));
  if (!snapshot.exists()) {
    return { items: [], total: 0 };
  }
  
  let items = Object.values(snapshot.val()) as any[];
  
  if (filters.category) {
    items = items.filter(i => i.category === filters.category);
  }
  if (filters.active !== undefined && filters.active !== null) {
    items = items.filter(i => i.active === filters.active);
  }
  
  items.sort((a, b) => {
    const sortA = a.sortOrder ?? a.sort_order ?? 0;
    const sortB = b.sortOrder ?? b.sort_order ?? 0;
    if (sortA !== sortB) return sortA - sortB;
    return a.id - b.id;
  });
  
  const records = items.map(item => ({
    id: item.id,
    slug: item.slug,
    category: item.category,
    featured: item.featured,
    active: item.active,
    sortOrder: item.sortOrder ?? item.sort_order ?? 0,
    titleTranslations: item.titleTranslations || item.title_translations,
    descriptionTranslations: item.descriptionTranslations || item.description_translations,
    highlightsTranslations: item.highlightsTranslations || item.highlights_translations,
    priceNoteTranslations: item.priceNoteTranslations || item.price_note_translations || {},
    durationDays: item.durationDays ?? item.duration_days ?? 0,
    durationLabelEn: item.durationLabelEn || item.duration_label_en,
    minGroupSize: item.minGroupSize ?? item.min_group_size ?? 1,
    groupSizeLabelEn: item.groupSizeLabelEn || item.group_size_label_en,
    location: item.location,
    priceAmount: item.priceAmount ?? item.price_amount,
    priceCurrency: item.priceCurrency ?? item.price_currency,
    rating: item.rating,
    reviewsCount: item.reviewsCount ?? item.reviews_count ?? 0,
    imageKey: item.imageKey ?? item.image_key,
    imageUrl: item.imageUrl ?? item.image_url,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  }));
  
  return {
    items: records,
    total: records.length,
  };
};

export const createAdminSafariPackage = async (
  accessToken: string,
  input: SafariPackageAdminInput,
): Promise<SafariPackageAdminRecord> => {
  const snapshot = await get(ref(db, 'safari_packages'));
  let nextId = 1;
  if (snapshot.exists()) {
    const ids = Object.keys(snapshot.val()).map(Number).filter(n => !isNaN(n));
    if (ids.length > 0) {
      nextId = Math.max(...ids) + 1;
    }
  }

  const slug = input.slug || input.titleTranslations?.en.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `package-${nextId}`;
  const createdAt = new Date().toISOString();
  
  const record: SafariPackageAdminRecord = {
    ...input,
    id: nextId,
    slug,
    createdAt,
    updatedAt: createdAt,
  };
  
  await set(ref(db, `safari_packages/${nextId}`), record);
  return record;
};

export const updateAdminSafariPackage = async (
  accessToken: string,
  packageId: SafariPackageId,
  input: SafariPackageAdminInput,
): Promise<SafariPackageAdminRecord> => {
  const packageRef = ref(db, `safari_packages/${packageId}`);
  const snap = await get(packageRef);
  if (!snap.exists()) {
    throw new Error('Safari package not found');
  }
  
  const current = snap.val();
  const updated: SafariPackageAdminRecord = {
    ...current,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  
  await set(packageRef, updated);
  return updated;
};

export const deleteAdminSafariPackage = async (accessToken: string, packageId: SafariPackageId): Promise<void> => {
  await remove(ref(db, `safari_packages/${packageId}`));
};

// Admin Blog Post Operations

export const listAdminBlogPosts = async (
  accessToken: string,
  filters: {
    status?: ContentStatus;
    category?: BlogCategory;
  } = {},
): Promise<BlogPostAdminListResponse> => {
  const snapshot = await get(ref(db, 'blog_posts'));
  if (!snapshot.exists()) {
    return { items: [], total: 0 };
  }
  
  let items = Object.values(snapshot.val()) as any[];
  
  if (filters.status) {
    items = items.filter(i => i.status === filters.status);
  }
  if (filters.category) {
    items = items.filter(i => (i.categoryKey ?? i.category_key) === filters.category);
  }
  
  items.sort((a, b) => {
    const sortA = a.sortOrder ?? a.sort_order ?? 0;
    const sortB = b.sortOrder ?? b.sort_order ?? 0;
    if (sortA !== sortB) return sortA - sortB;
    return a.id - b.id;
  });
  
  const records = items.map(item => ({
    id: item.id,
    slug: item.slug,
    status: item.status,
    featured: item.featured,
    sortOrder: item.sortOrder ?? item.sort_order ?? 0,
    categoryKey: item.categoryKey ?? item.category_key,
    authorName: item.authorName ?? item.author_name,
    imageKey: item.imageKey ?? item.image_key,
    publishedAt: item.publishedAt ?? item.published_at ?? item.published_on,
    readTimeMinutes: item.readTimeMinutes ?? item.read_time_minutes ?? 0,
    titleTranslations: item.titleTranslations || item.title_translations,
    excerptTranslations: item.excerptTranslations || item.excerpt_translations,
    contentTranslations: item.contentTranslations || item.content_translations,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  }));
  
  return {
    items: records,
    total: records.length,
  };
};

export const createAdminBlogPost = async (
  accessToken: string,
  input: BlogPostAdminInput,
): Promise<BlogPostAdminRecord> => {
  const snapshot = await get(ref(db, 'blog_posts'));
  let nextId = 1;
  if (snapshot.exists()) {
    const ids = Object.keys(snapshot.val()).map(Number).filter(n => !isNaN(n));
    if (ids.length > 0) {
      nextId = Math.max(...ids) + 1;
    }
  }

  const slug = input.slug || input.titleTranslations?.en.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `post-${nextId}`;
  const createdAt = new Date().toISOString();
  
  const record: BlogPostAdminRecord = {
    ...input,
    id: nextId,
    slug,
    createdAt,
    updatedAt: createdAt,
  };
  
  await set(ref(db, `blog_posts/${nextId}`), record);
  return record;
};

export const updateAdminBlogPost = async (
  accessToken: string,
  postId: number,
  input: BlogPostAdminInput,
): Promise<BlogPostAdminRecord> => {
  const postRef = ref(db, `blog_posts/${postId}`);
  const snap = await get(postRef);
  if (!snap.exists()) {
    throw new Error('Blog post not found');
  }
  
  const current = snap.val();
  const updated: BlogPostAdminRecord = {
    ...current,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  
  await set(postRef, updated);
  return updated;
};

export const deleteAdminBlogPost = async (accessToken: string, postId: number): Promise<void> => {
  await remove(ref(db, `blog_posts/${postId}`));
};

// Admin Destination Operations

export const listAdminDestinations = async (
  accessToken: string,
  filters: {
    status?: ContentStatus;
    country?: DestinationCountry;
  } = {},
): Promise<DestinationAdminListResponse> => {
  const snapshot = await get(ref(db, 'destinations'));
  if (!snapshot.exists()) {
    return { items: [], total: 0 };
  }
  
  let items = Object.values(snapshot.val()) as any[];
  
  if (filters.status) {
    items = items.filter(i => i.status === filters.status);
  }
  if (filters.country) {
    items = items.filter(i => i.country === filters.country);
  }
  
  items.sort((a, b) => {
    const sortA = a.sortOrder ?? a.sort_order ?? 0;
    const sortB = b.sortOrder ?? b.sort_order ?? 0;
    if (sortA !== sortB) return sortA - sortB;
    return a.id - b.id;
  });
  
  const records = items.map(item => ({
    id: item.id,
    slug: item.slug,
    status: item.status,
    featured: item.featured,
    sortOrder: item.sortOrder ?? item.sort_order ?? 0,
    country: item.country,
    experienceKeys: item.experienceKeys ?? item.experience_keys ?? [],
    imageKey: item.imageKey ?? item.image_key,
    nameTranslations: item.nameTranslations || item.name_translations,
    descriptionTranslations: item.descriptionTranslations || item.description_translations,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  }));
  
  return {
    items: records,
    total: records.length,
  };
};

export const createAdminDestination = async (
  accessToken: string,
  input: DestinationAdminInput,
): Promise<DestinationAdminRecord> => {
  const snapshot = await get(ref(db, 'destinations'));
  let nextId = 1;
  if (snapshot.exists()) {
    const ids = Object.keys(snapshot.val()).map(Number).filter(n => !isNaN(n));
    if (ids.length > 0) {
      nextId = Math.max(...ids) + 1;
    }
  }

  const slug = input.slug || input.nameTranslations?.en.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `destination-${nextId}`;
  const createdAt = new Date().toISOString();
  
  const record: DestinationAdminRecord = {
    ...input,
    id: nextId,
    slug,
    createdAt,
    updatedAt: createdAt,
  };
  
  await set(ref(db, `destinations/${nextId}`), record);
  return record;
};

export const updateAdminDestination = async (
  accessToken: string,
  destinationId: number,
  input: DestinationAdminInput,
): Promise<DestinationAdminRecord> => {
  const destRef = ref(db, `destinations/${destinationId}`);
  const snap = await get(destRef);
  if (!snap.exists()) {
    throw new Error('Destination not found');
  }
  
  const current = snap.val();
  const updated: DestinationAdminRecord = {
    ...current,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  
  await set(destRef, updated);
  return updated;
};

export const deleteAdminDestination = async (accessToken: string, destinationId: number): Promise<void> => {
  await remove(ref(db, `destinations/${destinationId}`));
};

// Admin Content Page Operations

export const listAdminContentPages = async (
  accessToken: string,
  filters: {
    status?: ContentStatus;
  } = {},
): Promise<ContentPageAdminListResponse> => {
  const snapshot = await get(ref(db, 'pages'));
  if (!snapshot.exists()) {
    return { items: [], total: 0 };
  }
  
  let items = Object.values(snapshot.val()) as any[];
  
  if (filters.status) {
    items = items.filter(i => i.status === filters.status);
  }
  
  items.sort((a, b) => a.key.localeCompare(b.key));
  
  const records = items.map(item => {
    const rawSections = item.sections || [];
    const sections = Object.values(rawSections).map((sec: any) => ({
      id: sec.id,
      key: sec.key,
      type: sec.type,
      status: sec.status,
      sortOrder: sec.sortOrder ?? sec.sort_order ?? 0,
      payloadTranslations: sec.payloadTranslations || sec.payload_translations,
      createdAt: sec.createdAt || new Date().toISOString(),
      updatedAt: sec.updatedAt || new Date().toISOString(),
    }));
    sections.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
    
    return {
      key: item.key,
      routePath: item.routePath ?? item.route_path,
      status: item.status,
      titleTranslations: item.titleTranslations || item.title_translations,
      sections,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
    };
  });
  
  return {
    items: records,
    total: records.length,
  };
};

export const createAdminContentPage = async (
  accessToken: string,
  input: ContentPageAdminCreateInput,
): Promise<ContentPageAdminRecord> => {
  const createdAt = new Date().toISOString();
  
  const rawSections = input.sections || [];
  const sectionsObj: Record<string, any> = {};
  rawSections.forEach((sec, idx) => {
    const sectionId = sec.key;
    sectionsObj[sectionId] = {
      id: sectionId,
      key: sec.key,
      type: sec.type,
      status: sec.status,
      sortOrder: sec.sortOrder ?? idx,
      payloadTranslations: sec.payloadTranslations,
      createdAt,
      updatedAt: createdAt,
    };
  });

  const record = {
    key: input.key,
    routePath: input.routePath,
    status: input.status,
    titleTranslations: input.titleTranslations,
    sections: sectionsObj,
    createdAt,
    updatedAt: createdAt,
  };
  
  await set(ref(db, `pages/${input.key}`), record);
  
  return {
    ...record,
    sections: Object.values(sectionsObj) as any[],
  };
};

export const updateAdminContentPage = async (
  accessToken: string,
  pageKey: string,
  input: ContentPageAdminUpdateInput,
): Promise<ContentPageAdminRecord> => {
  const pageRef = ref(db, `pages/${pageKey}`);
  const snap = await get(pageRef);
  if (!snap.exists()) {
    throw new Error('Page not found');
  }
  
  const current = snap.val();
  const updatedAt = new Date().toISOString();
  
  const rawSections = input.sections || [];
  const sectionsObj: Record<string, any> = {};
  rawSections.forEach((sec, idx) => {
    const sectionId = sec.key;
    const existingSection = current.sections?.[sectionId] || {};
    sectionsObj[sectionId] = {
      ...existingSection,
      id: sectionId,
      key: sec.key,
      type: sec.type,
      status: sec.status,
      sortOrder: sec.sortOrder ?? idx,
      payloadTranslations: sec.payloadTranslations,
      updatedAt,
      createdAt: existingSection.createdAt || updatedAt,
    };
  });
  
  const record = {
    ...current,
    routePath: input.routePath,
    status: input.status,
    titleTranslations: input.titleTranslations,
    sections: sectionsObj,
    updatedAt,
  };
  
  await set(pageRef, record);
  
  return {
    ...record,
    sections: Object.values(sectionsObj) as any[],
  };
};

export const deleteAdminContentPage = async (accessToken: string, pageKey: string): Promise<void> => {
  await remove(ref(db, `pages/${pageKey}`));
};
