
import { authenticatedFetch } from "@/lib/api-client";

import type {
  RepairService,
} from "@/lib/services";

// ==========================================
// TYPES
// ==========================================

export type ApprovalStatus =
  | "all"
  | "pending"
  | "approved"
  | "rejected";

export type UserRole =
  | "customer"
  | "technician"
  | "admin";

export type AdminStats = {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image: string | null;
  createdAt: string | null;
};

export type AdminService = RepairService & {
  reviewedAt?: string;
  reviewedBy?: string;
};

// ==========================================
// RESPONSE HANDLER
// ==========================================

async function parseResponse<T>(
  response: Response
): Promise<T> {
  const result: unknown = await response.json();

  if (!response.ok) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : `Request failed: ${response.status}`;

    throw new Error(message);
  }

  return result as T;
}

// ==========================================
// GET ADMIN STATS
// ==========================================

export async function getAdminStats() {
  const response = await authenticatedFetch(
    "/api/admin/stats"
  );

  return parseResponse<AdminStats>(response);
}

// ==========================================
// GET ALL ADMIN SERVICES
// ==========================================

export async function getAdminServices(
  status: ApprovalStatus = "all"
) {
  const params = new URLSearchParams({
    status,
  });

  const response = await authenticatedFetch(
    `/api/admin/services?${params.toString()}`
  );

  return parseResponse<AdminService[]>(response);
}

// ==========================================
// APPROVE OR REJECT SERVICE
// ==========================================

export async function reviewService(
  id: string,
  approvalStatus: "approved" | "rejected"
) {
  const response = await authenticatedFetch(
    `/api/admin/services/${encodeURIComponent(id)}/approval`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        approvalStatus,
      }),
    }
  );

  return parseResponse<{
    success: boolean;
    message: string;
  }>(response);
}

// ==========================================
// GET ALL USERS
// ==========================================

export async function getAdminUsers() {
  const response = await authenticatedFetch(
    "/api/admin/users"
  );

  return parseResponse<AdminUser[]>(response);
}

// ==========================================
// CHANGE USER ROLE
// ==========================================

export async function updateUserRole(
  id: string,
  role: UserRole
) {
  const response = await authenticatedFetch(
    `/api/admin/users/${encodeURIComponent(id)}/role`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    }
  );

  return parseResponse<{
    success: boolean;
    message: string;
  }>(response);
}
