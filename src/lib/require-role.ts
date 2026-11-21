import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth";

type Role = "customer" | "technician" | "admin";
const roleHome = (role: Role) => `/dashboard/${role}`;

/** Read the CURRENT role from the Express API/MongoDB, not an old session field. */
export async function requireRole(requiredRole: Role) {
  await connection();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/sign-in?callbackURL=${encodeURIComponent(roleHome(requiredRole))}`);

  const secret = process.env.API_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("API_JWT_SECRET is not configured correctly in client/.env.local");
  }
  const token = await new SignJWT({ email: session.user.email })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(session.user.id)
    .setIssuer("fixmate-auth")
    .setAudience("fixmate-api")
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(new TextEncoder().encode(secret));

  const apiURL = process.env.API_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const response = await fetch(`${apiURL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Unable to verify current account role with FixMate API (${response.status}). Check JWT secrets and MongoDB connectivity.`);
  }
  const body: unknown = await response.json();
  if (!body || typeof body !== "object" || !("user" in body)) {
    throw new Error("Invalid identity response from FixMate API");
  }
  const user = (body as { user: { role?: unknown } }).user;
  const role = user?.role;
  if (role !== "customer" && role !== "technician" && role !== "admin") {
    throw new Error("The account has no valid role in MongoDB");
  }
  if (role !== requiredRole) redirect(roleHome(role));
  return { ...session, user: { ...session.user, role } };
}
