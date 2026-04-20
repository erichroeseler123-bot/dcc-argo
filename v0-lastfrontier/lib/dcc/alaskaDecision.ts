import {
  buildDecisionContinuationParams,
  buildDecisionContinuationUrl,
  type DccDecisionContinuationInput,
  type DccDecisionPolicy,
  type DccDecisionSurface,
} from "@/lib/dcc/contracts/decisionContinuation";

type SearchParamInput =
  | Record<string, string | string[] | undefined>
  | URLSearchParams
  | undefined;

type DecisionContinuationSnapshot = {
  sourcePage?: string;
  decisionState?: string;
  decisionSurface?: string;
  destinationSurface?: string;
  decisionCorridor?: string;
  decisionCta?: string;
  decisionAction?: string;
  decisionEntry?: string;
  decisionPolicy?: string;
  decisionOption?: string;
  decisionProduct?: string;
};

type DecisionLinkInput = {
  baseHref: string;
  sourcePage: string;
  corridor: string;
  cta: string;
  action: string;
  option?: string;
  product?: string;
  destinationSurface?: DccDecisionSurface;
  policy?: DccDecisionPolicy;
};

const DUMMY_ORIGIN = "https://lastfrontiershoreexcursions.local";

function readFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function readParam(searchParams: SearchParamInput, key: string) {
  if (!searchParams) return undefined;
  if (searchParams instanceof URLSearchParams) {
    return searchParams.get(key) || undefined;
  }
  const value = readFirst(searchParams[key]);
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function appendParamsToHref(baseHref: string, params: Record<string, string | undefined>) {
  const isAbsolute = /^https?:\/\//i.test(baseHref);
  const url = new URL(baseHref, DUMMY_ORIGIN);

  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  return isAbsolute ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
}

export function readDecisionContinuation(searchParams: SearchParamInput): DecisionContinuationSnapshot {
  return {
    sourcePage: readParam(searchParams, "source_page"),
    decisionState: readParam(searchParams, "decision_state"),
    decisionSurface: readParam(searchParams, "decision_surface"),
    destinationSurface: readParam(searchParams, "destination_surface"),
    decisionCorridor: readParam(searchParams, "decision_corridor"),
    decisionCta: readParam(searchParams, "decision_cta"),
    decisionAction: readParam(searchParams, "decision_action"),
    decisionEntry: readParam(searchParams, "decision_entry"),
    decisionPolicy: readParam(searchParams, "decision_policy"),
    decisionOption: readParam(searchParams, "decision_option"),
    decisionProduct: readParam(searchParams, "decision_product"),
  };
}

export function hasDecisionContinuation(snapshot: DecisionContinuationSnapshot) {
  return Boolean(
    snapshot.sourcePage ||
      snapshot.decisionCorridor ||
      snapshot.decisionAction ||
      snapshot.decisionProduct
  );
}

export function buildAlaskaCorridor(citySlug: string, categorySlug: string) {
  return `${citySlug}-${categorySlug}`;
}

export function buildDecisionLink(
  input: DecisionLinkInput,
  existing?: DecisionContinuationSnapshot,
) {
  const payload: DccDecisionContinuationInput = {
    sourcePage: input.sourcePage,
    corridor: existing?.decisionCorridor || input.corridor,
    cta: input.cta,
    action: input.action,
    option: input.option,
    product: input.product,
    entryMode:
      existing?.decisionEntry === "dcc-first" ||
      existing?.decisionEntry === "flow-first" ||
      existing?.decisionEntry === "mixed"
        ? existing.decisionEntry
        : "mixed",
    state:
      existing?.decisionState === "considering" ||
      existing?.decisionState === "chosen" ||
      existing?.decisionState === "continuing"
        ? existing.decisionState
        : "continuing",
    sourceSurface:
      existing?.decisionSurface === "dcc" ||
      existing?.decisionSurface === "flow" ||
      existing?.decisionSurface === "operator"
        ? existing.decisionSurface
        : "dcc",
    destinationSurface: input.destinationSurface || "flow",
    policy:
      existing?.decisionPolicy === "continue_without_reset" ||
      existing?.decisionPolicy === "decision_support"
        ? existing.decisionPolicy
        : input.policy || "continue_without_reset",
  };

  if (/^https?:\/\//i.test(input.baseHref)) {
    return buildDecisionContinuationUrl(input.baseHref, payload);
  }

  return appendParamsToHref(input.baseHref, buildDecisionContinuationParams(payload));
}
