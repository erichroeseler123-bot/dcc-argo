import type { TourDetail, TourSummary } from "@/lib/types";
import { durationLabel, excerpt, stripHtml } from "@/lib/format";
import { buildViatorBookingUrl, buildViatorSearchUrl } from "@/lib/viator/config";
import { chooseVariantForSlot, getMaxVariantWidth, hasLowQualityImageVariants } from "@/lib/viator/images";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function firstNumber(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function normalizeDurationMinutes(raw: Record<string, unknown>) {
  const duration = asRecord(raw.duration);
  const direct = firstNumber(
    duration?.fixedDurationInMinutes,
    duration?.durationInMinutes,
    duration?.minutes
  );
  if (direct !== null) return Math.round(direct);
  const durationText = firstString(raw.durationText, duration?.formattedDuration, duration?.text);
  if (!durationText) return null;
  const lower = durationText.toLowerCase();
  const hourMatch = lower.match(/(\d+(?:\.\d+)?)\s*h(?:ou)?r/);
  if (hourMatch) return Math.round(Number(hourMatch[1]) * 60);
  const minuteMatch = lower.match(/(\d+(?:\.\d+)?)\s*m(?:in)?/);
  if (minuteMatch) return Math.round(Number(minuteMatch[1]));
  return null;
}

function getImageVariants(raw: Record<string, unknown>) {
  const variants: Array<{ url: string; width: number | null; height: number | null }> = [];
  const pushVariant = (value: unknown) => {
    const row = asRecord(value);
    if (!row) return;
    const url = firstString(
      row.url,
      row.secureUrl,
      row.highResUrl,
      row.mediumResUrl,
      row.lowResUrl,
      row.thumbnailUrl,
    );
    if (!url) return;
    variants.push({
      url,
      width: firstNumber(row.width, row.imageWidth, row.pixelWidth),
      height: firstNumber(row.height, row.imageHeight, row.pixelHeight),
    });
  };

  const sources = [
    raw,
    asRecord(raw.photo),
    asRecord(raw.image),
  ].filter(Boolean);

  for (const source of sources) {
    pushVariant(source);
    const variantsArray = Array.isArray((source as Record<string, unknown>).variants)
      ? ((source as Record<string, unknown>).variants as unknown[])
      : [];
    const photoVersions = Array.isArray((source as Record<string, unknown>).photoVersions)
      ? ((source as Record<string, unknown>).photoVersions as unknown[])
      : [];
    for (const variant of [...variantsArray, ...photoVersions]) pushVariant(variant);
  }

  const seen = new Set<string>();
  return variants.filter((variant) => {
    const key = `${variant.url}|${variant.width ?? "na"}|${variant.height ?? "na"}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getImages(raw: Record<string, unknown>) {
  const images = Array.isArray(raw.images) ? raw.images : [];
  const output: Array<{ url: string; variants: Array<{ url: string; width: number | null; height: number | null }> }> = [];
  for (const image of images) {
    const record = asRecord(image);
    if (!record) continue;
    const variants = getImageVariants(record);
    const preferred = chooseVariantForSlot(variants, 1200, { preferLargest: true });
    if (!preferred && variants.length === 0) continue;
    output.push({
      url: preferred?.url || variants[0]?.url || "",
      variants,
    });
  }
  const seen = new Set<string>();
  return output.filter((image) => {
    if (!image.url || seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
}

function flattenStrings(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry === "string" && entry.trim()) return [stripHtml(entry)];
    const record = asRecord(entry);
    const text = firstString(record?.description, record?.title, record?.label, record?.value, record?.text);
    return text ? [stripHtml(text)] : [];
  });
}

function pickTags(raw: Record<string, unknown>) {
  const tags = Array.isArray(raw.tags) ? raw.tags : [];
  const output = tags.flatMap((tag) => {
    const record = asRecord(tag);
    const label =
      firstString(record?.label, record?.name) ||
      firstString(asRecord(record?.allNamesByLocale)?.en, asRecord(record?.allNamesByLocale)?.["en-US"]);
    return label ? [label] : [];
  });
  return Array.from(new Set(output)).slice(0, 4);
}

function buildProductUrl(raw: Record<string, unknown>, title: string, fallbackQuery: string) {
  const direct = firstString(raw.productUrl, raw.webUrl);
  if (direct) return buildViatorBookingUrl(direct);
  return buildViatorSearchUrl(fallbackQuery || title);
}

function inferBestFor(title: string, description: string) {
  const haystack = `${title} ${description}`.toLowerCase();
  if (haystack.includes("helicopter") || haystack.includes("flight")) return "Travelers prioritizing scenery over budget.";
  if (haystack.includes("whale")) return "Cruise visitors wanting a dependable first-choice Alaska wildlife day.";
  if (haystack.includes("glacier")) return "Travelers who want glacier payoff without overcomplicating the port day.";
  if (haystack.includes("fjord")) return "Guests willing to commit to one major scenery experience.";
  return "Travelers who want a straightforward Alaska excursion with clear upside.";
}

export function normalizeSearchProducts(raw: unknown, fallbackQuery: string): TourSummary[] {
  const payload = asRecord(raw);
  const rows =
    (payload && Array.isArray(payload.products) ? payload.products : null) ||
    (payload && Array.isArray(payload.data) ? payload.data : null) ||
    [];

  return rows
    .map((item) => {
      const record = asRecord(item);
      if (!record) return null;

      const title = firstString(record.title, record.name) || "Alaska excursion";
      const description = excerpt(
        firstString(record.shortDescription, record.summary, record.description),
        "Live Viator product detail will supply the full excursion description."
      );
      const reviews = asRecord(record.reviews);
      const pricing = asRecord(record.pricing);
      const pricingSummary = asRecord(pricing?.summary);
      const price = asRecord(record.price);
      const durationMinutes = normalizeDurationMinutes(record);
      const images = getImages(record);
      const primaryImage = images[0] ?? null;
      const primaryVariant = primaryImage ? chooseVariantForSlot(primaryImage.variants, 960) : null;
      const maxImageWidth = primaryImage ? getMaxVariantWidth(primaryImage.variants) : null;

      return {
        productCode: firstString(record.productCode, record.code) || title.toLowerCase().replace(/\s+/g, "-"),
        title,
        description,
        durationMinutes,
        durationLabel: durationLabel(durationMinutes),
        priceFrom: firstNumber(pricingSummary?.fromPrice, price?.fromPrice, price?.amount),
        currency: firstString(pricing?.currency, price?.currency) || "USD",
        rating: firstNumber(reviews?.combinedAverageRating, reviews?.averageRating, reviews?.average),
        reviewCount: firstNumber(reviews?.totalReviews, reviews?.totalCount, reviews?.total, reviews?.count),
        imageUrl: primaryVariant?.url || primaryImage?.url || null,
        imageVariants: primaryImage?.variants || [],
        maxImageWidth,
        hasLowQualityImage: primaryImage ? hasLowQualityImageVariants(primaryImage.variants) : false,
        bookingUrl: buildProductUrl(record, title, fallbackQuery),
        supplierName: firstString(asRecord(record.supplier)?.name),
        tags: pickTags(record),
        highlights: flattenStrings(record.highlights).slice(0, 3),
        bestFor: inferBestFor(title, description),
      } satisfies TourSummary;
    })
    .filter((item): item is TourSummary => Boolean(item));
}

export function normalizeProductDetail(raw: unknown, fallbackQuery: string): TourDetail | null {
  const record = asRecord(raw);
  if (!record) return null;
  const title = firstString(record.title, record.name);
  if (!title) return null;

  const description = excerpt(
    firstString(record.shortDescription, record.summary, record.description),
    "Live Viator product detail will supply the full excursion description."
  );
  const durationMinutes = normalizeDurationMinutes(record);
  const images = getImages(record);
  const primaryImage = images[0] ?? null;
  const primaryVariant = primaryImage ? chooseVariantForSlot(primaryImage.variants, 1600, { preferLargest: true }) : null;
  const maxImageWidth = primaryImage ? getMaxVariantWidth(primaryImage.variants) : null;
  const pricing = asRecord(record.pricing);
  const pricingSummary = asRecord(pricing?.summary);
  const price = asRecord(record.price);
  const reviews = asRecord(record.reviews);
  const cancellationPolicy = asRecord(record.cancellationPolicy);
  const logistics = asRecord(record.logistics);
  const meeting = asRecord(logistics?.start);

  return {
    productCode: firstString(record.productCode, record.code) || title.toLowerCase().replace(/\s+/g, "-"),
    title,
    description,
    durationMinutes,
    durationLabel: durationLabel(durationMinutes),
    priceFrom: firstNumber(pricingSummary?.fromPrice, price?.fromPrice, price?.amount),
    currency: firstString(pricing?.currency, price?.currency) || "USD",
    rating: firstNumber(reviews?.combinedAverageRating, reviews?.averageRating, reviews?.average),
    reviewCount: firstNumber(reviews?.totalReviews, reviews?.totalCount, reviews?.total, reviews?.count),
    imageUrl: primaryVariant?.url || primaryImage?.url || null,
    imageVariants: primaryImage?.variants || [],
    maxImageWidth,
    hasLowQualityImage: primaryImage ? hasLowQualityImageVariants(primaryImage.variants) : false,
    bookingUrl: buildProductUrl(record, title, fallbackQuery),
    supplierName: firstString(asRecord(record.supplier)?.name),
    tags: pickTags(record),
    highlights: flattenStrings(record.highlights).slice(0, 5),
    bestFor: inferBestFor(title, description),
    overview: excerpt(
      firstString(record.description, record.summary, record.shortDescription),
      description,
      1200
    ),
    meetingPoint:
      firstString(meeting?.description, meeting?.name, asRecord(record.meetingPoint)?.description) ||
      "Check live Viator detail for the exact meeting instructions.",
    cancellationText:
      firstString(cancellationPolicy?.description) ||
      "Check Viator for the latest cancellation window before you book.",
    cancellationHeadline:
      Boolean(cancellationPolicy?.freeCancellation) ? "Free cancellation available" : "Cancellation policy varies",
    additionalInfo: flattenStrings(record.additionalInfo).slice(0, 6),
    inclusions: flattenStrings(record.inclusions).slice(0, 8),
    exclusions: flattenStrings(record.exclusions).slice(0, 6),
    departureNotes: flattenStrings(record.departure).slice(0, 5),
    returnNotes: flattenStrings(record.returnDetails).slice(0, 5),
    languages: flattenStrings(record.languages).slice(0, 5),
    images: images.slice(0, 6).map((image) => ({
      url: chooseVariantForSlot(image.variants, 1600, { preferLargest: true })?.url || image.url,
      variants: image.variants,
    })),
  };
}
