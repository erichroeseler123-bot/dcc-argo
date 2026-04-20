import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import HomepageSearch from "@/components/HomepageSearch";
import SectionHeading from "@/components/SectionHeading";
import TourCard from "@/components/TourCard";
import LinkGrid from "@/components/LinkGrid";
import DecisionStrip from "@/components/DecisionStrip";
import StructuredData from "@/components/StructuredData";
import TrackedCta from "@/components/telemetry/TrackedCta";
import { CITIES, pickHomepageCategories } from "@/data/alaska";
import { getFeaturedHomepageTours } from "@/lib/alaska";
import { getHomepageSearchEntries } from "@/lib/homepageSearch";
import { buildCollectionJsonLd, buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Alaska shore excursions that fit your port day",
  description:
    "Start by port or activity type and narrow to the right Alaska shore excursion fast. Compare live Viator tours for Juneau, Skagway, Ketchikan, Sitka, Seward, Denali, and more.",
  path: "/",
});

export default async function HomePage() {
  const featuredTours = await getFeaturedHomepageTours();
  const featuredCategories = pickHomepageCategories();
  const searchEntries = getHomepageSearchEntries();
  const cityTiles = CITIES.filter((city) => city.heroImageSrc);

  return (
    <main className="space-y-12 pb-10">
      <StructuredData
        data={buildCollectionJsonLd(
          "Last Frontier Shore Excursions",
          "Destination-first Alaska shore excursion planning for cruise passengers and independent travelers.",
          "/",
          CITIES.map((city) => ({ name: `${city.name} shore excursions`, url: `/${city.slug}` }))
        )}
      />

      <HeroSection
        eyebrow="Alaska cruise excursion planning"
        decisionLine="Start with the port day you actually want"
        title="Choose your Alaska cruise by the day you actually want."
        description="Most people pick a cruise first and figure out excursions later. Start with the port day that matters—Juneau, Skagway, or Ketchikan—and build from there."
        primaryCta={{ href: "/juneau", label: "Start with Juneau" }}
        secondaryCta={{ href: "/best-alaska-cruise-for-excursions", label: "Compare Alaska cruise options" }}
        primaryTelemetry={{
          eventName: "cta_clicked_primary",
          eventProps: {
            source_page: "/",
            target_path: "/juneau",
            route_target: "juneau",
            clicked_product_slug: "homepage-hero-juneau",
            fit_signal: "juneau",
            port: "juneau",
            corridor_id: "lastfrontier-alaska",
            metadata: {
              actual_corridor: "juneau",
              stage: "browse",
              decision_option: "homepage-hero-juneau",
            },
          },
        }}
        secondaryTelemetry={{
          eventName: "cta_clicked_alternative",
          eventProps: {
            source_page: "/",
            target_path: "/best-alaska-cruise-for-excursions",
            route_target: "alaska-cruise-excursions",
            clicked_product_slug: "homepage-hero-cruise-options",
            fit_signal: "alaska-cruise-excursions",
            corridor_id: "alaska-cruise-excursions",
            metadata: {
              actual_corridor: "alaska-cruise-excursions",
              stage: "browse",
              decision_option: "homepage-hero-cruise-options",
            },
          },
        }}
        fact="Built for cruise passengers and independent Alaska travelers."
        backgroundImageSrc="https://commons.wikimedia.org/wiki/Special:Redirect/file/Juneau%20Alaska%20%283%29.jpg"
        backgroundImageAlt="Alaska harbor and mountains under soft coastal light"
      />

      <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">How this actually works</p>
        <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600 md:text-base">
          <p>You’re booking the same tour, at the same price, directly with the company that runs it.</p>
          <p>We help you choose the right option for your port day, instead of sorting through dozens of similar listings.</p>
          <p>If something changes, like timing, weather, or plans, you’re not figuring it out alone.</p>
        </div>
      </section>

      <DecisionStrip
        title="How this site helps you decide"
        points={[
          "Start by port if your cruise stop decides the day.",
          "Start by category if you already know you want whales, helicopters, glaciers, or scenic rail.",
          "Use the recommended option first, then compare only a few viable alternatives.",
        ]}
      />

      <HomepageSearch entries={searchEntries} />

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Major ports"
          title="Choose your Alaska port"
          description="Each port page is built to narrow the day quickly, show the best-fitting categories, and surface live Viator tours without drowning you in duplicates."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cityTiles.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-panel transition hover:-translate-y-0.5 hover:border-slate-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={city.heroImageSrc}
                  alt={city.heroImageAlt || `${city.name} Alaska`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/62 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/72">{city.heroFact}</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">{city.name}</h2>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-6 text-slate-600">{city.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <LinkGrid
        title="Start by activity type"
        links={featuredCategories.map((category) => ({
          href: `/${category.city}/${category.slug}`,
          label: category.title,
          description: category.bestFor,
        }))}
      />

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Recommended tours"
          title="A few high-intent Alaska tours to start with"
          description="These are live Viator products pulled from the strongest demand lanes first. Use them as a starting point, then branch into the exact city or category page for a tighter comparison."
        />
        {featuredTours.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredTours.map((tour, index) => (
              <TourCard
                key={tour.productCode}
                tour={tour}
                priority={index === 0}
                bookingCampaign="homepage"
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-sm leading-7 text-slate-600">
            Add the Viator environment variables in <code>.env.local</code> to populate live tour cards here. The core port and category structure is already in place.
          </div>
        )}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-panel">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Port-first planning</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Cruise day decisions are different from generic Alaska tour browsing.</h2>
            <p className="text-base leading-7 text-slate-600">
              The best shore excursion is rarely “the top seller.” It is the option that fits your docking window, your transfer tolerance, and the one Alaska experience you actually care about most.
            </p>
            <TrackedCta
              href="/best-alaska-cruise-for-excursions"
              className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
              eventName="cta_clicked_alternative"
              eventProps={{
                source_page: "/",
                target_path: "/best-alaska-cruise-for-excursions",
                route_target: "alaska-cruise-excursions",
                clicked_product_slug: "homepage-cruise-link",
                fit_signal: "alaska-cruise-excursions",
                corridor_id: "alaska-cruise-excursions",
                metadata: {
                  actual_corridor: "alaska-cruise-excursions",
                  stage: "browse",
                  decision_option: "homepage-cruise-link",
                },
              }}
            >
              Planning a cruise? Choose by port day first
            </TrackedCta>
          </div>
          <div className="rounded-[24px] bg-fog p-6">
            <ul className="space-y-3 text-sm leading-6 text-slate-700">
              <li>Juneau: whales, helicopters, or glacier value.</li>
              <li>Skagway: White Pass rail fit versus overcommitting the day.</li>
              <li>Ketchikan: Misty Fjords scenery versus easy local-feeling tours.</li>
              <li>Seward and Denali: one major experience is usually the right call.</li>
            </ul>
          </div>
        </div>
      </section>

      <p className="text-sm text-slate-500">
        Canonical homepage: <span className="font-medium text-slate-700">{absoluteUrl("/")}</span>
      </p>
    </main>
  );
}
