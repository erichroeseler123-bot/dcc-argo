export type ViatorConfig = {
  apiKey: string;
  apiBase: string;
  locale: string;
  currency: string;
  pid: string;
  mcid: string;
  campaign: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

type ViatorBookingOverride = {
  campaign?: string;
  utmCampaign?: string;
};

function normalizeCampaignValue(value: string, fallback: string) {
  const cleaned = value.trim();
  if (!cleaned || cleaned === "cities") return fallback;
  return cleaned;
}

export function getViatorConfig(): ViatorConfig {
  return {
    apiKey: process.env.VIATOR_API_KEY?.trim() || "",
    apiBase: process.env.VIATOR_API_BASE?.trim() || "https://api.viator.com/partner",
    locale: process.env.VIATOR_LOCALE?.trim() || "en-US",
    currency: process.env.VIATOR_CURRENCY?.trim() || "USD",
    pid: process.env.NEXT_PUBLIC_VIATOR_PID?.trim() || process.env.VIATOR_PID?.trim() || "",
    mcid: process.env.NEXT_PUBLIC_VIATOR_MCID?.trim() || process.env.VIATOR_MCID?.trim() || "",
    campaign: normalizeCampaignValue(process.env.VIATOR_CAMPAIGN?.trim() || "", "lastfrontier-alaska"),
    utmSource: process.env.VIATOR_UTM_SOURCE?.trim() || "lastfrontiershoreexcursions",
    utmMedium: process.env.VIATOR_UTM_MEDIUM?.trim() || "affiliate",
    utmCampaign: normalizeCampaignValue(process.env.VIATOR_UTM_CAMPAIGN?.trim() || "", "lastfrontier-alaska"),
  };
}

export function hasViatorApiKey() {
  return getViatorConfig().apiKey.length > 0;
}

function setIfPresent(url: URL, key: string, value: string) {
  if (value) url.searchParams.set(key, value);
}

export function isViatorUrl(urlString: string) {
  try {
    const url = new URL(urlString);
    return /(^|\.)viator\.com$/i.test(url.hostname);
  } catch {
    return false;
  }
}

export function buildViatorBookingUrl(urlString: string, override?: ViatorBookingOverride) {
  try {
    const url = new URL(urlString);
    if (!/(^|\.)viator\.com$/i.test(url.hostname)) return urlString;

    const config = getViatorConfig();
    const pid = config.pid || url.searchParams.get("pid") || "";
    const mcid = config.mcid || url.searchParams.get("mcid") || "";
    const campaign =
      normalizeCampaignValue(override?.campaign || "", config.campaign) ||
      normalizeCampaignValue(url.searchParams.get("campaign") || "", config.campaign);
    const utmSource = config.utmSource || url.searchParams.get("utm_source") || "";
    const utmMedium = config.utmMedium || url.searchParams.get("utm_medium") || "";
    const utmCampaign =
      normalizeCampaignValue(override?.utmCampaign || "", config.utmCampaign) ||
      normalizeCampaignValue(url.searchParams.get("utm_campaign") || "", config.utmCampaign);
    const locale = config.locale || url.searchParams.get("locale") || "";
    const currency = config.currency || url.searchParams.get("currencyCode") || "";

    setIfPresent(url, "pid", pid);
    setIfPresent(url, "mcid", mcid);
    url.searchParams.set("medium", "api");
    setIfPresent(url, "campaign", campaign);
    setIfPresent(url, "utm_source", utmSource);
    setIfPresent(url, "utm_medium", utmMedium);
    setIfPresent(url, "utm_campaign", utmCampaign);
    setIfPresent(url, "locale", locale);
    setIfPresent(url, "currencyCode", currency);

    return url.toString();
  } catch {
    return urlString;
  }
}

export function buildViatorSearchUrl(query: string) {
  const url = new URL("https://www.viator.com/searchResults/all");
  url.searchParams.set("text", query);
  return buildViatorBookingUrl(url.toString());
}
