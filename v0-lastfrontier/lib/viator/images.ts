import type { ViatorImageVariant } from "@/lib/types";

export const LOW_QUALITY_IMAGE_WIDTH_THRESHOLD = 800;

function scoreVariant(variant: ViatorImageVariant) {
  if (variant.width && variant.height) return variant.width * variant.height;
  if (variant.width) return variant.width;
  if (variant.height) return variant.height;
  return 0;
}

export function sortImageVariants(variants: ViatorImageVariant[]) {
  return [...variants].sort((left, right) => scoreVariant(left) - scoreVariant(right));
}

export function getMaxVariantWidth(variants: ViatorImageVariant[]) {
  const widths = variants
    .map((variant) => variant.width)
    .filter((width): width is number => typeof width === "number" && Number.isFinite(width));
  if (widths.length === 0) return null;
  return Math.max(...widths);
}

export function hasLowQualityImageVariants(
  variants: ViatorImageVariant[],
  threshold = LOW_QUALITY_IMAGE_WIDTH_THRESHOLD,
) {
  const maxWidth = getMaxVariantWidth(variants);
  return maxWidth !== null && maxWidth < threshold;
}

export function chooseVariantForSlot(
  variants: ViatorImageVariant[],
  minWidth: number,
  options?: { preferLargest?: boolean },
) {
  const sorted = sortImageVariants(variants).filter((variant) => Boolean(variant.url));
  if (sorted.length === 0) return null;
  if (options?.preferLargest) return sorted[sorted.length - 1] ?? null;
  return sorted.find((variant) => (variant.width ?? 0) >= minWidth) ?? sorted[sorted.length - 1] ?? null;
}

export function buildVariantSrcSet(variants: ViatorImageVariant[]) {
  const candidates = sortImageVariants(variants).filter((variant) => Boolean(variant.url && variant.width));
  if (candidates.length < 2) return undefined;
  return candidates.map((variant) => `${variant.url} ${variant.width}w`).join(", ");
}

export function buildViatorImageProps(
  variants: ViatorImageVariant[],
  input: {
    minWidth: number;
    sizes: string;
    preferLargest?: boolean;
  },
) {
  const selected = chooseVariantForSlot(variants, input.minWidth, { preferLargest: input.preferLargest });
  if (!selected) return null;
  return {
    src: selected.url,
    srcSet: buildVariantSrcSet(variants),
    sizes: input.sizes,
    width: selected.width ?? undefined,
    height: selected.height ?? undefined,
  };
}
