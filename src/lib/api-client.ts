
// ==========================================
// FIXMATE API CLIENT
// ==========================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

// ==========================================
// AUTHENTICATED FETCH
// ==========================================

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  if (
    !endpoint.startsWith("/") ||
    endpoint.startsWith("//") ||
    endpoint.startsWith("/\\")
  ) {
    throw new Error("Invalid API endpoint");
  }

  // Ask our own Next.js server for a fresh JWT.
  const tokenResponse = await fetch(
    "/api/auth/token",
    {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
    }
  );

  if (!tokenResponse.ok) {
    throw new Error(
      "Authentication required. Please sign in."
    );
  }

  const data: { token: string } =
    await tokenResponse.json();

  const headers = new Headers(options.headers);

  headers.set(
    "Authorization",
    `Bearer ${data.token}`
  );

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });
}
