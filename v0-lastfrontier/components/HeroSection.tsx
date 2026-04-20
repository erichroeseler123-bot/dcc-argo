"use client";

import TrackedCta from "@/components/telemetry/TrackedCta";
import type { AlaskaCorridorEventName, AlaskaCorridorEventProps } from "@/lib/telemetry/alaskaCorridor";

type HeroSectionProps = {
  eyebrow: string;
  decisionLine?: string;
  title: string;
  description: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  fact?: string;
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
  primaryTelemetry?: {
    eventName: AlaskaCorridorEventName;
    additionalEvents?: AlaskaCorridorEventName[];
    eventProps: AlaskaCorridorEventProps;
  };
  secondaryTelemetry?: {
    eventName: AlaskaCorridorEventName;
    additionalEvents?: AlaskaCorridorEventName[];
    eventProps: AlaskaCorridorEventProps;
  };
};

export default function HeroSection({
  eyebrow,
  decisionLine,
  title,
  description,
  primaryCta,
  secondaryCta,
  fact,
  backgroundImageSrc,
  backgroundImageAlt,
  primaryTelemetry,
  secondaryTelemetry,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-hero-north p-8 text-white shadow-panel md:p-12">
      {backgroundImageSrc ? (
        <>
          <img
            src={backgroundImageSrc}
            alt={backgroundImageAlt || title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/45 to-slate-950/20" />
        </>
      ) : null}
      <div className="relative max-w-3xl space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-glacier/75">{eyebrow}</p>
        {decisionLine ? (
          <div className="inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-medium text-white/92">
            {decisionLine}
          </div>
        ) : null}
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>
        <p className="max-w-2xl text-lg leading-8 text-glacier/90">{description}</p>
        <div className="flex flex-wrap gap-3">
          <TrackedCta
            href={primaryCta.href}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-glacier"
            eventName={primaryTelemetry?.eventName}
            additionalEvents={primaryTelemetry?.additionalEvents}
            eventProps={primaryTelemetry?.eventProps}
          >
            {primaryCta.label}
          </TrackedCta>
          {secondaryCta ? (
            <TrackedCta
              href={secondaryCta.href}
              className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              eventName={secondaryTelemetry?.eventName}
              additionalEvents={secondaryTelemetry?.additionalEvents}
              eventProps={secondaryTelemetry?.eventProps}
            >
              {secondaryCta.label}
            </TrackedCta>
          ) : null}
        </div>
        {fact ? (
          <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-glacier/90">
            {fact}
          </div>
        ) : null}
      </div>
    </section>
  );
}
