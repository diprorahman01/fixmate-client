
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { auth } from "@/lib/auth";
import { db, connectToMongoDB } from "@/lib/mongodb";

type Role = "customer" | "technician" | "admin";

const roleHome = (role: Role) => `/dashboard/${role}`;

export async function requireRole(requiredRole: Role) {
  await connection();

  // Verify the user's Better Auth session.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(
      `/sign-in?callbackURL=${encodeURIComponent(
        roleHome(requiredRole)
      )}`
    );
  }

  // Use the existing MongoDB connection.
  await connectToMongoDB();

  // Read the CURRENT role directly from MongoDB.
  const user = await db.collection("user").findOne({
    email: session.user.email,
  });

  if (!user) {
    throw new Error(
      "Authenticated account was not found in MongoDB."
    );
  }

  const role = user.role;

  if (
    role !== "customer" &&
    role !== "technician" &&
    role !== "admin"
  ) {
    throw new Error(
      "This account does not have a valid role."
    );
  }

  // Prevent accessing another role's dashboard.
  if (role !== requiredRole) {
    redirect(roleHome(role));
  }

  return {
    ...session,
    user: {
      ...session.user,
      role,
    },
  };
}
