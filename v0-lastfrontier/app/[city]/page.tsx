import Link from "next/link";
import { notFound } from "next/navigation";
import HeroSection from "@/components/HeroSection";
import SectionHeading from "@/components/SectionHeading";
import LinkGrid from "@/components/LinkGrid";
import TourCard from "@/components/TourCard";
import DecisionStrip from "@/components/DecisionStrip";
import StructuredData from "@/components/StructuredData";
import TrackedCta from "@/components/telemetry/TrackedCta";
import { getCategoriesForCity, getCrossCityLinks, getSuggestedLinks } from "@/data/alaska";
import { getAllCities, getCityPageData } from "@/lib/alaska";
import { buildBreadcrumbJsonLd, buildCollectionJsonLd, buildMetadata } from "@/lib/seo";

type CityPageProps = {
  params: Promise<{ city: string }>;
};

export async function generateStaticParams() {
  return getAllCities().map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: CityPageProps) {
  const { city: citySlug } = await params;
  const payload = await getCityPageData(citySlug);
  if (!payload) return {};

  return buildMetadata({
    title: `${payload.city.name} shore excursions and tours`,
    description: payload.city.summary,
    path: `/${payload.city.slug}`,
  });
}

export default async function CityPage({ params }: CityPageProps) {
  const { city: citySlug } = await params;
  const payload = await getCityPageData(citySlug);
  if (!payload) notFound();

  const { city, tours } = payload;
  const categories = getCategoriesForCity(city.slug);

  return (
    <main className="space-y-12 pb-10">
      <StructuredData
        data={buildBreadcrumbJsonLd([
          { name: "Home", item: "/" },
          { name: city.name, item: `/${city.slug}` },
        ])}
      />
      <StructuredData
        data={buildCollectionJsonLd(
          `${city.name} shore excursions`,
          city.summary,
          `/${city.slug}`,
          tours.map((tour) => ({ name: tour.title, url: `/tour/${tour.productCode}` }))
        )}
      />

      <HeroSection
        eyebrow={`${city.name} excursion planning`}
        title={`${city.name} shore excursions that actually fit the day`}
        description={city.intro}
        primaryCta={categories[0] ? { href: `/${city.slug}/${categories[0].slug}`, label: `Start with ${categories[0].title}` } : { href: "/", label: "Back to homepage" }}
        secondaryCta={city.slug !== "juneau" ? { href: "/juneau", label: "Compare Juneau too" } : { href: "/skagway", label: "Compare Skagway too" }}
        fact={city.heroFact}
        backgroundImageSrc={city.heroImageSrc}
        backgroundImageAlt={city.heroImageAlt}
      />

      <DecisionStrip
        title={`How to choose ${city.name} fast`}
        points={[city.summary, city.planningNote, city.idealFor]}
      />

      {city.slug === "juneau" || city.slug === "skagway" ? (
        <section className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-panel">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm leading-6 text-slate-600">
              Still choosing the cruise itself? Start by picking the Alaska port day you actually want.
            </p>
            <TrackedCta
              href="/best-alaska-cruise-for-excursions"
              className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
              eventName="cta_clicked_alternative"
              eventProps={{
                source_page: `/${city.slug}`,
                target_path: "/best-alaska-cruise-for-excursions",
                route_target: "alaska-cruise-excursions",
                clicked_product_slug: `${city.slug}-support-link`,
                fit_signal: "alaska-cruise-excursions",
                port: city.slug,
                corridor_id: "alaska-cruise-excursions",
                metadata: {
                  actual_corridor: "alaska-cruise-excursions",
                  stage: "browse",
                  decision_option: `${city.slug}-support-link`,
                },
              }}
            >
              Choose the cruise by excursions
            </TrackedCta>
          </div>
        </section>
      ) : null}

      {categories.length > 0 ? <LinkGrid title={`${city.name} category pages`} links={getSuggestedLinks(city)} /> : null}

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Live tours"
          title={`Recommended ${city.name} tours`}
          description={`Lead with one recommended fit and a few good alternatives. These live Viator results are already filtered by ${city.name.toLowerCase()} so you can move faster.`}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {tours.map((tour, index) => (
            <TourCard
              key={tour.productCode}
              tour={tour}
              priority={index === 0}
              featured={index === 0}
              featuredCtaNote={index === 0 ? `If you want the fastest strong ${city.name} yes, start here.` : undefined}
              bookingCampaign={city.slug === "juneau" ? "juneau-city" : undefined}
            />
          ))}
        </div>
      </section>

      <LinkGrid title={`More Alaska ports to compare after ${city.name}`} links={getCrossCityLinks(city)} />
    </main>
  );
}
