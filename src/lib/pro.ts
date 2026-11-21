import { authenticatedFetch } from "@/lib/api-client";

export type ProStatus = {
  plan: "free" | "pro";
  subscriptionStatus: string;
  services: number;
  limit: number | null;
  verifiedPro: boolean;
  renewsAt: string | null;
};

async function getJSON<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data as T;
}

export async function getProStatus(): Promise<ProStatus> {
  return getJSON(await authenticatedFetch("/api/technician/pro"));
}
export async function beginProCheckout(): Promise<string> {
  const result = await getJSON<{ url: string }>(await authenticatedFetch("/api/technician/pro/checkout", { method: "POST" }));
  return result.url;
}
export async function manageProBilling(): Promise<string> {
  const result = await getJSON<{ url: string }>(await authenticatedFetch("/api/technician/pro/portal", { method: "POST" }));
  return result.url;
}
