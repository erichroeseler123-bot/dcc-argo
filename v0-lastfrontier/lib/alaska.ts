import {
  buildFallbackTour,
  CITIES,
  CATEGORIES,
  getCategory,
  getCity,
  type CategoryConfig,
  type CityConfig,
} from "@/data/alaska";
import { searchCityProducts, getProductDetail } from "@/lib/viator/client";
import { normalizeProductDetail, normalizeSearchProducts } from "@/lib/viator/normalize";
import type { TourDetail, TourSummary } from "@/lib/types";
import { buildViatorBookingUrl, isViatorUrl } from "@/lib/viator/config";

function scoreMatch(tour: TourSummary, category: CategoryConfig) {
  const haystack = `${tour.title} ${tour.description} ${tour.tags.join(" ")} ${tour.highlights.join(" ")}`.toLowerCase();
  return category.keywords.reduce((score, keyword) => (haystack.includes(keyword.toLowerCase()) ? score + 2 : score), 0);
}

function dedupeProducts(products: TourSummary[]) {
  const seen = new Set<string>();
  return products.filter((product) => {
    if (seen.has(product.productCode)) return false;
    seen.add(product.productCode);
    return true;
  });
}

function isValidLiveTour(product: TourSummary) {
  return Boolean(
    product.productCode &&
      product.title &&
      product.bookingUrl &&
      isViatorUrl(product.bookingUrl),
  );
}

function hasStrongMarketSignal(product: TourSummary) {
  return (product.rating || 0) >= 4.5 && (product.reviewCount || 0) >= 75;
}

function compareImageQuality(left: TourSummary, right: TourSummary) {
  if (left.hasLowQualityImage !== right.hasLowQualityImage) {
    return left.hasLowQualityImage ? 1 : -1;
  }
  return (right.maxImageWidth || 0) - (left.maxImageWidth || 0);
}

function sanitizeLiveTours(products: TourSummary[]) {
  const normalized = dedupeProducts(
    products.map((product) => ({
      ...product,
      bookingUrl: buildViatorBookingUrl(product.bookingUrl),
    })),
  ).filter(isValidLiveTour);

  const strongSignal = normalized.filter(hasStrongMarketSignal);
  const pool = strongSignal.length >= Math.min(3, normalized.length) ? strongSignal : normalized;
  return [...pool].sort(compareImageQuality);
}

export async function getCityTours(city: CityConfig, count = 9) {
  const raw = await searchCityProducts({ destinationId: city.destinationId, count: Math.max(count, 18) });
  if (!raw) return [];
  return sanitizeLiveTours(normalizeSearchProducts(raw, `${city.queryName} tours`)).slice(0, count);
}

export async function getCategoryTours(category: CategoryConfig) {
  const raw = await searchCityProducts({ destinationId: getCity(category.city)?.destinationId || 0, count: 36 });
  if (!raw) return [];
  const normalized = sanitizeLiveTours(normalizeSearchProducts(raw, category.query));
  return normalized
    .map((tour) => ({ tour, score: scoreMatch(tour, category) }))
    .filter((item) => item.score > 0 || normalized.length <= 4)
    .sort((a, b) => {
      const imageQualityComparison = compareImageQuality(a.tour, b.tour);
      if (imageQualityComparison !== 0) return imageQualityComparison;
      if (b.score !== a.score) return b.score - a.score;
      if ((b.tour.rating || 0) !== (a.tour.rating || 0)) return (b.tour.rating || 0) - (a.tour.rating || 0);
      return (a.tour.priceFrom || Number.MAX_SAFE_INTEGER) - (b.tour.priceFrom || Number.MAX_SAFE_INTEGER);
    })
    .map((item) => item.tour)
    .slice(0, 12);
}

export async function getFeaturedHomepageTours() {
  const categories = [
    getCategory("juneau", "whale-watching"),
    getCategory("juneau", "helicopter-tours"),
    getCategory("skagway", "white-pass-tours"),
  ].filter((item): item is CategoryConfig => Boolean(item));

  const sets = await Promise.all(categories.map((category) => getCategoryTours(category)));
  return dedupeProducts(sets.flat()).slice(0, 6);
}

export async function getTour(productCode: string): Promise<TourDetail | null> {
  const raw = await getProductDetail(productCode);
  if (!raw) return null;
  return normalizeProductDetail(raw, `Alaska excursion ${productCode}`);
}

export async function getTourSuggestions(productCode: string) {
  const city = CITIES.find((entry) => productCode.toLowerCase().includes(entry.slug.split("-")[0]));
  if (!city) return [];
  return getCityTours(city, 4);
}

export async function getCategoryPageData(citySlug: string, categorySlug: string) {
  const city = getCity(citySlug);
  const category = getCategory(citySlug, categorySlug);
  if (!city || !category) return null;

  const tours = await getCategoryTours(category);
  return {
    city,
    category,
    tours: tours.length > 0 ? tours : [buildFallbackTour(city, category.lead)],
  };
}

export async function getCityPageData(citySlug: string) {
  const city = getCity(citySlug);
  if (!city) return null;
  const tours = await getCityTours(city, 6);
  return {
    city,
    tours: tours.length > 0 ? tours : [buildFallbackTour(city, city.summary)],
  };
}

export function getAllCities() {
  return CITIES;
}

export function getAllCategories() {
  return CATEGORIES;
}
