import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import StructuredData from "@/components/StructuredData";
import AlaskaPageTelemetry from "@/components/telemetry/AlaskaPageTelemetry";
import TrackedCta from "@/components/telemetry/TrackedCta";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Best Alaska cruise for excursions",
  description:
    "Pick your Alaska cruise based on the port day you actually want. Start with Juneau, Skagway, or a balanced Alaska port mix instead of generic cruise-brand marketing.",
  path: "/best-alaska-cruise-for-excursions",
});

const DECISIONS = [
  {
    eyebrow: "Best for Juneau excursion people",
    title: "Choose the cruise that gives Juneau real weight.",
    description:
      "If you care about whales, helicopters, or getting enough Juneau time for a high-value excursion day, start by protecting Juneau first.",
    href: "/juneau/whale-watching",
    label: "Start with Juneau whale watching",
  },
  {
    eyebrow: "Best for Skagway excursion people",
    title: "Choose the cruise that makes Skagway feel worth it.",
    description:
      "If White Pass rail is the excursion day you actually care about, pick the cruise that gives Skagway enough room to work as more than a rushed photo stop.",
    href: "/skagway/white-pass-tours",
    label: "Start with White Pass tours",
  },
  {
    eyebrow: "Best overall port mix",
    title: "If you do not want to overthink it, choose by port quality.",
    description:
      "The safest move is usually the itinerary that gives you strong Juneau, strong Skagway, and at least one additional Alaska port that still supports a real excursion day.",
    href: "/",
    label: "Compare Alaska ports first",
  },
] as const;

const PAGE_PATH = "/best-alaska-cruise-for-excursions";
const CORRIDOR_ID = "alaska-cruise-excursions";

export default function BestAlaskaCruiseForExcursionsPage() {
  function buildTrackingProps(targetPath: string, option: string, stage: "recommended" | "browse") {
    return {
      source_page: PAGE_PATH,
      target_path: targetPath,
      route_target: CORRIDOR_ID,
      default_card_slug: "juneau-cruise-first",
      clicked_product_slug: option,
      fit_signal: CORRIDOR_ID,
      metadata: {
        actual_corridor: CORRIDOR_ID,
        decision_option: option,
        stage,
      },
      corridor_id: CORRIDOR_ID,
    } as const;
  }

  return (
    <main className="space-y-12 pb-10">
      <AlaskaPageTelemetry
        page={PAGE_PATH}
        actualCorridor={CORRIDOR_ID}
        defaultCardSlug="juneau-cruise-first"
        shortlistCount={DECISIONS.length}
        pageRole="feeder"
      />
      <StructuredData
        data={buildBreadcrumbJsonLd([
          { name: "Home", item: "/" },
          { name: "Best Alaska cruise for excursions", item: PAGE_PATH },
        ])}
      />

      <HeroSection
        eyebrow="Cruise-first planning, flipped"
        title="Pick your Alaska cruise based on the day you actually want."
        description="Most people choose the cruise first and figure out excursions later. The smarter move is choosing the itinerary that protects the port day you care about most."
        primaryCta={{ href: "/juneau/whale-watching", label: "Start with Juneau" }}
        secondaryCta={{ href: "/skagway/white-pass-tours", label: "Start with Skagway" }}
        primaryTelemetry={{
          eventName: "product_opened",
          additionalEvents: ["cta_clicked_primary"],
          eventProps: buildTrackingProps("/juneau/whale-watching", "juneau-cruise-first", "recommended"),
        }}
        secondaryTelemetry={{
          eventName: "product_opened",
          additionalEvents: ["cta_clicked_alternative"],
          eventProps: buildTrackingProps("/skagway/white-pass-tours", "skagway-cruise-first", "recommended"),
        }}
        fact="This page helps you choose the cruise, not book it."
      />

      <section className="grid gap-6 lg:grid-cols-3">
        {DECISIONS.map((decision, index) => (
          <article
            key={decision.href}
            className={`rounded-[28px] border bg-white p-6 shadow-panel ${
              index === 0 ? "border-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.14)]" : "border-slate-200"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{decision.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{decision.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{decision.description}</p>
            <TrackedCta
              href={decision.href}
              className={`mt-5 inline-flex rounded-full px-5 py-3 text-sm font-semibold transition ${
                index === 0
                  ? "bg-ember text-white hover:bg-[#c96b2d]"
                  : "border border-slate-300 text-slate-900 hover:border-slate-900"
              }`}
              eventName="product_opened"
              additionalEvents={[index === 0 ? "cta_clicked_primary" : "cta_clicked_alternative"]}
              eventProps={buildTrackingProps(
                decision.href,
                index === 0 ? "juneau-cruise-first" : index === 1 ? "skagway-cruise-first" : "balanced-port-mix",
                index === 2 ? "browse" : "recommended",
              )}
            >
              {decision.label}
            </TrackedCta>
          </article>
        ))}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">What actually matters</p>
        <p className="mt-4 max-w-4xl text-base leading-7 text-slate-700">
          Port time matters more than cruise-brand fluff. A short stop can ruin a big excursion day, and a longer stop can make one Alaska port worth choosing the whole sailing for.
        </p>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-panel">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Keep planning from the excursion side</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Once the itinerary looks right, narrow the port day fast.</h2>
          <p className="max-w-3xl text-base leading-7 text-slate-600">
            Use the Juneau, Skagway, and broader Alaska planning pages to decide whether the itinerary actually supports the excursion day you want.
          </p>
          <div className="flex flex-wrap gap-3">
            <TrackedCta
              href="/juneau/whale-watching"
              className="rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c96b2d]"
              eventName="product_opened"
              additionalEvents={["cta_clicked_primary"]}
              eventProps={buildTrackingProps("/juneau/whale-watching", "closing-juneau", "browse")}
            >
              Go to Juneau whale watching
            </TrackedCta>
            <TrackedCta
              href="/skagway/white-pass-tours"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
              eventName="product_opened"
              additionalEvents={["cta_clicked_alternative"]}
              eventProps={buildTrackingProps("/skagway/white-pass-tours", "closing-skagway", "browse")}
            >
              Go to White Pass planning
            </TrackedCta>
            <TrackedCta
              href="/"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
              eventName="product_opened"
              additionalEvents={["cta_clicked_alternative"]}
              eventProps={buildTrackingProps("/", "closing-homepage", "browse")}
            >
              Compare Alaska ports
            </TrackedCta>
          </div>
        </div>
      </section>
    </main>
  );
}
