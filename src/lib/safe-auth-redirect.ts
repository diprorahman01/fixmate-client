/** Allow only local in-app paths. Never use a full external URL as a callback. */
export function safeAuthPath(path: string | null | undefined): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return null;
  }
  if (/[\u0000-\u001F\u007F]/.test(path)) return null;
  try {
    const parsed = new URL(path, "http://localhost");
    if (parsed.origin !== "http://localhost") return null;
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return null;
  }
}

export type Role = "customer" | "technician" | "admin";

export function authorizedDestination(role: Role, callback: string | null | undefined): string {
  const safe = safeAuthPath(callback);
  const fallback = role === "customer" ? "/" : `/dashboard/${role}`;
  if (!safe) return fallback;
  const pathname = new URL(safe, "http://localhost").pathname;
  if (pathname === "/sign-in" || pathname === "/sign-up" || pathname.startsWith("/auth/")) {
    return fallback;
  }
  if (pathname.startsWith("/dashboard")) {
    if (pathname === "/dashboard/profile" || pathname.startsWith("/dashboard/profile/")) return safe;
    if (pathname === `/dashboard/${role}` || pathname.startsWith(`/dashboard/${role}/`)) return safe;
    return fallback;
  }
  if (pathname.startsWith("/payment/") && role !== "customer") return fallback;
  return safe;
}
