export const SITE = {
  name: "Last Frontier Shore Excursions",
  shortName: "Last Frontier",
  domain: "lastfrontiershoreexcursions.com",
  defaultUrl: "https://lastfrontiershoreexcursions.com",
  defaultTitle: "Last Frontier Shore Excursions | Alaska Cruise Port Tours That Fit Your Day",
  titleTemplate: "%s | Last Frontier Shore Excursions",
  description:
    "Port-by-port Alaska shore excursions for cruise travelers who want the right tour fast. Compare Viator-powered options by city, activity, timing fit, and confidence level.",
  ogImage:
    "https://images.unsplash.com/photo-1508261305436-e6ffdf8dcbad?auto=format&fit=crop&w=1600&q=80",
};

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || SITE.defaultUrl;
}

export function absoluteUrl(pathname = "/"): string {
  return new URL(pathname, getBaseUrl()).toString();
}
