import type { Metadata } from "next";
import { absoluteUrl, SITE } from "@/lib/site";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function buildMetadata({ title, description, path }: MetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: SITE.name,
      images: [
        {
          url: SITE.ogImage,
          width: 1600,
          height: 900,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE.ogImage],
    },
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; item: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.item),
    })),
  };
}

export function buildCollectionJsonLd(name: string, description: string, url: string, items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(url),
    hasPart: items.map((item) => ({
      "@type": "TouristTrip",
      name: item.name,
      url: absoluteUrl(item.url),
    })),
  };
}

export function buildTourJsonLd(input: {
  name: string;
  description: string;
  url: string;
  image?: string | null;
  price?: number | null;
  currency?: string;
  rating?: number | null;
  reviewCount?: number | null;
  provider?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: input.image ? [input.image] : undefined,
    brand: input.provider || "Viator",
    offers: input.price
      ? {
          "@type": "Offer",
          priceCurrency: input.currency || "USD",
          price: input.price,
          availability: "https://schema.org/InStock",
          url: absoluteUrl(input.url),
        }
      : undefined,
    aggregateRating:
      input.rating && input.reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: input.rating,
            reviewCount: input.reviewCount,
          }
        : undefined,
  };
}
