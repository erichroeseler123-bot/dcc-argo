import { CATEGORIES, CITIES } from "@/data/alaska";

export type HomepageSearchEntry = {
  href: string;
  label: string;
  description: string;
  typeLabel: "Port" | "Activity";
  searchTerms: string[];
};

function uniq(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean)));
}

const CITY_ALIASES: Record<string, string[]> = {
  juneau: ["whale watching", "helicopters", "helicopter", "glaciers", "glacier", "mendenhall", "tracy arm", "dog sledding", "small group", "port shuttle"],
  skagway: ["white pass", "scenic rail", "rail", "railway", "train", "historic downtown", "gold rush"],
  ketchikan: ["creek street", "waterfront", "historic district", "fishing", "float plane", "floatplane", "misty fjords", "kayaking"],
  sitka: ["wildlife", "otters", "marine life", "fishing"],
  "icy-strait-point": ["icy strait", "hoonah", "whale watching", "wildlife"],
  whittier: ["prince william sound", "glacier cruise", "port shuttle"],
  seward: ["kenai fjords", "wildlife", "glacier cruise", "kayaking", "fishing"],
  anchorage: ["day tours", "port shuttle", "glaciers", "wildlife"],
  fairbanks: ["interior alaska", "northern lights", "wildlife"],
  denali: ["flightseeing", "glacier trek", "aerial", "scenic flight"],
};

const CATEGORY_ALIASES: Record<string, string[]> = {
  "juneau/whale-watching": ["whale watching", "whales", "small group", "wildlife", "humpback", "orca"],
  "juneau/helicopter-tours": ["helicopters", "helicopter", "dog sledding", "glacier trek", "glacier walk", "icefield"],
  "juneau/glacier-tours": ["glaciers", "glacier", "mendenhall", "tracy arm", "glacier trek", "waterfall"],
  "skagway/white-pass-tours": ["white pass", "scenic rail", "rail", "railway", "train", "yukon"],
  "ketchikan/crab-tours": ["crab", "seafood", "fishing", "harbor"],
  "ketchikan/misty-fjords": ["misty fjords", "float plane", "floatplane", "scenic flight", "fjords"],
  "sitka/wildlife-tours": ["wildlife", "otter", "bear", "eagle", "marine life"],
  "icy-strait-point/whale-watching": ["whale watching", "whales", "wildlife", "icy strait"],
  "seward/kenai-fjords-tours": ["kenai fjords", "glaciers", "wildlife", "kayaking"],
  "denali/flightseeing": ["flightseeing", "aerial", "glacier trek", "scenic flight"],
  "anchorage/day-tours": ["day tours", "wildlife", "glacier", "scenic"],
};

export function getHomepageSearchEntries(): HomepageSearchEntry[] {
  const cityEntries: HomepageSearchEntry[] = CITIES.map((city) => ({
    href: `/${city.slug}`,
    label: city.name,
    description: city.summary,
    typeLabel: "Port",
    searchTerms: uniq([
      city.name,
      city.slug.replace(/-/g, " "),
      city.queryName,
      city.heroFact,
      city.summary,
      city.planningNote,
      city.idealFor,
      ...(CITY_ALIASES[city.slug] || []),
    ]),
  }));

  const categoryEntries: HomepageSearchEntry[] = CATEGORIES.map((category) => ({
    href: `/${category.city}/${category.slug}`,
    label: category.title,
    description: category.bestFor,
    typeLabel: "Activity",
    searchTerms: uniq([
      category.title,
      category.heading,
      category.query,
      category.slug.replace(/-/g, " "),
      ...category.keywords,
      ...(CATEGORY_ALIASES[`${category.city}/${category.slug}`] || []),
    ]),
  }));

  return [...cityEntries, ...categoryEntries];
}

export function scoreHomepageSearchEntry(entry: HomepageSearchEntry, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return 0;

  let score = 0;
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  for (const term of entry.searchTerms) {
    if (term === normalizedQuery) score += 120;
    else if (term.startsWith(normalizedQuery)) score += 80;
    else if (term.includes(normalizedQuery)) score += 40;

    for (const token of tokens) {
      if (term === token) score += 30;
      else if (term.includes(token)) score += 10;
    }
  }

  if (entry.typeLabel === "Activity" && tokens.length > 1) score += 2;
  return score;
}

export function searchHomepageEntries(entries: HomepageSearchEntry[], query: string, limit = 6) {
  return entries
    .map((entry) => ({ entry, score: scoreHomepageSearchEntry(entry, query) }))
    .filter((row) => row.score > 0)
    .sort((left, right) => right.score - left.score || left.entry.label.localeCompare(right.entry.label))
    .slice(0, limit)
    .map((row) => row.entry);
}
