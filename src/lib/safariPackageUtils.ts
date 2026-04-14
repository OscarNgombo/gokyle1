import type { SafariPackageCardData, SafariPackageItem } from '@/api/types';
import { getContentImage } from '@/lib/contentAssets';

export const getSafariPackageImage = (imageKey: string, imageUrl?: string) =>
  getContentImage(imageKey, imageUrl || undefined);

export const toSafariPackageCardData = (item: SafariPackageItem): SafariPackageCardData => ({
  ...item,
  image: getSafariPackageImage(item.imageKey, item.imageUrl),
  reviews: item.reviewsCount,
});

export const toSafariPackageCardDataList = (items: SafariPackageItem[]) =>
  items.map(toSafariPackageCardData);

export const findSafariPackageMatch = (
  items: SafariPackageItem[],
  query: string | null | undefined,
): SafariPackageItem | null => {
  if (!query) {
    return null;
  }

  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();

  return (
    items.find(
      (item) =>
        String(item.id) === trimmedQuery ||
        item.titleEn.trim().toLowerCase() === normalizedQuery ||
        item.title.trim().toLowerCase() === normalizedQuery ||
        item.slug.trim().toLowerCase() === normalizedQuery,
    ) || null
  );
};
