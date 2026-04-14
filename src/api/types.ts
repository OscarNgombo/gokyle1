export type ApiLocale = 'en' | 'de' | 'it';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type SafariPackageCategory = 'excursion' | 'jeep-safari' | 'fly-in-safari';

export type BlogCategory =
  | 'wildlife'
  | 'travel-tips'
  | 'destinations'
  | 'photography'
  | 'culture'
  | 'beach'
  | 'conservation';

export type DestinationCountry = 'kenya' | 'tanzania';

export type DestinationExperience = 'wildlife' | 'coast' | 'culture' | 'mountains';

export type SafariPackageId = number;

export type AdminUserRole = 'admin';
export type AdminAssignmentFilter = 'all' | 'me' | 'unassigned';
export type BookingRequestAdminStatus =
  | 'received'
  | 'in_review'
  | 'responded'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'spam';
export type ContactInquiryAdminStatus = 'received' | 'in_review' | 'responded' | 'resolved' | 'spam';

export interface AdminUser {
  id: string;
  email: string;
  fullName?: string | null;
  role: AdminUserRole;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

export type AdminLoginPayload = AdminLoginInput;

export interface AdminLoginResponse {
  accessToken: string;
  tokenType: 'bearer';
  expiresIn: number;
  user: AdminUser;
}

export interface SafariPackageItem {
  id: SafariPackageId;
  slug: string;
  category: SafariPackageCategory;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  title: string;
  titleEn: string;
  description: string;
  highlights: string[];
  duration: string;
  durationDays: number;
  durationLabelEn: string;
  groupSize: string;
  minGroupSize: number;
  groupSizeLabelEn: string;
  location: string;
  price: string;
  priceNote?: string | null;
  priceAmount: number;
  priceCurrency: string;
  rating: number;
  reviewsCount: number;
  imageKey: string;
  imageUrl: string;
}

export interface SafariPackageCardData extends SafariPackageItem {
  image: string;
  reviews: number;
}

export interface SafariPackageListFilters {
  locale?: ApiLocale;
  category?: SafariPackageCategory;
  featured?: boolean;
}

export interface SafariPackageListResponse {
  items: SafariPackageItem[];
  total: number;
  locale: ApiLocale;
}

export interface SafariPackageDetailResponse {
  item: SafariPackageItem;
  locale: ApiLocale;
}

export interface SafariPackageAdminRecord {
  id: SafariPackageId;
  slug: string;
  category: SafariPackageCategory;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  titleTranslations: Record<ApiLocale, string>;
  descriptionTranslations: Record<ApiLocale, string>;
  highlightsTranslations: Record<ApiLocale, string[]>;
  priceNoteTranslations: Partial<Record<ApiLocale, string>>;
  durationDays: number;
  durationLabelEn: string;
  minGroupSize: number;
  groupSizeLabelEn: string;
  location: string;
  priceAmount: number;
  priceCurrency: string;
  rating: number;
  reviewsCount: number;
  imageKey: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafariPackageAdminListResponse {
  items: SafariPackageAdminRecord[];
  total: number;
}

export interface SafariPackageAdminInput {
  slug?: string | null;
  category: SafariPackageCategory;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  titleTranslations: Record<ApiLocale, string>;
  descriptionTranslations: Record<ApiLocale, string>;
  highlightsTranslations: Record<ApiLocale, string[]>;
  priceNoteTranslations: Partial<Record<ApiLocale, string>>;
  durationDays: number;
  durationLabelEn: string;
  minGroupSize: number;
  groupSizeLabelEn: string;
  location: string;
  priceAmount: number;
  priceCurrency: string;
  rating: number;
  reviewsCount: number;
  imageKey: string;
  imageUrl: string;
}

export interface CategoryOption {
  value: string;
  label: string;
  count: number;
}

export interface BlogPostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  categoryKey: BlogCategory;
  categoryLabel: string;
  authorName: string;
  publishedAt?: string | null;
  dateLabel?: string | null;
  readTime: string;
  readTimeMinutes: number;
  featured: boolean;
  imageKey: string;
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
}

export interface BlogPostListFilters {
  locale?: ApiLocale;
  category?: BlogCategory;
  featured?: boolean;
}

export interface BlogPostListResponse {
  items: BlogPostSummary[];
  total: number;
  locale: ApiLocale;
  categories: CategoryOption[];
}

export interface BlogPostDetailResponse {
  item: BlogPostDetail;
  locale: ApiLocale;
}

export interface BlogPostAdminRecord {
  id: number;
  slug: string;
  status: ContentStatus;
  featured: boolean;
  sortOrder: number;
  categoryKey: BlogCategory;
  authorName: string;
  imageKey: string;
  publishedAt?: string | null;
  readTimeMinutes: number;
  titleTranslations: Record<ApiLocale, string>;
  excerptTranslations: Record<ApiLocale, string>;
  contentTranslations: Record<ApiLocale, string>;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostAdminListResponse {
  items: BlogPostAdminRecord[];
  total: number;
}

export interface BlogPostAdminInput {
  slug?: string | null;
  status: ContentStatus;
  featured: boolean;
  sortOrder: number;
  categoryKey: BlogCategory;
  authorName: string;
  imageKey: string;
  publishedAt?: string | null;
  readTimeMinutes: number;
  titleTranslations: Record<ApiLocale, string>;
  excerptTranslations: Record<ApiLocale, string>;
  contentTranslations: Record<ApiLocale, string>;
}

export interface DestinationSummary {
  id: number;
  slug: string;
  name: string;
  description: string;
  country: DestinationCountry;
  countryLabel: string;
  experienceKeys: DestinationExperience[];
  experienceLabels: string[];
  featured: boolean;
  sortOrder: number;
  imageKey: string;
}

export interface DestinationListFilters {
  locale?: ApiLocale;
  country?: DestinationCountry;
  featured?: boolean;
  experience?: DestinationExperience;
}

export interface DestinationListResponse {
  items: DestinationSummary[];
  total: number;
  locale: ApiLocale;
}

export interface DestinationDetailResponse {
  item: DestinationSummary;
  locale: ApiLocale;
}

export interface DestinationAdminRecord {
  id: number;
  slug: string;
  status: ContentStatus;
  featured: boolean;
  sortOrder: number;
  country: DestinationCountry;
  experienceKeys: DestinationExperience[];
  imageKey: string;
  nameTranslations: Record<ApiLocale, string>;
  descriptionTranslations: Record<ApiLocale, string>;
  createdAt: string;
  updatedAt: string;
}

export interface DestinationAdminListResponse {
  items: DestinationAdminRecord[];
  total: number;
}

export interface DestinationAdminInput {
  slug?: string | null;
  status: ContentStatus;
  featured: boolean;
  sortOrder: number;
  country: DestinationCountry;
  experienceKeys: DestinationExperience[];
  imageKey: string;
  nameTranslations: Record<ApiLocale, string>;
  descriptionTranslations: Record<ApiLocale, string>;
}

export interface ContentCta {
  label: string;
  href: string;
}

export interface HeroSliderSectionSlide {
  imageKey: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface HeroSliderSectionPayload {
  slides: HeroSliderSectionSlide[];
  primaryCta?: ContentCta | null;
  secondaryCta?: ContentCta | null;
}

export interface TimelineSectionItem {
  step: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  imageKey: string;
  href: string;
  cta: string;
}

export interface TimelineSectionPayload {
  tagline: string;
  title: string;
  subtitle: string;
  items: TimelineSectionItem[];
}

export interface CardGridSectionCard {
  icon: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export interface CardGridSectionPayload {
  tagline: string;
  title: string;
  subtitle: string;
  cards: CardGridSectionCard[];
}

export interface TestimonialGridSectionItem {
  name: string;
  location: string;
  rating: number;
  trip: string;
  quote: string;
}

export interface TestimonialGridSectionPayload {
  tagline: string;
  title: string;
  subtitle: string;
  items: TestimonialGridSectionItem[];
}

export interface CtaBannerSectionPayload {
  icon?: string;
  title: string;
  description: string;
  primaryCta?: ContentCta | null;
  secondaryCta?: ContentCta | null;
}

export interface HeroSectionPayload {
  title: string;
  tagline: string;
  subtitle: string;
  backgroundImageKey: string;
}

export interface SplitCardsSectionCard {
  title: string;
  description: string;
  href: string;
  cta: string;
  imageKey: string;
  bullets: string[];
}

export interface SplitCardsSectionPayload {
  tagline: string;
  title: string;
  subtitle: string;
  cards: SplitCardsSectionCard[];
}

export interface FilterableServiceListFilter {
  value: string;
  label: string;
}

export interface FilterableServiceListItem {
  category: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  imageKey: string;
}

export interface FilterableServiceListSectionPayload {
  tagline: string;
  title: string;
  subtitle: string;
  filterLabel: string;
  inquiryCta?: ContentCta | null;
  filters: FilterableServiceListFilter[];
  items: FilterableServiceListItem[];
}

export interface ValueGridSectionItem {
  icon: string;
  title: string;
  description: string;
}

export interface ValueGridSectionPayload {
  tagline: string;
  title: string;
  subtitle: string;
  items: ValueGridSectionItem[];
}

export interface ContentSectionPublic {
  key: string;
  type: string;
  sortOrder: number;
  payload: Record<string, unknown>;
}

export interface PageContentResponse {
  key: string;
  routePath: string;
  title: string;
  locale: ApiLocale;
  sections: ContentSectionPublic[];
}

export interface ContentSectionAdminRecord {
  id: number;
  key: string;
  type: string;
  status: ContentStatus;
  sortOrder: number;
  payloadTranslations: Record<ApiLocale, Record<string, unknown>>;
  createdAt: string;
  updatedAt: string;
}

export interface ContentSectionAdminInput {
  key: string;
  type: string;
  status: ContentStatus;
  sortOrder: number;
  payloadTranslations: Record<ApiLocale, Record<string, unknown>>;
}

export interface ContentPageAdminRecord {
  key: string;
  routePath: string;
  status: ContentStatus;
  titleTranslations: Record<ApiLocale, string>;
  sections: ContentSectionAdminRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentPageAdminListResponse {
  items: ContentPageAdminRecord[];
  total: number;
}

export interface ContentPageAdminCreateInput {
  key: string;
  routePath: string;
  status: ContentStatus;
  titleTranslations: Record<ApiLocale, string>;
  sections: ContentSectionAdminInput[];
}

export interface ContentPageAdminUpdateInput {
  routePath: string;
  status: ContentStatus;
  titleTranslations: Record<ApiLocale, string>;
  sections: ContentSectionAdminInput[];
}

export interface BookingRequestInput {
  locale?: ApiLocale;
  packageId: SafariPackageId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNationality: string;
  adultsCount?: number | null;
  childrenCount?: number | null;
  accommodationPreference?: string | null;
  specialRequests?: string | null;
}

export type BookingRequestPayload = BookingRequestInput;

export interface BookingRequestResponse {
  id: string;
  status: string;
  createdAt: string;
  packageId: SafariPackageId;
  packageTitle: string;
  packageTitleEn: string;
}

export interface AdminAssigneeSummary {
  id: string;
  email: string;
  fullName?: string | null;
}

export interface BookingRequestAdminListFilters {
  assigned?: AdminAssignmentFilter;
  search?: string;
  status?: BookingRequestAdminStatus;
}

export interface BookingRequestAdminListItem {
  id: string;
  packageId: SafariPackageId;
  packageTitle: string;
  packageTitleEn: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNationality: string;
  adultsCount?: number | null;
  childrenCount: number;
  locale: ApiLocale;
  status: BookingRequestAdminStatus;
  createdAt: string;
  updatedAt: string;
  assignedAdmin?: AdminAssigneeSummary | null;
  internalNotes?: string | null;
}

export interface BookingRequestAdminDetail extends BookingRequestAdminListItem {
  accommodationPreference?: string | null;
  specialRequests?: string | null;
}

export interface BookingRequestAdminListResponse {
  items: BookingRequestAdminListItem[];
  total: number;
  statusCounts: Record<BookingRequestAdminStatus, number>;
}

export interface BookingRequestAdminUpdateInput {
  assignedAdminUserId?: string | null;
  internalNotes?: string | null;
  status?: BookingRequestAdminStatus;
}

export interface ContactInquiryInput {
  locale?: ApiLocale;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}

export type ContactInquiryPayload = ContactInquiryInput;

export interface ContactInquiryResponse {
  id: string;
  status: string;
  createdAt: string;
}

export interface ContactInquiryAdminListFilters {
  assigned?: AdminAssignmentFilter;
  search?: string;
  status?: ContactInquiryAdminStatus;
}

export interface ContactInquiryAdminListItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  locale: ApiLocale;
  status: ContactInquiryAdminStatus;
  createdAt: string;
  updatedAt: string;
  assignedAdmin?: AdminAssigneeSummary | null;
  internalNotes?: string | null;
}

export interface ContactInquiryAdminDetail extends ContactInquiryAdminListItem {
  message: string;
}

export interface ContactInquiryAdminListResponse {
  items: ContactInquiryAdminListItem[];
  total: number;
  statusCounts: Record<ContactInquiryAdminStatus, number>;
}

export interface ContactInquiryAdminUpdateInput {
  assignedAdminUserId?: string | null;
  internalNotes?: string | null;
  status?: ContactInquiryAdminStatus;
}
