"use client";

export type AlaskaCorridorEventName =
  | "handoff_viewed"
  | "shortlist_rendered"
  | "product_opened"
  | "booking_opened"
  | "checkout_started"
  | "cta_clicked_primary"
  | "cta_clicked_alternative"
  | "execution_page_loaded"
  | "handoff_received"
  | "handoff_missing";

export type AlaskaExitKind = "decision" | "fallback";

export type AlaskaCorridorEventProps = {
  source_page: string;
  target_path?: string;
  route_target?: string;
  default_card_slug?: string;
  clicked_product_slug?: string;
  fit_signal?: string;
  port?: string;
  metadata?: Record<string, unknown>;
  corridor_id?: string;
};

export type AlaskaExitEventProps = {
  page: string;
  target_path: string;
  page_type: "category" | "tour_detail";
  stage: "recommended" | "shortlist" | "browse";
  exit_kind: AlaskaExitKind;
  city?: string;
  category?: string;
  clicked_product_slug?: string;
  default_card_slug?: string;
  decision_corridor?: string;
  decision_cta?: string;
  decision_action?: string;
  decision_option?: string;
  decision_product?: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

const CORRIDOR_EVENT_ENDPOINT =
  process.env.NEXT_PUBLIC_DCC_EVENT_ENDPOINT ||
  "https://www.destinationcommandcenter.com/api/internal/corridor-events";
const SESSION_KEY = "dcc_corridor_session_v1";
const LOCAL_EVENT_BUFFER_KEY = "dcc_telemetry_buffer_v1";
const LOCAL_EVENT_BUFFER_LIMIT = 250;
const DEFAULT_CORRIDOR_ID = "lastfrontier-alaska";

function getSessionId() {
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const next = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    window.localStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    return `anon-${Date.now()}`;
  }
}

function appendLocalTelemetryEvent(name: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") return;

  try {
    const raw = window.localStorage.getItem(LOCAL_EVENT_BUFFER_KEY);
    const existing = raw ? (JSON.parse(raw) as Array<Record<string, unknown>>) : [];
    const next = [
      ...existing,
      {
        event: name,
        timestamp: new Date().toISOString(),
        ...payload,
      },
    ].slice(-LOCAL_EVENT_BUFFER_LIMIT);
    window.localStorage.setItem(LOCAL_EVENT_BUFFER_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures.
  }
}

function dispatchUiEvent(name: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(`dcc:${name}`, { detail: payload }));
  appendLocalTelemetryEvent(name, payload);

  if (typeof window.gtag === "function") {
    window.gtag("event", name, payload);
    return;
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...payload });
  }
}

function postJson(body: Record<string, unknown>) {
  const payload = JSON.stringify(body);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon(CORRIDOR_EVENT_ENDPOINT, blob)) return;
    } catch {
      // Fall through to fetch.
    }
  }

  void fetch(CORRIDOR_EVENT_ENDPOINT, {
    method: "POST",
    mode: "cors",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: payload,
  }).catch(() => undefined);
}

function withSiteMetadata(metadata?: Record<string, unknown>) {
  return {
    site_identity: "lastfrontier",
    domain: "lastfrontiershoreexcursions.com",
    ...(metadata || {}),
  };
}

export function trackAlaskaCorridorEvent(name: AlaskaCorridorEventName, props: AlaskaCorridorEventProps) {
  if (typeof window === "undefined") return;

  const payload = {
    corridor_id: props.corridor_id || DEFAULT_CORRIDOR_ID,
    event_name: name,
    occurred_at: new Date().toISOString(),
    session_id: getSessionId(),
    source_page: props.source_page,
    landing_path: window.location.pathname,
    target_path: props.target_path,
    route_target: props.route_target,
    default_card_slug: props.default_card_slug,
    clicked_product_slug: props.clicked_product_slug,
    fit_signal: props.fit_signal,
    port: props.port,
    metadata: withSiteMetadata(props.metadata),
  };

  postJson(payload);
}

export function trackAlaskaUiEvent(name: string, props: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  dispatchUiEvent(name, withSiteMetadata(props));
}

export function trackAlaskaExitClicked(props: AlaskaExitEventProps) {
  trackAlaskaUiEvent("dcc_exit_clicked", props);
}
