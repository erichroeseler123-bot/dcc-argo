"use client";

import { useEffect } from "react";
import { trackAlaskaCorridorEvent } from "@/lib/telemetry/alaskaCorridor";

type AlaskaPageTelemetryProps = {
  page: string;
  port?: string;
  actualCorridor: string;
  defaultCardSlug?: string;
  shortlistCount?: number;
  pageRole: "feeder" | "execution";
  continuityPresent?: boolean;
};

export default function AlaskaPageTelemetry({
  page,
  port,
  actualCorridor,
  defaultCardSlug,
  shortlistCount,
  pageRole,
  continuityPresent = false,
}: AlaskaPageTelemetryProps) {
  useEffect(() => {
    if (pageRole === "feeder") {
      trackAlaskaCorridorEvent("handoff_viewed", {
        source_page: page,
        target_path: page,
        route_target: actualCorridor,
        default_card_slug: defaultCardSlug,
        fit_signal: actualCorridor,
        port,
        metadata: {
          page_role: pageRole,
          actual_corridor: actualCorridor,
          continuity_present: continuityPresent,
        },
      });

      if (defaultCardSlug) {
        trackAlaskaCorridorEvent("shortlist_rendered", {
          source_page: page,
          target_path: page,
          route_target: actualCorridor,
          default_card_slug: defaultCardSlug,
          fit_signal: actualCorridor,
          port,
          metadata: {
            page_role: pageRole,
            actual_corridor: actualCorridor,
            shortlist_count: shortlistCount ?? null,
            continuity_present: continuityPresent,
          },
        });
      }
      return;
    }

    trackAlaskaCorridorEvent("execution_page_loaded", {
      source_page: page,
      target_path: page,
      route_target: actualCorridor,
      default_card_slug: defaultCardSlug,
      clicked_product_slug: defaultCardSlug,
      fit_signal: actualCorridor,
      port,
      metadata: {
        page_role: pageRole,
        actual_corridor: actualCorridor,
        continuity_present: continuityPresent,
      },
    });

    trackAlaskaCorridorEvent(continuityPresent ? "handoff_received" : "handoff_missing", {
      source_page: page,
      target_path: page,
      route_target: actualCorridor,
      default_card_slug: defaultCardSlug,
      clicked_product_slug: defaultCardSlug,
      fit_signal: actualCorridor,
      port,
      metadata: {
        page_role: pageRole,
        actual_corridor: actualCorridor,
        continuity_present: continuityPresent,
      },
    });
  }, [actualCorridor, continuityPresent, defaultCardSlug, page, pageRole, port, shortlistCount]);

  return null;
}
