import { Fragment } from "react";
import { notFound } from "next/navigation";
import HeroSection from "@/components/HeroSection";
import SectionHeading from "@/components/SectionHeading";
import TourCard from "@/components/TourCard";
import LinkGrid from "@/components/LinkGrid";
import StructuredData from "@/components/StructuredData";
import AlaskaPageTelemetry from "@/components/telemetry/AlaskaPageTelemetry";
import { getCrossCityLinks } from "@/data/alaska";
import { buildAlaskaCorridor, buildDecisionLink, readDecisionContinuation } from "@/lib/dcc/alaskaDecision";
import { getAllCategories, getCategoryPageData } from "@/lib/alaska";
import { buildBreadcrumbJsonLd, buildCollectionJsonLd, buildMetadata } from "@/lib/seo";
import { buildViatorBookingUrl } from "@/lib/viator/config";

type CategoryPageProps = {
  params: Promise<{ city: string; category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({
    city: category.city,
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { city, category } = await params;
  const payload = await getCategoryPageData(city, category);
  if (!payload) return {};

  return buildMetadata({
    title: payload.category.title,
    description: payload.category.lead,
    path: `/${payload.city.slug}/${payload.category.slug}`,
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { city, category } = await params;
  const resolvedSearchParams = await searchParams;
  const payload = await getCategoryPageData(city, category);
  if (!payload) notFound();

  const [recommended, ...alternatives] = payload.tours;
  const shortList = alternatives.slice(0, 3);
  const browseTours = alternatives.slice(3);
  const pagePath = `/${payload.city.slug}/${payload.category.slug}`;
  const corridor = buildAlaskaCorridor(payload.city.slug, payload.category.slug);
  const incomingDecision = readDecisionContinuation(resolvedSearchParams);
  const citySlug = payload.city.slug;
  const categorySlug = payload.category.slug;
  const bookingCampaign =
    citySlug === "juneau" && categorySlug === "whale-watching" ? "juneau-whale" : undefined;
  const heroPrimaryCta = recommended
    ? citySlug === "juneau" && categorySlug === "whale-watching"
      ? {
          href: buildTourBookingHref(
            recommended.productCode,
            recommended.bookingUrl,
            "recommended-default",
            "check-availability",
            "continue_recommended_booking",
          ),
          label: "Check availability",
        }
      : {
          href: buildTourDetailHref(
            recommended.productCode,
            "recommended-default",
            "view-recommended-option",
            "review_recommended_tour",
          ),
          label: "View recommended option",
        }
    : { href: `/${payload.city.slug}`, label: `Back to ${payload.city.name}` };
  const heroSecondaryCta =
    citySlug === "juneau" && categorySlug === "whale-watching"
      ? undefined
      : { href: `/${payload.city.slug}`, label: `See all ${payload.city.name} excursions` };

  function buildTourDetailHref(productCode: string, option: string, cta: string, action: string) {
    return buildDecisionLink(
      {
        baseHref: `/tour/${productCode}`,
        sourcePage: pagePath,
        corridor,
        cta,
        action,
        option,
        product: productCode,
        destinationSurface: "flow",
      },
      incomingDecision,
    );
  }

  function buildTourBookingHref(productCode: string, bookingUrl: string, option: string, cta: string, action: string) {
    const attributedBookingUrl = buildViatorBookingUrl(
      bookingUrl,
      bookingCampaign ? { campaign: bookingCampaign, utmCampaign: bookingCampaign } : undefined,
    );
    return buildDecisionLink(
      {
        baseHref: attributedBookingUrl,
        sourcePage: pagePath,
        corridor,
        cta,
        action,
        option,
        product: productCode,
        destinationSurface: "operator",
      },
      incomingDecision,
    );
  }

  function buildTrackingPayload(
    targetPath: string,
    clickedProductSlug: string,
    option: string,
    stage: "recommended" | "browse",
  ) {
    return {
      source_page: pagePath,
      target_path: targetPath,
      route_target: stage,
      default_card_slug: recommended?.productCode,
      clicked_product_slug: clickedProductSlug,
      fit_signal: corridor,
      port: citySlug,
      metadata: {
        actual_corridor: corridor,
        city_slug: citySlug,
        category_slug: categorySlug,
        decision_corridor: incomingDecision.decisionCorridor || corridor,
        decision_option: option,
        stage,
        continuity_present: Boolean(incomingDecision.decisionCorridor || incomingDecision.decisionProduct),
      },
    } as const;
  }

  return (
    <main className="space-y-12 pb-10">
      <AlaskaPageTelemetry
        page={pagePath}
        port={payload.city.slug}
        actualCorridor={corridor}
        defaultCardSlug={recommended?.productCode}
        shortlistCount={payload.tours.length}
        pageRole="feeder"
        continuityPresent={Boolean(incomingDecision.decisionCorridor || incomingDecision.decisionProduct)}
      />
      <StructuredData
        data={buildBreadcrumbJsonLd([
          { name: "Home", item: "/" },
          { name: payload.city.name, item: `/${payload.city.slug}` },
          { name: payload.category.title, item: `/${payload.city.slug}/${payload.category.slug}` },
        ])}
      />
      <StructuredData
        data={buildCollectionJsonLd(
          payload.category.title,
          payload.category.lead,
          `/${payload.city.slug}/${payload.category.slug}`,
          payload.tours.map((tour) => ({ name: tour.title, url: `/tour/${tour.productCode}` }))
        )}
      />

      <HeroSection
        eyebrow={`${payload.city.name} category`}
        title={payload.category.heading}
        description={payload.category.lead}
        primaryCta={heroPrimaryCta}
        secondaryCta={heroSecondaryCta}
        fact={payload.category.heroFact}
        backgroundImageSrc={payload.city.heroImageSrc}
        backgroundImageAlt={payload.city.heroImageAlt}
        primaryTelemetry={recommended ? {
          eventName:
            citySlug === "juneau" && categorySlug === "whale-watching" ? "booking_opened" : "product_opened",
          additionalEvents: ["cta_clicked_primary"],
          eventProps:
            citySlug === "juneau" && categorySlug === "whale-watching"
              ? buildTrackingPayload(
                  buildViatorBookingUrl(
                    recommended.bookingUrl,
                    bookingCampaign ? { campaign: bookingCampaign, utmCampaign: bookingCampaign } : undefined,
                  ),
                  recommended.productCode,
                  "recommended-default",
                  "recommended",
                )
              : buildTrackingPayload(`/tour/${recommended.productCode}`, recommended.productCode, "recommended-default", "recommended"),
        } : undefined}
      />

      {recommended ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Recommended first"
            title={recommended.title}
            description="This is the first tour to check if you want the Juneau whale-watching option that fits cruise timing cleanly and still feels like the right wildlife call."
          />
          {payload.category.cruiseAudienceLine || payload.category.defaultWhyCopy?.length ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Why we lead with this option</p>
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                    {payload.category.cruiseAudienceLine || payload.category.defaultWhyTitle || `Why ${payload.category.title.toLowerCase()} leads here`}
                  </h3>
                  {payload.category.cruiseAudienceIntro ? (
                    <p className="max-w-3xl text-base leading-7 text-slate-600">
                      {payload.category.cruiseAudienceIntro}
                    </p>
                  ) : null}
                  {payload.category.cruiseAudienceSupport ? (
                    <p className="max-w-3xl text-base leading-7 text-slate-600">
                      {payload.category.cruiseAudienceSupport}
                    </p>
                  ) : null}
                </div>
                {payload.category.cruiseFitPoints?.length ? (
                  <div className="rounded-[24px] bg-fog p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Cruise fit</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {payload.category.cruiseFitPoints.map((point) => (
                        <li key={point}>• {point}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              {payload.category.defaultWhyCopy?.length ? (
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {payload.category.defaultWhyCopy.map((reason) => (
                    <div key={reason} className="rounded-2xl bg-fog p-4 text-sm leading-6 text-slate-700">
                      {reason}
                    </div>
                  ))}
                </div>
              ) : null}
              {payload.category.cruiseAudienceOutro ? (
                <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
                  {payload.category.cruiseAudienceOutro}
                </p>
              ) : null}
            </div>
          ) : null}

          {payload.category.reviewSnippets?.length ? (
            <div className="grid gap-3 md:grid-cols-3">
              {payload.category.reviewSnippets.map((snippet) => (
                <blockquote key={snippet.quote} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-panel">
                  <p className="text-sm leading-6 text-slate-700">“{snippet.quote}”</p>
                  <footer className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {snippet.label}
                  </footer>
                </blockquote>
              ))}
            </div>
          ) : null}

          <TourCard
            tour={recommended}
            priority
            featured
            featuredCtaNote="If you want the safest yes for a Juneau cruise stop, start here."
            featuredImageSrc={payload.city.heroImageSrc}
            featuredImageAlt={payload.city.heroImageAlt}
            bookingCampaign={bookingCampaign}
            detailHref={buildTourDetailHref(recommended.productCode, "recommended-default", "view-recommended-option", "review_recommended_tour")}
            bookingHref={buildTourBookingHref(recommended.productCode, recommended.bookingUrl, "recommended-default", "check-live-price-and-availability", "continue_recommended_booking")}
            detailTelemetry={{
              eventName: "product_opened",
              additionalEvents: ["cta_clicked_primary"],
              eventProps: buildTrackingPayload(`/tour/${recommended.productCode}`, recommended.productCode, "recommended-default", "recommended"),
            }}
            bookingTelemetry={{
              eventName: "booking_opened",
              additionalEvents: ["cta_clicked_primary"],
              eventProps: buildTrackingPayload(
                buildViatorBookingUrl(
                  recommended.bookingUrl,
                  bookingCampaign ? { campaign: bookingCampaign, utmCampaign: bookingCampaign } : undefined,
                ),
                recommended.productCode,
                "recommended-default",
                "recommended",
              ),
            }}
          />
        </section>
      ) : null}

      {payload.category.comparisonRows?.length ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Quick comparison"
            title="Why small boat stays the best fit for most first-timers"
            description="This is not a full catalog. It is the short comparison that explains why we default to the quieter, higher-visibility format first."
          />
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-panel">
            <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr] gap-px bg-slate-200 text-sm">
              <div className="bg-slate-950 p-4 font-semibold text-white">What matters</div>
              <div className="bg-slate-950 p-4 font-semibold text-white">Small boat</div>
              <div className="bg-slate-950 p-4 font-semibold text-white">Airboat</div>
              <div className="bg-slate-950 p-4 font-semibold text-white">Large group</div>
              {payload.category.comparisonRows.map((row) => (
                <Fragment key={row.label}>
                  <div key={`${row.label}-label`} className="bg-white p-4 font-semibold text-slate-950">
                    {row.label}
                  </div>
                  <div className="bg-white p-4 leading-6 text-slate-700">
                    {row.smallBoat}
                  </div>
                  <div className="bg-white p-4 leading-6 text-slate-700">
                    {row.airboat}
                  </div>
                  <div className="bg-white p-4 leading-6 text-slate-700">
                    {row.largeGroup}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {(payload.category.choosePoints?.length || payload.category.logisticsPoints?.length || payload.category.deepDiveProof?.length) ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Before you browse deeper"
            title="What separates the better Juneau whale-watching fits"
            description="Once you understand the featured pick, these are the details that matter most when you compare the rest of the field."
          />
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              {payload.category.choosePoints?.length ? (
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">How to choose</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {payload.category.choosePoints.map((point) => (
                      <div key={point.title} className="rounded-2xl bg-fog p-4">
                        <h3 className="text-base font-semibold tracking-tight text-slate-950">{point.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{point.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {payload.category.deepDiveProof?.length ? (
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">More proof from cruise travelers</p>
                  <div className="mt-4 grid gap-3">
                    {payload.category.deepDiveProof.map((snippet) => (
                      <blockquote key={snippet.quote} className="rounded-2xl bg-fog p-4">
                        <p className="text-sm leading-6 text-slate-700">“{snippet.quote}”</p>
                        <footer className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {snippet.label}
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {payload.category.logisticsPoints?.length ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Port-fit and logistics</p>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  This is where stronger Juneau whale-watching tours separate themselves from options that look fine on a card but fit a cruise day less cleanly.
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  {payload.category.logisticsPoints.map((point) => (
                    <li key={point} className="rounded-2xl bg-fog px-4 py-3">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {shortList.length > 0 ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Alternatives"
            title={`Other ${payload.category.title.toLowerCase()} picks worth comparing`}
            description="These are the next-best fits to scan after the featured choice if you want a shorter list before you drop into the fuller marketplace layer."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {shortList.map((tour) => (
              <TourCard
                key={tour.productCode}
                tour={tour}
                detailHref={buildTourDetailHref(tour.productCode, "shortlist-alternative", "view-shortlist-alternative", "review_shortlist_alternative")}
                bookingHref={buildTourBookingHref(tour.productCode, tour.bookingUrl, "shortlist-alternative", "check-live-price", "continue_shortlist_booking")}
                bookingCampaign={bookingCampaign}
                detailTelemetry={{
                  eventName: "product_opened",
                  additionalEvents: ["cta_clicked_alternative"],
                  eventProps: buildTrackingPayload(`/tour/${tour.productCode}`, tour.productCode, "shortlist-alternative", "browse"),
                }}
                bookingTelemetry={{
                  eventName: "booking_opened",
                  additionalEvents: ["cta_clicked_alternative"],
                  eventProps: buildTrackingPayload(
                    buildViatorBookingUrl(
                      tour.bookingUrl,
                      bookingCampaign ? { campaign: bookingCampaign, utmCampaign: bookingCampaign } : undefined,
                    ),
                    tour.productCode,
                    "shortlist-alternative",
                    "browse",
                  ),
                }}
              />
            ))}
          </div>
        </section>
      ) : null}

      {browseTours.length > 0 ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="More Juneau whale-watching options"
            title="Keep browsing without losing the shortlist"
            description={
              payload.category.browseLead ||
              "These are the next live options to scan if you want more marketplace depth after the recommendation and top alternatives."
            }
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {browseTours.map((tour) => (
              <TourCard
                key={tour.productCode}
                tour={tour}
                detailHref={buildTourDetailHref(tour.productCode, "browse-grid-option", "view-browse-option", "review_browse_option")}
                bookingHref={buildTourBookingHref(tour.productCode, tour.bookingUrl, "browse-grid-option", "check-live-price", "continue_browse_booking")}
                bookingCampaign={bookingCampaign}
                detailTelemetry={{
                  eventName: "product_opened",
                  additionalEvents: ["cta_clicked_alternative"],
                  eventProps: buildTrackingPayload(`/tour/${tour.productCode}`, tour.productCode, "browse-grid-option", "browse"),
                }}
                bookingTelemetry={{
                  eventName: "booking_opened",
                  additionalEvents: ["cta_clicked_alternative"],
                  eventProps: buildTrackingPayload(
                    buildViatorBookingUrl(
                      tour.bookingUrl,
                      bookingCampaign ? { campaign: bookingCampaign, utmCampaign: bookingCampaign } : undefined,
                    ),
                    tour.productCode,
                    "browse-grid-option",
                    "browse",
                  ),
                }}
              />
            ))}
          </div>
        </section>
      ) : null}

      <LinkGrid title="Keep narrowing the Alaska plan" links={getCrossCityLinks(payload.city)} />
    </main>
  );
}
