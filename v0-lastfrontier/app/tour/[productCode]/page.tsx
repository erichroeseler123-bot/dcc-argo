import { notFound } from "next/navigation";
import SectionHeading from "@/components/SectionHeading";
import StructuredData from "@/components/StructuredData";
import AlaskaPageTelemetry from "@/components/telemetry/AlaskaPageTelemetry";
import TrackedCta from "@/components/telemetry/TrackedCta";
import { getTour, getTourSuggestions } from "@/lib/alaska";
import { buildDecisionLink, readDecisionContinuation } from "@/lib/dcc/alaskaDecision";
import { formatMoney, formatRating } from "@/lib/format";
import { buildBreadcrumbJsonLd, buildMetadata, buildTourJsonLd } from "@/lib/seo";
import { buildViatorBookingUrl } from "@/lib/viator/config";
import { buildViatorImageProps } from "@/lib/viator/images";

type TourPageProps = {
  params: Promise<{ productCode: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: TourPageProps) {
  const { productCode } = await params;
  const detail = await getTour(productCode);
  if (!detail) return {};

  return buildMetadata({
    title: detail.title,
    description: detail.description,
    path: `/tour/${detail.productCode}`,
  });
}

export default async function TourPage({ params, searchParams }: TourPageProps) {
  const { productCode } = await params;
  const resolvedSearchParams = await searchParams;
  const detail = await getTour(productCode);
  if (!detail) notFound();

  const suggestions = await getTourSuggestions(productCode);
  const pagePath = `/tour/${detail.productCode}`;
  const incomingDecision = readDecisionContinuation(resolvedSearchParams);
  const corridor = incomingDecision.decisionCorridor || "alaska-tour-detail";
  const detailProductCode = detail.productCode;
  const attributedBookingUrl = buildViatorBookingUrl(detail.bookingUrl);
  const bookingHref = buildDecisionLink(
    {
      baseHref: attributedBookingUrl,
      sourcePage: pagePath,
      corridor,
      cta: "check-live-availability-on-viator",
      action: "continue_selected_tour_booking",
      option: incomingDecision.decisionOption || "tour-detail",
      product: detail.productCode,
      destinationSurface: "operator",
    },
    incomingDecision,
  );
  function buildSuggestionDetailHref(nextProductCode: string) {
    return buildDecisionLink(
      {
        baseHref: `/tour/${nextProductCode}`,
        sourcePage: pagePath,
        corridor,
        cta: "view-nearby-alternative",
        action: "review_nearby_alternative",
        option: "nearby-alternative",
        product: nextProductCode,
        destinationSurface: "flow",
      },
      incomingDecision,
    );
  }

  function buildSuggestionBookingHref(nextProductCode: string, nextBookingUrl: string) {
    const attributedSuggestionBookingUrl = buildViatorBookingUrl(nextBookingUrl);
    return buildDecisionLink(
      {
        baseHref: attributedSuggestionBookingUrl,
        sourcePage: pagePath,
        corridor,
        cta: "check-nearby-live-price",
        action: "continue_nearby_alternative_booking",
        option: "nearby-alternative",
        product: nextProductCode,
        destinationSurface: "operator",
      },
      incomingDecision,
    );
  }

  function buildTrackingPayload(targetPath: string, clickedProductSlug: string, option: string) {
    return {
      source_page: pagePath,
      target_path: targetPath,
      route_target: option,
      default_card_slug: incomingDecision.decisionProduct || detailProductCode,
      clicked_product_slug: clickedProductSlug,
      fit_signal: corridor,
      metadata: {
        actual_corridor: corridor,
        product_code: detailProductCode,
        decision_option: option,
        continuity_present: Boolean(incomingDecision.decisionCorridor || incomingDecision.decisionProduct),
      },
    } as const;
  }

  return (
    <main className="space-y-12 pb-10">
      <AlaskaPageTelemetry
        page={pagePath}
        actualCorridor={corridor}
        defaultCardSlug={detail.productCode}
        pageRole="execution"
        continuityPresent={Boolean(incomingDecision.decisionCorridor || incomingDecision.decisionProduct)}
      />
      <StructuredData
        data={buildBreadcrumbJsonLd([
          { name: "Home", item: "/" },
          { name: "Tour detail", item: `/tour/${detail.productCode}` },
        ])}
      />
      <StructuredData
        data={buildTourJsonLd({
          name: detail.title,
          description: detail.description,
          url: `/tour/${detail.productCode}`,
          image: detail.imageUrl,
          price: detail.priceFrom,
          currency: detail.currency,
          rating: detail.rating,
          reviewCount: detail.reviewCount,
          provider: detail.supplierName,
        })}
      />

      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Tour detail</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">{detail.title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">{detail.overview}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {detail.images.length > 0 ? (
              detail.images.slice(0, 4).map((image, index) => {
                const imageProps = buildViatorImageProps(image.variants, {
                  minWidth: index === 0 ? 1800 : 960,
                  sizes: "(min-width: 1024px) 24vw, (min-width: 640px) 50vw, 100vw",
                  preferLargest: index === 0,
                });
                return (
                  <div key={image.url} className="overflow-hidden rounded-[24px] bg-slate-100">
                    <img
                      src={imageProps?.src || image.url}
                      srcSet={imageProps?.srcSet}
                      sizes={imageProps?.sizes}
                      alt={detail.title}
                      className="aspect-[4/3] h-full w-full object-cover"
                      width={imageProps?.width}
                      height={imageProps?.height}
                    />
                  </div>
                );
              })
            ) : (
              <div className="rounded-[24px] bg-slate-100 p-8 text-sm text-slate-500">
                Live Viator media will appear here when returned for this product.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
          <div>
            <p className="text-sm text-slate-500">From</p>
            <p className="text-3xl font-semibold tracking-tight text-slate-950">{formatMoney(detail.priceFrom, detail.currency)}</p>
            <p className="mt-2 text-sm text-slate-500">{detail.durationLabel}</p>
            <p className="mt-1 text-sm text-slate-500">{formatRating(detail.rating, detail.reviewCount)}</p>
          </div>
          <div className="rounded-2xl bg-fog p-4 text-sm leading-6 text-slate-700">
            <p className="font-medium text-slate-900">Best for</p>
            <p className="mt-1">{detail.bestFor}</p>
          </div>
          <div className="space-y-2 text-sm leading-6 text-slate-700">
            <p><span className="font-medium text-slate-900">Meeting point:</span> {detail.meetingPoint}</p>
            <p><span className="font-medium text-slate-900">Cancellation:</span> {detail.cancellationHeadline}</p>
            <p>{detail.cancellationText}</p>
          </div>
          <TrackedCta
            href={bookingHref}
            target="_blank"
            rel="noreferrer"
            className="block rounded-full bg-ember px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#c96b2d]"
            eventName="booking_opened"
            additionalEvents={["cta_clicked_primary"]}
            eventProps={buildTrackingPayload(bookingHref, detail.productCode, incomingDecision.decisionOption || "tour-detail")}
          >
            Check availability
          </TrackedCta>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
          <SectionHeading
            eyebrow="Highlights"
            title="What stands out"
            description="The fastest way to judge whether this tour matches the kind of Alaska day you actually want."
          />
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
            {detail.highlights.length > 0
              ? detail.highlights.map((item) => <li key={item}>• {item}</li>)
              : <li>• Live Viator detail will list the strongest highlights for this tour.</li>}
          </ul>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
          <SectionHeading
            eyebrow="What to confirm"
            title="Before you book"
            description="These are the practical items that matter most for cruise guests and independent travelers."
          />
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
            {[...detail.additionalInfo, ...detail.departureNotes, ...detail.returnNotes].slice(0, 6).map((item) => (
              <li key={item}>• {item}</li>
            ))}
            {detail.additionalInfo.length + detail.departureNotes.length + detail.returnNotes.length === 0 ? (
              <li>• Review meeting instructions, transfer timing, and the cancellation window directly in the live Viator listing.</li>
            ) : null}
          </ul>
        </div>
      </section>

      {suggestions.length > 0 ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Compare nearby options"
            title="A few alternatives if this one is not the fit"
            description="Sometimes the right move is keeping the same city or category but changing duration, budget, or pace."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {suggestions.map((tour) => (
              <div key={tour.productCode} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-panel">
                <h2 className="text-xl font-semibold text-slate-950">{tour.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{tour.description}</p>
                <div className="mt-4 flex gap-3">
                  <TrackedCta
                    href={buildSuggestionDetailHref(tour.productCode)}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900"
                    eventName="product_opened"
                    additionalEvents={["cta_clicked_alternative"]}
                    eventProps={buildTrackingPayload(`/tour/${tour.productCode}`, tour.productCode, "nearby-alternative")}
                  >
                    View details
                  </TrackedCta>
                  <TrackedCta
                    href={buildSuggestionBookingHref(tour.productCode, tour.bookingUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    eventName="booking_opened"
                    additionalEvents={["cta_clicked_alternative"]}
                    eventProps={buildTrackingPayload(buildSuggestionBookingHref(tour.productCode, tour.bookingUrl), tour.productCode, "nearby-alternative")}
                  >
                    Check availability
                  </TrackedCta>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
