import { getViatorConfig, hasViatorApiKey } from "@/lib/viator/config";

type SearchInput = {
  destinationId: number;
  count?: number;
};

async function request(endpoint: string, init?: RequestInit) {
  const config = getViatorConfig();
  if (!config.apiKey) throw new Error("missing_viator_api_key");

  const response = await fetch(`${config.apiBase}${endpoint}`, {
    ...init,
    headers: {
      Accept: "application/json;version=2.0",
      "Accept-Language": config.locale,
      "Content-Type": "application/json;charset=UTF-8",
      "exp-api-key": config.apiKey,
      ...(init?.headers || {}),
    },
    next: {
      revalidate: 60 * 30,
    },
  });

  if (!response.ok) {
    const body = (await response.text()).slice(0, 220);
    throw new Error(`viator_http_${response.status}:${body}`);
  }

  return response.json();
}

export async function searchCityProducts({ destinationId, count = 18 }: SearchInput) {
  if (!hasViatorApiKey()) return null;
  return request("/products/search", {
    method: "POST",
    body: JSON.stringify({
      filtering: { destination: destinationId },
      currency: getViatorConfig().currency,
      pagination: { start: 1, count },
    }),
  });
}

export async function getProductDetail(productCode: string) {
  if (!hasViatorApiKey()) return null;
  return request(`/products/${encodeURIComponent(productCode)}`);
}
