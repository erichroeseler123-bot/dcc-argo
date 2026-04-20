"use client";

import TrackedCta from "@/components/telemetry/TrackedCta";
import { formatMoney, formatRating } from "@/lib/format";
import type { AlaskaCorridorEventName, AlaskaCorridorEventProps } from "@/lib/telemetry/alaskaCorridor";
import type { TourSummary } from "@/lib/types";
import { buildViatorBookingUrl } from "@/lib/viator/config";
import { buildViatorImageProps } from "@/lib/viator/images";

export default function TourCard({
  tour,
  priority = false,
  featured = false,
  featuredCtaNote,
  featuredImageSrc,
  featuredImageAlt,
  detailHref,
  bookingHref,
  bookingCampaign,
  detailTelemetry,
  bookingTelemetry,
}: {
  tour: TourSummary;
  priority?: boolean;
  featured?: boolean;
  featuredCtaNote?: string;
  featuredImageSrc?: string;
  featuredImageAlt?: string;
  detailHref?: string;
  bookingHref?: string;
  bookingCampaign?: string;
  detailTelemetry?: {
    eventName: AlaskaCorridorEventName;
    additionalEvents?: AlaskaCorridorEventName[];
    eventProps: AlaskaCorridorEventProps;
  };
  bookingTelemetry?: {
    eventName: AlaskaCorridorEventName;
    additionalEvents?: AlaskaCorridorEventName[];
    eventProps: AlaskaCorridorEventProps;
  };
}) {
  const resolvedDetailHref = detailHref || `/tour/${tour.productCode}`;
  const resolvedBookingHref = buildViatorBookingUrl(
    bookingHref || tour.bookingUrl,
    bookingCampaign ? { campaign: bookingCampaign, utmCampaign: bookingCampaign } : undefined,
  );
  const imageProps = buildViatorImageProps(tour.imageVariants, {
    minWidth: featured ? 1280 : 720,
    sizes: featured
      ? "(min-width: 1024px) 42rem, 100vw"
      : "(min-width: 1280px) 22rem, (min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw",
  });

  return (
    <article
      className={`overflow-hidden rounded-[28px] border bg-white shadow-panel ${
        featured ? "border-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.14)]" : "border-slate-200"
      }`}
    >
      <div className={`bg-slate-100 ${featured ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        {featured && featuredImageSrc ? (
          <img
            src={featuredImageSrc}
            alt={featuredImageAlt || tour.title}
            className="h-full w-full object-cover"
            loading={priority ? "eager" : "lazy"}
          />
        ) : tour.imageUrl ? (
          <img
            src={imageProps?.src || tour.imageUrl}
            srcSet={imageProps?.srcSet}
            sizes={imageProps?.sizes}
            alt={tour.title}
            className="h-full w-full object-cover"
            loading={priority ? "eager" : "lazy"}
            width={imageProps?.width}
            height={imageProps?.height}
          />
        ) : (
          <div className="flex h-full items-end bg-gradient-to-br from-glacier via-slate-100 to-slate-200 p-5 text-sm text-slate-500">
            Live images populate here when Viator returns media.
          </div>
        )}
      </div>
      <div className={`space-y-4 ${featured ? "p-6" : "p-5"}`}>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {featured ? (
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                Recommended default
              </span>
            ) : null}
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{tour.durationLabel}</p>
          </div>
          <h3 className={`${featured ? "text-2xl md:text-3xl" : "text-xl"} font-semibold tracking-tight text-slate-950`}>
            {tour.title}
          </h3>
          <p className={`${featured ? "text-base leading-7" : "text-sm leading-6"} text-slate-600`}>{tour.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tour.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {tag}
            </span>
          ))}
        </div>
        <div className="rounded-2xl bg-fog p-4 text-sm text-slate-700">
          <p className="font-medium text-slate-900">Best for</p>
          <p className="mt-1">{tour.bestFor}</p>
        </div>
        <div className={`flex ${featured ? "flex-col gap-5 md:flex-row md:items-end md:justify-between" : "items-end justify-between"} gap-4`}>
          <div className={featured ? "grid w-full gap-3 grid-cols-2" : ""}>
            <div className={featured ? "rounded-2xl bg-fog p-4" : ""}>
              <p className="text-sm text-slate-500">Starting price</p>
              <p className={`${featured ? "text-4xl" : "text-2xl"} font-semibold tracking-tight text-slate-950`}>
                {formatMoney(tour.priceFrom, tour.currency)}
              </p>
            </div>
            <div className={featured ? "rounded-2xl bg-fog p-4" : ""}>
              <p className="text-sm text-slate-500">Social proof</p>
              <p className={`${featured ? "text-xl" : "text-sm"} font-semibold text-slate-950`}>
                {formatRating(tour.rating, tour.reviewCount)}
              </p>
            </div>
          </div>
          <div className={`flex ${featured ? "w-full max-w-sm flex-col gap-3" : "flex-col gap-2"} text-sm font-semibold`}>
            {featured && featuredCtaNote ? (
              <p className="text-sm leading-6 text-slate-600">{featuredCtaNote}</p>
            ) : null}
            <TrackedCta
              href={resolvedBookingHref}
              target="_blank"
              rel="noreferrer"
              className={`rounded-full bg-ember text-center text-white transition hover:bg-[#c96b2d] ${
                featured ? "px-5 py-3.5 text-base" : "px-4 py-2"
              }`}
              eventName={bookingTelemetry?.eventName}
              additionalEvents={bookingTelemetry?.additionalEvents}
              eventProps={bookingTelemetry?.eventProps}
            >
              {"Check availability"}
            </TrackedCta>
            <TrackedCta
              href={resolvedDetailHref}
              className={`text-center text-slate-700 underline-offset-4 transition hover:text-slate-950 hover:underline ${
                featured ? "text-sm" : "rounded-full border border-slate-300 px-4 py-2 text-slate-900 hover:border-slate-900"
              }`}
              eventName={detailTelemetry?.eventName}
              additionalEvents={detailTelemetry?.additionalEvents}
              eventProps={detailTelemetry?.eventProps}
            >
              View details
            </TrackedCta>
          </div>
        </div>
      </div>
    </article>
  );
}
