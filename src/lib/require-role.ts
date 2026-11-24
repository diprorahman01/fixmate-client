
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { connectToMongoDB } from "@/lib/mongodb";

type Role = "customer" | "technician" | "admin";

function isValidRole(value: unknown): value is Role {
  return (
    value === "customer" ||
    value === "technician" ||
    value === "admin"
  );
}

function dashboardFor(role: Role) {
  return `/dashboard/${role}`;
}

export async function requireRole(requiredRole: Role) {
  // Keep authorization checks dynamic on every request.
  await connection();

  // Establish MongoDB connection BEFORE importing Better Auth.
  await connectToMongoDB();

  // Load Better Auth after MongoDB is connected.
  const { auth } = await import("@/lib/auth");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Logged-out visitors must sign in.
  if (!session?.user) {
    redirect(
      `/sign-in?callbackURL=${encodeURIComponent(
        dashboardFor(requiredRole)
      )}`
    );
  }

  // The role comes from the verified server-side session,
  // not from a browser query parameter.
  const role: unknown = session.user.role;

  if (!isValidRole(role)) {
    throw new Error(
      "Account role is missing or invalid. Check Better Auth user data."
    );
  }

  // Users cannot open another role's dashboard.
  if (role !== requiredRole) {
    redirect(dashboardFor(role));
  }

  return {
    ...session,
    user: {
      ...session.user,
      role,
    },
  };
}
