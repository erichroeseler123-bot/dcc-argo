import type { MetadataRoute } from "next";
import { CITIES, CATEGORIES } from "@/data/alaska";
import { getFeaturedHomepageTours } from "@/lib/alaska";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const corePages = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...CITIES.map((city) => ({
      url: absoluteUrl(`/${city.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.88,
    })),
    ...CATEGORIES.map((category) => ({
      url: absoluteUrl(`/${category.city}/${category.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.82,
    })),
  ];

  const featuredTours = await getFeaturedHomepageTours();
  const tourPages = featuredTours.slice(0, 12).map((tour) => ({
    url: absoluteUrl(`/tour/${tour.productCode}`),
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.72,
  }));

  return [...corePages, ...tourPages];
}
