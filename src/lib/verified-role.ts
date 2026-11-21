import { authenticatedFetch } from "@/lib/api-client";

export type FixMateRole = "customer" | "technician" | "admin";

export async function getVerifiedRole(): Promise<FixMateRole> {
  const response = await authenticatedFetch("/api/auth/me");
  if (!response.ok) throw new Error(`Unable to verify account role (${response.status})`);
  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("user" in data)) throw new Error("Invalid account data");
  const user = (data as { user: { role?: unknown } }).user;
  if (!user || !["customer", "technician", "admin"].includes(String(user.role))) {
    throw new Error("Unknown account role");
  }
  return user.role as FixMateRole;
}

export function destinationForRole(role: FixMateRole): string {
  if (role === "admin") return "/dashboard/admin";
  if (role === "technician") return "/dashboard/technician";
  // Customers arrive at the public homepage by default.
  return "/";
}
