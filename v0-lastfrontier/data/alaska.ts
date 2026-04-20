import type { ComparisonRow, DetailPoint, ReviewSnippet, TourSummary } from "@/lib/types";

export type CitySlug =
  | "juneau"
  | "skagway"
  | "ketchikan"
  | "sitka"
  | "icy-strait-point"
  | "whittier"
  | "seward"
  | "anchorage"
  | "fairbanks"
  | "denali";

export type CategorySlug =
  | "whale-watching"
  | "helicopter-tours"
  | "glacier-tours"
  | "white-pass-tours"
  | "crab-tours"
  | "misty-fjords"
  | "wildlife-tours"
  | "kenai-fjords-tours"
  | "flightseeing"
  | "day-tours";

export type CityConfig = {
  slug: CitySlug;
  name: string;
  destinationId: number;
  queryName: string;
  intro: string;
  idealFor: string;
  summary: string;
  planningNote: string;
  heroFact: string;
  categories: CategorySlug[];
  heroImageSrc?: string;
  heroImageAlt?: string;
};

export type CategoryConfig = {
  slug: CategorySlug;
  city: CitySlug;
  title: string;
  heading: string;
  bestFor: string;
  lead: string;
  query: string;
  keywords: string[];
  heroFact: string;
  defaultWhyTitle?: string;
  defaultWhyCopy?: string[];
  reviewSnippets?: ReviewSnippet[];
  comparisonRows?: ComparisonRow[];
  cruiseAudienceLine?: string;
  cruiseAudienceIntro?: string;
  cruiseAudienceSupport?: string;
  cruiseFitPoints?: string[];
  cruiseAudienceOutro?: string;
  deepDiveProof?: ReviewSnippet[];
  choosePoints?: DetailPoint[];
  logisticsPoints?: string[];
  browseLead?: string;
};

export const CITIES: CityConfig[] = [
  {
    slug: "juneau",
    name: "Juneau",
    destinationId: 941,
    queryName: "Juneau",
    intro: "Juneau is where most Alaska cruise itineraries offer the biggest excursion menu and the hardest tradeoff: whales, helicopters, or glacier time.",
    idealFor: "Cruise guests who want one high-confidence Alaska splurge and need to compare logistics fast.",
    summary: "The strongest Juneau picks usually come down to wildlife, glacier access, or flightseeing. This page helps you choose the lane before you browse everything.",
    planningNote: "If you only have time for one premium Alaska port excursion, Juneau is often the best use of that budget.",
    heroFact: "Best port for big-ticket glacier and whale decisions.",
    categories: ["whale-watching", "helicopter-tours", "glacier-tours"],
    heroImageSrc:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Juneau%20Alaska%20%283%29.jpg",
    heroImageAlt: "Downtown Juneau and harbor with mountains behind them",
  },
  {
    slug: "skagway",
    name: "Skagway",
    destinationId: 943,
    queryName: "Skagway",
    intro: "Skagway works best when you match your excursion to the rail-and-scenery rhythm of the port instead of forcing too much into the day.",
    idealFor: "Travelers deciding between White Pass scenery, Yukon-style road trips, or keeping the day simple and historic.",
    summary: "Most Skagway cruise decisions are really about train fit, transfer time, and how much of the day you want committed to one signature experience.",
    planningNote: "White Pass is the anchor product here, but the best version depends on your ship window and tolerance for long seat time.",
    heroFact: "Best port for rail scenery and classic Gold Rush landscapes.",
    categories: ["white-pass-tours"],
    heroImageSrc:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Skagway%20Alaska%20%281%29.jpg",
    heroImageAlt: "Historic downtown Skagway with mountain backdrop",
  },
  {
    slug: "ketchikan",
    name: "Ketchikan",
    destinationId: 942,
    queryName: "Ketchikan",
    intro: "Ketchikan excels when you choose around weather, transfer friction, and whether you want wildlife, scenery, or a more local-feeling excursion.",
    idealFor: "Cruise travelers who want a tight plan that still feels distinctly Southeast Alaska.",
    summary: "The best Ketchikan tours tend to separate into Misty Fjords scenery, seafood-heavy local experiences, and wildlife or rainforest combos.",
    planningNote: "Rain changes the feel of Ketchikan quickly, so practical logistics matter more here than most first-timers expect.",
    heroFact: "Best port for floatplane scenery, rainforest, and seafood culture.",
    categories: ["crab-tours", "misty-fjords"],
    heroImageSrc:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ketchikan%20Creek%20Street%20%288110071326%29.jpg",
    heroImageAlt: "Creek Street boardwalk and waterfront in Ketchikan",
  },
  {
    slug: "sitka",
    name: "Sitka",
    destinationId: 4153,
    queryName: "Sitka",
    intro: "Sitka is smaller and easier to overcomplicate. The right excursion usually focuses on wildlife or a calm scenic day rather than aggressive activity stacking.",
    idealFor: "Travelers who want a lower-stress port day with strong nature payoff.",
    summary: "Sea otters, marine life, and scenic shoreline experiences are the main reasons to book here.",
    planningNote: "Sitka rewards tours with simple transfers and a clear wildlife angle.",
    heroFact: "Best port for a calmer wildlife-first Alaska day.",
    categories: ["wildlife-tours"],
    heroImageSrc:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sitka_Harbor.jpg",
    heroImageAlt: "Sitka harbor with boats, waterfront, and forested hills behind it",
  },
  {
    slug: "icy-strait-point",
    name: "Icy Strait Point",
    destinationId: 26215,
    queryName: "Hoonah",
    intro: "Icy Strait Point is built around a few marquee experiences, so the best plan is usually a decisive one rather than a broad comparison exercise.",
    idealFor: "Cruise guests who want whales or signature adventure without getting lost in too many options.",
    summary: "Most travelers here either go marine-life first or choose one iconic adrenaline experience and keep the rest of the day easy.",
    planningNote: "Whale watching is the cleanest decision path for most cruise visitors to Icy Strait Point.",
    heroFact: "Best port for decisive single-experience booking.",
    categories: ["whale-watching"],
    heroImageSrc:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Icy_Strait_Harbor%2C_Hoonah%2C_Alaska.jpg",
    heroImageAlt: "Icy Strait harbor and surrounding shoreline near Hoonah",
  },
  {
    slug: "whittier",
    name: "Whittier",
    destinationId: 22320,
    queryName: "Whittier",
    intro: "Whittier is more about access and scenic marine excursions than classic cruise-port browsing.",
    idealFor: "Independent travelers or cruise extensions looking for a structured Prince William Sound day.",
    summary: "Use Whittier for marine scenery, transfer planning, and extension-day decisions rather than a pure port-day shopping list.",
    planningNote: "The right Whittier excursion usually depends on whether it stands alone or pairs with Anchorage or Seward travel.",
    heroFact: "Strong marine scenery and extension-day logistics.",
    categories: [],
    heroImageSrc:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Whittier_Harbor%2C_Alaska_%282%29.jpg",
    heroImageAlt: "Whittier harbor and Prince William Sound scenery",
  },
  {
    slug: "seward",
    name: "Seward",
    destinationId: 4368,
    queryName: "Seward",
    intro: "Seward is one of the best places in Alaska for a full water-based scenery day, especially if Kenai Fjords is your main target.",
    idealFor: "Travelers who want a longer, high-payoff marine wildlife and glacier experience.",
    summary: "If you are choosing Seward, you are usually choosing depth over variety. Kenai Fjords dominates the best-booking conversation here.",
    planningNote: "This is a port where committing to one excellent long excursion is usually smarter than trying to mix activities.",
    heroFact: "Top base for Kenai Fjords marine touring.",
    categories: ["kenai-fjords-tours"],
    heroImageSrc:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Seward_Harbor.jpg",
    heroImageAlt: "Seward harbor with boats and mountain scenery around Resurrection Bay",
  },
  {
    slug: "anchorage",
    name: "Anchorage",
    destinationId: 4152,
    queryName: "Anchorage",
    intro: "Anchorage works best as a launch point. The strongest excursion picks are day trips that solve scenery and logistics together.",
    idealFor: "Independent travelers adding one organized day to a broader Alaska itinerary.",
    summary: "Use Anchorage to compare how much ground you want to cover and whether you want glaciers, wildlife, rail pairings, or scenic driving.",
    planningNote: "The best Anchorage day tours reduce rental-car hassle while still delivering a real Alaska landscape payoff.",
    heroFact: "Best hub for multi-stop Alaska day touring.",
    categories: ["day-tours"],
    heroImageSrc:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Anchorage%2C_Alaska.JPG",
    heroImageAlt: "Anchorage skyline with surrounding mountain backdrop",
  },
  {
    slug: "fairbanks",
    name: "Fairbanks",
    destinationId: 5269,
    queryName: "Fairbanks",
    intro: "Fairbanks is less about classic shore excursions and more about interior Alaska add-ons, seasonal experiences, and flexible independent travel support.",
    idealFor: "Travelers extending their trip inland and choosing around seasonality instead of cruise timing.",
    summary: "This page helps position Fairbanks within the larger Alaska trip rather than treating it like a standard port list.",
    planningNote: "Fairbanks choices change more by season than by category, so a short curated list is more useful than a giant catalog.",
    heroFact: "Interior Alaska hub with strong seasonal variation.",
    categories: [],
    heroImageSrc:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Fairbanks%2C_Alaska.jpg",
    heroImageAlt: "Fairbanks cityscape under clear Alaska light",
  },
  {
    slug: "denali",
    name: "Denali",
    destinationId: 22364,
    queryName: "Denali National Park",
    intro: "Denali is about scenic scale. Flightseeing is the clearest premium decision if you want a transformative single activity.",
    idealFor: "Travelers willing to spend more for one unforgettable perspective on Denali.",
    summary: "Most Denali tour choices are really about how much you value aerial access versus staying fully land-based.",
    planningNote: "Flightseeing is one of the few Alaska experiences where the premium is often justified by the view difference alone.",
    heroFact: "Best interior splurge for aerial scenery.",
    categories: ["flightseeing"],
    heroImageSrc:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Denali_National_Park.jpg",
    heroImageAlt: "Denali mountain and broad national park landscape",
  },
];

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "whale-watching",
    city: "juneau",
    title: "Juneau Whale Watching",
    heading: "Best Juneau whale watching tours for cruise travelers",
    bestFor: "Cruise guests who want the cleanest high-confidence wildlife win in Juneau.",
    lead: "If you want the safest first pick in Juneau, whale watching is usually it. The deciding variables are boat size, transfer simplicity, and whether you want to pair it with glacier time.",
    query: "Juneau whale watching tours",
    keywords: ["whale", "marine", "orca", "humpback", "wildlife"],
    heroFact: "Usually the easiest premium Juneau yes.",
    defaultWhyTitle: "Why whale watching is our default Juneau recommendation",
    defaultWhyCopy: [
      "Juneau is one of the few Alaska ports where the most popular choice is also the safest first-time recommendation. Whale tours deliver the clearest wildlife payoff without committing the whole day to one transfer-heavy experience.",
      "Small-boat operators usually give you better sight lines, less engine noise, and a more personal guide rhythm once whales surface. That combination tends to create a better first Alaska wildlife experience than a louder, more crowded format.",
      "For most cruise travelers, the winning formula is simple pickup logistics, strong humpback odds, and enough room to move when the action shifts. That is why we lead here instead of asking you to sort through every boat yourself.",
    ],
    reviewSnippets: [
      {
        quote: "First Alaska stop of our cruise and this felt like the right call immediately. Smaller boat, easy pickup, and we saw humpbacks fast without fighting for rail space.",
        label: "First-time cruise visitors",
      },
      {
        quote: "We booked this with kids because the format felt calmer than a giant tour. The guide kept everyone engaged and the whale sightings were constant.",
        label: "Family choosing the easy yes",
      },
      {
        quote: "We wanted wildlife, not a long complicated excursion. This hit the sweet spot: smooth transfer, great visibility, and still enough time back in port.",
        label: "Independent travelers on a port clock",
      },
    ],
    comparisonRows: [
      {
        label: "Noise level",
        smallBoat: "Quieter on the water, easier to hear the guide and stay tuned to sightings.",
        airboat: "Not the standard Juneau format and usually louder, more thrill-first than wildlife-first.",
        largeGroup: "More engine and passenger noise once the boat fills up.",
      },
      {
        label: "Wildlife viewing",
        smallBoat: "Best blend of maneuverability and clean sight lines when whales surface.",
        airboat: "Lower fit for the classic Juneau whale-viewing experience.",
        largeGroup: "Still good, but rail space and crowding can dilute the moment.",
      },
      {
        label: "Group size",
        smallBoat: "Smaller groups feel more personal and easier to reposition.",
        airboat: "Varies, but usually less about interpretation and more about the ride.",
        largeGroup: "Higher passenger count and more shared attention.",
      },
      {
        label: "Overall vibe",
        smallBoat: "The most balanced first-timer choice: practical, scenic, and high confidence.",
        airboat: "Adrenaline-forward and less aligned with why most people book Juneau whales.",
        largeGroup: "Works if price is the only filter, but feels less premium once onboard.",
      },
    ],
    cruiseAudienceLine: "Built for cruise ship passengers visiting Juneau",
    cruiseAudienceIntro:
      "Most people booking whale watching here are coming off a cruise ship, and the wrong tour can ruin your port day fast.",
    cruiseAudienceSupport:
      "We only recommend options that fit the reality of a cruise stop.",
    cruiseFitPoints: [
      "Works with all major Alaska cruise lines including Royal Caribbean, Carnival, Norwegian, Princess, and more.",
      "Fits typical Juneau port windows without overcommitting your day.",
      "Reliable return-to-ship timing with no risky long transfers.",
      "Port pickup included or easy to reach from the dock.",
    ],
    cruiseAudienceOutro:
      "If this is your first time in Juneau, the goal is not to find every tour. It is to pick one that actually fits your schedule and delivers a high-confidence wildlife experience. That is why we lead with this option first.",
    deepDiveProof: [
      {
        quote: "The pickup was simple, the guide set expectations clearly, and we still had time to enjoy Juneau after the tour instead of rushing straight back.",
        label: "Princess guests protecting port time",
      },
      {
        quote: "We compared a few options, but this one felt the most cruise-aware. It was easy from the dock and never felt like we were gambling with ship timing.",
        label: "Royal Caribbean couple on a first Alaska sailing",
      },
      {
        quote: "The smaller format made a difference once whales showed up. We could move, listen, and actually enjoy the moment instead of standing three rows back.",
        label: "Norwegian family prioritizing visibility",
      },
    ],
    choosePoints: [
      {
        title: "Start with boat size, not just price",
        text: "Smaller whale-watching boats usually give you cleaner sight lines, less crowding at the rail, and a better guide-to-guest rhythm once the action starts.",
      },
      {
        title: "Watch for combo-tour tradeoffs",
        text: "If a tour also adds salmon baking, glacier stops, or city sightseeing, it can be a better fit for variety seekers but usually gives you a less focused whale experience.",
      },
      {
        title: "Use schedule fit as a hard filter",
        text: "On a cruise day, the best option is often the one that leaves a little margin for transfers, weather, and getting back to the ship without stress.",
      },
    ],
    logisticsPoints: [
      "Most strong Juneau whale tours are built around typical cruise schedules rather than full independent-travel days.",
      "Pickup is often included, and when it is not, the meeting point is usually straightforward from the cruise docks.",
      "Shorter transfer time usually means more of the excursion is spent on the water instead of in vans or check-in lines.",
      "If your ship has a tighter port window, prioritize the cleanest round-trip logistics over the most ambitious combo itinerary.",
    ],
    browseLead:
      "If you want to keep comparing before you click, these are the other live Juneau whale-watching options worth scanning after the featured recommendation and short-list alternatives.",
  },
  {
    slug: "helicopter-tours",
    city: "juneau",
    title: "Juneau Helicopter Tours",
    heading: "Best Juneau helicopter tours for glacier-day splurges",
    bestFor: "Travelers deciding whether the premium aerial-glacier experience is worth it.",
    lead: "Juneau helicopter tours are the Alaska splurge product people remember. The right choice depends on budget tolerance, weight and weather flexibility, and how much of the day you want committed to one experience.",
    query: "Juneau helicopter glacier tours",
    keywords: ["helicopter", "glacier", "flight", "dog sled", "landing"],
    heroFact: "The highest-upside Juneau splurge lane.",
  },
  {
    slug: "glacier-tours",
    city: "juneau",
    title: "Juneau Glacier Tours",
    heading: "Best Juneau glacier tours if you want scenery without the helicopter price",
    bestFor: "Travelers who want glacier payoff but need a more grounded plan.",
    lead: "Glacier tours in Juneau cover a wide spread, from efficient Mendenhall-focused options to broader combo days. Start with how much glacier access you actually want versus how much you just want the view.",
    query: "Juneau glacier tours",
    keywords: ["glacier", "mendenhall", "icefield", "waterfall", "trail"],
    heroFact: "Best value lane for glacier-focused visitors.",
  },
  {
    slug: "white-pass-tours",
    city: "skagway",
    title: "Skagway White Pass Tours",
    heading: "Best Skagway White Pass tours and rail alternatives",
    bestFor: "Cruise travelers who want the signature Skagway scenery with clean logistics.",
    lead: "White Pass is the default Skagway signature, but the best tour depends on whether you want rail-only simplicity, a bus combo, or broader Yukon mileage.",
    query: "Skagway White Pass tours",
    keywords: ["white pass", "railway", "train", "yukon", "scenic"],
    heroFact: "Skagway’s core decision lane.",
  },
  {
    slug: "crab-tours",
    city: "ketchikan",
    title: "Ketchikan Crab Tours",
    heading: "Best Ketchikan crab and seafood-focused tours",
    bestFor: "Travelers who want something local-feeling, easy, and very Ketchikan.",
    lead: "Crab tours work when you want a lower-friction excursion that still feels distinctly Alaskan. The real filter is whether you want scenery and storytelling or a more food-forward outing.",
    query: "Ketchikan crab tours",
    keywords: ["crab", "seafood", "bairdi", "local", "harbor"],
    heroFact: "One of the easiest low-stress Ketchikan picks.",
  },
  {
    slug: "misty-fjords",
    city: "ketchikan",
    title: "Ketchikan Misty Fjords Tours",
    heading: "Best Misty Fjords tours from Ketchikan",
    bestFor: "Travelers who want the strongest scenery-first excursion in Ketchikan.",
    lead: "Misty Fjords is the premium scenery lane in Ketchikan. The choice is usually floatplane versus cruise-style access, not whether the landscape payoff is real.",
    query: "Ketchikan Misty Fjords tours",
    keywords: ["misty fjords", "floatplane", "fjords", "scenic", "flight"],
    heroFact: "Ketchikan’s headline scenery splurge.",
  },
  {
    slug: "wildlife-tours",
    city: "sitka",
    title: "Sitka Wildlife Tours",
    heading: "Best Sitka wildlife tours for a lower-stress Alaska port day",
    bestFor: "Cruise guests who want marine life or wildlife without a heavy logistics day.",
    lead: "Sitka wildlife tours make sense when you want a strong nature payoff but don’t need a huge adrenaline or transfer-heavy experience.",
    query: "Sitka wildlife tours",
    keywords: ["wildlife", "otter", "bear", "eagle", "marine"],
    heroFact: "Strong nature payoff with less friction.",
  },
  {
    slug: "whale-watching",
    city: "icy-strait-point",
    title: "Icy Strait Point Whale Watching",
    heading: "Best whale watching tours from Icy Strait Point",
    bestFor: "Cruise travelers who want the cleanest single-booking decision in Icy Strait Point.",
    lead: "At Icy Strait Point, whale watching is often the simplest path to a memorable day. Use this page to choose the right format fast instead of browsing too many near-duplicates.",
    query: "Icy Strait Point whale watching tours",
    keywords: ["whale", "marine", "wildlife", "icy strait", "hoonah"],
    heroFact: "The easiest Icy Strait Point yes.",
  },
  {
    slug: "kenai-fjords-tours",
    city: "seward",
    title: "Seward Kenai Fjords Tours",
    heading: "Best Kenai Fjords tours from Seward",
    bestFor: "Travelers willing to devote the day to one marine-glacier experience.",
    lead: "Kenai Fjords is why most travelers book Seward. The main decision is how long you want to be on the water and how wildlife-forward versus glacier-forward you want the trip to feel.",
    query: "Seward Kenai Fjords tours",
    keywords: ["kenai", "fjord", "marine", "glacier", "wildlife"],
    heroFact: "A full-day marine scenery commitment that usually pays off.",
  },
  {
    slug: "flightseeing",
    city: "denali",
    title: "Denali Flightseeing",
    heading: "Best Denali flightseeing tours",
    bestFor: "Travelers deciding whether Denali is worth the aerial splurge.",
    lead: "Denali flightseeing is the premium interior Alaska bet. The right option comes down to route quality, glacier landing potential, and how much of the mountain you are likely to actually see from the air.",
    query: "Denali flightseeing tours",
    keywords: ["flightseeing", "plane", "aerial", "glacier", "denali"],
    heroFact: "The top Denali premium experience.",
  },
  {
    slug: "day-tours",
    city: "anchorage",
    title: "Anchorage Day Tours",
    heading: "Best Anchorage day tours if you want a guided Alaska sampler",
    bestFor: "Independent travelers who want one organized Alaska day without renting a car.",
    lead: "Anchorage day tours work best when you know whether you want a broad scenic sampler, wildlife, glacier access, or a rail-style extension feel.",
    query: "Anchorage day tours",
    keywords: ["day tour", "anchorage", "scenic", "wildlife", "glacier"],
    heroFact: "The cleanest way to add one guided Alaska day.",
  },
];

export const CATEGORY_LOOKUP = new Map<string, CategoryConfig>(
  CATEGORIES.map((category) => [`${category.city}/${category.slug}`, category] as const)
);

export const CITY_LOOKUP = new Map<string, CityConfig>(CITIES.map((city) => [city.slug, city] as const));

export function getCity(slug: string) {
  return CITY_LOOKUP.get(slug as CitySlug) || null;
}

export function getCategory(city: string, category: string) {
  return CATEGORY_LOOKUP.get(`${city}/${category}`) || null;
}

export function getCategoriesForCity(city: CitySlug) {
  return CATEGORIES.filter((category) => category.city === city);
}

export function getSuggestedLinks(city: CityConfig) {
  return city.categories
    .map((slug) => getCategory(city.slug, slug))
    .filter((item): item is CategoryConfig => Boolean(item))
    .map((item) => ({
      href: `/${city.slug}/${item.slug}`,
      label: item.title,
      description: item.bestFor,
    }));
}

export function getCrossCityLinks(city: CityConfig) {
  return CITIES.filter((item) => item.slug !== city.slug).slice(0, 4).map((item) => ({
    href: `/${item.slug}`,
    label: `${item.name} excursions`,
    description: item.heroFact,
  }));
}

export function pickHomepageCategories() {
  return [
    getCategory("juneau", "whale-watching"),
    getCategory("juneau", "helicopter-tours"),
    getCategory("skagway", "white-pass-tours"),
    getCategory("ketchikan", "misty-fjords"),
  ].filter((item): item is CategoryConfig => Boolean(item));
}

export function buildFallbackTour(city: CityConfig, copy: string): TourSummary {
  return {
    productCode: `${city.slug}-planning`,
    title: `${city.name} excursion planning`,
    description: copy,
    durationMinutes: null,
    durationLabel: "Varies by itinerary",
    priceFrom: null,
    currency: "USD",
    rating: null,
    reviewCount: null,
    imageUrl: null,
    imageVariants: [],
    maxImageWidth: null,
    hasLowQualityImage: false,
    bookingUrl: `/${city.slug}`,
    supplierName: null,
    tags: [],
    highlights: [city.heroFact, city.planningNote],
    bestFor: city.idealFor,
  };
}
